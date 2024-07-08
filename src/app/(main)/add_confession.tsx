import React, { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const CONTENT_LENGTH = 10000

/**
 * AddConfession component for adding new confessions.
 * Allows user to input confession type and content.
 */

const AddConfession = () => {
	const { theme, styles } = useStyles(stylesheet)
	const [confessionTypeText, setConfessionTypeText] = useState<string>('')
	const [confessionContent, setConfessionContent] = useState<string>('')
	const [confessionTypes, setConfessionTypes] = useState<Set<string>>(new Set())
	const insets = useSafeAreaInsets()

	const handleAddConfessionType = useCallback(() => {
		if (confessionTypeText.trim()) {
			if (confessionTypes.has(confessionTypeText)) return
			setConfessionTypes((prev) => {
				const newSet = new Set(prev)
				newSet.add(confessionTypeText)
				return newSet
			})
			setConfessionTypeText('')
		}
	}, [confessionTypeText, confessionTypes])

	const handleClearContent = useCallback(() => {
		setConfessionContent('')
		setConfessionTypes(new Set())
	}, [])

	return <></>
}

export default AddConfession

const stylesheet = createStyleSheet({})
