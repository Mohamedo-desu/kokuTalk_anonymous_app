import ConfessionCard from '@/components/ConfessionCard'
import { FlashList } from '@shopify/flash-list'
import dayjs from 'dayjs'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const CONFESSIONS = [
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
	{
		id: 9,
		displayName: 'PaulBlack789',
		gender: 'm',
		age: 29,
		favorite: false,
		likes: 40,
		comments: 9,
		confession: "I can't sleep without a night light. The darkness just feels too overwhelming.",
		type: 'loneliness',
		createdAt: '2023-06-21T20:00:00Z',
	},
]

const HomePage = () => {
	const { theme, styles } = useStyles(stylesheet)
	const safeAreaInsets = useSafeAreaInsets()

	const renderConfessionCard = useCallback(({ item }: { item: (typeof CONFESSIONS)[0] }) => {
		if (!item) {
			return null
		}

		return <ConfessionCard item={item} />
	}, [])

	return (
		<LinearGradient
			colors={[theme.colors.background, theme.colors.gray[100]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={styles.container}>
			<FlashList
				data={CONFESSIONS}
				renderItem={renderConfessionCard}
				keyExtractor={(item) => item?.id?.toString() || ''}
				showsVerticalScrollIndicator={false}
				alwaysBounceHorizontal
				automaticallyAdjustContentInsets
				contentContainerStyle={{
					paddingBottom: safeAreaInsets.bottom + moderateScale(80),
					paddingTop: moderateScale(10),
				}}
				estimatedItemSize={200}
			/>
		</LinearGradient>
	)
}

export default HomePage
const stylesheet = createStyleSheet({
	container: {
		flex: 1,
	},
})
