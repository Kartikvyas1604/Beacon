import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SendScreen from '../screens/SendScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import MeshStatusScreen from '../screens/MeshStatusScreen';
import LimitsScreen from '../screens/LimitsScreen';
import FreezeScreen from '../screens/FreezeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { colors, radius } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS: any = {
  headerShown: false,
  animation: 'slide_from_bottom' as const,
  contentStyle: { backgroundColor: colors.bg },
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = { Home: '◉', Mesh: '◎', Limits: '⟐' };
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && { color: colors.accent }]}>
        {icons[label] || '○'}
      </Text>
      <Text style={[styles.tabLabel, focused && { color: colors.textPrimary }]}>
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mesh" component={MeshStatusScreen} />
      <Tab.Screen name="Limits" component={LimitsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="Receive" component={ReceiveScreen} />
        <Stack.Screen name="Freeze" component={FreezeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg,
    borderTopWidth: 0,
    elevation: 0,
    height: 64,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabItem: { alignItems: 'center', gap: 3 },
  tabIcon: { fontSize: 16, color: colors.textMuted },
  tabLabel: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 10,
    letterSpacing: 0.5, color: colors.textMuted,
  },
});
