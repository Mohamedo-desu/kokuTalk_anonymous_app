import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const getLikes = query({
  args: { confessionId: v.id('confessions') },
  handler: async (ctx, { confessionId }) => {
    const likes = await ctx.db
      .query('likes')
      .withIndex('by_confession', q => q.eq('confessionId', confessionId))
      .collect();

    return Promise.all(
      likes.map(async like => {
        const user = await ctx.db.get(like.userId);
        if (!user) return null;

        return {
          ...like,
          user: {
            userId: user._id,
            username: user.username,
            image_url: user.image_url,
          },
        };
      })
    ).then(likes => likes.filter(Boolean));
  },
});

export const toggleLike = mutation({
  args: { confessionId: v.id('confessions') },
  handler: async (ctx, { confessionId }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return;

    const confession = await ctx.db.get(confessionId);
    if (!confession) return;

    const existingLike = await ctx.db
      .query('likes')
      .withIndex('by_user_confession', q =>
        q.eq('userId', user._id).eq('confessionId', confessionId)
      )
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(confessionId, {
        likesCount: Math.max(0, confession.likesCount - 1),
      });
    } else {
      await ctx.db.insert('likes', {
        userId: user._id,
        confessionId,
      });
      await ctx.db.patch(confessionId, {
        likesCount: confession.likesCount + 1,
      });

      if (confession.userId !== user._id) {
        await ctx.db.insert('notifications', {
          userId: confession.userId,
          type: 'like',
          sourceUserId: user._id,
          confessionId,
          isRead: false,
        });
      }
    }
  },
});
