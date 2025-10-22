import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image_url: v.string(),
    confessionsCount: v.number(),
  }).index('by_clerk_id', ['clerkId']),

  confessions: defineTable({
    userId: v.id('users'),
    text: v.string(),
    fileUrl: v.optional(v.string()),
    fileType: v.optional(v.union(v.literal('image'), v.literal('video'))),
    visibility: v.union(v.literal('public'), v.literal('private')),
    likesCount: v.number(),
    commentsCount: v.number(),
    storageId: v.optional(v.id('_storage')),
  })
    .index('by_user', ['userId'])
    .index('by_visibility', ['visibility']),

  comments: defineTable({
    userId: v.id('users'),
    confessionId: v.id('confessions'),
    text: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_confession', ['confessionId']),

  likes: defineTable({
    userId: v.id('users'),
    confessionId: v.id('confessions'),
  })
    .index('by_user', ['userId'])
    .index('by_confession', ['confessionId'])
    .index('by_user_confession', ['userId', 'confessionId']),

  notifications: defineTable({
    userId: v.id('users'),
    type: v.union(v.literal('like'), v.literal('comment'), v.literal('follow')),
    sourceUserId: v.id('users'),
    confessionId: v.optional(v.id('confessions')),
    commentId: v.optional(v.id('comments')),
    isRead: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_type', ['type']),
});
