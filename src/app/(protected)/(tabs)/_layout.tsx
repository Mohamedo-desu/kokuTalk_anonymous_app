import { Fonts } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles, withUnistyles } from 'react-native-unistyles';
import { api } from '../../../../convex/_generated/api';

const TabsUnistyle = withUnistyles(Tabs, theme => ({
  screenOptions: {
    tabBarShowLabel: false,
    tabBarActiveTintColor: theme.Colors.primary,
    tabBarInactiveTintColor: theme.Colors.gray[500],
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
      backgroundColor: theme.Colors.background,
      borderTopWidth: 2,
      borderColor: theme.Colors.primary,
    },
    tabBarLabelStyle: {
      fontSize: 13,
      fontFamily: Fonts.Regular,
    },
    tabBarButton: props => <Pressable {...props} android_ripple={null} />,
  },
}));

const TabsLayout = () => {
  const { theme } = useUnistyles();
  const unreadNotifications = useQuery(api.notifications.getUnreadCount);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.Colors.primary,
        tabBarInactiveTintColor: theme.Colors.gray[400],
        tabBarStyle: {
          position: 'absolute' as const,
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: theme.Colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.Colors.gray[200],
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: theme.Colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: 'Inter',
          fontSize: 18,
          fontWeight: '600',
        },
        headerLeft: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/(protected)/(tabs)/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.Colors.typography} />
            {unreadNotifications && unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton}>
            <Image source={require('@/assets/icon.png')} style={styles.logo} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add_confession"
        options={{
          title: 'Add Confession',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create((theme, rt) => ({
  fabContainer: {
    backgroundColor: theme.Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 100,
    top: -25,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: theme.Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
}));
