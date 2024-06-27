import { store, useAppDispatch } from '@/store/store'
import { LOG_OUT } from '@/store/userSlice'
import React from 'react'
import { Button, View } from 'react-native'

const Account = () => {
	const dispatch = useAppDispatch()
	const state = store.getState()

	const signOut = async () => {
		await LOG_OUT(dispatch, state)
	}
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Button title="Sign Out" onPress={signOut} />
		</View>
	)
}

export default Account
