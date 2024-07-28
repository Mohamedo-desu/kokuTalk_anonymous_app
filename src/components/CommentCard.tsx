import { PAGE_SIZE } from '@/constants/appDetails'
import useIsAnonymous from '@/hooks/useIsAnonymous'
import { fetchCommentReplies } from '@/services/commentActions'
import { moderateContent } from '@/services/openAi/userAiActions'
import { blockUser } from '@/services/userActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { COMMENTPROPS, REPLYPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { deleteComment, disLikeComment, likeComment } from '@/utils/commentUtils'
import { shortenNumber } from '@/utils/generalUtils'
import { addReply } from '@/utils/ReplyUtils'
import { formatRelativeTime } from '@/utils/timeUtils'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { moderateScale } from 'react-native-size-matters'
import Toast from 'react-native-toast-message'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import AddCommentCard from './AddCommentCard'
import GuestModal from './GuestModal'
import MenuOptions from './MenuOptions'
import ReplyCard from './ReplyCard'
import ReportModal from './ReportModal'
import Skeleton from './Skeleton'

/**
 * Renders a Comment card component
 * @param {COMMENTPROPS} item - The Comment card props
 * @returns {JSX.Element} The Comment card component
 */

const COMMENT_LENGTH = Math.floor(DEVICE_WIDTH / 2)

