import { PLACE_HOLDER } from '@/constants/placeHolders'
import useIsAnonymous from '@/hooks/useIsAnonymous'
import { removePushToken } from '@/services/userActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { auth } from '@/utils/firebase'
import { deleteStoredValues } from '@/utils/storageUtils'
import { Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'

import Toast from 'react-native-toast-message'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import Loader from './Loader'

/**
 * Renders the content of the drawer
 * @param props - The props for the drawer content
 * @returns The JSX element for the drawer content
 */
const DrawerContent = (props: DrawerContentComponentProps): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	const insets = useSafeAreaInsets()
	const isAnonymous = useIsAnonymous()

	const { id, photo_url, display_name, age, gender } = useAuthStoreSelectors.use.currentUser()
	const [loading, setLoading] = useState(false)

	const logOut = useAuthStoreSelectors.use.logOut()

	const handleLogOut = async () => {
		try {
			if (!isAnonymous) {
				Alert.alert('Log Out', 'Are you sure you want to log out?', [
					{
						text: 'Cancel',
						style: 'cancel',
					},
					{
						text: 'Yes',
						onPress: async () => {
							setLoading(true)
							await removePushToken(id)
							await auth.signOut()
							setLoading(false)
							logOut()
						},
					},
				])
			} else {
				await deleteStoredValues(['isAnonymous'])
				logOut()
			}
		} catch (error) {
			setLoading(false)
			Toast.show({
				type: 'danger',
				text1: `${error}`,
			})
		}
	}
	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} {...props}>
			<LinearGradient
				colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
				style={styles.linearGradient}>
				<View
					style={[
						styles.header,
						{ paddingTop: insets.top, backgroundColor: theme.colors.primary[500] },
					]}>
					<View>
						<Image
							source={{ uri: photo_url || PLACE_HOLDER }}
							style={styles.profileImage}
							resizeMode="cover"
						/>
					</View>
					<Text style={styles.display_name}>{display_name || 'Anonymous'}</Text>
					{age && gender && (
						<Text style={styles.ageGender}>
							{age}.{gender.charAt(0)}
						</Text>
					)}
				</View>
				<View style={[styles.content, { paddingBottom: insets.bottom }]}>
					<TouchableOpacity
						disabled={isAnonymous}
						activeOpacity={0.8}
						style={styles.drawerItem}
						onPress={() => router.navigate('/(main)/my_confessions')}>
						<View style={styles.drawerIconContainer}>
							<MaterialCommunityIcons
								name="account-voice"
								style={[
									styles.drawerItemIcon,
									{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
								]}
							/>
						</View>
						<Text
							style={[
								styles.drawerItemLabel,
								{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
							]}>
							My confessions
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						disabled={isAnonymous}
						activeOpacity={0.8}
						style={styles.drawerItem}
						onPress={() => router.navigate('/(main)/saved_confessions')}>
						<View style={styles.drawerIconContainer}>
							<Fontisto
								name="favorite"
								style={[
									styles.drawerItemIcon,
									{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
								]}
							/>
						</View>
						<Text
							style={[
								styles.drawerItemLabel,
								{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
							]}>
							Saved confessions
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						disabled={isAnonymous}
						activeOpacity={0.8}
						style={styles.drawerItem}
						onPress={() => router.navigate('/(main)/manage_settings')}>
						<View style={styles.drawerIconContainer}>
							<MaterialCommunityIcons
								name="account-cog"
								style={[
									styles.drawerItemIcon,
									{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
								]}
							/>
						</View>
						<Text
							style={[
								styles.drawerItemLabel,
								{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
							]}>
							Manage settings
						</Text>
					</TouchableOpacity>
					<TouchableOpacity disabled={isAnonymous} activeOpacity={0.8} style={styles.drawerItem}>
						<View style={styles.drawerIconContainer}>
							<MaterialCommunityIcons
								name="book-open"
								style={[
									styles.drawerItemIcon,
									{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
								]}
							/>
						</View>
						<Text
							style={[
								styles.drawerItemLabel,
								{ color: isAnonymous ? theme.colors.gray[500] : theme.colors.white },
							]}>
							Privacy & Policy
						</Text>
					</TouchableOpacity>
					<View style={{ flex: 1, flexGrow: 1 }} />
					<View style={[styles.footer, { paddingVertical: insets.top }]}>
						<TouchableOpacity
							activeOpacity={0.8}
							style={styles.logoutButton}
							onPress={handleLogOut}>
							<View style={styles.drawerIconContainer}>
								<Ionicons
									name="log-out"
									style={[
										styles.drawerItemIcon,
										{ color: 'rgba(255,255,255,.2)', fontSize: moderateScale(28) },
									]}
								/>
							</View>
							<Text style={[styles.drawerItemLabel, { color: 'rgba(255,255,255,.2)' }]}>
								{isAnonymous ? 'Login' : 'Logout'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>

			<Loader visible={loading} text={isAnonymous ? '' : 'Logging out...'} />
		</ScrollView>
	)
}

export default DrawerContent

const stylesheet = createStyleSheet({
	linearGradient: {
		flex: 1,
		paddingBottom: moderateScale(10),
	},
	header: {
		alignSelf: 'center',
		paddingVertical: moderateScale(10),
		alignItems: 'center',
		width: '100%',
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: moderateScale(50),
	},
	display_name: {
		fontFamily: 'Medium',
		fontSize: moderateScale(15),
		color: 'rgba(255,255,255,.4)',
	},
	ageGender: {
		fontFamily: 'Medium',
		fontSize: moderateScale(15),
		color: 'rgba(255,255,255,.4)',
	},
	content: {
		flex: 1,
	},
	drawerItem: {
		flexDirection: 'row',
		paddingHorizontal: moderateScale(15),
		paddingVertical: moderateScale(20),
		alignItems: 'center',
	},
	drawerIconContainer: {
		width: moderateScale(40),
	},
	drawerItemIcon: {
		fontSize: moderateScale(20),
	},
	drawerItemLabel: {
		fontFamily: 'Regular',
		fontSize: moderateScale(16),
		textAlign: 'left',
		alignSelf: 'flex-start',
	},
	footer: {
		borderTopWidth: 2,
		borderTopColor: 'rgba(255,255,255,.1)',
	},
	logoutButton: {
		flexDirection: 'row',
		paddingHorizontal: moderateScale(15),
		alignItems: 'center',
	},
})
