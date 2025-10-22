import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const getComments = query({
  args: { confessionId: v.id('confessions') },
  handler: async (ctx, { confessionId }) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_confession', q => q.eq('confessionId', confessionId))
      .order('desc')
      .collect();

    return Promise.all(
      comments.map(async comment => {
        const user = await ctx.db.get(comment.userId);
        if (!user) return null;

        return {
          ...comment,
          user: {
            userId: user._id,
            username: user.username,
            image_url: user.image_url,
          },
        };
      })
    ).then(comments => comments.filter(Boolean));
  },
});

export const addComment = mutation({
  args: { confessionId: v.id('confessions'), text: v.string() },
  handler: async (ctx, { confessionId, text }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return;

    const confession = await ctx.db.get(confessionId);
    if (!confession) return;

    const commentId = await ctx.db.insert('comments', {
      userId: user._id,
      confessionId,
      text,
    });

    await ctx.db.patch(confessionId, {
      commentsCount: confession.commentsCount + 1,
    });

    if (confession.userId !== user._id) {
      await ctx.db.insert('notifications', {
        userId: confession.userId,
        type: 'comment',
        sourceUserId: user._id,
        confessionId,
        commentId,
        isRead: false,
      });
    }

    return commentId;
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id('comments') },
  handler: async (ctx, { commentId }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return;

    const comment = await ctx.db.get(commentId);
    if (!comment) return;

    const confession = await ctx.db.get(comment.confessionId);
    if (!confession) return;

    if (comment.userId !== user._id && confession.userId !== user._id) return;

    await ctx.db.delete(commentId);
    await ctx.db.patch(confession._id, {
      commentsCount: Math.max(0, confession.commentsCount - 1),
    });
  },
});
