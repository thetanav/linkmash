import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  profiles: defineTable({
    linkedinUrl: v.string(),
    name: v.string(),
    title: v.string(),
    category: v.string(), // "developer", "founder", "designer", "pm", "other"
    submittedBy: v.optional(v.id("users")), // Made optional for anonymous submissions
    approved: v.boolean(),
    score: v.number(),
    totalVotes: v.number(),
    wins: v.number(),
    losses: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_score", ["score"])
    .index("by_approved", ["approved"]),

  votes: defineTable({
    voterId: v.optional(v.id("users")), // Optional for anonymous voting
    winnerProfileId: v.id("profiles"),
    loserProfileId: v.id("profiles"),
    category: v.string(),
    voterIp: v.optional(v.string()),
  })
    .index("by_voter", ["voterId"])
    .index("by_profiles", ["winnerProfileId", "loserProfileId"]),

  matchups: defineTable({
    profile1Id: v.id("profiles"),
    profile2Id: v.id("profiles"),
    category: v.string(),
    active: v.boolean(),
  }).index("by_category_active", ["category", "active"]),
};

export default defineSchema({
  ...applicationTables,
});
