import React from 'react';
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
  const dotOpacity = useSharedValue(0.5);

  React.useEffect(() => {
    dotOpacity.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [dotOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  function timeSince(date: Date): string {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'NOW';
    if (mins < 60) return `${mins}M`;
    return `${Math.floor(mins / 60)}H`;
  }

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.dot, animatedStyle]} />
      <View style={styles.info}>
        <Text style={styles.name}>{peer.name}</Text>
        <Text style={styles.meta}>
          {peer.hops} HOP{peer.hops !== 1 ? 'S' : ''} · {timeSince(peer.lastSeen)} AGO
        </Text>
      </View>
      <View style={styles.signalContainer}>
        <View style={styles.signalBarBg}>
          <View
            style={[
              styles.signalBarFill,
              { width: `${peer.signalStrength * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.signalText}>
          {Math.round(peer.signalStrength * 100)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mesh,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
    color: colors.textPrimary,
  },
  meta: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: colors.textFaint,
    marginTop: 1,
  },
  signalContainer: {
    alignItems: 'flex-end',
    gap: 3,
  },
  signalBarBg: {
    width: 60,
    height: 3,
    backgroundColor: colors.hairline,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  signalBarFill: {
    height: '100%',
    backgroundColor: colors.mesh,
    borderRadius: 1.5,
  },
  signalText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: colors.textFaint,
  },
});
