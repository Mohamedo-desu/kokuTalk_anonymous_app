export interface NOTIFICATIONPROPS {
	id: string
	date: string
	avatar: string
	title: string
	body: string
}

export interface CONFESSIONSPROPS {
	id: string
	displayName: string
	gender: string
	age: string
	favorite: boolean
	dislikes: string[]
	likes: string[]
	comments: string
	confession: string
	type: string
	createdAt: string
}
