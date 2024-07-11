import useIsAnonymous from '@/hooks/useIsAnonymous'
import { useAuthStoreSelectors } from '@/store/authStore'
import { CONFESSIONSPROPS } from '@/types'
import {
	addComment,
	disLikeConfession,
	favoriteConfession,
	likeConfession,
	shareConfession,
} from '@/utils/confessionUtils'
import { shortenNumber } from '@/utils/generalUtils'
import { getStoredValues } from '@/utils/storageUtils'
import { formatRelativeTime } from '@/utils/timeUtils'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import CommentCard from './CommentCard'
import GuestModal from './GuestModal'

/**
 * Renders a confession card component
 * @param {CONFESSIONSPROPS} item - The confession card props
 * @returns {JSX.Element} The confession card component
 */

const ConfessionCard = ({ item }: { item: CONFESSIONSPROPS }): JSX.Element => {
	const isAnonymous = useIsAnonymous()

	const { theme, styles } = useStyles(stylesheet)
	const { id, confession_text, confession_types, created_at } = item
	const { display_name, gender, age, photo_url } = item.user

	const userId = useAuthStoreSelectors.getState().currentUser.id

	const [guestModalVisible, setGuestModalVisible] = useState(false)

	const [likes, setLikes] = useState(item.likes)
	const [dislikes, setdisLikes] = useState(item.dislikes)
	const [isFavorite, setIsFavorite] = useState(item.favorites.includes(userId))

	const [comments, setComments] = useState(item.comments.length)
	const [newComment, setNewComment] = useState('')
	const [commenting, setCommenting] = useState(false)
	const [loading, setLoading] = useState(false)

	// CONFESSION FUNCTIONS
	const navigateToDetails = useCallback(() => {
		router.navigate({
			pathname: '/(main)/confession_details',
			params: { id },
		})
	}, [id])
	const handleLikeConfession = useCallback(async () => {
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
	const handleDislikeConfession = useCallback(async () => {
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
	const handleAddComment = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		await addComment({ id, loading, newComment, setComments, setLoading, setNewComment })
	}, [newComment, id])
	const handleFavorite = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}
		await favoriteConfession({ id, isFavorite, setIsFavorite, itemFavorites: item.favorites })
	}, [isAnonymous, isFavorite, id])
	const handleShareConfession = useCallback(async () => {
		if (isAnonymous) {
			return setGuestModalVisible(true)
		}

		await shareConfession({ id, itemShares: item.shares })
	}, [isAnonymous, id])
	// CONFESSION FUNCTIONS END

	// CONFESSION COMPONENTS
	const renderTimeDisplay = () => (
		<View style={styles.timeCon}>
			<Text style={[styles.timeText, { color: theme.colors.gray[400] }]}>
				{formatRelativeTime(created_at)}
			</Text>
		</View>
	)
	const renderFooterDisplay = () => (
		<View style={styles.footer}>
			<View style={styles.likeCountCon}>
				<TouchableOpacity activeOpacity={0.8} onPress={handleLikeConfession}>
					<Feather
						name="chevrons-up"
						size={26}
						color={likes.includes(userId) ? theme.colors.primary[500] : theme.colors.gray[400]}
					/>
				</TouchableOpacity>
				<Text style={[styles.likesText, { color: theme.colors.gray[400] }]} numberOfLines={5}>
					{shortenNumber(likes.length - dislikes.length)}
				</Text>
				<TouchableOpacity activeOpacity={0.8} onPress={handleDislikeConfession}>
					<Feather
						name="chevrons-down"
						size={26}
						color={dislikes.includes(userId) ? theme.colors.disliked : theme.colors.gray[400]}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.commentShareCon}>
				<TouchableOpacity onPress={() => setCommenting(!commenting)}>
					<Ionicons name="chatbox-ellipses-outline" size={26} color={theme.colors.gray[400]} />
				</TouchableOpacity>
				<Text style={[styles.comment, { color: theme.colors.gray[400] }]} numberOfLines={5}>
					{shortenNumber(comments)}
				</Text>
				<TouchableOpacity onPress={handleShareConfession}>
					<Ionicons name="share-social-outline" size={26} color={theme.colors.gray[400]} />
				</TouchableOpacity>
			</View>
		</View>
	)
	const renderBodyDisplay = () => (
		<TouchableOpacity onPress={navigateToDetails} style={styles.body} activeOpacity={0.7}>
			<TouchableOpacity activeOpacity={1} onPress={() => undefined} style={styles.tagsContainer}>
				{confession_types?.map((type) => (
					<TouchableOpacity
						activeOpacity={0.8}
						key={type}
						style={[styles.confessionTypeCon, { backgroundColor: theme.colors.primary[500] }]}>
						<Text style={[styles.confessionTypeText, { color: theme.colors.white }]}>#{type}</Text>
					</TouchableOpacity>
				))}
			</TouchableOpacity>
			<Text style={[styles.confessionText, { color: theme.colors.typography }]} numberOfLines={5}>
				{confession_text}
			</Text>
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
					</Text>
					<Text style={[styles.ageGender, { color: theme.colors.typography }]}>
						{age}.{gender.charAt(0)}
					</Text>
				</View>
			</View>
			<TouchableOpacity activeOpacity={0.8} onPress={handleFavorite}>
				<AntDesign
					name={isFavorite ? 'heart' : 'hearto'}
					size={24}
					color={isFavorite ? theme.colors.primary[500] : theme.colors.gray[400]}
				/>
			</TouchableOpacity>
		</View>
	)
	// CONFESSION COMPONENTS END

	useEffect(() => {
		;(async () => {
			// await deleteStoredValues(['postsToFavorite', 'postsToUnFavorite'])
			const {
				postsToLike,
				postsToUnlike,
				postsTodisLike,
				postsToUndislike,
				postsToFavorite,
				postsToUnFavorite,
				postsToShare,
			} = await getStoredValues([
				'postsToLike',
				'postsToUnlike',
				'postsTodisLike',
				'postsToUndislike',
				'postsToFavorite',
				'postsToUnFavorite',
				'postsToShare',
			])

			console.log({
				postsToLike,
				postsToUnlike,
				postsTodisLike,
				postsToUndislike,
				postsToFavorite,
				postsToUnFavorite,
				postsToShare,
			})
		})()
	}, [isFavorite, likes, dislikes])

	return (
		<>
			<View style={[styles.card, { backgroundColor: theme.colors.gray[100] }]}>
				{renderHeaderDisplay()}
				{renderBodyDisplay()}
				{renderTimeDisplay()}
				{renderFooterDisplay()}
			</View>
			{commenting ? (
				<CommentCard
					loading={loading}
					handleAddComment={handleAddComment}
					setNewComment={setNewComment}
					newComment={newComment}
				/>
			) : null}
			<GuestModal visible={guestModalVisible} onPress={() => setGuestModalVisible(false)} />
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
		alignSelf: 'flex-start',
		paddingHorizontal: moderateScale(10),
		borderRadius: moderateScale(20),
		marginBottom: moderateScale(10),
		opacity: 0.7,
	},
	confessionTypeText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(10),
		textAlign: 'justify',
	},
	confessionText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(14),
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
		width: moderateScale(100),
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
})