const commentCard = ({ item, index }: { item: COMMENTPROPS; index?: number }): JSX.Element => {
	const isAnonymous = useIsAnonymous()

	const { id: userId, blocked_users } = useAuthStoreSelectors.getState().currentUser

	const isOwner = item.user?.id === userId

	const { theme, styles } = useStyles(stylesheet)
	const { id, comment_text, created_at, confession_id, commented_by } = item
	const { display_name, gender, age, photo_url, pushTokens } = item.user

	const [guestModalVisible, setGuestModalVisible] = useState(false)
	const [reportModalVisible, setReportModalVisible] = useState(false)

	const [likes, setLikes] = useState(item.likes)
	const [dislikes, setdisLikes] = useState(item.dislikes)

	const [repliesCount, setRepliesCount] = useState(item.replies.length)
	const [replies, setReplies] = useState<REPLYPROPS[]>([])

	const [loading, setLoading] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [reporting, setReporting] = useState(false)
	const [blocking, setBlocking] = useState(false)
	const [newReply, setNewReply] = useState('')

	const [toggleDetails, setToggleDetails] = useState(false)
	const [showFullComment, setShowFullComment] = useState(false)

	const [lastDocumentFetched, setLastDocumentFetched] = useState(null)
	const [noMoreDocuments, setNoMoreDocuments] = useState(false)
	const [fetchingMore, setFetchingMore] = useState(false)
	const [fetchingFirstComment, setFetchingFirstComment] = useState(true)

	const animatedAddCommentHeight = useSharedValue(0)

	const toggleCommentCard = useCallback(() => {
		animatedAddCommentHeight.value = animatedAddCommentHeight.value > 0 ? 0 : moderateScale(85)
	}, [animatedAddCommentHeight])

	// COMMENT FUNCTIONS

	const handleLikeComment = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		await likeComment({
			id,
			likes,
			dislikes,
			pushTokens,
			itemLikes: item.likes,
			setLikes,
			setdisLikes,
		})
	}, [isAnonymous, likes, dislikes, id])
	const handleDislikeComment = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		await disLikeComment({
			id,
			likes,
			dislikes,
			itemDisLikes: item.dislikes,
			setLikes,
			setdisLikes,
		})
	}, [isAnonymous, likes, dislikes, id])
	const handleAddReply = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		if (loading) return
		setLoading(true)

		await addReply({
			id,
			confessionId: confession_id,
			newReply,
		})
		setRepliesCount((prev) => prev + 1)
		setNewReply('')
		setLoading(false)
	}, [id, newReply, isAnonymous, loading, confession_id])
	const handleDeleteComment = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		if (deleting) return
		setDeleting(true)
		await deleteComment({
			confessionId: confession_id,
			commentId: id,
			commentedById: item.user.id,
		})
		setDeleting(false)
	}, [isAnonymous, id])
	const handleReportComment = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		if (reporting) return
		setReportModalVisible(true)
	}, [isAnonymous, id])
	const handleBlockUser = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		if (blocking) return
		if (blocked_users?.includes(commented_by)) return
		setBlocking(true)
		try {
			await blockUser({ uid: userId, blockUserId: commented_by })
			setBlocking(false)
			Alert.alert(
				'User Blocked',
				'You will no longer see this user or their confessions, comments, or replies.',
				[{ text: 'OK' }],
			)
		} catch (error) {
			console.error('Error blocking user:', error)
		}
	}, [isAnonymous, blocking, userId, commented_by])
	// COMMENT FUNCTIONS END

	// COMMENT COMPONENTS
	const renderTimeDisplay = () => (
		<View style={styles.timeCon}>
			<Text style={[styles.timeText, { color: theme.colors.gray[400] }]}>
				{formatRelativeTime(created_at)}
			</Text>
		</View>
	)
	const renderFooterDisplay = () =>
		!toggleDetails ? (
			<View style={styles.footer}>
				<View style={styles.likeCountCon}>
					<TouchableOpacity activeOpacity={0.8} onPress={handleLikeComment}>
						<Feather
							name="chevrons-up"
							size={20}
							color={likes.includes(userId) ? theme.colors.primary[500] : theme.colors.gray[400]}
						/>
					</TouchableOpacity>

					<Text style={[styles.likesText, { color: theme.colors.gray[400] }]}>
						{shortenNumber(likes.length - dislikes.length)}
					</Text>

					<TouchableOpacity activeOpacity={0.8} onPress={handleDislikeComment}>
						<Feather
							name="chevrons-down"
							size={20}
							color={dislikes.includes(userId) ? theme.colors.disliked : theme.colors.gray[400]}
						/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={{ flexGrow: 1, height: '100%' }}
					onPress={() => setToggleDetails(!toggleDetails)}
				/>

				<View style={styles.replieshareCon}>
					<TouchableOpacity onPress={toggleCommentCard}>
						<MaterialIcons name="replay" size={17} color={theme.colors.gray[400]} />
					</TouchableOpacity>
					<Text style={[styles.replies, { color: theme.colors.gray[400] }]} numberOfLines={5}>
						{shortenNumber(repliesCount)}
					</Text>
				</View>
			</View>
		) : (
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={() => setToggleDetails(!toggleDetails)}
				style={[styles.detailsCon]}>
				<Text
					style={[
						styles.likesText,
						{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
					]}>
					{shortenNumber(likes.length - dislikes.length)}
				</Text>
				<Text
					style={[
						styles.likesText,
						{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
					]}>
					upvotes
				</Text>
				<Text
					style={[
						styles.likesText,
						{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
					]}>
					{`\u2022`}
				</Text>
				<Text
					style={[
						styles.replies,
						{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
					]}
					numberOfLines={5}>
					{shortenNumber(repliesCount)}
				</Text>
				<Text
					style={[
						styles.likesText,
						{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
					]}>
					replies
				</Text>
			</TouchableOpacity>
		)
	const renderBodyDisplay = () => (
		<TouchableOpacity style={styles.body} activeOpacity={0.7}>
			<Text style={[styles.commentText, { color: theme.colors.typography }]}>
				{moderateContent(
					showFullComment
						? comment_text
						: comment_text.length > COMMENT_LENGTH
							? comment_text.slice(0, COMMENT_LENGTH) + '...'
							: comment_text,
				)}
			</Text>
			{comment_text.length > COMMENT_LENGTH && (
				<TouchableOpacity onPress={() => setShowFullComment(!showFullComment)}>
					<Text style={[styles.commentText, { color: theme.colors.primary[300] }]}>
						{showFullComment ? 'See Less' : 'See More'}
					</Text>
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	)
	const renderHeaderDisplay = () => (
		<View style={styles.header}>
			<View style={styles.confessedUser}>
				<View style={styles.imageCon}>
					<Image source={{ uri: photo_url }} style={styles.image} resizeMode="cover" />
				</View>
				<View>
					<Text style={[styles.displayName, { color: theme.colors.typography }]}>
						{display_name}
						{isOwner ? ' (You)' : ''}
					</Text>
					<Text style={[styles.ageGender, { color: theme.colors.typography }]}>
						{age}.{gender.charAt(0)}
					</Text>
				</View>
			</View>

			{deleting || reporting || blocking ? (
				<ActivityIndicator size={'small'} color={theme.colors.primary[500]} />
			) : isOwner ? (
				<MenuOptions
					menuItems={[
						{
							title: 'Delete',
							onPress: handleDeleteComment,
							icon: 'trash-can-outline',
						},
					]}
				/>
			) : (
				<MenuOptions
					menuItems={[
						{
							title: 'Report',
							onPress: handleReportComment,
							icon: 'flag-outline',
						},
						{
							title: 'Block',
							onPress: handleBlockUser,
							icon: 'account-cancel-outline',
						},
					]}
				/>
			)}
		</View>
	)
	const renderReplies = () => {
		return fetchingFirstComment ? (
			<Skeleton
				width={moderateScale(300)}
				height={moderateScale(50)}
				style={[styles.skeleton, { marginBottom: moderateScale(10) }]}
			/>
		) : (
			<>
				{replies.map((reply) => (
					<ReplyCard key={reply.id} item={reply} />
				))}
				{fetchingMore ? (
					<View
						style={{
							alignSelf: 'flex-start',
							marginHorizontal: moderateScale(15),
							marginTop: moderateScale(10),
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<ActivityIndicator size="small" color={theme.colors.primary[500]} />
					</View>
				) : (
					repliesCount - replies.length > 0 && (
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => loadMoreReplies({ limit: PAGE_SIZE })}
							style={{
								alignSelf: 'flex-start',
								marginHorizontal: moderateScale(15),
								marginTop: moderateScale(10),
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Text style={[styles.commentText, { color: theme.colors.primary[300] }]}>
								{repliesCount - replies.length > 10
									? '10 more replies'
									: `${repliesCount - replies.length} more replies`}
							</Text>
						</TouchableOpacity>
					)
				)}
			</>
		)
	}

	const loadMoreReplies = useCallback(
		async ({ limit }: { limit: number }) => {
			try {
				if (noMoreDocuments) return
				if (fetchingMore) return
				setFetchingMore(true)
				const newReplies = await fetchCommentReplies({
					commentsReplies: item.replies,
					fetchLimit: limit,
					lastDocumentFetched,
					setLastDocumentFetched,
					setNoMoreDocuments,
				})

				setReplies((prev) => [...prev, ...newReplies])
				setFetchingMore(false)
			} catch (error) {
				setFetchingMore(false)
				Toast.show({
					type: 'danger',
					text1: `${error}`,
				})
			}
		},
		[lastDocumentFetched, fetchingMore, id],
	)

	useEffect(() => {
		;(async () => {
			setFetchingFirstComment(true)
			await loadMoreReplies({ limit: 1 })
			setFetchingFirstComment(false)
		})()
	}, [id])

	return (
		<>
			<Animated.View style={[styles.card, { backgroundColor: theme.colors.gray[100] }]}>
				{renderHeaderDisplay()}
				{renderBodyDisplay()}
				{renderTimeDisplay()}
				{renderFooterDisplay()}
				{renderReplies()}
			</Animated.View>

			<AddCommentCard
				loading={loading}
				handleAddComment={handleAddReply}
				setNewComment={setNewReply}
				newComment={newReply}
				placeHolder="Reply to here..."
				animatedAddCommentHeight={animatedAddCommentHeight}
			/>

			<GuestModal visible={guestModalVisible} onPress={() => setGuestModalVisible(false)} />
			{reportModalVisible && (
				<ReportModal
					visible={reportModalVisible}
					onClose={() => setReportModalVisible(false)}
					handleReport={handleReportComment}
					comment_id={id}
					setReporting={setReporting}
					reportType="comment"
				/>
			)}
		</>
	)
}

export default commentCard

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
	},
	card: {
		paddingHorizontal: moderateScale(15),
		paddingVertical: moderateScale(10),
		marginHorizontal: moderateScale(10),
		borderRadius: moderateScale(10),
		overflow: 'hidden',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	confessedUser: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: moderateScale(10),
	},
	imageCon: {
		width: moderateScale(30),
		aspectRatio: 1,
		borderRadius: moderateScale(15),
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	displayName: {
		fontFamily: 'Medium',
		fontSize: moderateScale(11),
	},
	ageGender: {
		fontFamily: 'Medium',
		fontSize: moderateScale(9),
	},
	body: {
		marginVertical: moderateScale(0),
	},

	commentText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(12),
	},
	timeCon: {
		marginBottom: moderateScale(5),
	},
	timeText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(10),
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	likeCountCon: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: moderateScale(70),
	},
	likesText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(12),
		textAlign: 'justify',
	},
	replieshareCon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		alignContent: 'center',
		width: moderateScale(50),
	},
	detailsCon: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		alignContent: 'center',
		width: '100%',
	},
	replies: {
		fontFamily: 'Medium',
		fontSize: moderateScale(12),
		textAlign: 'justify',
	},
	skeleton: {
		marginTop: moderateScale(5),
		borderRadius: moderateScale(10),
	},
})
