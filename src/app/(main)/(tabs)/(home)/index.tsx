import ConfessionCard from '@/components/ConfessionCard'
import Skeleton from '@/components/Skeleton'
import { PAGE_SIZE } from '@/constants/appDetails'
import useNetworkState from '@/hooks/useNetworkState'
import { fetchConfessions } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { CONFESSIONSPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { getStoredValues, saveSecurely } from '@/utils/storageUtils'
import { FlashList } from '@shopify/flash-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { Toast } from 'react-native-toast-notifications'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const HomePage = () => {
	const { theme, styles } = useStyles(stylesheet)
	const safeAreaInsets = useSafeAreaInsets()
	const [loading, setLoading] = useState(true)
	const [fetchingMore, setFetchingMore] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

	const [confessions, setConfessions] = useState<CONFESSIONSPROPS[]>([])
	const [lastDocumentFetched, setLastDocumentFetched] = useState(null)

	const userId = useAuthStoreSelectors.use.currentUser().id
	const isNetwork = useNetworkState()

	const renderConfessionCard = useCallback(({ item }: { item: CONFESSIONSPROPS }) => {
		if (!item) {
			return null
		}

		return <ConfessionCard item={item} numberOfLines={5} />
	}, [])

	const ListEmptyComponent = useCallback(() => {
		return (
			<View style={styles.emptyContainer}>
				<Text style={[styles.emptyText, { color: theme.colors.gray[200] }]}>
					{isNetwork
						? 'No confessions available. Please check back later!'
						: 'Please check your internet!'}
				</Text>
			</View>
		)
	}, [theme.colors.gray[400]])

	useEffect(() => {
		;(async () => {
			try {
				if (!loading) {
					setLoading(true)
				}

				const newConfessions = await fetchConfessions({
					fetchLimit: PAGE_SIZE,
					lastDocumentFetched,
					setLastDocumentFetched,
				})

				setConfessions((prev) => {
					const combinedConfessions = [...prev, ...newConfessions]
					const uniqueConfessionIds = Array.from(
						new Set(combinedConfessions.map((confession) => confession.id)),
					).filter((id) => id !== undefined)
					const uniqueConfessions = uniqueConfessionIds
						.map((id) => combinedConfessions.find((confession) => confession.id === id))
						.filter((confession) => confession !== undefined)

					return uniqueConfessions
				})

				setLoading(false)
			} catch (error) {
				setLoading(false)
				Toast.show(`${error}`, {
					type: 'danger',
				})
			}
		})()
	}, [isNetwork])

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

				const newConfessions = await fetchConfessions({
					fetchLimit: PAGE_SIZE,
					lastDocumentFetched,
					setLastDocumentFetched,
				})
				if (newConfessions.length > 0) {
					setConfessions((prev) => {
						const combinedConfessions = prepend
							? [...newConfessions, ...prev]
							: [...prev, ...newConfessions]

						const uniqueConfessionIds = Array.from(
							new Set(combinedConfessions.map((confession) => confession.id)),
						).filter((id) => id !== undefined)
						const uniqueConfessions = uniqueConfessionIds
							.map((id) => combinedConfessions.find((confession) => confession.id === id))
							.filter((confession) => confession !== undefined)

						return uniqueConfessions
					})
				}
				if (prepend) {
					setRefreshing(false)
				} else {
					setFetchingMore(false)
				}
			} catch (error) {
				if (prepend) {
					setRefreshing(false)
				} else {
					setFetchingMore(false)
				}
				Toast.show(`${error}`, {
					type: 'danger',
				})
			}
		},
		[lastDocumentFetched, refreshing, fetchingMore],
	)

	const keyExtractor = useCallback((item: CONFESSIONSPROPS, i: number) => `${i}-${item.id}`, [])

	const onViewableItemsChanged = async ({ viewableItems }: { viewableItems: any[] }) => {
		const unseenItems = viewableItems
			.filter((item) => !item.item.views?.includes(userId))
			.map((item) => item.item.id)

		if (unseenItems.length === 0) {
			return
		}

		try {
			let { unseenConfessions } = await getStoredValues(['unseenConfessions'])

			if (!unseenConfessions) {
				unseenConfessions = []
			} else {
				unseenConfessions = JSON.parse(unseenConfessions)
			}

			const updatedUnseenConfessions = Array.from(new Set([...unseenItems, ...unseenConfessions]))

			await saveSecurely([
				{
					key: 'unseenConfessions',
					value: JSON.stringify(updatedUnseenConfessions),
				},
			])
		} catch (error) {
			Toast.show(`${error}`, {
				type: 'danger',
			})
		}
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
			) : (
				<FlashList
					data={confessions}
					renderItem={renderConfessionCard}
					refreshControl={
						<RefreshControl
							onRefresh={() => loadMoreConfessions({ prepend: true })}
							refreshing={refreshing}
							tintColor={theme.colors.primary[500]}
							colors={[theme.colors.primary[500], theme.colors.primary[400]]}
							style={{ backgroundColor: theme.colors.gray[300] }}
						/>
					}
					keyExtractor={keyExtractor}
					contentContainerStyle={{
						paddingBottom: safeAreaInsets.bottom + moderateScale(80),
						paddingTop: moderateScale(10),
					}}
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
					viewabilityConfig={{
						itemVisiblePercentThreshold: 100,
						minimumViewTime: 5000,
						waitForInteraction: false,
					}}
					onViewableItemsChanged={onViewableItemsChanged}
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
