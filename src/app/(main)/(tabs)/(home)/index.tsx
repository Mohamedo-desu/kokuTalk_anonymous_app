import ConfessionCard from '@/components/ConfessionCard'
import Skeleton from '@/components/Skeleton'
import { fetchConfessions } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { CONFESSIONSPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { FlashList } from '@shopify/flash-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const PAGE_SIZE = 20

const HomePage = () => {
	const { theme, styles } = useStyles(stylesheet)
	const safeAreaInsets = useSafeAreaInsets()
	const [loading, setLoading] = useState(true)
	const [fetchingMore, setFetchingMore] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

	const [confessions, setConfessions] = useState<CONFESSIONSPROPS[]>([])

	const userId = useAuthStoreSelectors.use.currentUser().id

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

	useEffect(() => {
		;(async () => {
			try {
				const newConfessions = await fetchConfessions({ userId, limit: PAGE_SIZE })
				if (newConfessions) {
					setConfessions((prev) => {
						const combinedConfessions = [...prev, ...newConfessions]
						const uniqueConfessions = Array.from(
							new Set(combinedConfessions.map((confession) => confession.id)),
						).map((id) => combinedConfessions.find((confession) => confession.id === id))

						return uniqueConfessions
					})
				}
				setLoading(false)
			} catch (error) {
				console.log(error)
				setLoading(false)
			}
		})()
	}, [])

	const loadMoreConfessions = useCallback(
		async ({ prepend }: { prepend: boolean }) => {
			try {
				if (prepend) {
					if (refreshing) return
					setRefreshing(true)
				} else {
					if (fetchingMore) return
					setFetchingMore(true)
				}

				const newConfessions = await fetchConfessions({ userId, limit: PAGE_SIZE })
				if (newConfessions.length > 0) {
					setConfessions((prev) => {
						const combinedConfessions = prepend
							? [...newConfessions, ...prev]
							: [...prev, ...newConfessions]
						const uniqueConfessions = Array.from(
							new Set(combinedConfessions.map((confession) => confession.id)),
						).map((id) => combinedConfessions.find((confession) => confession.id === id))

						return uniqueConfessions
					})
				}
				if (prepend) {
					setRefreshing(false)
				} else {
					setFetchingMore(false)
				}
			} catch (error) {
				console.log(error)

				if (prepend) {
					setRefreshing(false)
				} else {
					setFetchingMore(false)
				}
			}
		},
		[userId, confessions],
	)
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
			) : (
				<FlashList
					data={confessions}
					renderItem={renderConfessionCard}
					refreshControl={
						<RefreshControl
							onRefresh={() => loadMoreConfessions({ prepend: true })}
							refreshing={refreshing}
							colors={[theme.colors.primary[500], theme.colors.primary[400]]}
							style={{ backgroundColor: theme.colors.gray[300] }}
						/>
					}
					keyExtractor={(item) => item?.id.toString()}
					contentContainerStyle={{
						paddingBottom: safeAreaInsets.bottom + moderateScale(80),
						paddingTop: moderateScale(10),
					}}
					alwaysBounceHorizontal
					automaticallyAdjustContentInsets
					estimatedItemSize={200}
					indicatorStyle={theme.colors.typography}
					onScrollEndDrag={() => loadMoreConfessions({ prepend: false })}
					ListFooterComponent={() =>
						fetchingMore && (
							<View style={{ padding: safeAreaInsets.bottom }}>
								<ActivityIndicator size={'small'} color={theme.colors.primary[500]} />
							</View>
						)
					}
					ListEmptyComponent={ListEmptyComponent}
				/>
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
