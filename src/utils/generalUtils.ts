// CAPITALIZE WORDS
export const capitalizeWords = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.replace(/(^|\s)\S/g, (char) => char.toUpperCase())
}
