import { v } from 'convex/values';
import { internal } from './_generated/api';
import { internalMutation, mutation, MutationCtx, query, QueryCtx } from './_generated/server';

export const createUser = internalMutation({
  args: {
    username: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image_url: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .unique();

    if (existingUser) return;

    await ctx.db.insert('users', {
      username: args.username,
      email: args.email,
      clerkId: args.clerkId,
      image_url: args.image_url,
      confessionsCount: 0,
    });
  },
});

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
    .first();

  return user;
};

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', clerkId))
      .first();
  },
});

export const initiateAccountDeletion = mutation({
  args: { clerkId: v.string() },
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const clerkId = identity.subject;

    try {
      const CLERK_API_KEY = process.env.CLERK_API_KEY;
      if (!CLERK_API_KEY) {
        throw new Error('Clerk API key not configured');
      }

      const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${CLERK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Failed to delete Clerk user: ${errorData}`);
        throw new Error(`Clerk API error: ${response.status}`);
      }

      console.log(`Successfully deleted Clerk user: ${clerkId}`);

      return { success: true };
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw new Error('Failed to delete user account');
    }
  },
});
export const deleteUserData = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', clerkId))
      .first();

    if (!user) return;

    // Delete user's confessions and associated data
    const confessions = await ctx.db
      .query('confessions')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .collect();

    for (const confession of confessions) {
      // Delete confession's comments
      const comments = await ctx.db
        .query('comments')
        .withIndex('by_confession', q => q.eq('confessionId', confession._id))
        .collect();

      for (const comment of comments) {
        await ctx.db.delete(comment._id);

        // Update confession's comment count
        await ctx.db.patch(confession._id, {
          commentsCount: Math.max(0, confession.commentsCount - 1),
        });
      }

      // Delete confession's likes
      const likes = await ctx.db
        .query('likes')
        .withIndex('by_confession', q => q.eq('confessionId', confession._id))
        .collect();

      for (const like of likes) {
        await ctx.db.delete(like._id);

        // Update confession's like count
        await ctx.db.patch(confession._id, {
          likesCount: Math.max(0, confession.likesCount - 1),
        });
      }

      // Delete confession's notifications
      const confessionNotifications = await ctx.db
        .query('notifications')
        .filter(q => q.eq(q.field('confessionId'), confession._id))
        .collect();

      for (const notification of confessionNotifications) {
        await ctx.db.delete(notification._id);
      }

      // Delete confession
      await ctx.db.delete(confession._id);
    }

    // Delete user's comments on other confessions
    const userComments = await ctx.db
      .query('comments')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .collect();

    for (const comment of userComments) {
      const confession = await ctx.db.get(comment.confessionId);
      if (confession) {
        await ctx.db.patch(confession._id, {
          commentsCount: Math.max(0, confession.commentsCount - 1),
        });
      }

      // Delete comment's notifications
      const commentNotifications = await ctx.db
        .query('notifications')
        .filter(q => q.eq(q.field('commentId'), comment._id))
        .collect();

      for (const notification of commentNotifications) {
        await ctx.db.delete(notification._id);
      }

      await ctx.db.delete(comment._id);
    }

    // Delete user's likes on other confessions
    const userLikes = await ctx.db
      .query('likes')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .collect();

    for (const like of userLikes) {
      const confession = await ctx.db.get(like.confessionId);
      if (confession) {
        await ctx.db.patch(confession._id, {
          likesCount: Math.max(0, confession.likesCount - 1),
        });
      }

      // Delete like's notifications
      const likeNotifications = await ctx.db
        .query('notifications')
        .filter(q =>
          q.and(
            q.eq(q.field('type'), 'like'),
            q.eq(q.field('sourceUserId'), user._id),
            q.eq(q.field('confessionId'), like.confessionId)
          )
        )
        .collect();

      for (const notification of likeNotifications) {
        await ctx.db.delete(notification._id);
      }

      await ctx.db.delete(like._id);
    }

    // Delete user's notifications and notifications about the user
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    const notificationsAboutUser = await ctx.db
      .query('notifications')
      .filter(q => q.eq(q.field('sourceUserId'), user._id))
      .collect();

    for (const notification of notificationsAboutUser) {
      await ctx.db.delete(notification._id);
    }

    // Delete user
    await ctx.db.delete(user._id);
  },
});

// Kept for backward compatibility - now delegates to deleteUserData
export const deleteAccount = mutation({
  handler: async ctx => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const clerkId = user.clerkId;

    try {
      await ctx.runMutation(internal.users.deleteUserData, { clerkId });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete user data' };
    }
  },
});
