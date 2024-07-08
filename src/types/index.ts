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
	confessionText: string
	confessionTypes: string[]
	created_at: string
	user: {
		displayName: string
		gender: string
		age: string
		userName: string
		photoURL: string
	}
}
