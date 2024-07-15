import NotificationCard from '@/components/NotificationCard'
import Skeleton from '@/components/Skeleton'
import { APP_NOTIFICATIONS } from '@/dummyData/notifications'
import { NOTIFICATION } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { groupNotifications } from '@/utils/NotificationUtils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, SectionList, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

dayjs.extend(relativeTime)

const Notifications = () => {
	const { theme, styles } = useStyles(stylesheet)
	const [sections, setSections] = useState<{ title: string; data: NOTIFICATION[] }[]>([])

	const [loading, setLoading] = useState(true)

	const insets = useSafeAreaInsets()

	const renderNotificationCard = useCallback(
		({ item, index }: { item: (typeof APP_NOTIFICATIONS)[0]; index: number }) => {
			if (!item) {
				return null
			}

			return <NotificationCard item={item} index={index} />
		},
		[],
	)
	const renderSectionHeader = useCallback(
		({ section: { title, data } }: { section: { title: string; data: NOTIFICATION[] } }) => {
			if (data.length > 0) {
				return (
					<View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
						<Text style={[styles.sectionHeaderText, { color: theme.colors.typography }]}>
							{title}
						</Text>
					</View>
				)
			}
			return null
		},
		[theme.colors.typography, theme.colors.background],
	)

	const ListEmptyComponent = useCallback(() => {
		return (
			<View style={styles.emptyContainer}>
				<Text style={[styles.emptyText, { color: theme.colors.gray[400] }]}>
					You have no notifications yet! Please check back later!
				</Text>
			</View>
		)
	}, [theme.colors.gray[400]])

	useEffect(() => {
		// TODO: fetch notifications from server or local database
		const timeOut = setTimeout(() => {
			setSections(groupNotifications([]))
			setLoading(false)
		}, 2000)

		return () => clearTimeout(timeOut)
	}, [])

	return (
		<LinearGradient
			colors={[theme.colors.background, theme.colors.background]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={styles.container}>
			{loading ? (
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={[
						styles.scrollViewContent,
						{ paddingBottom: insets.bottom + moderateScale(80) },
					]}>
					{Array(5)
						.fill(null)
						.map((_, index) => (
							<Skeleton
								key={index}
								width={DEVICE_WIDTH - moderateScale(25)}
								height={moderateScale(120)}
								style={styles.skeleton}
							/>
						))}
				</ScrollView>
			) : sections[0].data.length > 0 &&
			  sections[1].data.length > 0 &&
			  sections[2].data.length > 0 ? (
				<SectionList
					style={[styles.sectionList, { backgroundColor: theme.colors.background }]}
					contentContainerStyle={[
						styles.sectionListContent,
						{ paddingBottom: insets.bottom + moderateScale(80) },
					]}
					sections={sections}
					keyExtractor={(item) => item.id}
					renderItem={renderNotificationCard}
					renderSectionHeader={renderSectionHeader}
					indicatorStyle={theme.colors.typography}
					stickySectionHeadersEnabled
				/>
			) : (
				<ListEmptyComponent />
			)}
		</LinearGradient>
	)
}

export default Notifications

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
	},
	sectionList: {
		flex: 1,
		paddingHorizontal: moderateScale(15),
	},
	sectionListContent: {
		flexGrow: 1,
		gap: moderateScale(5),
	},
	sectionHeader: {
		paddingVertical: moderateScale(10),
	},
	sectionHeaderText: {
		fontSize: moderateScale(18),
		fontFamily: 'SemiBold',
	},
	skeleton: {
		marginHorizontal: moderateScale(10),
		marginTop: moderateScale(5),
		borderRadius: moderateScale(10),
	},
	scrollViewContent: {
		flexGrow: 1,
		paddingTop: moderateScale(5),
		alignItems: 'center',
	},
	emptyContainer: {
		flex: 1,
		padding: moderateScale(20),
	},
	emptyText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
		textAlign: 'center',
	},
})
