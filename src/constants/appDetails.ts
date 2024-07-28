export const appName = 'KokuTalk'

export const PAGE_SIZE = 10

export enum CONFESSION_STORED_KEYS {
	CONFESSIONS_TO_LIKE = 'confessionsToLike',
	CONFESSIONS_TO_DISLIKE = 'confessionsTodisLike',
	CONFESSIONS_TO_UNLIKE = 'confessionsToUnlike',
	CONFESSIONS_TO_UNDISLIKE = 'confessionsToUndislike',
	CONFESSIONS_TO_SHARE = 'confessionsToShare',
	CONFESSIONS_TO_FAVORITE = 'confessionsToFavorite',
	CONFESSIONS_TO_UNFAVORITE = 'confessionsToUnFavorite',
	PUSH_TOKENS_TO_NOTIFY = 'confessionsPushTokensToNotify',
	UNSEEN_CONFESSIONS = 'unseenConfessions',
}

export enum COMMENT_STORED_KEYS {
	COMMENTS_TO_LIKE = 'commentsToLike',
	COMMENTS_TO_DISLIKE = 'commentsTodisLike',
	COMMENTS_TO_UNLIKE = 'commentsToUnlike',
	COMMENTS_TO_UNDISLIKE = 'commentsToUndislike',
	PUSH_TOKENS_TO_NOTIFY = 'commentsPushTokensToNotify',
}

export enum REPLY_STORED_KEYS {
	REPLIES_TO_LIKE = 'repliesToLike',
	REPLIES_TO_DISLIKE = 'repliesTodisLike',
	REPLIES_TO_UNLIKE = 'repliesToUnlike',
	REPLIES_TO_UNDISLIKE = 'repliesToUndislike',
	PUSH_TOKENS_TO_NOTIFY = 'repliesPushTokensToNotify',
}

export enum NOTIFICATION_TYPES {
	SYSTEM = 'system',
	USER = 'user',
}
