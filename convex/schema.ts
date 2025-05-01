import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image_url: v.string(),
    confessionsCount: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_username', ['username']),

  confessions: defineTable({
    userId: v.id('users'),
    text: v.optional(v.string()),
    visibility: v.union(v.literal('public'), v.literal('private')),
    fileUrl: v.optional(v.string()),
    fileType: v.optional(v.union(v.literal('image'), v.literal('video'))),
    storageId: v.optional(v.id('_storage')),
    likesCount: v.number(),
    commentsCount: v.number(),
  })
    .index('by_visibility', ['visibility'])
    .index('by_user', ['userId']),

  likes: defineTable({
    userId: v.id('users'),
    confessionId: v.id('confessions'),
  })
    .index('by_confession', ['confessionId'])
    .index('by_user_confession', ['userId', 'confessionId']),

  comments: defineTable({
    userId: v.id('users'),
    confessionId: v.id('confessions'),
    content: v.string(),
  }).index('by_confession', ['confessionId']),
});
