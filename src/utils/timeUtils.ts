import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // Plugin for relative time

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime)

export const dateFormat = 'ddd,MMM DD'
export const dateFormatWithYear = 'MMM DD,YYYY'
export const timeFormat = 'HH:mm A'
export const yearFormat = 'YYYY'

/**
 * Formats the relative time of a given date.
 * If the date is in the current year, it will return the relative time.
 * If the date is not in the current year, it will return the formatted date with year.
 *
 * @param {Date | null} createdAt - The date to be formatted.
 * @return {string} The formatted relative time or date.
 */
export const formatRelativeTime = (createdAt: Date | string | null): string => {
	// If createdAt is null, return an empty string.
	if (createdAt === null) return ''

	// Get the current date and the createdAt date.
	const currentDate = dayjs()
	const createdAtDate = dayjs(createdAt)

	// Check if the createdAt date is in the current year.
	const isCurrentYear = createdAtDate.year() === currentDate.year()

	// If the createdAt date is in the current year, calculate the difference in days.
	// If the difference is greater than 7, return the formatted date without year.
	// Otherwise, return the relative time.
	if (isCurrentYear) {
		const diffInDays = currentDate.diff(createdAtDate, 'day')
		if (diffInDays > 7) return createdAtDate.format(dateFormat)
		return createdAtDate.fromNow()
	}

	// If the createdAt date is not in the current year, return the formatted date with year.
	return createdAtDate.format(dateFormatWithYear)
}
