import { useAuthStoreSelectors } from '@/store/authStore'
import { Colors } from '@/unistyle/theme'
import { reportComment } from '@/utils/commentUtils'
import { reportConfession } from '@/utils/confessionUtils'
import { reportReply } from '@/utils/ReplyUtils'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Checkbox, Modal, Portal } from 'react-native-paper'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface ReportModalProps {
	visible: boolean
	onClose: () => void
	reportType: string
	confession_id?: string
	comment_id?: string
	reply_id?: string
	setReporting: Dispatch<SetStateAction<boolean>>
}

/**
 * A modal for reporting a confession, comment or reply.
 * It appears when the user clicks on the three dots on a confession, comment or reply.
 * It allows the user to select the reasons for reporting and submit the report.
 * @param {ReportModalProps} props
 */
const ReportModal = ({
	visible,
	onClose,
	setReporting,
	reportType,
	confession_id,
	comment_id,
	reply_id,
}: ReportModalProps) => {
	const { styles, theme } = useStyles(stylesheet)

	const userId = useAuthStoreSelectors.getState().currentUser.id

	/**
	 * The selected reasons for reporting
	 * @type {Object<string, boolean>}
	 */
	const [selectedReasons, setSelectedReasons] = useState<{ [key: string]: boolean }>({})
	/**
	 * The other reason for reporting if the user selects "Other"
	 * @type {string}
	 */
	const [otherReason, setOtherReason] = useState('')

	/**
	 * The reasons for reporting
	 * @type {string[]}
	 */
	const reasons = ['Harassment', 'Spam', 'Hate Speech', 'Inappropriate Content', 'Other']

	/**
	 * Toggle the selected reason for reporting
	 * @param {string} reason
	 */
	const toggleReason = (reason: string) =>
		setSelectedReasons((prev) => ({ ...prev, [reason]: !prev[reason] }))

	/**
	 * Handle the submit button
	 */
	const handleSubmit = async () => {
		setReporting(true)
		onClose()
		const selected = Object.keys(selectedReasons).filter((reason) => selectedReasons[reason])
		const report_reason = [...selected, { other: otherReason }]

		if (reportType === 'confession') {
			confession_id &&
				(await reportConfession({
					confessionId: confession_id,
					report_reason,
					reported_by: userId,
				}))
		} else if (reportType === 'comment') {
			comment_id &&
				(await reportComment({ commentId: comment_id, report_reason, reported_by: userId }))
		} else if (reportType === 'reply') {
			reply_id && (await reportReply({ replyId: reply_id, report_reason, reported_by: userId }))
		}

		setReporting(false)

		Alert.alert('Report Submitted', 'Thank you for your report. We will review it shortly.', [
			{ text: 'OK' },
		])
	}

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={onClose}
				contentContainerStyle={[
					styles.modalContainer,
					{ backgroundColor: theme.colors.background },
				]}
				style={styles.modal}>
				<Text
					style={[styles.title, { color: theme.colors.typography }]}>{`Report ${reportType}`}</Text>
				<ScrollView showsVerticalScrollIndicator={false}>
					{reasons.map((reason) => (
						<View key={reason} style={styles.checkboxContainer}>
							<Checkbox
								status={selectedReasons[reason] ? 'checked' : 'unchecked'}
								onPress={() => toggleReason(reason)}
							/>
							<Text style={[styles.checkboxLabel, { color: theme.colors.typography }]}>
								{reason}
							</Text>
						</View>
					))}
					{selectedReasons['Other'] && (
						<TextInput
							placeholder="Please specify"
							autoCapitalize="words"
							autoCorrect
							cursorColor={theme.colors.primary[500]}
							maxLength={50}
							value={otherReason}
							onChangeText={setOtherReason}
							style={styles.input}
							placeholderTextColor={theme.colors.gray[400]}
						/>
					)}
				</ScrollView>

				<TouchableOpacity style={styles.submitButton} activeOpacity={0.8} onPress={handleSubmit}>
					<Text style={styles.submitButtonText}>Submit</Text>
				</TouchableOpacity>
			</Modal>
		</Portal>
	)
}

export default ReportModal

/**
 * Style sheet for the ReportModal component.
 */
const stylesheet = createStyleSheet({
	modal: {
		backgroundColor: 'rgba(0,0,0,0.8)',
	},
	modalContainer: {
		marginHorizontal: moderateScale(10),
		marginBottom: moderateScale(100),
		padding: moderateScale(10),
		borderRadius: moderateScale(5),
	},
	title: {
		fontFamily: 'SemiBold',
		fontSize: moderateScale(18),
		marginBottom: moderateScale(12),
		textAlign: 'center',
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: moderateScale(8),
	},
	checkboxLabel: {
		fontFamily: 'Regular',
		fontSize: moderateScale(14),
	},
	input: {
		padding: moderateScale(10),
		marginTop: moderateScale(8),
		borderWidth: 1,
		borderRadius: moderateScale(5),
		borderColor: Colors.primary[500],
		fontFamily: 'Regular',
		fontSize: moderateScale(14),
	},
	submitButton: {
		marginTop: moderateScale(16),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary[500],
		padding: moderateScale(10),
		borderRadius: moderateScale(5),
	},
	submitButtonText: {
		color: Colors.white,
		fontSize: moderateScale(16),
		fontFamily: 'SemiBold',
	},
})
