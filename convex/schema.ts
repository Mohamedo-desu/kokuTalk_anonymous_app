import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    clerkId: v.string(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_username', ['username']),
});
