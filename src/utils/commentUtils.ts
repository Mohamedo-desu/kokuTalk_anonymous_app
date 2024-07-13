import { uploadReply } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { Toast } from 'react-native-toast-notifications'

export const addReply = async ({
	id,
	confessionId,
	newReply,
}: {
	id: string
	confessionId: string
	newReply: string
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		await uploadReply({
			id: '',
			created_at: '',
			reply_text: newReply,
			confession_id: confessionId,
			replied_by: userId,
			likes: [],
			dislikes: [],
			comment_id: id,
		})

		Toast.show('success', {
			type: 'success',
		})
	} catch (error) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
