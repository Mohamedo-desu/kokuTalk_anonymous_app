import NotificationCard from '@/components/NotificationCard'
import Skeleton from '@/components/Skeleton'
import { PAGE_SIZE } from '@/constants/appDetails'
import useNetworkState from '@/hooks/useNetworkState'
import { fetchNotifications } from '@/services/userActions'
import { NOTIFICATIONPROPS } from '@/types'
import { DEVICE_WIDTH } from '@/utils'
import { groupNotifications } from '@/utils/NotificationUtils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, SectionList, Text, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import Toast from 'react-native-toast-message'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

dayjs.extend(relativeTime)

const Notifications = () => {
	const { theme, styles } = useStyles(stylesheet)
	const [sections, setSections] = useState<{ title: string; data: NOTIFICATIONPROPS[] }[]>([])

	const [loading, setLoading] = useState(true)
	const [lastDocumentFetched, setLastDocumentFetched] = useState(null)
	const [noMoreDocuments, setNoMoreDocuments] = useState(false)

	const [refreshing, setRefreshing] = useState(false)

	const insets = useSafeAreaInsets()
	const isNetwork = useNetworkState()

	const renderNotificationCard = useCallback(
		({ item, index }: { item: NOTIFICATIONPROPS; index: number }) => {
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

	const loadMoreNotifications = async () => {
		try {
			if (noMoreDocuments) return

			if (refreshing) return
			setRefreshing(true)

			const newNotifications = await fetchNotifications({
				fetchLimit: PAGE_SIZE,
				lastDocumentFetched,
				setLastDocumentFetched,
				setNoMoreDocuments,
			})

			const existingNotifications: NOTIFICATIONPROPS[] = sections.flatMap((section) => section.data)

			const allNotifications: NOTIFICATIONPROPS[] = [...existingNotifications, ...newNotifications]

			const groupedNotifications = groupNotifications(allNotifications)

			setSections(groupedNotifications)

			setRefreshing(false)
		} catch (error) {
			setRefreshing(false)
			Toast.show({
				type: 'danger',
				text1: `${error}`,
			})
		}
	}

	useEffect(() => {
		;(async () => {
			try {
				if (!loading) setLoading(true)
				setLastDocumentFetched(null)
				const newNotifications = await fetchNotifications({
					fetchLimit: PAGE_SIZE,
					lastDocumentFetched,
					setLastDocumentFetched,
					setNoMoreDocuments,
				})
				setSections(groupNotifications(newNotifications))
				setLoading(false)
			} catch (error) {
				setLoading(false)
				Toast.show(`${error}`, {
					type: 'danger',
				})
			}
		})()
	}, [isNetwork])

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
			) : (
				<SectionList
					style={[styles.sectionList, { backgroundColor: theme.colors.background }]}
					contentContainerStyle={[
						styles.sectionListContent,
						{ paddingBottom: insets.bottom + moderateScale(80) },
					]}
					refreshControl={
						<RefreshControl
							onRefresh={() => loadMoreNotifications()}
							refreshing={refreshing}
							tintColor={theme.colors.primary[500]}
							colors={[theme.colors.primary[500], theme.colors.primary[400]]}
							style={{ backgroundColor: theme.colors.gray[300] }}
						/>
					}
					sections={sections}
					keyExtractor={(item) => item.created_at}
					renderItem={renderNotificationCard}
					renderSectionHeader={renderSectionHeader}
					indicatorStyle={theme.colors.typography}
					stickySectionHeadersEnabled
				/>
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
