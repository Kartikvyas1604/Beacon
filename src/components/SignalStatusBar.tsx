import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius, shadow } from '../theme';
import { ConnectivityStatus } from '../mocks/mockChain';

const STATUS_MAP: Record<ConnectivityStatus, { color: string; label: string; bg: string }> = {
  online: { color: colors.green, label: 'Online', bg: colors.greenDim },
  mesh: { color: colors.amber, label: 'Mesh', bg: colors.amberDim },
  frozen: { color: colors.red, label: 'Frozen', bg: colors.redDim },
};

interface Props {
  onPress?: () => void;
}

export function SignalStatusBar({ onPress }: Props) {
  const connectivity = useWalletStore((s) => s.connectivity);
  const hopCount = useWalletStore((s) => s.hopCount);
  const st = STATUS_MAP[connectivity];

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (connectivity === 'mesh') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1, false
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [connectivity, pulse]);

  const anim = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const hopText = connectivity === 'mesh' ? ` · ${hopCount} hop${hopCount !== 1 ? 's' : ''}` : '';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: st.bg }, shadow.card]}
      accessibilityRole="button"
      accessibilityLabel={`Network: ${st.label}${hopText}`}
    >
      <Animated.View style={[styles.inner, anim]}>
        <View style={[styles.dot, { backgroundColor: st.color }]} />
        <Text style={[styles.label, { color: st.color }]}>
          {st.label}{hopText}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
