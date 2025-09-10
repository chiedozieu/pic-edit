import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),

    plan: v.union(v.literal("free"), v.literal("pro")),
    // usage tracking for plan limits
    projectsUsed: v.number(), // number of projects count
    exportsThisMonth: v.number(), // number of exports this month

    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_name", ["name"])
    .searchIndex("search_name", {searchField: "name"})
    .searchIndex("search_email", {searchField: "email"}),
});
