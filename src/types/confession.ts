import { Doc, Id } from '../../convex/_generated/dataModel';

export interface Confession extends Doc<'confessions'> {
  userId: Id<'users'>;
  text?: string;
  visibility: 'public' | 'private';
  fileUrl?: string;
  fileType?: 'image' | 'video';
  storageId?: Id<'_storage'>;
  likesCount: number;
  commentsCount: number;
}

export interface ConfessionWithUser extends Confession {
  user: {
    username: string;
    email: string;
  };
}
