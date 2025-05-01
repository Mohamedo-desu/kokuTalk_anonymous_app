import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

// Constants
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { DEVICE_WIDTH } from '@/utils';
import { StyleSheet } from 'react-native-unistyles';

const CustomTabBar: FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const { routes, index: activeIndex } = state;

  return (
    <Animated.View style={styles.container}>
      <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.fabContainer}>
        <TouchableOpacity
          onPress={() => router.navigate('/(protected)/add_confession')}
          style={styles.fabButton}
        >
          <Ionicons name="add-sharp" size={20} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tabWrapper}>
        {routes.map((route, i) => {
          const focused = activeIndex === i;
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const activeColor = options.tabBarActiveTintColor || Colors.primary;
          const inactiveColor = options.tabBarInactiveTintColor!;
          const tintColor = focused ? activeColor : inactiveColor;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
            >
              <Text style={styles.labelText(tintColor)}>
                {typeof label === 'string' ? label : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.Colors.background,
    borderTopWidth: 2,
    borderColor: theme.Colors.primary,
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  tabItem: {
    flex: 1,
    height: 30,
    marginBottom: rt.insets.bottom,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.Regular,
  },
  labelText: (color: string) => ({
    color,
    fontSize: 13,
    fontFamily: Fonts.Regular,
  }),
  fabContainer: {
    backgroundColor: theme.Colors.primary,
    position: 'absolute',
    top: -25,
    left: DEVICE_WIDTH / 2 - 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 100,
  },
  fabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
