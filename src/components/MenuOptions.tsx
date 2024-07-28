import { Ionicons } from '@expo/vector-icons'
import React, { memo, useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Menu } from 'react-native-paper'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

/**
 * Represents a menu item.
 */
interface MenuItem {
	icon: string
	onPress: () => void
	title: string
}

/**
 * Props for the MenuOptions component.
 */
interface MenuOptionsProps {
	menuItems: MenuItem[]
}

/**
 * Component that renders a menu with a list of menu items.
 */
const MenuOptions = memo(
	/**
	 * Renders the menu options component.
	 * @param {MenuOptionsProps} props - The props for the component.
	 * @returns {React.ReactElement} The rendered component.
	 */
	({ menuItems }: MenuOptionsProps) => {
		const { styles, theme } = useStyles(stylesheet)

		const [menuVisible, setMenuVisible] = useState(false)

		/**
		 * Toggles the visibility of the menu.
		 */
		const toggleMenu = useCallback(() => setMenuVisible((prev) => !prev), [])

		return (
			<Menu
				visible={menuVisible}
				onDismiss={toggleMenu}
				anchor={
					<TouchableOpacity activeOpacity={0.8} onPress={toggleMenu}>
						<Ionicons name={'ellipsis-vertical-sharp'} size={18} color={theme.colors.gray[400]} />
					</TouchableOpacity>
				}
				contentStyle={[styles.projectCardMenuContent, { backgroundColor: theme.colors.background }]}
				anchorPosition="bottom"
				keyboardShouldPersistTaps="handled"
				elevation={0}>
				{/* Render each menu item */}
				{menuItems.map(({ icon, onPress, title }, index) => (
					<Menu.Item
						key={title}
						trailingIcon={icon}
						titleStyle={[styles.title, { color: theme.colors.typography }]}
						rippleColor={theme.colors.background}
						onPress={() => {
							toggleMenu()
							onPress()
						}}
						title={title}
						style={styles.projectCardMenuIcon}
					/>
				))}
			</Menu>
		)
	},
	(prevProps, nextProps) => prevProps.menuItems === nextProps.menuItems,
)

export default MenuOptions

/**
 * Style sheet for the MenuOptions component.
 */
const stylesheet = createStyleSheet({
	projectCardMenuIcon: {
		height: moderateScale(25),
	},
	projectCardMenuContent: {
		right: '10%',
		top: '40%',
		borderRadius: moderateScale(0),
	},
	title: {
		fontSize: moderateScale(13),
		fontFamily: 'Regular',
	},
})
