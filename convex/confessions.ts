import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

// Create a new confession
export const createConfession = mutation({
  args: {
    text: v.optional(v.string()),
    visibility: v.union(v.literal('public'), v.literal('private')),
    storageId: v.optional(v.id('_storage')),
    fileType: v.optional(v.union(v.literal('image'), v.literal('video'))),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // Validate that at least text or file is provided
    if (!args.text && !args.storageId) {
      throw new ConvexError('Confession must contain either text or media');
    }

    if (!currentUser) {
      throw new ConvexError('You must be logged in to create a confession');
    }

    let fileUrl: string | undefined | null;

    // Update imageUrl if a storageId is provided.
    if (args.storageId) {
      const result = await ctx.runMutation(internal.storage.getDownloadUrl, {
        storageId: args.storageId,
      });
      if (!result) throw new Error('fileUrl not found');
      fileUrl = result || undefined;
    }

    const confession: Id<'confessions'> = await ctx.db.insert('confessions', {
      userId: currentUser._id,
      text: args.text,
      visibility: args.visibility,
      ...(fileUrl && { fileUrl, fileType: args.fileType }),
      storageId: args.storageId,
      likesCount: 0,
      commentsCount: 0,
    });

    // Update user's confession count
    await ctx.db.patch(currentUser._id, {
      confessionsCount: (currentUser.confessionsCount || 0) + 1,
    });

    return confession;
  },
});

// Get public confessions with pagination
export const getPublicConfessions = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new ConvexError('You must be logged in to view public confessions');
    }

    const confessionsPage = await ctx.db
      .query('confessions')
      .withIndex('by_visibility', q => q.eq('visibility', 'public'))
      .order('desc')
      .paginate(args.paginationOpts);

    const confessions = confessionsPage.page;

    const postsWithInfo = await Promise.all(
      confessions.map(async confession => {
        const confessionAuthor = confession.userId
          ? await ctx.db.get(confession.userId as Id<'users'>)
          : null;

        let isLiked = false;
        if (confession._id && currentUser._id) {
          const like = await ctx.db
            .query('likes')
            .withIndex('by_user_confession', q =>
              q.eq('userId', currentUser._id).eq('confessionId', confession._id)
            )
            .first();
          isLiked = !!like;
        }

        return {
          ...confession,
          confessor: confessionAuthor
            ? {
                userId: confessionAuthor._id,
                username: confessionAuthor.username,
                image_url: confessionAuthor.image_url,
              }
            : null,
          isLiked,
        };
      })
    );

    return {
      ...confessionsPage,
      page: postsWithInfo,
    };
  },
});

// Get user's confessions with pagination
export const getUserConfessions = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (!currentUser) {
      throw new ConvexError('You must be logged in to view your confessions');
    }

    return await ctx.db
      .query('confessions')
      .withIndex('by_user', q => q.eq('userId', currentUser._id))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

// Get confession by ID
export const getConfessionById = query({
  args: { id: v.id('confessions') },
  handler: async (ctx, args) => {
    const confession = await ctx.db.get(args.id);
    if (!confession) {
      throw new ConvexError('Confession not found');
    }

    const user = await ctx.db.get(confession.userId);
    return {
      ...confession,
      user: {
        username: user?.username,
        email: user?.email,
        image_url: user?.image_url,
      },
    };
  },
});

