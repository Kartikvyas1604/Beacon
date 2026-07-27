import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing } from '../theme';
import { MeshPeer } from '../mocks/mockChain';

interface Props {
  peer: MeshPeer;
}

export function RadarPeerView({ peer }: Props) {
  const dot = useSharedValue(0.5);

  useEffect(() => {
    dot.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, [dot]);

  const anim = useAnimatedStyle(() => ({ opacity: dot.value }));

  function since(d: Date): string {
    const m = Math.floor((Date.now() - d.getTime()) / 60000);
    if (m < 1) return 'now';
    if (m < 60) return `${m}m`;
    return `${Math.floor(m / 60)}h`;
  }

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.dot, anim]} />
      <View style={styles.info}>
        <Text style={styles.name}>{peer.name}</Text>
        <Text style={styles.meta}>
          {peer.hops} hop{peer.hops !== 1 ? 's' : ''} · {since(peer.lastSeen)} ago
        </Text>
      </View>
      <View style={styles.signal}>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${peer.signalStrength * 100}%` }]} />
        </View>
        <Text style={styles.signalText}>{Math.round(peer.signalStrength * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.amber,
  },
  info: { flex: 1 },
  name: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
    color: colors.textPrimary,
  },
  meta: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  signal: { alignItems: 'flex-end', gap: 3 },
  barBg: {
    width: 56,
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.amber,
    borderRadius: 1.5,
  },
  signalText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: colors.textMuted,
  },
});
