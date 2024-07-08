import { PLACE_HOLDER } from '@/constants/placeHolders'
import useIsAnonymous from '@/hooks/useIsAnonymous'
import { useAuthStoreSelectors } from '@/store/authStore'
import { deleteStoredValues } from '@/utils/storageUtils'
import { supabase } from '@/utils/supabase'
import { Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import Loader from './Loader'
import SelectAvatarModal from './SelectAvatarModal'

/**
 * Renders the content of the drawer
 * @param props - The props for the drawer content
 * @returns The JSX element for the drawer content
 */
const DrawerContent = (props: DrawerContentComponentProps): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	const insets = useSafeAreaInsets()
	const isAnonymous = useIsAnonymous()

	const [avatarModalVisible, setAvatarModalVisible] = useState(false)

	const { photoURL, displayName, age, gender } = useAuthStoreSelectors.use.currentUser()
	const [loading, setLoading] = useState(false)

	const logOut = useAuthStoreSelectors.use.logOut()

	const handleLogOut = async () => {
		try {
			setLoading(true)
			if (!isAnonymous) {
				let { error } = await supabase.auth.signOut()
				if (error) {
					throw new Error(error.message)
				}
			}
			await deleteStoredValues(['isAnonymous'])
			logOut()
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
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
					<TouchableOpacity disabled={isAnonymous} onPress={() => setAvatarModalVisible(true)}>
						<Image
							source={{ uri: photoURL || PLACE_HOLDER }}
							style={styles.profileImage}
							resizeMode="cover"
						/>
					</TouchableOpacity>
					<Text style={styles.displayName}>{displayName || 'Anonymous'}</Text>
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
							My Confessions
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
							Saved Confessions
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
								Log out
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
			<SelectAvatarModal
				visible={avatarModalVisible}
				onClose={() => setAvatarModalVisible(false)}
			/>
			<Loader visible={loading} text="Logging out..." />
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
		paddingVertical: moderateScale(20),
		gap: moderateScale(2),
		alignItems: 'center',
		width: '100%',
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: moderateScale(50),
	},
	displayName: {
		fontFamily: 'Medium',
		fontSize: moderateScale(18),
		color: 'rgba(255,255,255,.4)',
	},
	ageGender: {
		fontFamily: 'Medium',
		fontSize: moderateScale(16),
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
		fontSize: moderateScale(26),
	},
	drawerItemLabel: {
		fontFamily: 'Medium',
		fontSize: moderateScale(17),
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
