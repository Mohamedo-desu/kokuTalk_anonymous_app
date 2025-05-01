import CustomTabBar from '@/components/tab/CustomTabBar';
import { Tabs } from 'expo-router';
import React from 'react';
import { withUnistyles } from 'react-native-unistyles';

const TabsUnistyle = withUnistyles(Tabs, theme => ({
  screenOptions: {
    tabBarActiveTintColor: theme.Colors.primary,
    tabBarInactiveTintColor: theme.Colors.gray[500],
    tabBarHideOnKeyboard: true,
  },
}));

const TabsLayout = () => {
  return (
    <TabsUnistyle
      initialRouteName="index"
      backBehavior="initialRoute"
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </TabsUnistyle>
  );
};

export default TabsLayout;
