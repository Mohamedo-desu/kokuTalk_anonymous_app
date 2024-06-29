import { placeHolder } from '@/constants'
import { Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

/**
 * Renders the content of the drawer
 * @param props - The props for the drawer content
 * @returns The JSX element for the drawer content
 */
const DrawerContent = (props: DrawerContentComponentProps): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	const insets = useSafeAreaInsets()

	return (
		<DrawerContentScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} {...props}>
			<LinearGradient
				colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
				style={{
					paddingTop: insets.top,
					paddingBottom: moderateScale(10),
					justifyContent: 'center',
					alignItems: 'center',
					gap: moderateScale(10),
				}}>
				<Image
					source={{ uri: placeHolder }}
					style={{ width: 100, height: 100, borderRadius: moderateScale(50) }}
					contentFit="cover"
					transition={500}
				/>
				<Text
					style={{
						fontFamily: 'Medium',
						fontSize: moderateScale(16),
						color: 'rgba(255,255,255,.3)',
					}}>
					Anonymous
				</Text>
			</LinearGradient>
			<View
				style={{
					backgroundColor: theme.colors.primary[300],
					flex: 1,
					paddingBottom: insets.bottom,
				}}>
				<TouchableOpacity activeOpacity={0.8} style={styles.drawerItem}>
					<View style={{ width: moderateScale(40) }}>
						<MaterialCommunityIcons
							name="account-voice"
							style={[styles.drawerItemIcon, { color: theme.colors.primary[400] }]}
						/>
					</View>

					<Text style={[styles.drawerItemLabel, { color: theme.colors.primary[400] }]}>
						My Confessions
					</Text>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} style={styles.drawerItem}>
					<View style={{ width: moderateScale(40) }}>
						<Fontisto
							name="favorite"
							style={[styles.drawerItemIcon, { color: theme.colors.primary[400] }]}
						/>
					</View>

					<Text style={[styles.drawerItemLabel, { color: theme.colors.primary[400] }]}>
						Saved Confessions
					</Text>
				</TouchableOpacity>
				<View style={{ flex: 1, flexGrow: 1 }} />
				<View
					style={{
						borderTopWidth: 2,
						paddingVertical: insets.top,
						borderTopColor: 'rgba(255,255,255,.1)',
					}}>
					<TouchableOpacity
						activeOpacity={0.8}
						style={{
							flexDirection: 'row',
							paddingHorizontal: moderateScale(15),
							alignItems: 'center',
						}}>
						<View style={{ width: moderateScale(40) }}>
							<Ionicons
								name="log-out"
								style={[
									styles.drawerItemIcon,
									{ color: 'rgba(255,255,255,.2)', fontSize: moderateScale(28) },
								]}
							/>
						</View>

						<Text style={[styles.drawerItemLabel, { color: 'rgba(255,255,255,.2)' }]}>Log out</Text>
					</TouchableOpacity>
				</View>
			</View>
			<DrawerItemList {...props} />
		</DrawerContentScrollView>
	)
}

export default DrawerContent

const stylesheet = createStyleSheet({
	drawerItemLabel: {
		fontFamily: 'Medium',
		fontSize: moderateScale(17),
		textAlign: 'left',
		alignSelf: 'flex-start',
	},
	drawerItemIcon: {
		fontSize: moderateScale(26),
	},
	drawerItem: {
		flexDirection: 'row',
		paddingHorizontal: moderateScale(15),
		paddingVertical: moderateScale(20),
		alignItems: 'center',
	},
})
