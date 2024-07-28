import { NOTIFICATIONPROPS } from '@/types'
import { formatRelativeTime } from '@/utils/timeUtils'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const NotificationCard = ({
	item,
	index,
}: {
	item: NOTIFICATIONPROPS
	index: number
}): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	const { avatar, title, body, created_at, url } = item
	return (
		<TouchableOpacity
			onPress={() => router.navigate(url)}
			style={[styles.notificationContainer, { backgroundColor: theme.colors.gray[100] }]}>
			<Image source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />
			<View style={styles.textContainer}>
				<Text style={[styles.title, { color: theme.colors.typography }]}>{title}</Text>
				<Text style={[styles.body, { color: theme.colors.typography }]}>{body}</Text>
				<Text style={[styles.date, { color: theme.colors.gray[500] }]}>
					{formatRelativeTime(created_at)}
				</Text>
			</View>
		</TouchableOpacity>
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
