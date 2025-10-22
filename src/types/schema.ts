import { Id } from 'convex/_generated/dataModel';

export type User = {
  _id: Id<'users'>;
  _creationTime: number;
  username: string;
  email: string;
  clerkId: string;
  image_url: string;
  confessionsCount: number;
};

export type Confession = {
  _id: Id<'confessions'>;
  _creationTime: number;
  userId: Id<'users'>;
  text: string;
  visibility: 'public' | 'private';
  storageId?: Id<'_storage'>;
  fileUrl?: string;
  fileType?: 'image' | 'video';
  likesCount: number;
  commentsCount: number;
  createdAt: number;
  user: {
    username: string;
    image_url: string;
  };
};

export type Comment = {
  _id: Id<'comments'>;
  _creationTime: number;
  userId: Id<'users'>;
  confessionId: Id<'confessions'>;
  text: string;
  createdAt: number;
};

export type Like = {
  _id: Id<'likes'>;
  _creationTime: number;
  userId: Id<'users'>;
  confessionId: Id<'confessions'>;
  createdAt: number;
};

export type NotificationType = 'like' | 'comment' | 'mention' | 'follow';

export type Notification = {
  _id: Id<'notifications'>;
  _creationTime: number;
  userId: Id<'users'>;
  type: NotificationType;
  sourceUserId: Id<'users'>;
  confessionId?: Id<'confessions'>;
  commentId?: Id<'comments'>;
  isRead: boolean;
  createdAt: number;
};
