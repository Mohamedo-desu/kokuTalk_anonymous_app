import dayjs from 'dayjs'

interface ConfessionTypeStyles {
	[key: string]: {
		backgroundColor: string
		// Add other properties if needed
	}
}

export const CONFESSIONS = [
	{
		id: 1,
		displayName: 'JohnDoe123',
		gender: 'm',
		age: 25,
		favorite: true,
		likes: 23,
		comments: 5,
		confession:
			'I have a fear of clowns. It started when I was a kid and watched a horror movie. Now, even seeing a clown at a party makes me anxious.',
		type: 'fear',
		createdAt: dayjs().toISOString(),
	},
	{
		id: 2,
		displayName: 'JaneDoe456',
		gender: 'f',
		age: 30,
		favorite: false,
		likes: 42,
		comments: 10,
		confession: "I love singing in the shower. It's my private concert every morning!",
		type: 'happiness',
		createdAt: dayjs().subtract(1, 'days').toISOString(),
	},
	{
		id: 3,
		displayName: 'MikeSmith789',
		gender: 'm',
		age: 22,
		favorite: true,
		likes: 15,
		comments: 2,
		confession:
			"I never learned how to ride a bike. My parents tried, but I just couldn't get the hang of it.",
		type: 'sad',
		createdAt: dayjs().subtract(2, 'days').toISOString(),
	},
	{
		id: 4,
		displayName: 'SaraJones321',
		gender: 'f',
		age: 28,
		favorite: false,
		likes: 36,
		comments: 8,
		confession:
			'I am secretly afraid of the dark. Even at this age, I need a night light to sleep peacefully.',
		type: 'fear',
		createdAt: '2024-06-30T2:00:00Z',
	},
	{
		id: 5,
		displayName: 'TomWhite654',
		gender: 'm',
		age: 35,
		favorite: true,
		likes: 55,
		comments: 20,
		confession:
			'I often talk to my plants. I believe they grow better when I tell them about my day.',
		type: 'kindness',
		createdAt: '2023-06-18T09:30:00Z',
	},
	{
		id: 6,
		displayName: 'LindaGreen987',
		gender: 'f',
		age: 26,
		favorite: false,
		likes: 29,
		comments: 12,
		confession:
			"I can't stand the sound of chewing. It drives me crazy, especially when someone is eating loudly next to me.",
		type: 'just saying',
		createdAt: '2023-06-22T17:20:00Z',
	},
	{
		id: 7,
		displayName: 'ChrisBlue123',
		gender: 'm',
		age: 27,
		favorite: true,
		likes: 33,
		comments: 7,
		confession:
			'I still watch cartoons every morning. They remind me of simpler times and make me happy.',
		type: 'funny',
		createdAt: '2023-06-24T14:15:00Z',
	},
	{
		id: 8,
		displayName: 'AnnaYellow456',
		gender: 'f',
		age: 31,
		favorite: true,
		likes: 48,
		comments: 15,
		confession:
			'I am terrified of heights. Once, I froze on a Ferris wheel and had to be helped down.',
		type: 'fear',
		createdAt: '2023-06-26T11:45:00Z',
	},
]

export const CONFESSIONS_TYPES_STYLES: ConfessionTypeStyles = {
	fear: {
		backgroundColor: 'red',
	},
	happiness: {
		backgroundColor: 'yellow',
	},
	sadness: {
		backgroundColor: 'blue',
	},
	kindness: {
		backgroundColor: 'green',
	},
	'just saying': {
		backgroundColor: 'purple',
	},
	funny: {
		backgroundColor: 'orange',
	},
	love: {
		backgroundColor: 'pink',
	},
	anger: {
		backgroundColor: 'darkred',
	},
	surprise: {
		backgroundColor: 'cyan',
	},
	excitement: {
		backgroundColor: 'magenta',
	},
	hope: {
		backgroundColor: 'lightgreen',
	},
	regret: {
		backgroundColor: 'darkslategray',
	},
	gratitude: {
		backgroundColor: 'gold',
	},
	nostalgia: {
		backgroundColor: 'teal',
	},
	envy: {
		backgroundColor: 'lime',
	},
	guilt: {
		backgroundColor: 'brown',
	},
	ambition: {
		backgroundColor: 'navy',
	},
	confusion: {
		backgroundColor: 'orchid',
	},
	admiration: {
		backgroundColor: 'lightcoral',
	},
	determination: {
		backgroundColor: 'indigo',
	},
	patience: {
		backgroundColor: 'olive',
	},
	curiosity: {
		backgroundColor: 'darkorange',
	},
	relief: {
		backgroundColor: 'lightblue',
	},
	satisfaction: {
		backgroundColor: 'mediumspringgreen',
	},
	pride: {
		backgroundColor: 'hotpink',
	},
	contentment: {
		backgroundColor: 'deepskyblue',
	},
	disgust: {
		backgroundColor: 'peru',
	},
	despair: {
		backgroundColor: 'slateblue',
	},
	courage: {
		backgroundColor: 'tomato',
	},
	compassion: {
		backgroundColor: 'sienna',
	},
	loneliness: {
		backgroundColor: 'coral',
	},
	remorse: {
		backgroundColor: 'darkviolet',
	},
	awe: {
		backgroundColor: 'salmon',
	},
	amazement: {
		backgroundColor: 'firebrick',
	},
	humility: {
		backgroundColor: 'darkcyan',
	},
	fulfillment: {
		backgroundColor: 'steelblue',
	},
	zeal: {
		backgroundColor: 'slategrey',
	},
	trust: {
		backgroundColor: 'lightpink',
	},
	disbelief: {
		backgroundColor: 'lightseagreen',
	},
	exhilaration: {
		backgroundColor: 'violet',
	},
	frustration: {
		backgroundColor: 'orangered',
	},
	appreciation: {
		backgroundColor: 'lavender',
	},

	eagerness: {
		backgroundColor: 'darkslateblue',
	},

	impatience: {
		backgroundColor: 'lightgrey',
	},
	attraction: {
		backgroundColor: 'royalblue',
	},

	serenity: {
		backgroundColor: 'mediumvioletred',
	},
	affection: {
		backgroundColor: 'goldenrod',
	},
	delight: {
		backgroundColor: 'mediumaquamarine',
	},
	enchantment: {
		backgroundColor: 'darkmagenta',
	},
	contempt: {
		backgroundColor: 'lightyellow',
	},
	irritation: {
		backgroundColor: 'darkkhaki',
	},
	doubt: {
		backgroundColor: 'thistle',
	},

	enthusiasm: {
		backgroundColor: 'darkslategrey',
	},
	obsession: {
		backgroundColor: 'mediumseagreen',
	},

	astonishment: {
		backgroundColor: 'mediumblue',
	},

	adoration: {
		backgroundColor: 'burlywood',
	},

	sorrow: {
		backgroundColor: 'antiquewhite',
	},
	joy: {
		backgroundColor: 'mediumspringgreen',
	},
	apprehension: {
		backgroundColor: 'darkolivegreen',
	},

	confidence: {
		backgroundColor: 'plum',
	},
	uncertainty: {
		backgroundColor: 'darkcyan',
	},
	shame: {
		backgroundColor: 'lightseagreen',
	},

	rage: {
		backgroundColor: 'lavenderblush',
	},
	indifference: {
		backgroundColor: 'palegoldenrod',
	},

	pity: {
		backgroundColor: 'rosybrown',
	},
	loathing: {
		backgroundColor: 'lightsteelblue',
	},
	annoyance: {
		backgroundColor: 'cadetblue',
	},
}
