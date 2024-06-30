import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // Plugin for relative time

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime)

export const dateFormat = 'ddd,MMM DD'
export const timeFormat = 'HH:mm A'
export const yearFormat = 'yyyy'

export const formatRelativeTime = (createdAt: Date) => {
	// Calculate the difference in days from now
	const diffInDays = dayjs().diff(createdAt, 'day')

	// If more than 7 days, return formatted date
	if (diffInDays > 7) {
		return dayjs(createdAt).format(dateFormat)
	}

	// Otherwise, return relative time
	return dayjs(createdAt).fromNow()
}
