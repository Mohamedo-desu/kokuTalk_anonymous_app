import AnimatedHeader from '@/components/AnimatedHeader'
import CommentCard from '@/components/CommentCard'
import ConfessionCard from '@/components/ConfessionCard'
import Skeleton from '@/components/Skeleton'
import { PAGE_SIZE } from '@/constants/appDetails'
import useNetworkState from '@/hooks/useNetworkState'
import { fetchConfessionById, fetchConfessionComments } from '@/services/confessionActions'
import { COMMENTPROPS, CONFESSIONPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { FlashList } from '@shopify/flash-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	RefreshControl,
	Text,
	View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import Toast from 'react-native-toast-message'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const AnimatedFlatlist = Animated.createAnimatedComponent(FlashList)

const ConfessionDetails = () => {
	const { id }: Partial<{ id: string }> = useLocalSearchParams()
	console.log('id', id)

	const { theme, styles } = useStyles(stylesheet)
	const [confession, setConfession] = useState<CONFESSIONPROPS>()
	const [comments, setComments] = useState<COMMENTPROPS[]>([])
	const [loading, setLoading] = useState(true)
	const [commentsLoading, setCommentsLoading] = useState(true)

	const safeAreaInsets = useSafeAreaInsets()
	const isNetwork = useNetworkState()

	const scrollY = useSharedValue(0)

	const [fetchingMore, setFetchingMore] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

	const [lastDocumentFetched, setLastDocumentFetched] = useState(null)
	const [noMoreDocuments, setNoMoreDocuments] = useState(false)

	useEffect(() => {
		;(async () => {
			try {
				if (!loading) setLoading(true)
				setLastDocumentFetched(null)
				const confession = await fetchConfessionById({ id })
				setConfession(confession)
				setLoading(false)
			} catch (error) {
				setLoading(false)
				Toast.show(`${error}`, {
					type: 'danger',
				})
			}
		})()
	}, [id, isNetwork])
	useEffect(() => {
		;(async () => {
			try {
				if (!commentsLoading) setCommentsLoading(true)
				const comments = await fetchConfessionComments({
					confessionComments: confession?.comments,
					fetchLimit: PAGE_SIZE,
					lastDocumentFetched,
					setLastDocumentFetched,
					setNoMoreDocuments,
				})

				setComments(comments)

				setCommentsLoading(false)
			} catch (error) {
				setCommentsLoading(false)
				Toast.show(`${error}`, {
					type: 'danger',
				})
			}
		})()
	}, [confession, id, isNetwork])

	const renderCommentCard = useCallback(
		({ item, index }: { item: COMMENTPROPS; index: number }) => {
			if (!item) {
				return null
			}

			return <CommentCard item={item} index={index} />
		},
		[],
	)

	const ListEmptyComponent = useCallback(() => {
		return (
			<View style={styles.emptyContainer}>
				{commentsLoading ? (
					Array(4)
						.fill(null)
						.map((_, index) => (
							<Skeleton
								key={index}
								width={DEVICE_WIDTH - moderateScale(25)}
								height={moderateScale(75)}
								style={styles.skeleton}
							/>
						))
				) : (
					<Text style={[styles.emptyText, { color: theme.colors.gray[200] }]}>
						{isNetwork
							? 'No Comments available yet!. Please check back later!'
							: 'Please check your internet!'}
					</Text>
				)}
			</View>
		)
	}, [theme.colors.gray[400], commentsLoading, isNetwork])
	const loadMoreConfessions = async ({ prepend }: { prepend: boolean }) => {
		try {
			if (noMoreDocuments) return
			if (prepend) {
				if (refreshing) return
				setRefreshing(true)
			} else {
				if (fetchingMore) return
				setFetchingMore(true)
			}

			const newConfessions = await fetchConfessionComments({
				confessionComments: confession?.comments,
				fetchLimit: PAGE_SIZE,
				lastDocumentFetched,
				setLastDocumentFetched,
				setNoMoreDocuments,
			})

			if (newConfessions.length > 0) {
				setComments((prev) => {
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
			Toast.show({
				type: 'danger',
				text1: `${error}`,
			})
		}
	}

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y
		},
	})

	const stickyHeaderHeight = moderateScale(60)

	const rnStyles = useAnimatedStyle(() => {
		return {
			height:
				scrollY.value > 150
					? withTiming(stickyHeaderHeight, {
							duration: 300,
						})
					: withTiming(0, {
							duration: 300,
						}),
		}
	})

	return (
		<LinearGradient
			colors={[theme.colors.background, theme.colors.background]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={styles.container}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={moderateScale(100)}>
				<KeyboardAwareScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					scrollEnabled={true}
					enableOnAndroid={true}
					enableAutomaticScroll={true}
					keyboardOpeningTime={0}
					extraScrollHeight={moderateScale(60)}
					keyboardShouldPersistTaps="handled">
					{loading ? (
						<View style={{ alignItems: 'center', flex: 1 }}>
							<Skeleton
								width={DEVICE_WIDTH - moderateScale(25)}
								height={moderateScale(200)}
								style={[styles.skeleton, { marginBottom: moderateScale(10) }]}
							/>
							{Array(4)
								.fill(null)
								.map((_, index) => (
									<Skeleton
										key={index}
										width={DEVICE_WIDTH - moderateScale(25)}
										height={moderateScale(80)}
										style={styles.skeleton}
									/>
								))}
						</View>
					) : (
						<>
							<AnimatedFlatlist
								data={comments}
								renderItem={renderCommentCard}
								refreshControl={
									<RefreshControl
										onRefresh={() => loadMoreConfessions({ prepend: true })}
										refreshing={refreshing}
										tintColor={theme.colors.primary[500]}
										colors={[theme.colors.primary[500], theme.colors.primary[400]]}
										style={{ backgroundColor: theme.colors.gray[300] }}
									/>
								}
								keyExtractor={(item: COMMENTPROPS) => item.id}
								contentContainerStyle={{
									paddingBottom: safeAreaInsets.bottom + moderateScale(80),
									paddingTop: moderateScale(5),
								}}
								estimatedItemSize={200}
								indicatorStyle={theme.colors.typography}
								onScrollEndDrag={() => loadMoreConfessions({ prepend: false })}
								ListHeaderComponent={
									confession && (
										<>
											<ConfessionCard item={confession} numberOfLines={0} isDetailsScreen={true} />
											<View style={{ marginVertical: moderateScale(5) }} />
										</>
									)
								}
								ListFooterComponent={() =>
									fetchingMore && (
										<View style={{ padding: safeAreaInsets.bottom }}>
											<ActivityIndicator size={'small'} color={theme.colors.primary[500]} />
										</View>
									)
								}
								ListEmptyComponent={ListEmptyComponent}
								onScroll={scrollHandler}
							/>

							{confession?.user && (
								<AnimatedHeader
									item={{
										confession_text: confession.confession_text,
										upVotes: confession.likes.length - confession.dislikes.length,
										commentCount: confession.comments.length,
										viewsCount: confession.views.length,
										sharesCount: confession.shares.length,
										favCount: confession.favorites.length,
									}}
									style={rnStyles}
								/>
							)}
						</>
					)}
				</KeyboardAwareScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	)
}

export default ConfessionDetails

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
		paddingTop: moderateScale(5),
	},
	skeleton: {
		marginTop: moderateScale(5),
		borderRadius: moderateScale(10),
	},
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
