import useIsAnonymous from '@/hooks/useIsAnonymous'
import { useAuthStoreSelectors } from '@/store/authStore'
import { COMMENTPROPS, REPLYPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { disLikeConfession, likeConfession } from '@/utils/confessionUtils'
import { shortenNumber } from '@/utils/generalUtils'
import { formatRelativeTime } from '@/utils/timeUtils'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'
import { useCallback, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import AddCommentCard from './AddCommentCard'
import GuestModal from './GuestModal'

/**
 * Renders a Comment card component
 * @param {COMMENTPROPS} item - The Comment card props
 * @returns {JSX.Element} The Comment card component
 */

const COMMENT_LENGTH = Math.floor(DEVICE_WIDTH / 2)

const commentCard = ({ item, index }: { item: COMMENTPROPS; index?: number }): JSX.Element => {
	const isAnonymous = useIsAnonymous()

	const userId = useAuthStoreSelectors.getState().currentUser.id

	const isOwner = item.user?.id === userId

	const { theme, styles } = useStyles(stylesheet)
	const { id, comment_text, created_at } = item
	const { display_name, gender, age, photo_url } = item.user

	const [guestModalVisible, setGuestModalVisible] = useState(false)

	const [likes, setLikes] = useState(item.likes)
	const [dislikes, setdisLikes] = useState(item.dislikes)

	const [repliesCount, setRepliesCount] = useState(item.replies.length)
	const [replies, setReplies] = useState<REPLYPROPS[]>([])
	const [loading, setLoading] = useState(false)
	const [showReplies, setshowReplies] = useState(true)
	const [replying, setReplying] = useState(false)
	const [newReply, setNewReply] = useState('')

	const [toggleDetails, setToggleDetails] = useState(false)
	const [showFullComment, setShowFullComment] = useState(false)

	// COMMENT FUNCTIONS

	const handleLikeComment = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		await likeConfession({
			id,
			likes,
			dislikes,
			itemLikes: item.likes,
			setLikes,
			setdisLikes,
		})
	}, [isAnonymous, likes, dislikes, id])
	const handleDislikeComment = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		await disLikeConfession({
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
	}, [id])
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
					<TouchableOpacity onPress={() => setReplying(!replying)}>
						<MaterialIcons name="replay" size={20} color={theme.colors.gray[400]} />
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
					votes :
				</Text>
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
					replies :
				</Text>

				<Text
					style={[
						styles.replies,
						{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
					]}
					numberOfLines={5}>
					{shortenNumber(repliesCount)}
				</Text>
			</TouchableOpacity>
		)
	const renderBodyDisplay = () => (
		<TouchableOpacity style={styles.body} activeOpacity={0.7}>
			<Text style={[styles.commentText, { color: theme.colors.typography }]}>
				{showFullComment
					? comment_text
					: comment_text.length > COMMENT_LENGTH
						? comment_text.slice(0, COMMENT_LENGTH) + '...'
						: comment_text}
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

			<TouchableOpacity activeOpacity={0.8} onPress={() => undefined}>
				<AntDesign name={'ellipsis1'} size={24} color={theme.colors.gray[400]} />
			</TouchableOpacity>
		</View>
	)
	const renderReplies = () => (showReplies ? <></> : null)
	// CONFESSION COMPONENTS END

	// useEffect(() => {
	// 	;(async () => {
	// 		// await deleteStoredValues(['postsToFavorite', 'postsToUnFavorite'])
	// 		const {
	// 			postsToLike,
	// 			postsToUnlike,
	// 			postsTodisLike,
	// 			postsToUndislike,
	// 			postsToFavorite,
	// 			postsToUnFavorite,
	// 			postsToShare,
	// 			unseenConfessions,
	// 		} = await getStoredValues([
	// 			'postsToLike',
	// 			'postsToUnlike',
	// 			'postsTodisLike',
	// 			'postsToUndislike',
	// 			'postsToFavorite',
	// 			'postsToUnFavorite',
	// 			'postsToShare',
	// 			'unseenConfessions',
	// 		])

	// 		console.log({
	// 			postsToLike,
	// 			postsToUnlike,
	// 			postsTodisLike,
	// 			postsToUndislike,
	// 			postsToFavorite,
	// 			postsToUnFavorite,
	// 			postsToShare,
	// 			unseenConfessions,
	// 		})
	// 	})()
	// }, [ likes, dislikes])

	return (
		<>
			<Animated.View style={[styles.card, { backgroundColor: theme.colors.gray[100] }]}>
				{renderHeaderDisplay()}
				{renderBodyDisplay()}
				{renderTimeDisplay()}
				{renderFooterDisplay()}
				{renderReplies()}
			</Animated.View>
			{replying ? (
				<AddCommentCard
					loading={loading}
					handleAddComment={handleAddReply}
					setNewComment={setNewReply}
					newComment={newReply}
					placeHolder="Reply to here..."
				/>
			) : null}
			<GuestModal visible={guestModalVisible} onPress={() => setGuestModalVisible(false)} />
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
		marginTop: moderateScale(5),
		borderRadius: moderateScale(10),
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
})
