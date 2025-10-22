import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

type NotificationType = 'like' | 'comment' | 'follow';

type NotificationResult = Doc<'notifications'> & {
  sourceUser: {
    userId: string;
    username: string;
    image_url: string;
  };
  confession?: {
    text: string;
    fileUrl?: string;
    fileType?: 'image' | 'video';
  };
  comment?: {
    text: string;
  };
};

export const getUnreadCount = query({
  args: {},
  handler: async ctx => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return 0;

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .filter(q => q.eq(q.field('isRead'), false))
      .collect();

    return notifications.length;
  },
});

export const getNotifications = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, { paginationOpts }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return { page: [], isDone: true, continueCursor: null };

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .order('desc')
      .paginate(paginationOpts);

    const page = await Promise.all(
      notifications.page.map(async notification => {
        const sourceUser = await ctx.db.get(notification.sourceUserId);
        if (!sourceUser) return null;

        const result: NotificationResult = {
          ...notification,
          sourceUser: {
            userId: sourceUser._id,
            username: sourceUser.username,
            image_url: sourceUser.image_url,
          },
        };

        if (notification.confessionId) {
          const confession = await ctx.db.get(notification.confessionId);
          if (confession) {
            result.confession = {
              text: confession.text,
              fileUrl: confession.fileUrl,
              fileType: confession.fileType,
            };
          }
        }

        if (notification.commentId) {
          const comment = await ctx.db.get(notification.commentId);
          if (comment) {
            result.comment = {
              text: comment.text,
            };
          }
        }

        return result;
      })
    ).then(notifications => notifications.filter(Boolean));

    return {
      page,
      isDone: notifications.isDone,
      continueCursor: notifications.continueCursor,
    };
  },
});

export const markNotificationAsRead = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, { notificationId }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return;

    const notification = await ctx.db.get(notificationId);
    if (!notification || notification.userId !== user._id) return;

    await ctx.db.patch(notificationId, { isRead: true });
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {},
  handler: async ctx => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return;

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .filter(q => q.eq(q.field('isRead'), false))
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }
  },
});

export const createNotification = mutation({
  args: {
    userId: v.id('users'),
    type: v.union(v.literal('like'), v.literal('comment'), v.literal('follow')),
    sourceUserId: v.id('users'),
    confessionId: v.optional(v.id('confessions')),
    commentId: v.optional(v.id('comments')),
  },
  handler: async (ctx, { userId, type, sourceUserId, confessionId, commentId }) => {
    return await ctx.db.insert('notifications', {
      userId,
      type,
      sourceUserId,
      confessionId,
      commentId,
      isRead: false,
    });
  },
});
