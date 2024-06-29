import { logOut } from '@/store/authStore'
import React from 'react'
import { Button, View } from 'react-native'

const Search = () => {
	const signOut = async () => {
		logOut()
	}
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Button title="Sign Out" onPress={signOut} />
		</View>
	)
}

export default Search
