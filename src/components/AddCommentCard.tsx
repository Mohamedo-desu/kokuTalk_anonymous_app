import { Ionicons } from '@expo/vector-icons'
import { Dispatch, SetStateAction } from 'react'
import { ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const COMMENT_LENGTH = 500

const AddCommentCard = ({
	newComment,
	setNewComment,
	loading,
	placeHolder,
	handleAddComment,
}: {
	newComment: string
	setNewComment: Dispatch<SetStateAction<string>>
	loading: boolean
	placeHolder: string
	handleAddComment: () => void
}) => {
	const { theme, styles } = useStyles(stylesheet)
	return (
		<Animated.View
			entering={ZoomIn}
			exiting={ZoomOut}
			style={[
				styles.comment,
				{ backgroundColor: theme.colors.gray[100], borderColor: theme.colors.primary[500] },
			]}>
			<TextInput
				value={newComment}
				onChangeText={setNewComment}
				placeholder={placeHolder}
				maxLength={COMMENT_LENGTH}
				cursorColor={theme.colors.primary[500]}
				multiline
				scrollEnabled
				textBreakStrategy="highQuality"
				textAlign="left"
				keyboardType="default"
				style={[styles.commentInput, { color: theme.colors.typography }]}
				placeholderTextColor={theme.colors.gray[400]}
				autoCorrect
				autoCapitalize="sentences"
				spellCheck
				dataDetectorTypes={['link', 'phoneNumber', 'address', 'calendarEvent']}
			/>
			<TouchableOpacity
				activeOpacity={0.8}
				disabled={!newComment || loading}
				onPress={handleAddComment}
				style={[styles.addButton, { backgroundColor: theme.colors.primary[500] }]}>
				{loading ? (
					<ActivityIndicator size={'small'} color={theme.colors.white} />
				) : (
					<Ionicons name="add-sharp" size={moderateScale(25)} color={theme.colors.white} />
				)}
			</TouchableOpacity>
		</Animated.View>
	)
}

export default AddCommentCard

const stylesheet = createStyleSheet({
	comment: {
		justifyContent: 'space-between',
		marginVertical: moderateScale(5),
		marginHorizontal: moderateScale(20),
		borderRadius: moderateScale(10),
		borderWidth: 1.5,
	},
	commentInput: {
		flex: 1,
		flexGrow: 1,
		fontFamily: 'Regular',
		fontSize: moderateScale(13),
		paddingHorizontal: moderateScale(15),
		paddingVertical: moderateScale(10),
	},
	addButton: {
		alignSelf: 'flex-end',
		borderRadius: moderateScale(25),
		justifyContent: 'center',
		alignItems: 'center',
		width: moderateScale(25),
		aspectRatio: 1,
		margin: moderateScale(8),
	},
})
