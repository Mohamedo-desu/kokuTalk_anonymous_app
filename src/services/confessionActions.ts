import { ADDCONFESSIONPROPS } from '@/types'
import { supabase } from '@/utils/supabase'

export const fetchConfessions = async ({ userId, limit }: { userId: string; limit: number }) => {
	try {
		let query = supabase.from('random_confessions_view').select('*, user:users(*)').limit(limit)

		if (userId) {
			query = query.not('views', 'cs', `{${userId}}`)
		}

		const { data: confessions, error } = await query

		if (error) {
			console.error('Error fetching random confessions:', error)
			return []
		}

		if (!confessions || confessions.length <= 0) {
			// If no confessions found, fetch some recent confessions as fallback
			const fallbackQuery = supabase
				.from('random_confessions_view')
				.select('*, user:users(*)')
				.limit(limit)

			const { data: recentConfessions, error: recentError } = await fallbackQuery

			if (recentError) {
				console.error('Error fetching recent confessions:', recentError)
				return []
			}

			return recentConfessions || []
		}

		return confessions
	} catch (error: any) {
		console.error('Unexpected error:', error)
		throw new Error(error.message || 'An error occurred')
	}
}

export const addConfession = async (confessionBody: ADDCONFESSIONPROPS) => {
	const {
		confession_text,
		confession_types,
		confessed_by,
		likes,
		dislikes,
		comments,
		shares,
		views,
	} = confessionBody
	try {
		const { data, error } = await supabase.from('confessions').insert([
			{
				confession_text,
				confession_types,
				confessed_by,
				likes,
				dislikes,
				comments,
				shares,
				views,
			},
		])
		if (error) {
			throw new Error(error.message)
		}
	} catch (error: any) {
		throw new Error(error)
	}
}
