import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
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

	return (
		<LinearGradient
			colors={[theme.colors.background, theme.colors.background]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={[
				styles.screen,
				{
					paddingBottom: insets.bottom + moderateScale(10),
					backgroundColor: theme.colors.background,
				},
			]}>
			<View style={[styles.confessionTypeTextBody, { backgroundColor: theme.colors.gray[100] }]}>
				{Array.from(confessionTypes).map((type) => (
					<TouchableOpacity
						key={type}
						onPress={() =>
							setConfessionTypes((prev) => {
								const newSet = new Set(prev)
								newSet.delete(type)
								return newSet
							})
						}
						style={[styles.confessionTypeTextCon, { backgroundColor: theme.colors.primary[500] }]}>
						<Text style={[styles.confessionTypeText, { color: theme.colors.white }]}>#{type}</Text>
					</TouchableOpacity>
				))}

				{confessionTypes.size < 2 && (
					<>
						<TextInput
							value={confessionTypeText}
							onChangeText={setConfessionTypeText}
							placeholder="Confession type . . ."
							maxLength={13}
							cursorColor={theme.colors.primary[500]}
							numberOfLines={1}
							keyboardType="default"
							autoComplete="off"
							style={[styles.confessionInput, { color: theme.colors.typography }]}
							placeholderTextColor={theme.colors.gray[400]}
						/>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={handleAddConfessionType}
							style={{
								backgroundColor: theme.colors.primary[500],
								borderRadius: moderateScale(20),
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Ionicons name="add-sharp" size={moderateScale(25)} color={theme.colors.white} />
						</TouchableOpacity>
					</>
				)}
			</View>
			<View style={styles.confessHeader}>
				<TouchableOpacity
					onPress={handleClearContent}
					activeOpacity={0.7}
					style={[styles.clearConfess, { backgroundColor: theme.colors.primary[500] }]}>
					<Text style={[styles.clearConfessText, { color: theme.colors.white }]}>Clear</Text>
				</TouchableOpacity>
				<Text style={[styles.confessCount, { color: theme.colors.primary[500] }]}>
					{confessionContent.length}/{CONTENT_LENGTH}
				</Text>
			</View>

			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				style={{ flex: 1 }}
				contentContainerStyle={styles.container}>
				<TextInput
					value={confessionContent}
					onChangeText={setConfessionContent}
					placeholder="Type here..."
					maxLength={CONTENT_LENGTH}
					cursorColor={theme.colors.primary[500]}
					multiline
					scrollEnabled
					textAlignVertical="top"
					textBreakStrategy="highQuality"
					textAlign="left"
					keyboardType="default"
					style={[styles.confessionContentInput, { color: theme.colors.typography }]}
					placeholderTextColor={theme.colors.gray[400]}
					autoCorrect
					autoCapitalize="sentences"
					spellCheck
					dataDetectorTypes={['link', 'phoneNumber', 'address', 'calendarEvent', 'none']}
					removeClippedSubviews
				/>
			</KeyboardAwareScrollView>
			<TouchableOpacity
				activeOpacity={0.8}
				disabled={confessionContent.length === 0}
				style={[
					styles.confessButton,
					{
						backgroundColor:
							confessionContent.length === 0 ? theme.colors.gray[100] : theme.colors.primary[500],
					},
				]}>
				<Text
					style={[
						styles.confessButtonText,
						{ color: confessionContent.length === 0 ? theme.colors.gray[300] : theme.colors.white },
					]}>
					Confess
				</Text>
			</TouchableOpacity>
		</LinearGradient>
	)
}

export default AddConfession

const stylesheet = createStyleSheet({
	screen: {
		flex: 1,
		paddingTop: moderateScale(20),
		paddingHorizontal: moderateScale(15),
	},
	container: {
		marginTop: moderateScale(20),
		paddingHorizontal: moderateScale(15),
		paddingBottom: moderateScale(50),
	},
	confessionInput: {
		flex: 1,
		fontFamily: 'Regular',
		fontSize: moderateScale(14),
	},
	confessionTypeTextCon: {
		paddingHorizontal: moderateScale(10),
		paddingVertical: moderateScale(5),
		borderRadius: moderateScale(25),
	},
	confessionTypeText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(12),
		textAlign: 'justify',
	},
	confessionTypeTextBody: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		height: moderateScale(50),
		overflow: 'hidden',
		borderRadius: moderateScale(25),
		paddingHorizontal: moderateScale(15),
		gap: moderateScale(5),
	},
	confessionContent: {
		width: '100%',
	},
	confessionContentInput: {
		textAlignVertical: 'top',
		fontFamily: 'Regular',
		fontSize: moderateScale(15),
	},
	confessButton: {
		padding: moderateScale(15),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: moderateScale(40),
	},
	confessButtonText: { fontSize: moderateScale(16), fontFamily: 'Medium' },
	confessHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: moderateScale(25),
		marginTop: moderateScale(20),
		marginHorizontal: moderateScale(15),
	},
	clearConfess: {
		paddingHorizontal: moderateScale(10),
		borderRadius: moderateScale(25),
		justifyContent: 'center',
		alignItems: 'center',
	},
	clearConfessText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
	},
	confessCount: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
	},
})
