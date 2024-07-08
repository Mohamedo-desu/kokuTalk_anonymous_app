import { FEMALE_AVATARS, MALE_AVATARS } from '@/constants/userAvatars'
import useIsAnonymous from '@/hooks/useIsAnonymous'
import { CONFESSIONSPROPS } from '@/types'
import { shortenNumber } from '@/utils/generalUtils'
import { formatRelativeTime } from '@/utils/timeUtils'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

import { memo, useCallback, useMemo, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

/**
 * Renders a confession card component
 * @param {CONFESSIONSPROPS} item - The confession card props
 * @returns {JSX.Element} The confession card component
 */

const COMMENT_LENGTH = 500

const userId = '45'

const ConfessionCard = memo(({ item }: { item: CONFESSIONSPROPS }): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	const { id, displayName, gender, age, confession, type, createdAt } = item

	const isAnonymous = useIsAnonymous()

	const [likes, setLikes] = useState(item.likes.length)
	const [dislikes, setdisLikes] = useState(item.dislikes.length)
	const [likeCount, setlikeCount] = useState(item.likes.length - item.dislikes.length)
	const [comments, setcomments] = useState(parseInt(item.comments))
	const [newComment, setNewComment] = useState('')
	const [commenting, setCommenting] = useState(false)
	const [favorite, setFavorite] = useState(item.favorite)
	const [likeStatus, setlikeStatus] = useState(
		item.likes.includes(userId) ? 'liked' : item.dislikes.includes(userId) ? 'disliked' : 'none',
	)

	const PROFILE_AVATARS = useMemo(
		() => (gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS),
		[gender],
	)

	const navigateToDetails = useCallback(() => {
		router.navigate({
			pathname: '/(main)/confession_details',
			params: { id },
		})
	}, [id])

	const handleLikeConfession = useCallback(() => {
		setLikes((prev) => prev + 1)
	}, [])
	const handleDislikeConfession = useCallback(() => {
		setLikes((prev) => prev - 1)
	}, [])
	const handleAddComment = useCallback(() => {
		setCommenting((prev) => !prev)
	}, [])
	const handleFavorite = useCallback(() => {
		setFavorite((prev) => !prev)
	}, [])

	const handleShareConfession = useCallback(() => {}, [])

	const renderTimeDisplay = () => (
		<View style={styles.timeCon}>
			<Text style={[styles.timeText, { color: theme.colors.gray[400] }]}>
				{formatRelativeTime(createdAt)}
			</Text>
		</View>
	)
	const renderFooterDisplay = () => (
		<View style={styles.footer}>
			<View style={styles.likeCountCon}>
				<TouchableOpacity onPress={handleLikeConfession}>
					<Feather name="chevrons-up" size={26} color={theme.colors.gray[400]} />
				</TouchableOpacity>
				<Text style={[styles.likesText, { color: theme.colors.gray[400] }]} numberOfLines={5}>
					{shortenNumber(likes)}
				</Text>
				<TouchableOpacity onPress={handleDislikeConfession}>
					<Feather name="chevrons-down" size={26} color={theme.colors.gray[400]} />
				</TouchableOpacity>
			</View>
			<View style={styles.commentShareCon}>
				<TouchableOpacity onPress={handleAddComment}>
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
			<View style={[styles.confessionTypeCon, { backgroundColor: theme.colors.primary[500] }]}>
				<Text style={[styles.confessionTypeText, { color: theme.colors.white }]}>#{type}</Text>
			</View>
			<Text style={[styles.confessionText, { color: theme.colors.typography }]} numberOfLines={5}>
				{confession}
			</Text>
		</TouchableOpacity>
	)
	const renderHeaderDisplay = () => (
		<View style={styles.header}>
			<View style={styles.confessedUser}>
				<View style={styles.imageCon}>
					<Image source={{ uri: PROFILE_AVATARS[id] }} style={styles.image} resizeMode="cover" />
				</View>
				<View>
					<Text style={[styles.displayName, { color: theme.colors.typography }]}>
						{displayName}
					</Text>
					<Text style={[styles.ageGender, { color: theme.colors.typography }]}>
						{age}.{gender.charAt(0)}
					</Text>
				</View>
			</View>
			<TouchableOpacity activeOpacity={0.8} onPress={handleFavorite}>
				<AntDesign
					name={favorite ? 'heart' : 'hearto'}
					size={24}
					color={favorite ? theme.colors.primary[500] : theme.colors.gray[400]}
				/>
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
			{commenting && (
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
						style={{
							backgroundColor: theme.colors.primary[500],
							alignSelf: 'flex-end',
							borderRadius: moderateScale(25),
							justifyContent: 'center',
							alignItems: 'center',
							width: moderateScale(30),
							aspectRatio: 1,
							margin: moderateScale(8),
						}}>
						<Ionicons name="add-sharp" size={moderateScale(25)} color={theme.colors.white} />
					</TouchableOpacity>
				</View>
			)}
		</>
	)
})

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
		fontSize: moderateScale(15),
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
