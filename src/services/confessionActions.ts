import { useAuthStoreSelectors } from '@/store/authStore'
import { ADDCONFESSIONPROPS, CONFESSIONSPROPS } from '@/types'
import { deleteStoredValues, getStoredValues } from '@/utils/storageUtils'
import { supabase } from '@/utils/supabase'

export const fetchConfessions = async ({ userId, limit }: { userId: string; limit: number }) => {
	try {
		let query = supabase.from('random_confessions_view').select('*, user:users(*)').limit(limit)

		const { data: confessions, error } = await query

		if (error) {
			console.error('Error fetching random confessions:', error)
			return []
		}

		if (!confessions || confessions.length <= 0) {
			return []
		}

		if (!userId) {
			return confessions
		}

		const seenConfessions: CONFESSIONSPROPS[] = []
		const unseenConfessions: CONFESSIONSPROPS[] = []

		confessions.forEach((confession) => {
			if (confession.views && confession.views.includes(userId)) {
				seenConfessions.push(confession)
			} else {
				unseenConfessions.push(confession)
			}
		})

		const sortedConfessions = unseenConfessions.concat(seenConfessions).slice(0, limit)

		return sortedConfessions
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

export const updateUnseenConfessions = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		let { unseenConfessions } = await getStoredValues(['unseenConfessions'])

		if (!unseenConfessions) {
			return
		}

		unseenConfessions = JSON.parse(unseenConfessions)

		const { data: confessionsToUpdate, error } = await supabase
			.from('confessions')
			.select('*')
			.in('id', unseenConfessions)

		if (error) {
			throw new Error(error.message)
		}

		const updates = confessionsToUpdate.map((confession) => {
			const { views } = confession
			const updatedViews = Array.isArray(views) ? views : []

			if (!updatedViews.includes(userId)) {
				updatedViews.push(userId)
			}

			return {
				...confession,
				views: updatedViews,
			}
		})

		const { error: updateError } = await supabase
			.from('confessions')
			.upsert(updates, { onConflict: 'id' })

		if (updateError) {
			throw new Error(updateError.message)
		}

		await deleteStoredValues(['unseenConfessions'])
	} catch (error) {
		console.error('Error updating unseen confessions:', error)
	}
}
