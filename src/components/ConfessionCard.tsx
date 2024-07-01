import { CONFESSIONS_TYPES_STYLES } from '@/constants/confessionTypes'
import { FEMALE_AVATARS, MALE_AVATARS } from '@/constants/userAvatars'
import { formatRelativeTime } from '@/utils/timeUtils'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { useMemo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface ConfessionCardProps {
	id: number
	displayName: string
	gender: string
	age: number
	favorite: boolean
	likes: number
	comments: number
	confession: string
	type: string
	createdAt: string
}

/**
 * Renders a confession card component
 * @param {ConfessionCardProps} item - The confession card props
 * @returns {JSX.Element} The confession card component
 */
const ConfessionCard = ({ item }: { item: ConfessionCardProps }): JSX.Element => {
	// Extract the confession card props
	const { theme, styles } = useStyles(stylesheet)
	const { id, displayName, gender, age, favorite, likes, comments, confession, type, createdAt } =
		item

	const PROFILE_AVATARS = useMemo(() => {
		return gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS
	}, [gender])

	const router = useRouter()
	const goToDetails = () => {
		// TODO: go to the confession details screen
		router.navigate({
			pathname: '/(main)/confession_details',
			params: {
				id,
			},
		})
	}
	return (
		// Render the confession card component
		<View style={[styles.card, { backgroundColor: theme.colors.gray[100] }]}>
			<View style={styles.header}>
				<View style={styles.confessedUser}>
					<View style={styles.imageCon}>
						{/* Render the profile image */}
						<Image source={{ uri: PROFILE_AVATARS[id] }} style={styles.image} resizeMode="cover" />
					</View>
					<View>
						{/* Render the display name */}
						<Text style={[styles.displayName, { color: theme.colors.typography }]}>
							{displayName}
						</Text>
						{/* Render the age and gender */}
						<Text style={[styles.ageGender, { color: theme.colors.typography }]}>
							{age}.{gender.charAt(0)}
						</Text>
					</View>
				</View>
				<TouchableOpacity>
					{/* Render the favorite icon */}
					<AntDesign
						name={favorite ? 'heart' : 'hearto'}
						size={24}
						color={favorite ? theme.colors.primary[500] : theme.colors.gray[400]}
					/>
				</TouchableOpacity>
			</View>

			<TouchableOpacity onPress={goToDetails} style={styles.body} activeOpacity={0.7}>
				<View
					style={[
						styles.confessionTypeCon,
						{
							backgroundColor:
								CONFESSIONS_TYPES_STYLES[type]?.backgroundColor || theme.colors.primary[500],
						},
					]}>
					<Text style={[styles.confessionTypeText, { color: theme.colors.white }]}>#{type}</Text>
				</View>
				<Text style={[styles.confessionText, { color: theme.colors.typography }]} numberOfLines={5}>
					{confession}
				</Text>
			</TouchableOpacity>

			<View style={styles.timeCon}>
				<Text style={[styles.timeText, { color: theme.colors.gray[400] }]}>
					{formatRelativeTime(createdAt)}
				</Text>
			</View>

			<View style={styles.footer}>
				<View style={styles.likeCountCon}>
					<Feather name="chevrons-up" size={26} color={theme.colors.gray[400]} />
					<Text style={[styles.likesText, { color: theme.colors.gray[400] }]} numberOfLines={5}>
						{likes}
					</Text>
					<Feather name="chevrons-down" size={26} color={theme.colors.gray[400]} />
				</View>
				<View style={styles.commentShareCon}>
					<Ionicons name="chatbox-ellipses-outline" size={26} color={theme.colors.gray[400]} />
					<Text style={[styles.comment, { color: theme.colors.gray[400] }]} numberOfLines={5}>
						{comments}
					</Text>
					<Ionicons name="share-social-outline" size={26} color={theme.colors.gray[400]} />
				</View>
			</View>
		</View>
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
		fontFamily: 'Medium',
		fontSize: moderateScale(13),
		textAlign: 'justify',
	},
	timeCon: { marginBottom: moderateScale(10) },
	timeText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(12),
	},
	footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	likeCountCon: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) },
	likesText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(16),
		textAlign: 'justify',
	},
	commentShareCon: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(20) },
	comment: {
		fontFamily: 'Medium',
		fontSize: moderateScale(16),
		textAlign: 'justify',
	},
})
