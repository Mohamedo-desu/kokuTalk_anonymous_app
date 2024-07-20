export interface NOTIFICATIONPROPS {
	id: string
	date: string
	avatar: string
	title: string
	body: string
}

export interface CONFESSIONPROPS {
	id: string
	created_at: string
	dislikes: string[]
	likes: string[]
	comments: string[]
	confession_text: string
	confessed_by: string
	confession_types: string[]
	shares: string[]
	views: string[]
	favorites: string[]
	user: User
	reports: string[]
}

export interface ADDCONFESSIONPROPS {
	created_at: string
	confession_text: string
	confession_types: string[]
	confessed_by: string
	likes: string[]
	dislikes: string[]
	comments: string[]
	shares: string[]
	views: string[]
	favorites: string[]
	reports: []
}

export interface User {
	id: string
	display_name: string
	email: string
	photo_url: string
	gender: string
	age: string
	pushTokens: string[]
	blocked_users: string[]
	confessions: CONFESSIONPROPS[]
	comments: COMMENTPROPS[]
	replies: string[]
	favorites: CONFESSIONPROPS[]
	created_at: string
	updated_at: string
}

export interface COMMENTPROPS {
	id: string
	comment_text: string
	confession_id: string
	commented_by: string
	replies: string[]
	likes: string[]
	dislikes: string[]
	user: CONFESSIONPROPS['user']
	created_at: string
	reports: string[]
}
export interface REPLYPROPS {
	id: string
	reply_text: string
	comment_id: string
	confession_id: string
	replied_by: string
	likes: string[]
	dislikes: string[]
	user: CONFESSIONPROPS['user']
	created_at: string
	reports: string[]
}

export interface REPORTPROPS {
	confession_id: string
	report_reason: (string | { other: string })[]
	reported_by: string
	created_at: string
}
