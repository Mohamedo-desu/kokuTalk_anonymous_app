// Capitalize words
export const capitalizeWords = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.replace(/(^|\s)\S/g, (char) => char.toUpperCase())
}

// Converts a number into a shortened format.
export const shortenNumber = (num: number): string => {
	const absNum = Math.abs(num)
	let result: string = ''

	if (absNum >= 1e9) {
		result = `${(num / 1e9).toFixed(1)}B`
	} else if (absNum >= 1e6) {
		result = `${(num / 1e6).toFixed(1)}M`
	} else if (absNum >= 1e3) {
		result = `${(num / 1e3).toFixed(1)}k`
	} else {
		result = num.toString()
	}

	// Remove the trailing zero and dot if they exist
	result = result.replace(/\.0+([kMB])$/, '$1')

	return result
}
