import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SchedulesScreen } from '../screens/SchedulesScreen';
import { ProfilesScreen } from '../screens/ProfilesScreen';
import { PrayerScheduleDetailScreen } from '../screens/PrayerScheduleDetailScreen';
import { AddCustomScheduleScreen } from '../screens/AddCustomScheduleScreen';
import { ProfileEditorScreen } from '../screens/ProfileEditorScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { TabBar } from './TabBar';
import type { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
      <Tab.Screen name="Profiles" component={ProfilesScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="PrayerScheduleDetail" component={PrayerScheduleDetailScreen} />
        <Stack.Screen name="AddCustomSchedule" component={AddCustomScheduleScreen} />
        <Stack.Screen name="ProfileEditor" component={ProfileEditorScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
