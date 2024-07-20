import { db } from '@/utils/firebase'
import { deleteStoredValues, getStoredValues, saveSecurely } from '@/utils/storageUtils'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

export const uploadPushToken = async (
	pushTokenString: string,
	pushTokens: string[],
	uid: string,
) => {
	await saveSecurely([{ key: 'pushTokenString', value: pushTokenString }])

	if (pushTokens?.includes(pushTokenString)) {
		return
	} else {
		await updateDoc(doc(db, 'users', uid), {
			pushTokens: arrayUnion(pushTokenString),
			updated_at: new Date().toISOString(),
		})
	}
}
export const removePushToken = async (uid: string) => {
	const { pushTokenString } = await getStoredValues(['pushTokenString'])

	await updateDoc(doc(db, 'users', uid), {
		pushTokens: arrayRemove(pushTokenString || ''),
		updated_at: new Date().toISOString(),
	})

	await deleteStoredValues(['pushTokenString'])
}

export const blockUser = async ({ uid, blockUserId }: { uid: string; blockUserId: string }) => {
	await updateDoc(doc(db, 'users', uid), {
		blocked_users: arrayUnion(blockUserId),
		updated_at: new Date().toISOString(),
	})
}
