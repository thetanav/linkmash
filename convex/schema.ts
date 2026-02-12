import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  profiles: defineTable({
    linkedinUrl: v.string(),
    name: v.string(),
    title: v.string(),
    category: v.string(), // "developer", "founder", "designer", "pm", "marketing", "sales", "other"
    bio: v.optional(v.string()), // Short bio / about text
    imageUrl: v.optional(v.string()), // User-provided profile image URL (overrides auto-generated)
    submittedBy: v.optional(v.id("users")),
    approved: v.boolean(),
    score: v.number(),
    totalVotes: v.number(),
    wins: v.number(),
    losses: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_score", ["score"])
    .index("by_approved", ["approved"])
    .index("by_linkedinUrl", ["linkedinUrl"]),

  votes: defineTable({
    voterId: v.optional(v.id("users")),
    winnerProfileId: v.id("profiles"),
    loserProfileId: v.id("profiles"),
    category: v.string(),
    voterIp: v.optional(v.string()),
    votedAt: v.optional(v.number()), // Timestamp for rate limiting
  })
    .index("by_voter", ["voterId"])
    .index("by_profiles", ["winnerProfileId", "loserProfileId"])
    .index("by_voter_time", ["voterId", "votedAt"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
