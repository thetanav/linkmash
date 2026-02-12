import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to extract LinkedIn username from URL
function extractLinkedInUsername(url: string): string {
  const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
  return match ? match[1] : "";
}

// Generate a profile image URL from the LinkedIn username using unavatar.io
function getProfileImageUrl(
  linkedinUrl: string,
  customImageUrl?: string,
): string {
  if (customImageUrl) return customImageUrl;
  const username = extractLinkedInUsername(linkedinUrl);
  if (!username) return "";
  return `https://unavatar.io/linkedin/${username}`;
}

export const submitProfile = mutation({
  args: {
    linkedinUrl: v.string(),
    name: v.string(),
    title: v.string(),
    category: v.string(),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Validate LinkedIn URL
    if (!args.linkedinUrl.includes("linkedin.com/in/")) {
      throw new Error("Please provide a valid LinkedIn profile URL");
    }

    // Normalize LinkedIn URL (remove trailing slashes, query params)
    const normalizedUrl = args.linkedinUrl.split("?")[0].replace(/\/+$/, "");

    // Check if profile already exists -- return existing profile ID instead of error
    const existing = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("linkedinUrl"), normalizedUrl))
      .first();

    if (existing) {
      return { profileId: existing._id, alreadyExists: true };
    }

    const profileId = await ctx.db.insert("profiles", {
      linkedinUrl: normalizedUrl,
      name: args.name,
      title: args.title,
      category: args.category,
      bio: args.bio || undefined,
      imageUrl: args.imageUrl || undefined,
      submittedBy: userId || undefined,
      approved: true,
      score: 1000,
      totalVotes: 0,
      wins: 0,
      losses: 0,
    });

    return { profileId, alreadyExists: false };
  },
});

// Use a mutation instead of query to allow Math.random() (mutations are not cached)
export const getRandomMatchup = mutation({
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

    // Fisher-Yates shuffle (safe in a mutation)
    const shuffled = [...profiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const addProfileData = (profile: (typeof profiles)[0]) => ({
      ...profile,
      username: extractLinkedInUsername(profile.linkedinUrl),
      resolvedImageUrl: getProfileImageUrl(
        profile.linkedinUrl,
        profile.imageUrl,
      ),
    });

    return {
      profile1: addProfileData(shuffled[0]),
      profile2: addProfileData(shuffled[1]),
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
    const userId = await getAuthUserId(ctx);

    // Rate limiting: max 60 votes per minute per user
    if (userId) {
      const oneMinuteAgo = Date.now() - 60_000;
      const recentVotes = await ctx.db
        .query("votes")
        .withIndex("by_voter_time", (q) =>
          q.eq("voterId", userId).gte("votedAt", oneMinuteAgo),
        )
        .collect();

      if (recentVotes.length >= 60) {
        throw new Error("You're voting too fast! Slow down a bit.");
      }
    }

    // Get current profiles
    const winner = await ctx.db.get(args.winnerProfileId);
    const loser = await ctx.db.get(args.loserProfileId);

    if (!winner || !loser) {
      throw new Error("Invalid profiles");
    }

    // Calculate new ELO scores
    const K = 32;
    const expectedWinner =
      1 / (1 + Math.pow(10, (loser.score - winner.score) / 400));
    const expectedLoser =
      1 / (1 + Math.pow(10, (winner.score - loser.score) / 400));

    const newWinnerScore = Math.round(winner.score + K * (1 - expectedWinner));
    const newLoserScore = Math.max(
      0,
      Math.round(loser.score + K * (0 - expectedLoser)),
    );

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

    // Record the vote
    await ctx.db.insert("votes", {
      voterId: userId || undefined,
      winnerProfileId: args.winnerProfileId,
      loserProfileId: args.loserProfileId,
      category: args.category,
      votedAt: Date.now(),
    });

    // Return vote stats for post-vote engagement
    const winnerWinRate = (winner.wins + 1) / (winner.totalVotes + 1);
    const loserWinRate =
      loser.totalVotes + 1 > 0 ? loser.wins / (loser.totalVotes + 1) : 0;

    // Count how many times these two faced each other
    const matchupVotes = await ctx.db
      .query("votes")
      .withIndex("by_profiles", (q) =>
        q
          .eq("winnerProfileId", args.winnerProfileId)
          .eq("loserProfileId", args.loserProfileId),
      )
      .collect();

    const reverseVotes = await ctx.db
      .query("votes")
      .withIndex("by_profiles", (q) =>
        q
          .eq("winnerProfileId", args.loserProfileId)
          .eq("loserProfileId", args.winnerProfileId),
      )
      .collect();

    const totalMatchupVotes = matchupVotes.length + reverseVotes.length;
    const agreementPct =
      totalMatchupVotes > 0
        ? Math.round((matchupVotes.length / totalMatchupVotes) * 100)
        : 100;

    return {
      success: true,
      winnerNewScore: newWinnerScore,
      loserNewScore: newLoserScore,
      winnerWinRate: Math.round(winnerWinRate * 100),
      loserWinRate: Math.round(loserWinRate * 100),
      agreementPct,
      totalMatchupVotes,
    };
  },
});

export const getLeaderboard = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
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

      profiles = profiles.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    return profiles.map((profile) => ({
      ...profile,
      username: extractLinkedInUsername(profile.linkedinUrl),
      resolvedImageUrl: getProfileImageUrl(
        profile.linkedinUrl,
        profile.imageUrl,
      ),
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

    const winRate =
      profile.totalVotes > 0 ? (profile.wins / profile.totalVotes) * 100 : 0;

    // Get rank (count profiles with higher score)
    const higherScored = await ctx.db
      .query("profiles")
      .withIndex("by_score")
      .filter((q) =>
        q.and(
          q.eq(q.field("approved"), true),
          q.gt(q.field("score"), profile.score),
        ),
      )
      .collect();

    return {
      ...profile,
      winRate: Math.round(winRate),
      rank: higherScored.length + 1,
      username: extractLinkedInUsername(profile.linkedinUrl),
      resolvedImageUrl: getProfileImageUrl(
        profile.linkedinUrl,
        profile.imageUrl,
      ),
    };
  },
});

// Get total vote count across the platform (social proof)
export const getTotalVotes = query({
  args: {},
  handler: async (ctx) => {
    const allProfiles = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("approved"), true))
      .collect();

    const totalVotes = allProfiles.reduce((sum, p) => sum + p.totalVotes, 0);
    const totalProfiles = allProfiles.length;

    return { totalVotes: Math.floor(totalVotes / 2), totalProfiles };
  },
});
