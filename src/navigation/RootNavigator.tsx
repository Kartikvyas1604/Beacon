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
import MeshStatusScreen from '../screens/MeshStatusScreen';
import FreezeScreen from '../screens/FreezeScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '⬡',
  Send: '↗',
  Receive: '↙',
  Settings: '⚙',
  Browser: '◎',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={tabStyles.wrap}>
      <Text style={[tabStyles.icon, focused && { color: colors.accent }]}>
        {TAB_ICONS[name] || '○'}
      </Text>
      <Text style={[tabStyles.label, focused && { color: colors.textPrimary }]}>
        {name}
      </Text>
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
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Send" component={SendScreen} />
      <Tab.Screen name="Receive" component={ReceiveScreen} />
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
    height: 68,
    paddingTop: 8,
    paddingBottom: 10,
  },
  wrap: { alignItems: 'center', gap: 3 },
  icon: { fontSize: 18, color: colors.textMuted },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: colors.textMuted,
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
        <Stack.Screen name="Mesh" component={MeshStatusScreen} />
        <Stack.Screen name="Freeze" component={FreezeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
