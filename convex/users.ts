import { v } from 'convex/values';
import { internal } from './_generated/api';
import {
  action,
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from './_generated/server';

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

  const currentUser = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
    .unique();

  if (!currentUser) return null;

  return currentUser;
};

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .unique();

    return user;
  },
});

export const initiateAccountDeletion = action({
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
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const user = await db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .unique();

    if (!user) {
      console.log(`User with Clerk ID ${args.clerkId} not found in the database`);
      return { success: false };
    }

    await db.delete(user._id);

    console.log(`User data deleted for Clerk ID: ${args.clerkId}`);
    return { success: true };
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
