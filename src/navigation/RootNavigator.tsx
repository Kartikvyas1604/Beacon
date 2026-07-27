import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SendScreen from '../screens/SendScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BrowserScreen from '../screens/BrowserScreen';
import AssetsScreen from '../screens/AssetsScreen';
import SwapScreen from '../screens/SwapScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ContactsScreen from '../screens/ContactsScreen';
import FiatScreen from '../screens/FiatScreen';
import MeshStatusScreen from '../screens/MeshStatusScreen';
import FreezeScreen from '../screens/FreezeScreen';
import AuditLogScreen from '../screens/AuditLogScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '⬡',
  Assets: '◧',
  Swap: '⇄',
  Browser: '◎',
  Settings: '≡',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={tabStyles.wrap}>
      <Text style={[tabStyles.icon, focused && { color: colors.accent }]}>
        {TAB_ICONS[name] || '○'}
      </Text>
      {focused && <View style={tabStyles.indicator} />}
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarStyle: tabStyles.bar,
        tabBarShowLabel: false,
        tabBarAllowFontScaling: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Assets" component={AssetsScreen} />
      <Tab.Screen name="Swap" component={SwapScreen} />
      <Tab.Screen name="Browser" component={BrowserScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    height: 60,
    paddingTop: 8,
    paddingBottom: 8,
  },
  wrap: { alignItems: 'center', gap: 4 },
  icon: { fontSize: 20, color: colors.textMuted },
  indicator: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.accent,
  },
});

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="Receive" component={ReceiveScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Fiat" component={FiatScreen} />
        <Stack.Screen name="Mesh" component={MeshStatusScreen} />
        <Stack.Screen name="Freeze" component={FreezeScreen} />
        <Stack.Screen name="AuditLog" component={AuditLogScreen} />
        <Stack.Screen name="AddTrustline" component={AssetsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
