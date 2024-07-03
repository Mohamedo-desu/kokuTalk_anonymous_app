import { MALE_AVATARS } from '@/constants/userAvatars'
import { NOTIFICATION } from '@/types'
import { formatRelativeTime } from '@/utils/timeUtils'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const NotificationCard = ({ item, index }: { item: NOTIFICATION; index: number }): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)

	return (
		<View style={[styles.notificationContainer, { backgroundColor: theme.colors.gray[100] }]}>
			<Image source={{ uri: MALE_AVATARS[index] }} style={styles.avatar} resizeMode="cover" />
			<View style={styles.textContainer}>
				<Text style={[styles.title, { color: theme.colors.typography }]}>{item.title}</Text>
				<Text style={[styles.body, { color: theme.colors.typography }]}>{item.body}</Text>
				<Text style={[styles.date, { color: theme.colors.gray[500] }]}>
					{formatRelativeTime(item.date)}
				</Text>
			</View>
		</View>
	)
}

export default NotificationCard

const stylesheet = createStyleSheet({
	notificationContainer: {
		flexDirection: 'row',
		padding: moderateScale(15),
		borderRadius: moderateScale(10),
	},
	avatar: {
		width: moderateScale(49),
		aspectRatio: 1,
		borderRadius: moderateScale(25),
		marginRight: moderateScale(10),
	},
	textContainer: {
		flex: 1,
	},
	title: {
		fontSize: moderateScale(15),
		fontFamily: 'SemiBold',
	},
	body: {
		fontSize: moderateScale(13),
	},
	date: {
		fontSize: moderateScale(11),
		marginTop: moderateScale(4),
	},
})
