import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import * as Font from 'expo-font';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono';
import {
  Fraunces_400Regular,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import { useWalletStore } from './src/state/walletStore';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { colors } from './src/theme';

function AppContent() {
  const onboarded = useWalletStore((s) => s.onboarded);
  return onboarded ? <RootNavigator /> : <OnboardingScreen />;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      IBMPlexMono_400Regular,
      IBMPlexMono_500Medium,
      IBMPlexMono_600SemiBold,
      IBMPlexMono_700Bold,
      Fraunces_400Regular,
      Fraunces_600SemiBold,
    })
      .then(() => setFontsLoaded(true))
      .catch(() => setFontsLoaded(true));
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <AppContent />
    </>
  );
}
