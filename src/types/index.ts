export interface NOTIFICATIONPROPS {
	id: string
	date: string
	avatar: string
	title: string
	body: string
}

export interface CONFESSIONSPROPS {
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

export interface ADDCOMMENTPROPS {
	comment_text: string
	confession_id: string
	commented_by: string
	replies: string[]
	likes: string[]
	dislikes: string[]
}

export interface User {
	id: string
	display_name: string
	email: string
	user_name: string
	photo_url: string
	gender: string
	age: string
	confessions: CONFESSIONSPROPS[]
	comments: string[]
	replies: string[]
	favorites: string[]
}
