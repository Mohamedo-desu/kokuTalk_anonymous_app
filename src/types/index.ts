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
	user: {
		id: string
		display_name: string
		user_name: string
		photo_url: string
		gender: string
		age: string
	}
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
}

export interface User {
	id: string
	display_name: string
	email: string
	user_name: string
	photo_url: string
	gender: string
	age: string
	confessions: CONFESSIONPROPS[]
	comments: COMMENTPROPS[]
	replies: string[]
	favorites: CONFESSIONPROPS[]
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
}
