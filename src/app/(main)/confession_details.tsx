import ConfessionCard from '@/components/ConfessionCard'
import { fetchConfessionById } from '@/services/confessionActions'
import { CONFESSIONSPROPS } from '@/types'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Toast } from 'react-native-toast-notifications'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ConfessionDetails = () => {
	const { id }: Partial<{ id: string }> = useLocalSearchParams()
	const { theme, styles } = useStyles(stylesheet)
	const [confession, setConfession] = useState<CONFESSIONSPROPS | any>()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		;(async () => {
			try {
				setLoading(true)
				const confession = await fetchConfessionById({ id })
				setConfession(confession)
				setLoading(false)
			} catch (error) {
				setLoading(false)
				Toast.show(`${error}`, {
					type: 'danger',
				})
			}
		})()
	}, [id])

	return <View style={styles.container}>{!loading && <ConfessionCard item={confession} />}</View>
}

export default ConfessionDetails

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
	},
})
