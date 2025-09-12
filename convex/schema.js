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
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_email", { searchField: "email" }),

  projects: defineTable({
    // basic project info
    title: v.string(),
    userId: v.id("users"),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),

    plan: v.union(v.literal("free"), v.literal("pro")),

    // usage tracking for plan limits
    projectsUsed: v.number(), // number of projects count
    exportsThisMonth: v.number(), // number of exports this month

    // canvas dimensions and state

    canvasState: v.any(), // // Fabric.js canvas JSON  (objects, layers, etc)
    width: v.number(), // canvas width
    height: v.number(), // canvas height

    // image assets associated with the project
    originalImageUrl: v.optional(v.string()), // original uploaded image
    currentImageUrl: v.optional(v.string()), // current image with edits applied
    thumbnailUrl: v.optional(v.string()), // small thumbnail for project listing

    // imagekit transformation state
    activeTransformations: v.optional(v.string()), //current imagekit url params

    // AI feature state tracks what AI features have been applied
    backgroundRemoved: v.optional(v.boolean()), // has background been removed
    // upscaled: v.boolean(), // has image been upscaled
    // colorEnhanced: v.boolean(), // has color enhancement been applied
    // filtersApplied: v.array(v.string()), // list of filters applied
    // editsHistory: v.array(v.string()), // list of edit descriptions applied

    // organization
    folderId: v.optional(v.id("folders")), // optional folder association

    //timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .index("by_folder", ["folderId"]),

  folders: defineTable({
    name: v.string(),
    userId: v.id("users"), // owner of the folder
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});


/*
PLAN
-Free: 3 projects, 20 exports/month basic features only
-Pro: Unlimited projects/exports all AI features
*/
