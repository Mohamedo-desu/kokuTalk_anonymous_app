import useIsAnonymous from '@/hooks/useIsAnonymous'
import { useAuthStoreSelectors } from '@/store/authStore'
import { REPLYPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { disLikeConfession, likeConfession } from '@/utils/confessionUtils'
import { shortenNumber } from '@/utils/generalUtils'
import { formatRelativeTime } from '@/utils/timeUtils'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useCallback, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import GuestModal from './GuestModal'

/**
 * Renders a Reply card component
 * @param {REPLYPROPS} item - The Reply card props
 * @returns {JSX.Element} The Reply card component
 */

const REPLY_LENGTH = Math.floor(DEVICE_WIDTH / 2)

const ReplyCard = ({ item, index }: { item: REPLYPROPS; index?: number }): JSX.Element => {
	const isAnonymous = useIsAnonymous()

	const userId = useAuthStoreSelectors.getState().currentUser.id

	const isOwner = item.user?.id === userId

	const { theme, styles } = useStyles(stylesheet)
	const { id, reply_text, created_at } = item
	const { display_name, gender, age, photo_url } = item.user

	const [guestModalVisible, setGuestModalVisible] = useState(false)

	const [likes, setLikes] = useState(item.likes)
	const [dislikes, setdisLikes] = useState(item.dislikes)

	const [loading, setLoading] = useState(false)

	const [toggleDetails, setToggleDetails] = useState(false)
	const [showFullReply, setShowFullReply] = useState(false)

	// REPLY FUNCTIONS
	const handleLikeReply = useCallback(async () => {
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
	const handleDislikeReply = useCallback(async () => {
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
	// REPLY FUNCTIONS END

	// REPLY COMPONENTS
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
					<TouchableOpacity activeOpacity={0.8} onPress={handleLikeReply}>
						<Feather
							name="chevrons-up"
							size={25}
							color={likes.includes(userId) ? theme.colors.primary[500] : theme.colors.gray[400]}
						/>
					</TouchableOpacity>

					<Text style={[styles.likesText, { color: theme.colors.gray[400] }]}>
						{shortenNumber(likes.length - dislikes.length)}
					</Text>

					<TouchableOpacity activeOpacity={0.8} onPress={handleDislikeReply}>
						<Feather
							name="chevrons-down"
							size={25}
							color={dislikes.includes(userId) ? theme.colors.disliked : theme.colors.gray[400]}
						/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={{ flexGrow: 1, height: '100%' }}
					onPress={() => setToggleDetails(!toggleDetails)}
				/>
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
			</TouchableOpacity>
		)
	const renderBodyDisplay = () => (
		<TouchableOpacity style={styles.body} activeOpacity={0.7}>
			<Text style={[styles.replyText, { color: theme.colors.typography }]}>
				{showFullReply
					? reply_text
					: reply_text.length > REPLY_LENGTH
						? reply_text.slice(0, REPLY_LENGTH) + '...'
						: reply_text}
			</Text>
			{reply_text.length > REPLY_LENGTH && (
				<TouchableOpacity onPress={() => setShowFullReply(!showFullReply)}>
					<Text style={[styles.replyText, { color: theme.colors.primary[300] }]}>
						{showFullReply ? 'See Less' : 'See More'}
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
	// REPLY COMPONENTS END
	return (
		<>
			<Animated.View
				style={[
					styles.card,
					{ backgroundColor: theme.colors.gray[100], borderLeftColor: theme.colors.gray[300] },
				]}>
				{renderHeaderDisplay()}
				{renderBodyDisplay()}
				{renderTimeDisplay()}
				{renderFooterDisplay()}
			</Animated.View>

			<GuestModal visible={guestModalVisible} onPress={() => setGuestModalVisible(false)} />
		</>
	)
}

export default ReplyCard

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
	},
	card: {
		paddingHorizontal: moderateScale(15),
		paddingVertical: moderateScale(10),
		marginHorizontal: moderateScale(15),
		marginTop: moderateScale(5),
		borderLeftWidth: 1,
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
		width: moderateScale(25),
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
		fontSize: moderateScale(10),
	},
	ageGender: {
		fontFamily: 'Medium',
		fontSize: moderateScale(8),
	},
	body: {
		marginVertical: moderateScale(0),
	},

	replyText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(10),
	},
	timeCon: {
		marginBottom: moderateScale(5),
	},
	timeText: {
		fontFamily: 'Regular',
		fontSize: moderateScale(9),
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
		width: moderateScale(65),
	},
	likesText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(10),
		textAlign: 'justify',
	},
	detailsCon: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		alignContent: 'center',
		width: '100%',
	},
})
