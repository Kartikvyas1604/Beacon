import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import * as Font from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
} from '@expo-google-fonts/jetbrains-mono';
import { useWalletStore } from './src/state/walletStore';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { colors } from './src/theme';

function AppContent() {
  const onboarded = useWalletStore((s) => s.onboarded);
  return onboarded ? <RootNavigator /> : <OnboardingScreen />;
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
      JetBrainsMono_400Regular,
    }).finally(() => setReady(true));
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <AppContent />
    </>
  );
}
