import ConfessionCard from '@/components/ConfessionCard'
import Loader from '@/components/Loader'
import { addConfession } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useState } from 'react'
import {
	Alert,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const CONTENT_LENGTH = 2000

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
	const user = useAuthStoreSelectors.use.currentUser()

	const [showPreviewModal, setShowPreviewModal] = useState(false)

	const handleAddConfessionType = useCallback(() => {
		if (confessionTypeText.trim()) {
			if (confessionTypes.includes(confessionTypeText)) return
			setConfessionTypes((prev) => [...prev, confessionTypeText])
			setConfessionTypeText('')
		}
	}, [confessionTypeText, confessionTypes])

	const handleClearContent = useCallback(() => {
		if (confessionText.trim().length <= 0) return
		Alert.alert('Clear Content', 'Are you sure you want to clear the content?', [
			{
				text: 'Cancel',
				onPress: () => {},
				style: 'cancel',
			},
			{ text: 'Yes', onPress: () => setConfessionText('') },
		])
	}, [confessionText])
	const handlePreviewContent = useCallback(() => {
		if (confessionText.trim().length <= 0) return
		setShowPreviewModal(true)
	}, [confessionText])

	const handeConfess = async () => {
		try {
			setLoading(true)
			setShowPreviewModal(false)
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
								width: moderateScale(25),
								aspectRatio: 1,
							}}>
							<Ionicons name="add-sharp" size={moderateScale(25)} color={theme.colors.white} />
						</TouchableOpacity>
					</>
				)}
			</View>
			<Text
				style={{
					fontFamily: 'Italic',
					fontSize: moderateScale(10),
					color: theme.colors.gray[400],
					marginTop: moderateScale(4),
				}}>
				Note:Tags are essential for categorizing your confessions, making it easier for others to
				find and relate to them.
			</Text>

			<View style={styles.confessHeader}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
					<TouchableOpacity
						onPress={handleClearContent}
						activeOpacity={0.7}
						style={[styles.clearConfess, { backgroundColor: theme.colors.error }]}>
						<Text style={[styles.clearConfessText, { color: theme.colors.white }]}>Clear</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handlePreviewContent}
						activeOpacity={0.7}
						style={[styles.clearConfess, { backgroundColor: theme.colors.primary[500] }]}>
						<Text style={[styles.clearConfessText, { color: theme.colors.white }]}>Preview</Text>
					</TouchableOpacity>
				</View>

				<Text style={[styles.confessCount, { color: theme.colors.primary[500] }]}>
					{confessionText.length} / {CONTENT_LENGTH}
				</Text>
			</View>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={moderateScale(120)}>
				<KeyboardAwareScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					scrollEnabled={true}
					enableOnAndroid={true}
					enableAutomaticScroll={true}
					keyboardOpeningTime={0}
					extraScrollHeight={moderateScale(130)}>
					<TextInput
						value={confessionText}
						onChangeText={setConfessionText}
						placeholder="Type here..."
						maxLength={CONTENT_LENGTH}
						cursorColor={theme.colors.primary[500]}
						multiline
						scrollEnabled
						textAlignVertical="top"
						textBreakStrategy="simple"
						textAlign="left"
						keyboardType="default"
						style={[styles.confessionTextInput, { color: theme.colors.typography }]}
						placeholderTextColor={theme.colors.gray[400]}
						autoCorrect
						autoCapitalize="sentences"
						spellCheck
						dataDetectorTypes={['link', 'phoneNumber', 'address', 'calendarEvent', 'none']}
					/>
				</KeyboardAwareScrollView>
			</KeyboardAvoidingView>
			<Modal
				visible={showPreviewModal}
				onDismiss={() => {
					setShowPreviewModal(false)
				}}
				animationType="slide">
				<ScrollView
					style={{ flex: 1, backgroundColor: theme.colors.background }}
					contentContainerStyle={{
						paddingBottom: insets.bottom + moderateScale(85),
						paddingTop: moderateScale(10),
					}}>
					<View style={styles.modalHeader}>
						<Ionicons
							name="close-circle-sharp"
							size={moderateScale(30)}
							onPress={() => setShowPreviewModal(false)}
							color={theme.colors.error}
						/>
						<Ionicons
							name="add-circle-sharp"
							size={moderateScale(30)}
							onPress={handeConfess}
							color={theme.colors.primary[500]}
						/>
					</View>
					<ConfessionCard
						isDetailsScreen={true}
						item={{
							id: '',
							confession_text: confessionText,
							confession_types: confessionTypes,
							created_at: new Date().toISOString(),
							dislikes: [],
							likes: [],
							views: [],
							favorites: [],
							comments: [],
							shares: [],
							reports: [],
							confessed_by: userId,
							user,
						}}
						isPreview={true}
						numberOfLines={0}
					/>
				</ScrollView>
			</Modal>
			<Loader visible={loading} text="Confessing..." />
		</LinearGradient>
	)
}

export default AddConfession

const stylesheet = createStyleSheet({
	screen: {
		flex: 1,
		paddingTop: moderateScale(10),
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
		borderRadius: moderateScale(10),
	},
	confessionTypeText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
		textAlign: 'justify',
	},
	confessionTypeTextBody: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		height: moderateScale(50),
		overflow: 'hidden',
		borderRadius: moderateScale(10),
		paddingHorizontal: moderateScale(15),
		gap: moderateScale(5),
	},
	confessionText: {
		width: '100%',
	},
	confessionTextInput: {
		textAlignVertical: 'top',
		fontFamily: 'Regular',
		fontSize: moderateScale(14),
	},
	confessHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: moderateScale(25),
		marginTop: moderateScale(10),
		marginBottom: moderateScale(10),
		elevation: 1,
	},
	clearConfess: {
		paddingHorizontal: moderateScale(10),
		borderRadius: moderateScale(5),
		justifyContent: 'center',
		alignItems: 'center',
	},
	clearConfessText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(12),
	},
	confessCount: {
		fontFamily: 'Regular',
		fontSize: moderateScale(12),
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: moderateScale(10),
		marginVertical: moderateScale(10),
	},
})
