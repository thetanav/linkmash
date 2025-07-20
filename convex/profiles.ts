import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to extract LinkedIn username from URL
function extractLinkedInUsername(url: string): string {
  const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
  return match ? match[1] : "";
}

// Helper function to generate LinkedIn profile image URL
function getLinkedInImageUrl(linkedinUrl: string): string {
  const username = extractLinkedInUsername(linkedinUrl);
  if (!username) return "";
  
  // LinkedIn profile image URL pattern (this may not always work due to privacy settings)
  return `https://media.licdn.com/dms/image/v2/D4E03AQH8tOjQZKqQzw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1234567890123?e=1234567890&v=beta&t=abcdef`;
}

export const submitProfile = mutation({
  args: {
    linkedinUrl: v.string(),
    name: v.string(),
    title: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Allow anonymous submissions - get userId if available, otherwise use null
    const userId = await getAuthUserId(ctx);

    // Validate LinkedIn URL
    if (!args.linkedinUrl.includes("linkedin.com/in/")) {
      throw new Error("Please provide a valid LinkedIn profile URL");
    }

    // Check if profile already exists
    const existing = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("linkedinUrl"), args.linkedinUrl))
      .first();

    if (existing) {
      throw new Error("This LinkedIn profile has already been submitted");
    }

    const profileId = await ctx.db.insert("profiles", {
      linkedinUrl: args.linkedinUrl,
      name: args.name,
      title: args.title,
      category: args.category,
      submittedBy: userId || undefined,
      approved: true, // Auto-approve for now
      score: 1000, // Starting ELO-style score
      totalVotes: 0,
      wins: 0,
      losses: 0,
    });

    return profileId;
  },
});

export const getRandomMatchup = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const category = args.category || "all";
    
    let profiles;
    if (category === "all") {
      profiles = await ctx.db
        .query("profiles")
        .filter((q) => q.eq(q.field("approved"), true))
        .collect();
    } else {
      profiles = await ctx.db
        .query("profiles")
        .withIndex("by_category", (q) => q.eq("category", category))
        .filter((q) => q.eq(q.field("approved"), true))
        .collect();
    }

    if (profiles.length < 2) {
      return null;
    }

    // Randomly select two different profiles using Fisher-Yates shuffle
    const shuffled = [...profiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Add profile image URLs
    const profile1 = {
      ...shuffled[0],
      imageUrl: getLinkedInImageUrl(shuffled[0].linkedinUrl),
      username: extractLinkedInUsername(shuffled[0].linkedinUrl)
    };
    
    const profile2 = {
      ...shuffled[1],
      imageUrl: getLinkedInImageUrl(shuffled[1].linkedinUrl),
      username: extractLinkedInUsername(shuffled[1].linkedinUrl)
    };
    
    return {
      profile1,
      profile2,
    };
  },
});

export const submitVote = mutation({
  args: {
    winnerProfileId: v.id("profiles"),
    loserProfileId: v.id("profiles"),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Allow anonymous voting - get userId if available, otherwise use null
    const userId = await getAuthUserId(ctx);

    // Get current profiles
    const winner = await ctx.db.get(args.winnerProfileId);
    const loser = await ctx.db.get(args.loserProfileId);

    if (!winner || !loser) {
      throw new Error("Invalid profiles");
    }

    // Calculate new ELO scores
    const K = 32; // K-factor for ELO rating
    const expectedWinner = 1 / (1 + Math.pow(10, (loser.score - winner.score) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winner.score - loser.score) / 400));

    const newWinnerScore = Math.round(winner.score + K * (1 - expectedWinner));
    const newLoserScore = Math.round(loser.score + K * (0 - expectedLoser));

    // Update winner
    await ctx.db.patch(args.winnerProfileId, {
      score: newWinnerScore,
      totalVotes: winner.totalVotes + 1,
      wins: winner.wins + 1,
    });

    // Update loser
    await ctx.db.patch(args.loserProfileId, {
      score: newLoserScore,
      totalVotes: loser.totalVotes + 1,
      losses: loser.losses + 1,
    });

    // Record the vote (anonymous if no user)
    await ctx.db.insert("votes", {
      voterId: userId || undefined,
      winnerProfileId: args.winnerProfileId,
      loserProfileId: args.loserProfileId,
      category: args.category,
    });

    return { success: true };
  },
});

export const getLeaderboard = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const category = args.category || "all";

    let profiles;
    if (category === "all") {
      profiles = await ctx.db
        .query("profiles")
        .withIndex("by_score")
        .filter((q) => q.eq(q.field("approved"), true))
        .order("desc")
        .take(limit);
    } else {
      profiles = await ctx.db
        .query("profiles")
        .withIndex("by_category", (q) => q.eq("category", category))
        .filter((q) => q.eq(q.field("approved"), true))
        .collect();
      
      // Sort by score and take top results
      profiles = profiles
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    }

    // Add image URLs and usernames to profiles
    return profiles.map(profile => ({
      ...profile,
      imageUrl: getLinkedInImageUrl(profile.linkedinUrl),
      username: extractLinkedInUsername(profile.linkedinUrl)
    }));
  },
});

export const getProfileStats = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      return null;
    }

    const winRate = profile.totalVotes > 0 ? (profile.wins / profile.totalVotes) * 100 : 0;

    return {
      ...profile,
      winRate: Math.round(winRate),
      imageUrl: getLinkedInImageUrl(profile.linkedinUrl),
      username: extractLinkedInUsername(profile.linkedinUrl)
    };
  },
});
