import useIsAnonymous from '@/hooks/useIsAnonymous'
import { addComment } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { CONFESSIONSPROPS } from '@/types'
import { shortenNumber } from '@/utils/generalUtils'
import { getStoredValues, saveSecurely } from '@/utils/storageUtils'
import { formatRelativeTime } from '@/utils/timeUtils'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import GuestModal from './GuestModal'

/**
 * Renders a confession card component
 * @param {CONFESSIONSPROPS} item - The confession card props
 * @returns {JSX.Element} The confession card component
 */

const COMMENT_LENGTH = 500

const ConfessionCard = ({ item }: { item: CONFESSIONSPROPS }): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	const { id, confession_text, confession_types, created_at } = item
	const { display_name, gender, age, photo_url } = item.user

	const userId = useAuthStoreSelectors.use.currentUser().id

	const isAnonymous = useIsAnonymous()
	const [guestModalVisible, setGuestModalVisible] = useState(false)

	const [likes, setLikes] = useState(item.likes)
	const [dislikes, setdisLikes] = useState(item.dislikes)

	const [comments, setcomments] = useState(item.comments.length)
	const [newComment, setNewComment] = useState('')
	const [commenting, setCommenting] = useState(false)
	const [loading, setLoading] = useState(false)

	const navigateToDetails = useCallback(() => {
		router.navigate({
			pathname: '/(main)/confession_details',
			params: { id },
		})
	}, [id])

	const handleLikeConfession = useCallback(async () => {
		if (isAnonymous) {
			setGuestModalVisible(true)
			return
		}
		try {
			const updatedLikes = likes.includes(userId)
				? likes.filter((like) => like !== userId)
				: [...likes, userId]
			const updatedDislikes = dislikes.includes(userId)
				? dislikes.filter((dislike) => dislike !== userId)
				: dislikes

			const storedValues = await getStoredValues(['postsTodisLike', 'postsToLike'])

			let postsTodisLike = JSON.parse(storedValues.postsTodisLike || '[]')
			let postsToLike = JSON.parse(storedValues.postsToLike || '[]')

			postsTodisLike = postsTodisLike.filter((postId: string) => postId !== id)

			if (likes.includes(userId)) {
				postsToLike = postsToLike.filter((postId: string) => postId !== id)
			} else {
				postsToLike = [...postsToLike, id]
			}

			await saveSecurely([
				{ key: 'postsToLike', value: JSON.stringify(postsToLike) },
				{ key: 'postsTodisLike', value: JSON.stringify(postsTodisLike) },
			])

			setLikes(updatedLikes)
			setdisLikes(updatedDislikes)
		} catch (error) {
			console.error('Failed to handle like confession:', error)
		}
	}, [likes, dislikes, id, userId])

	const handleDislikeConfession = useCallback(async () => {
		if (isAnonymous) {
			setGuestModalVisible(true)
			return
		}

		try {
			const updatedDislikes = dislikes.includes(userId)
				? dislikes.filter((dislike) => dislike !== userId)
				: [...dislikes, userId]

			const updatedLikes = likes.includes(userId) ? likes.filter((like) => like !== userId) : likes

			const storedValues = await getStoredValues(['postsTodisLike', 'postsToLike'])
			let postsTodisLike = JSON.parse(storedValues.postsTodisLike || '[]')
			let postsToLike = JSON.parse(storedValues.postsToLike || '[]')

			postsToLike = postsToLike.filter((postId: string) => postId !== id)

			if (dislikes.includes(userId)) {
				postsTodisLike = postsTodisLike.filter((postId: string) => postId !== id)
			} else {
				postsTodisLike = [...postsTodisLike, id]
			}

			await saveSecurely([
				{ key: 'postsToLike', value: JSON.stringify(postsToLike) },
				{ key: 'postsTodisLike', value: JSON.stringify(postsTodisLike) },
			])

			setLikes(updatedLikes)
			setdisLikes(updatedDislikes)
		} catch (error) {
			console.error('Failed to handle dislike confession:', error)
		}
	}, [isAnonymous, likes, dislikes, id, userId])

	const handleAddComment = useCallback(async () => {
		if (isAnonymous) {
			setGuestModalVisible(true)
			return
		}

		try {
			if (loading) return
			setLoading(true)

			await addComment({
				comment_text: newComment,
				confession_id: id,
				commented_by: userId,
				replies: [],
				likes: [],
				dislikes: [],
			})

			setcomments((prev) => prev + 1)
			setNewComment('')

			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}, [newComment, id])
	const handleFavorite = useCallback(() => {
		if (isAnonymous) {
			setGuestModalVisible(true)
			return
		}
	}, [])
	const handleShareConfession = useCallback(() => {
		if (isAnonymous) {
			setGuestModalVisible(true)
			return
		}
	}, [])

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
						color={likes.includes(userId) ? theme.colors.primary[300] : theme.colors.gray[400]}
					/>
				</TouchableOpacity>
				<Text style={[styles.likesText, { color: theme.colors.gray[400] }]} numberOfLines={5}>
					{shortenNumber(likes.length - dislikes.length)}
				</Text>
				<TouchableOpacity activeOpacity={0.8} onPress={handleDislikeConfession}>
					<Feather
						name="chevrons-down"
						size={26}
						color={dislikes.includes(userId) ? theme.colors.red : theme.colors.gray[400]}
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
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => undefined}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: moderateScale(10),
				}}>
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
				<AntDesign name={'hearto'} size={24} color={theme.colors.gray[400]} />
			</TouchableOpacity>
		</View>
	)

	return (
		<>
			<View style={[styles.card, { backgroundColor: theme.colors.gray[100] }]}>
				{renderHeaderDisplay()}
				{renderBodyDisplay()}
				{renderTimeDisplay()}
				{renderFooterDisplay()}
			</View>
			{commenting ? (
				<View
					style={{
						justifyContent: 'space-between',
						backgroundColor: theme.colors.gray[100],
						marginVertical: moderateScale(5),
						marginHorizontal: moderateScale(20),
						borderRadius: moderateScale(10),
						borderWidth: 1.5,
						borderColor: theme.colors.primary[500],
					}}>
					<TextInput
						value={newComment}
						onChangeText={setNewComment}
						placeholder="Comment here..."
						maxLength={COMMENT_LENGTH}
						cursorColor={theme.colors.primary[500]}
						multiline
						scrollEnabled
						textBreakStrategy="highQuality"
						textAlign="left"
						keyboardType="default"
						style={[styles.commentInput, { color: theme.colors.typography }]}
						placeholderTextColor={theme.colors.gray[400]}
						autoCorrect
						autoCapitalize="sentences"
						spellCheck
						dataDetectorTypes={['link', 'phoneNumber', 'address', 'calendarEvent']}
					/>
					<TouchableOpacity
						activeOpacity={0.8}
						disabled={!newComment || loading}
						onPress={handleAddComment}
						style={{
							backgroundColor: theme.colors.primary[500],
							alignSelf: 'flex-end',
							borderRadius: moderateScale(25),
							justifyContent: 'center',
							alignItems: 'center',
							width: moderateScale(25),
							aspectRatio: 1,
							margin: moderateScale(8),
						}}>
						{loading ? (
							<ActivityIndicator size={'small'} color={theme.colors.white} />
						) : (
							<Ionicons name="add-sharp" size={moderateScale(25)} color={theme.colors.white} />
						)}
					</TouchableOpacity>
				</View>
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
	header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	confessedUser: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) },
	imageCon: {
		width: moderateScale(40),
		aspectRatio: 1,
		borderRadius: moderateScale(25),
		overflow: 'hidden',
	},
	image: { width: '100%', height: '100%' },
	displayName: {
		fontFamily: 'Medium',
		fontSize: moderateScale(14),
	},
	ageGender: {
		fontFamily: 'Medium',
		fontSize: moderateScale(11),
	},
	body: { marginVertical: moderateScale(10) },
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
	timeCon: { marginBottom: moderateScale(10) },
	timeText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(12),
	},
	footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
	commentInput: {
		flex: 1,
		flexGrow: 1,
		fontFamily: 'Regular',
		fontSize: moderateScale(13),
		paddingHorizontal: moderateScale(15),
		paddingVertical: moderateScale(10),
	},
})
