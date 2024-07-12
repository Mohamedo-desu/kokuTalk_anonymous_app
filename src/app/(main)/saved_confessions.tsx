import ConfessionCard from '@/components/ConfessionCard'
import Skeleton from '@/components/Skeleton'
import { PAGE_SIZE } from '@/constants/appDetails'
import useNetworkState from '@/hooks/useNetworkState'
import { fetchFavoriteConfessions } from '@/services/confessionActions'
import { CONFESSIONSPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { FlashList } from '@shopify/flash-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { Toast } from 'react-native-toast-notifications'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SavedConfessions = () => {
	const { theme, styles } = useStyles(stylesheet)
	const safeAreaInsets = useSafeAreaInsets()
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [fetchingMore, setFetchingMore] = useState(false)

	const [favoriteConfessions, setFavoriteConfessions] = useState<CONFESSIONSPROPS[]>([])
	const [lastDocumentFetched, setLastDocumentFetched] = useState(null)

	const isNetwork = useNetworkState()

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
					{isNetwork
						? 'You have no saved confessions. Please check back later!'
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

				const confessions = await fetchFavoriteConfessions({
					fetchLimit: PAGE_SIZE,
					lastDocumentFetched,
					setLastDocumentFetched,
				})
				setFavoriteConfessions(confessions)
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
			if (prepend) {
				if (refreshing) return
				setRefreshing(true)
			} else {
				if (fetchingMore) return
				setFetchingMore(true)
			}

			try {
				const newConfessions = await fetchFavoriteConfessions({
					fetchLimit: PAGE_SIZE,
					lastDocumentFetched,
					setLastDocumentFetched,
				})

				setFavoriteConfessions((prev) => {
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

	return (
		<LinearGradient
			colors={[theme.colors.background, theme.colors.background]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={styles.container}>
			{loading && favoriteConfessions.length === 0 ? (
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
					data={favoriteConfessions}
					renderItem={renderConfessionCard}
					keyExtractor={keyExtractor}
					contentContainerStyle={{
						paddingBottom: safeAreaInsets.bottom + moderateScale(80),
						paddingTop: moderateScale(10),
					}}
					refreshControl={
						<RefreshControl
							onRefresh={() => loadMoreConfessions({ prepend: true })}
							refreshing={refreshing}
							tintColor={theme.colors.primary[500]}
							colors={[theme.colors.primary[500], theme.colors.primary[400]]}
							style={{ backgroundColor: theme.colors.gray[300] }}
						/>
					}
					estimatedItemSize={200}
					indicatorStyle={theme.colors.typography}
					ListEmptyComponent={ListEmptyComponent}
					onScrollEndDrag={() => loadMoreConfessions({ prepend: false })}
					ListFooterComponent={() =>
						fetchingMore && (
							<View style={{ padding: safeAreaInsets.bottom }}>
								<ActivityIndicator size={'small'} color={theme.colors.primary[500]} />
							</View>
						)
					}
				/>
			)}
		</LinearGradient>
	)
}

export default SavedConfessions

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