// Delete a confession
export const deleteConfession = mutation({
  args: {
    confessionId: v.id('confessions'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (!currentUser) {
      throw new ConvexError('You must be logged in to delete a confession');
    }

    const confession = await ctx.db.get(args.confessionId);
    if (!confession) {
      throw new ConvexError('Confession not found');
    }

    if (confession.userId !== currentUser._id) {
      throw new ConvexError('Not authorized to delete this confession');
    }

    // Delete associated file if it exists
    if (confession.storageId) {
      await ctx.runMutation(internal.storage.deleteFile, {
        storageId: confession.storageId,
      });
    }

    // Delete all likes for this confession
    const likes = await ctx.db
      .query('likes')
      .withIndex('by_confession', q => q.eq('confessionId', args.confessionId))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Delete all comments for this confession
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_confession', q => q.eq('confessionId', args.confessionId))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete the confession
    await ctx.db.delete(args.confessionId);

    // Update user's confession count
    await ctx.db.patch(currentUser._id, {
      confessionsCount: Math.max(0, (currentUser.confessionsCount || 1) - 1),
    });

    return { success: true };
  },
});

// Update a confession
export const updateConfession = mutation({
  args: {
    confessionId: v.id('confessions'),
    text: v.optional(v.string()),
    visibility: v.union(v.literal('public'), v.literal('private')),
    storageId: v.optional(v.id('_storage')),
    fileType: v.optional(v.union(v.literal('image'), v.literal('video'))),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) throw new ConvexError('You must be logged in to update a confession');

    const confession = await ctx.db.get(args.confessionId);
    if (!confession) throw new ConvexError('Confession not found');
    if (confession.userId !== currentUser._id) throw new ConvexError('Not authorized');

    let fileUrl: string | undefined | null = confession.fileUrl;
    let storageId: Id<'_storage'> | undefined | null = confession.storageId;
    let fileType: 'image' | 'video' | undefined | null = confession.fileType;

    // CASE 1: File is removed (no new storageId, but confession had a file)
    if (!args.storageId && confession.storageId) {
      await ctx.runMutation(internal.storage.deleteFile, {
        storageId: confession.storageId,
      });
      fileUrl = undefined;
      storageId = undefined;
      fileType = undefined;
    }

    // CASE 2: File is changed (new storageId, and it's different from the old one)
    if (args.storageId && args.storageId !== confession.storageId) {
      if (confession.storageId) {
        await ctx.runMutation(internal.storage.deleteFile, {
          storageId: confession.storageId,
        });
      }
      fileUrl = await ctx.runMutation(internal.storage.getDownloadUrl, {
        storageId: args.storageId,
      });
      storageId = args.storageId;
      fileType = args.fileType ?? fileType;
    }

    // CASE 3: File is unchanged (args.storageId === confession.storageId)
    // If fileType is provided, update it (for edge cases)
    if (args.storageId === confession.storageId && args.fileType) {
      fileType = args.fileType;
    }

    await ctx.db.patch(args.confessionId, {
      text: args.text,
      visibility: args.visibility,
      fileUrl: fileUrl || undefined,
      storageId,
      fileType,
    });

    return { success: true };
  },
});

// Like a confession
export const toggleLike = mutation({
  args: {
    confessionId: v.id('confessions'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (!currentUser) {
      throw new ConvexError('You must be logged in to like a confession');
    }

    const confession = await ctx.db.get(args.confessionId);
    if (!confession) {
      throw new ConvexError('Confession not found');
    }

    // Check if user already liked
    const existingLike = await ctx.db
      .query('likes')
      .withIndex('by_user_confession', q =>
        q.eq('userId', currentUser._id).eq('confessionId', args.confessionId)
      )
      .unique();

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.confessionId, {
        likesCount: Math.max(0, confession.likesCount - 1),
      });
    } else {
      // Like
      await ctx.db.insert('likes', {
        userId: currentUser._id,
        confessionId: args.confessionId,
      });
      await ctx.db.patch(args.confessionId, {
        likesCount: confession.likesCount + 1,
      });
    }

    return { success: true };
  },
});

// Get confession with user info and like status
export const getConfessionWithUser = query({
  args: { id: v.id('confessions') },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const confession = await ctx.db.get(args.id);

    if (!confession) {
      throw new ConvexError('Confession not found');
    }

    const user = await ctx.db.get(confession.userId);
    if (!user) {
      throw new ConvexError('User not found');
    }

    let isLiked = false;
    if (currentUser) {
      const like = await ctx.db
        .query('likes')
        .withIndex('by_user_confession', q =>
          q.eq('userId', currentUser._id).eq('confessionId', args.id)
        )
        .unique();
      isLiked = !!like;
    }

    return {
      ...confession,
      user: {
        username: user.username,
        image_url: user.image_url,
      },
      isLiked,
    };
  },
});

// Add this mutation alongside the existing ones
export const deletePost = mutation({
  args: {
    postId: v.id('confessions'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (!currentUser) {
      throw new ConvexError('You must be logged in to delete a post');
    }

    const confession = await ctx.db.get(args.postId);
    if (!confession) {
      throw new ConvexError('Post not found');
    }

    if (confession.userId !== currentUser._id) {
      throw new ConvexError('Not authorized to delete this post');
    }

    // Delete associated file if it exists
    if (confession.storageId) {
      await ctx.runMutation(internal.storage.deleteFile, {
        storageId: confession.storageId,
      });
    }

    // Delete the confession
    await ctx.db.delete(args.postId);

    // Update user's confession count
    await ctx.db.patch(currentUser._id, {
      confessionsCount: Math.max(0, (currentUser.confessionsCount || 1) - 1),
    });

    return { success: true };
  },
});
