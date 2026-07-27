import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing, radius } from '../theme';

interface Props {
  hopCount: number;
  peerCount: number;
}

export function MeshBanner({ hopCount, peerCount }: Props) {
  const pulse = useSharedValue(0.6);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, [pulse]);

  const anim = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, anim]} />
      <View style={styles.textGroup}>
        <Text style={styles.title}>Relaying via mesh</Text>
        <Text style={styles.sub}>
          {peerCount} peer{peerCount !== 1 ? 's' : ''} · {hopCount} hop{hopCount !== 1 ? 's' : ''} to connectivity
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.amberDim,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber,
  },
  textGroup: { flex: 1 },
  title: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
    color: colors.amber,
  },
  sub: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
});
