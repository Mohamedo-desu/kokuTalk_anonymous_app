import { shortenNumber } from '@/utils/generalUtils'
import { Text, View, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const AnimatedHeader = ({
	item,
	style,
}: {
	item: {
		upVotes: number
		commentCount: number
		confession_text: string
		viewsCount: number
		sharesCount: number
		favCount: number
	}
	style: ViewStyle
}) => {
	const { theme, styles } = useStyles(stylesheet)
	const { confession_text, upVotes, commentCount, viewsCount, sharesCount, favCount } = item

	return (
		<Animated.View style={[styles.header, style, { backgroundColor: theme.colors.background }]}>
			<Text numberOfLines={1} style={[styles.confessionText, { color: theme.colors.typography }]}>
				{confession_text}
			</Text>
			<View style={styles.detailsCon}>
				<Text numberOfLines={1} style={[styles.detailText, { color: theme.colors.gray[300] }]}>
					{shortenNumber(upVotes)} upvotes
				</Text>
				<Text style={[styles.detailText, { color: theme.colors.gray[300] }]}>{`\u2022`}</Text>
				<Text numberOfLines={1} style={[styles.detailText, { color: theme.colors.gray[300] }]}>
					{shortenNumber(commentCount)} comments
				</Text>
				<Text style={[styles.detailText, { color: theme.colors.gray[300] }]}>{`\u2022`}</Text>
				<Text numberOfLines={1} style={[styles.detailText, { color: theme.colors.gray[300] }]}>
					{shortenNumber(sharesCount)} shares
				</Text>
				<Text style={[styles.detailText, { color: theme.colors.gray[300] }]}>{`\u2022`}</Text>
				<Text numberOfLines={1} style={[styles.detailText, { color: theme.colors.gray[300] }]}>
					{shortenNumber(favCount)} favorites
				</Text>
				<Text style={[styles.detailText, { color: theme.colors.gray[300] }]}>{`\u2022`}</Text>
				<Text numberOfLines={1} style={[styles.detailText, { color: theme.colors.gray[300] }]}>
					{shortenNumber(viewsCount)} views
				</Text>
			</View>
		</Animated.View>
	)
}

export default AnimatedHeader

const stylesheet = createStyleSheet({
	header: {
		position: 'absolute',
		top: 0,
		width: '100%',
		paddingHorizontal: moderateScale(15),
		zIndex: 100,
		overflow: 'hidden',
		elevation: 2,
	},
	detailsCon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	detailText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(12),
	},
	confessionText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(14),
		marginTop: moderateScale(5),
	},
})
