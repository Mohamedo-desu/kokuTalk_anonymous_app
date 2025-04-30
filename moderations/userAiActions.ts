import { HATE_WORDS } from '@/constants/moderation'
import Constants from 'expo-constants'

const OPEN_AI_API_KEY = Constants?.expoConfig?.extra?.OPEN_AI_API_KEY

export const generateDisplayName = async () => {
	try {
		return 'user' + Math.floor(Math.random() * 1000000000)
	} catch (error) {
		console.error('Error generating display name:', error)
	}
}
export const moderateContent = (text: string) => {
	try {
		let moderated: string = text

		// Regex patterns
		const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
		const phonePattern = /(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{7,10}/g
		const addressPattern = /\d+\s[A-z]+\s[A-z]+/g
		const urlPattern = /(?:https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:[^\s]*)/gi
		const ccnPattern = /\b(?:\d[ -]*?){13,16}\b/g
		const ssnPattern = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g

		// List of common hate and swear words

		const hatePattern = new RegExp('\\b(' + HATE_WORDS.join('|') + ')\\b', 'gi')

		// Replace matched patterns with ****
		moderated = moderated.replace(emailPattern, '****')
		moderated = moderated.replace(phonePattern, '****')
		moderated = moderated.replace(addressPattern, '****')
		moderated = moderated.replace(urlPattern, '****')
		moderated = moderated.replace(ccnPattern, '****')
		moderated = moderated.replace(ssnPattern, '****')
		moderated = moderated.replace(hatePattern, '****')

		return moderated
	} catch (error) {
		console.error('Error moderating content', error)
		return text // Return original text in case of error
	}
}
