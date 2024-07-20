import useIsAnonymous from '@/hooks/useIsAnonymous'
import { moderateContent } from '@/services/openAi/userAiActions'
import { blockUser } from '@/services/userActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { CONFESSIONPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { addComment } from '@/utils/commentUtils'
import {
	deleteConfession,
	disLikeConfession,
	favoriteConfession,
	generateRandomColor,
	likeConfession,
	shareConfession,
} from '@/utils/confessionUtils'
import { shortenNumber } from '@/utils/generalUtils'
import { formatRelativeTime } from '@/utils/timeUtils'
import { Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import AddCommentCard from './AddCommentCard'
import GuestModal from './GuestModal'
import MenuOptions from './MenuOptions'
import ReportModal from './ReportModal'

/**
 * Renders a confession card component
 * @param {CONFESSIONPROPS} item - The confession card props
 * @returns {JSX.Element} The confession card component
 */

const CONFESSION_LENGTH = Math.floor(DEVICE_WIDTH / 2)

const ConfessionCard = ({
	item,
	numberOfLines,
	isDetailsScreen = false,
	isPreview,
	index,
}: {
	item: CONFESSIONPROPS
	numberOfLines: number
	isDetailsScreen?: boolean
	isPreview?: boolean
	index?: number
}): JSX.Element => {
	const isAnonymous = useIsAnonymous()

	const { id: userId, blocked_users } = useAuthStoreSelectors.getState().currentUser

	const isOwner = item.user?.id === userId

	const { theme, styles } = useStyles(stylesheet)
	const { id, confession_text, confession_types, created_at, confessed_by } = item
	const { display_name, gender, age, photo_url } = item.user

	const [guestModalVisible, setGuestModalVisible] = useState(false)
	const [reportModalVisible, setReportModalVisible] = useState(false)

	const [likes, setLikes] = useState(item.likes)
	const [dislikes, setdisLikes] = useState(item.dislikes)
	const [isFavorite, setIsFavorite] = useState(item.favorites.includes(userId))

	const [comments, setComments] = useState(item.comments.length)
	const [newComment, setNewComment] = useState('')
	const [loading, setLoading] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [reporting, setReporting] = useState(false)
	const [blocking, setBlocking] = useState(false)

	const [toggleDetails, setToggleDetails] = useState(false)
	const [showFullReply, setShowFullReply] = useState(false)

	const animatedAddCommentHeight = useSharedValue(0)
	const toggleCommentCard = useCallback(() => {
		if (isPreview) return
		animatedAddCommentHeight.value = animatedAddCommentHeight.value > 0 ? 0 : moderateScale(85)
	}, [animatedAddCommentHeight])

	// CONFESSION FUNCTIONS
	const navigateToDetails = useCallback(() => {
		if (isPreview) return
		router.navigate({
			pathname: '/(main)/confession_details',
			params: { id },
		})
	}, [id])
	const handleLikeConfession = useCallback(async () => {
		if (isPreview) return
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
	}, [isAnonymous, isPreview, likes, dislikes])
	const handleDislikeConfession = useCallback(async () => {
		if (isPreview) return
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
	}, [isAnonymous, isPreview, likes, dislikes])
	const handleAddComment = useCallback(async () => {
		if (isPreview) return
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		await addComment({
			id,
			loading,
			newComment,
			setComments,
			setLoading,
			setNewComment,
		})
	}, [newComment, id, isAnonymous, isPreview, loading])
	const handleFavorite = useCallback(async () => {
		if (isPreview) return
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		await favoriteConfession({ id, isFavorite, setIsFavorite, itemFavorites: item.favorites })
	}, [isAnonymous, isPreview, isFavorite])
	const handleShareConfession = useCallback(async () => {
		if (isPreview) return
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		await shareConfession({
			id,
			itemShares: item.shares,
			messageBody: confession_text.substring(0, 120) + '...',
			confesser: {
				display_name,
				gender,
				age,
				photo_url,
			},
		})
	}, [isAnonymous, isPreview])
	const handleDeleteConfession = useCallback(async () => {
		if (isPreview) return
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		Alert.alert('Delete Confession', 'Are you sure you want to delete this confession?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					if (deleting) return
					setDeleting(true)
					await deleteConfession({
						confessionId: id,
						confessedUserId: item.confessed_by,
					})
					setDeleting(false)
				},
			},
		])
	}, [isAnonymous, isPreview])
	const handleReportConfession = useCallback(async () => {
		if (isPreview) return
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		setReportModalVisible(true)
		if (reporting) return
	}, [isAnonymous, isPreview])
	const handleBlockUser = useCallback(async () => {
		if (isPreview) return
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		if (blocking) return
		if (blocked_users?.includes(confessed_by)) return
		setBlocking(true)
		try {
			await blockUser({ uid: userId, blockUserId: confessed_by })
			setBlocking(false)
			Alert.alert(
				'User Blocked',
				'You will no longer see this user or their confessions, comments, or replies.',
				[{ text: 'OK' }],
			)
		} catch (error) {
			console.error('Error blocking user:', error)
		}
	}, [isAnonymous, isPreview, blocking, userId, confessed_by])

	// CONFESSION FUNCTIONS END

	// CONFESSION COMPONENTS
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
					<TouchableOpacity activeOpacity={0.8} onPress={handleLikeConfession}>
						<Feather
							name="chevrons-up"
							size={24}
							color={likes.includes(userId) ? theme.colors.primary[500] : theme.colors.gray[400]}
						/>
					</TouchableOpacity>

					<Text style={[styles.likesText, { color: theme.colors.gray[400] }]}>
						{shortenNumber(likes.length - dislikes.length)}
					</Text>

					<TouchableOpacity activeOpacity={0.8} onPress={handleDislikeConfession}>
						<Feather
							name="chevrons-down"
							size={24}
							color={dislikes.includes(userId) ? theme.colors.disliked : theme.colors.gray[400]}
						/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={{ flexGrow: 1, height: '100%' }}
					onPress={() => setToggleDetails(!toggleDetails)}
				/>

				<View
					style={[
						styles.commentShareCon,
						{ width: isOwner ? moderateScale(110) : moderateScale(150) },
					]}>
					<TouchableOpacity onPress={toggleCommentCard} activeOpacity={0.8}>
						<Ionicons name="chatbox-ellipses-outline" size={24} color={theme.colors.gray[400]} />
					</TouchableOpacity>
					<Text style={[styles.comment, { color: theme.colors.gray[400] }]} numberOfLines={5}>
						{shortenNumber(comments)}
					</Text>
					<TouchableOpacity onPress={handleShareConfession} activeOpacity={0.8}>
						<Ionicons name="share-social-outline" size={24} color={theme.colors.gray[400]} />
					</TouchableOpacity>
					{!isOwner && (
						<TouchableOpacity onPress={handleFavorite} activeOpacity={0.8}>
							<Ionicons
								name={isFavorite ? 'bookmark' : 'bookmark-outline'}
								size={24}
								color={isFavorite ? theme.colors.primary[500] : theme.colors.gray[400]}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
		) : (
			<ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={false}>
				<TouchableOpacity
					style={styles.detailsCon}
					activeOpacity={0.7}
					onPress={() => setToggleDetails(!toggleDetails)}>
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
							styles.comment,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}
						numberOfLines={5}>
						{shortenNumber(comments)}
					</Text>
					<Text
						style={[
							styles.likesText,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}>
						comments
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
							styles.comment,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}
						numberOfLines={5}>
						{shortenNumber(item.shares.length)}
					</Text>
					<Text
						style={[
							styles.likesText,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}>
						shares
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
							styles.comment,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}
						numberOfLines={5}>
						{shortenNumber(item.favorites.length)}
					</Text>
					<Text
						style={[
							styles.likesText,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}>
						favorites
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
							styles.comment,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}
						numberOfLines={5}>
						{shortenNumber(item.views.length)}
					</Text>
					<Text
						style={[
							styles.likesText,
							{ color: theme.colors.gray[400], fontSize: moderateScale(12), fontFamily: 'Italic' },
						]}>
						views
					</Text>
				</TouchableOpacity>
			</ScrollView>
		)
	const renderBodyDisplay = () => (
		<TouchableOpacity
			onPress={isDetailsScreen ? undefined : navigateToDetails}
			style={styles.body}
			activeOpacity={isDetailsScreen ? 1 : 0.7}>
			<TouchableOpacity activeOpacity={1} onPress={() => undefined} style={styles.tagsContainer}>
				{confession_types?.map((type) => (
					<TouchableOpacity activeOpacity={0.8} key={type} style={[styles.confessionTypeCon]}>
						<Text style={[styles.confessionTypeText, { color: theme.colors.white }]}>#{type}</Text>
					</TouchableOpacity>
				))}
			</TouchableOpacity>
			{isDetailsScreen ? (
				<>
					<Text style={[styles.confessionText, { color: theme.colors.typography }]}>
						{moderateContent(
							showFullReply
								? confession_text
								: confession_text.length > CONFESSION_LENGTH
									? confession_text.slice(0, CONFESSION_LENGTH) + '...'
									: confession_text,
						)}
					</Text>
					{confession_text.length > CONFESSION_LENGTH && (
						<TouchableOpacity onPress={() => setShowFullReply(!showFullReply)}>
							<Text style={[styles.confessionText, { color: theme.colors.primary[300] }]}>
								{showFullReply ? 'See Less' : 'See More'}
							</Text>
						</TouchableOpacity>
					)}
				</>
			) : (
				<Text
					style={[styles.confessionText, { color: theme.colors.typography }]}
					numberOfLines={numberOfLines}>
					{moderateContent(confession_text)}
				</Text>
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
							onPress: handleDeleteConfession,
							icon: 'trash-can-outline',
						},
					]}
				/>
			) : (
				<MenuOptions
					menuItems={[
						{
							title: 'Report',
							onPress: handleReportConfession,
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
	// CONFESSION COMPONENTS END

	return (
		<>
			<Animated.View style={[styles.card, { backgroundColor: theme.colors.gray[100] }]}>
				{renderHeaderDisplay()}
				{renderBodyDisplay()}
				{renderTimeDisplay()}
				{renderFooterDisplay()}
			</Animated.View>
			<AddCommentCard
				loading={loading}
				handleAddComment={handleAddComment}
				setNewComment={setNewComment}
				newComment={newComment}
				placeHolder="Comment here..."
				animatedAddCommentHeight={animatedAddCommentHeight}
			/>

			<GuestModal visible={guestModalVisible} onPress={() => setGuestModalVisible(false)} />
			{reportModalVisible && (
				<ReportModal
					visible={reportModalVisible}
					onClose={() => setReportModalVisible(false)}
					handleReport={handleReportConfession}
					confession_id={id}
					setReporting={setReporting}
					reportType="confession"
				/>
			)}
		</>
	)
}

export default ConfessionCard

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
		width: moderateScale(40),
		aspectRatio: 1,
		borderRadius: moderateScale(25),
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	displayName: {
		fontFamily: 'Medium',
		fontSize: moderateScale(14),
	},
	ageGender: {
		fontFamily: 'Medium',
		fontSize: moderateScale(11),
	},
	body: {
		marginVertical: moderateScale(10),
	},
	confessionTypeCon: {
		backgroundColor: generateRandomColor(),
		alignSelf: 'flex-start',
		paddingHorizontal: moderateScale(10),
		borderRadius: moderateScale(20),
		marginBottom: moderateScale(10),
		opacity: 0.9,
	},
	confessionTypeText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(10),
		textAlign: 'justify',
	},
	confessionText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(13),
	},
	timeCon: {
		marginBottom: moderateScale(10),
	},
	timeText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(12),
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
		width: moderateScale(100),
	},
	likesText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(16),
		textAlign: 'justify',
	},
	commentShareCon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		alignContent: 'center',
	},
	comment: {
		fontFamily: 'Medium',
		fontSize: moderateScale(16),
		textAlign: 'justify',
	},
	tagsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: moderateScale(10),
	},
	detailsCon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: moderateScale(5),
	},
})
