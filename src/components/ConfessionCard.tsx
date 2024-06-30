import { PROFILE_AVATARS } from '@/constants'
import { formatRelativeTime } from '@/utils/timeUtils'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Text, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ConfessionCard = ({ item }: any) => {
	const { theme, styles } = useStyles(stylesheet)
	const { id, displayName, gender, age, favorite, likes, comments, confession, type, createdAt } =
		item

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				paddingHorizontal: moderateScale(15),
				paddingVertical: moderateScale(10),
				marginHorizontal: moderateScale(10),
				marginTop: moderateScale(5),
				borderRadius: moderateScale(10),
			}}>
			{/* Confession Header */}
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				{/* Confessed User */}
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
					<View
						style={{
							width: moderateScale(40),
							aspectRatio: 1,
							borderRadius: moderateScale(25),
							overflow: 'hidden',
						}}>
						<Image
							source={{ uri: PROFILE_AVATARS[id] }}
							style={{ width: '100%', height: '100%' }}
							contentFit="cover"
							transition={500}
						/>
					</View>
					<View>
						<Text
							style={{
								fontFamily: 'Medium',
								fontSize: moderateScale(14),
								color: theme.colors.typography,
							}}>
							{displayName}
						</Text>
						<Text
							style={{
								fontFamily: 'Medium',
								fontSize: moderateScale(11),
								color: theme.colors.typography,
							}}>
							{age}.{gender}
						</Text>
					</View>
				</View>
				<TouchableOpacity>
					<AntDesign
						name={favorite ? 'heart' : 'hearto'}
						size={24}
						color={favorite ? theme.colors.primary[500] : theme.colors.gray[400]}
					/>
				</TouchableOpacity>
			</View>

			{/* Confession Body */}
			<View style={{ marginVertical: moderateScale(10) }}>
				<View
					style={{
						backgroundColor: theme.colors.primary[500],
						alignSelf: 'flex-start',
						paddingHorizontal: moderateScale(10),
						borderRadius: moderateScale(20),
						marginBottom: moderateScale(10),
						opacity: 0.7,
					}}>
					<Text
						style={{
							fontFamily: 'Italic',
							fontSize: moderateScale(10),
							color: theme.colors.white,
							textAlign: 'justify',
						}}
						numberOfLines={5}>
						#{type}
					</Text>
				</View>
				<Text
					style={{
						fontFamily: 'Medium',
						fontSize: moderateScale(13),
						color: theme.colors.typography,
						textAlign: 'justify',
					}}
					numberOfLines={5}>
					{confession}
				</Text>
			</View>
			{/* Time */}
			<View style={{ marginBottom: moderateScale(10) }}>
				<Text
					style={{
						fontFamily: 'Medium',
						fontSize: moderateScale(12),
						color: theme.colors.gray[400],
					}}>
					{formatRelativeTime(createdAt)}
				</Text>
			</View>
			{/* Confession Footer */}
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
					<Feather name="chevrons-up" size={26} color={theme.colors.gray[400]} />
					<Text
						style={{
							fontFamily: 'Medium',
							fontSize: moderateScale(16),
							color: theme.colors.gray[400],
							textAlign: 'justify',
						}}
						numberOfLines={5}>
						{likes}
					</Text>
					<Feather name="chevrons-down" size={26} color={theme.colors.gray[400]} />
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(20) }}>
					<Ionicons name="chatbox-ellipses-outline" size={26} color={theme.colors.gray[400]} />
					<Text
						style={{
							fontFamily: 'Medium',
							fontSize: moderateScale(16),
							color: theme.colors.gray[400],
							textAlign: 'justify',
						}}
						numberOfLines={5}>
						{comments}
					</Text>
					<Ionicons name="share-social-outline" size={26} color={theme.colors.gray[400]} />
				</View>
			</View>
		</View>
	)
}

export default ConfessionCard

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
	},
})
