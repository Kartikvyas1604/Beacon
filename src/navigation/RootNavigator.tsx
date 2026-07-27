import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import SendScreen from '../screens/SendScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import MeshStatusScreen from '../screens/MeshStatusScreen';
import LimitsScreen from '../screens/LimitsScreen';
import FreezeScreen from '../screens/FreezeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const glyphs: Record<string, string> = {
    Home: '◉',
    Mesh: '◎',
    Limits: '⊞',
    Freeze: '⊘',
  };
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text
        style={{
          fontFamily: 'IBMPlexMono_500Medium',
          fontSize: 16,
          color: focused ? colors.signal : colors.textFaint,
        }}
      >
        {glyphs[label] || '○'}
      </Text>
      <Text
        style={{
          fontFamily: 'IBMPlexMono_500Medium',
          fontSize: 8,
          letterSpacing: 1,
          color: focused ? colors.signal : colors.textFaint,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.hairline,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Mesh"
        component={MeshStatusScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Mesh" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Limits"
        component={LimitsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Limits" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Freeze"
        component={FreezeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Freeze" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.signal,
          background: colors.bg,
          card: colors.bgElevated,
          text: colors.textPrimary,
          border: colors.hairline,
          notification: colors.signal,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="Receive" component={ReceiveScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
