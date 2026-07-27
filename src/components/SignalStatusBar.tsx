import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useWalletStore } from '../state/walletStore';
import { colors } from '../theme';
import { ConnectivityStatus } from '../mocks/mockChain';

const STATUS_CONFIG: Record<
  ConnectivityStatus,
  { glyph: string; label: string; color: string; showHops: boolean }
> = {
  online: { glyph: '●', label: 'ONLINE', color: colors.online, showHops: false },
  mesh: { glyph: '◐', label: 'MESH', color: colors.mesh, showHops: true },
  frozen: { glyph: '●', label: 'FROZEN', color: colors.frozen, showHops: false },
};

interface Props {
  onPress?: () => void;
}

export function SignalStatusBar({ onPress }: Props) {
  const connectivity = useWalletStore((s) => s.connectivity);
  const hopCount = useWalletStore((s) => s.hopCount);
  const config = STATUS_CONFIG[connectivity];

  const pulseOpacity = useSharedValue(1);

  React.useEffect(() => {
    if (connectivity === 'mesh') {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      pulseOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [connectivity, pulseOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const hopText = config.showHops
    ? ` · ${hopCount} HOP${hopCount !== 1 ? 'S' : ''}`
    : '';

  return (
    <Animated.View style={[styles.container, { borderColor: config.color + '30' }, animatedStyle]}>
      <View style={styles.inner}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.glyph, { color: config.color }]}>{config.glyph}</Text>
        <Text style={[styles.label, { color: config.color }]}>
          {config.label}
          {hopText}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  glyph: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
