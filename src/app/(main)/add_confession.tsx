import Loader from '@/components/Loader'
import { addConfession } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { shortenNumber } from '@/utils/generalUtils'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const CONTENT_LENGTH = 5000

/**
 * AddConfession component for adding new confessions.
 * Allows user to input confession type and content.
 */

const AddConfession = () => {
	const insets = useSafeAreaInsets()
	const { theme, styles } = useStyles(stylesheet)

	const [loading, setLoading] = useState(false)

	const [confessionTypeText, setConfessionTypeText] = useState<string>('')
	const [confessionText, setConfessionText] = useState<string>('')
	const [confessionTypes, setConfessionTypes] = useState<string[]>([])

	const userId = useAuthStoreSelectors.use.currentUser().id

	const handleAddConfessionType = useCallback(() => {
		if (confessionTypeText.trim()) {
			if (confessionTypes.includes(confessionTypeText)) return
			setConfessionTypes((prev) => [...prev, confessionTypeText])
			setConfessionTypeText('')
		}
	}, [confessionTypeText, confessionTypes])

	const handleClearContent = useCallback(() => {
		setConfessionText('')
		setConfessionTypes([])
	}, [])

	const handeConfess = async () => {
		try {
			setLoading(true)
			await addConfession({
				created_at: new Date().toISOString(),
				confession_text: confessionText,
				confession_types: confessionTypes,
				confessed_by: userId,
				likes: [],
				dislikes: [],
				comments: [],
				shares: [],
				views: [],
				favorites: [],
				reports: [],
			})

			setConfessionTypeText('')
			setConfessionText('')
			setConfessionTypes([])

			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}
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
						onPress={() => setConfessionTypes((prev) => [...prev.filter((item) => item !== type)])}
						style={[styles.confessionTypeTextCon, { backgroundColor: theme.colors.primary[500] }]}>
						<Text style={[styles.confessionTypeText, { color: theme.colors.white }]}>#{type}</Text>
					</TouchableOpacity>
				))}

				{confessionTypes.length < 2 && (
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
					{shortenNumber(confessionText.length)} / {shortenNumber(CONTENT_LENGTH)}
				</Text>
			</View>

			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				style={{ flex: 1 }}
				contentContainerStyle={styles.container}>
				<TextInput
					value={confessionText}
					onChangeText={setConfessionText}
					placeholder="Type here..."
					maxLength={CONTENT_LENGTH}
					cursorColor={theme.colors.primary[500]}
					multiline
					scrollEnabled
					textAlignVertical="top"
					textBreakStrategy="highQuality"
					textAlign="left"
					keyboardType="default"
					style={[styles.confessionTextInput, { color: theme.colors.typography }]}
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
				disabled={confessionText.length === 0}
				onPress={handeConfess}
				style={[
					styles.confessButton,
					{
						backgroundColor:
							confessionText.length === 0 ? theme.colors.gray[100] : theme.colors.primary[500],
					},
				]}>
				<Text
					style={[
						styles.confessButtonText,
						{ color: confessionText.length === 0 ? theme.colors.gray[300] : theme.colors.white },
					]}>
					Confess
				</Text>
			</TouchableOpacity>
			<Loader visible={loading} text="Confessing..." />
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
	confessionText: {
		width: '100%',
	},
	confessionTextInput: {
		textAlignVertical: 'top',
		fontFamily: 'Regular',
		fontSize: moderateScale(13),
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
		fontFamily: 'Regular',
		fontSize: moderateScale(11),
	},
})
