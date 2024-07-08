import ConfessionCard from '@/components/ConfessionCard'
import Skeleton from '@/components/Skeleton'
import { CONFESSIONSPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { supabase } from '@/utils/supabase'
import { FlashList } from '@shopify/flash-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const PAGE_SIZE = 50

const HomePage = () => {
	const { theme, styles } = useStyles(stylesheet)
	const safeAreaInsets = useSafeAreaInsets()
	const [loading, setLoading] = useState(true)
	const [confessions, setConfessions] = useState<CONFESSIONSPROPS[]>([])
	const [page, setPage] = useState(0)

	const renderConfessionCard = useCallback(({ item }: { item: CONFESSIONSPROPS }) => {
		if (!item) {
			return null
		}

		return <ConfessionCard item={item} />
	}, [])

	const ListEmptyComponent = useCallback(() => {
		return (
			<View style={styles.emptyContainer}>
				<Text style={[styles.emptyText, { color: theme.colors.gray[200] }]}>
					No confessions available. Please check back later!
				</Text>
			</View>
		)
	}, [theme.colors.gray[400]])

	const fetchConfessions = useCallback(async (page: number) => {
		try {
			let { data: newConfessions, error } = await supabase
				.from('confessions')
				.select(
					`*,
                	user:users (
                    id,
                    displayName,
                    userName,
					gender,
					age,
					photoURL
                	)`,
				)
				.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

			if (error) {
				throw new Error(error.message)
			}

			if (newConfessions) {
				setConfessions((prevConfessions) => [...prevConfessions, ...newConfessions])
			}
		} catch (error) {
			console.log(error)
		}
	}, [])

	useEffect(() => {
		fetchConfessions(page)
	}, [page])

	const loadMoreConfessions = () => {
		setPage((prevPage) => prevPage + 1)
	}

	return (
		<LinearGradient
			colors={[theme.colors.background, theme.colors.background]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={styles.container}>
			{loading && confessions.length === 0 ? (
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={[
						styles.scrollViewContent,
						{ paddingBottom: safeAreaInsets.bottom + moderateScale(80) },
					]}>
					{Array(5)
						.fill(null)
						.map((_, index) => (
							<Skeleton
								key={index}
								width={DEVICE_WIDTH - moderateScale(25)}
								height={moderateScale(150)}
								style={styles.skeleton}
							/>
						))}
				</ScrollView>
			) : confessions.length > 0 ? (
				<FlashList
					data={confessions}
					renderItem={renderConfessionCard}
					keyExtractor={(item) => item?.id.toString()}
					contentContainerStyle={{
						paddingBottom: safeAreaInsets.bottom + moderateScale(80),
						paddingTop: moderateScale(10),
					}}
					alwaysBounceHorizontal
					automaticallyAdjustContentInsets
					estimatedItemSize={200}
					indicatorStyle={theme.colors.typography}
					onEndReached={loadMoreConfessions}
					onEndReachedThreshold={0.5}
				/>
			) : (
				<ListEmptyComponent />
			)}
		</LinearGradient>
	)
}

export default HomePage

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
	},
	skeleton: {
		marginHorizontal: moderateScale(10),
		marginTop: moderateScale(5),
		borderRadius: moderateScale(10),
	},
	scrollViewContent: {
		flexGrow: 1,
		paddingTop: moderateScale(5),
		alignItems: 'center',
	},
	flashListContent: {},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: moderateScale(20),
	},
	emptyText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
		textAlign: 'center',
	},
})
