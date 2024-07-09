export interface NOTIFICATIONPROPS {
	id: string
	date: string
	avatar: string
	title: string
	body: string
}

export interface CONFESSIONSPROPS {
	id: string
	dislikes: string[]
	likes: string[]
	comments: string[]
	confession_text: string
	confession_types: string[]
	created_at: string
	user: {
		display_name: string
		user_name: string
		photo_url: string
		gender: string
		age: string
	}
}

export interface ADDCONFESSIONPROPS {
	confession_text: string
	confession_types: string[]
	confessed_by: string
	likes: string[]
	dislikes: string[]
	comments: string[]
	shares: string[]
	views: string[]
}
