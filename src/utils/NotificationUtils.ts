import { NOTIFICATIONPROPS } from '@/types'
import dayjs from 'dayjs'

/**
 * Groups the given notifications by date into sections.
 * @param notifications - The notifications to group, each with a date property of type string.
 * @returns An array of sections, each containing a title of type string and data array of notifications, each with a date property of type string.
 */
export const groupNotifications = (notifications: NOTIFICATIONPROPS[]) => {
	notifications.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))

	const groupedNotifications: Record<string, Array<NOTIFICATIONPROPS>> = notifications.reduce(
		(acc: Record<string, Array<NOTIFICATIONPROPS>>, notification: NOTIFICATIONPROPS) => {
			const notificationDate = dayjs(notification.created_at)
			const groupKey = getGroupKey(notificationDate)

			if (!acc[groupKey]) {
				acc[groupKey] = []
			}

			acc[groupKey].push(notification)
			return acc
		},
		{},
	)

	return [
		{ title: 'Today', data: groupedNotifications.today || [] },
		{ title: 'Yesterday', data: groupedNotifications.yesterday || [] },
		{ title: 'Earlier', data: groupedNotifications.earlier || [] },
	]
}

const getGroupKey = (notificationDate: dayjs.Dayjs) => {
	if (notificationDate.isSame(dayjs(), 'day')) {
		return 'today'
	}
	if (notificationDate.isSame(dayjs().subtract(1, 'day'), 'day')) {
		return 'yesterday'
	}
	return 'earlier'
}
