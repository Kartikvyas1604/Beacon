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
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.indicator, animatedStyle]} />
      <View style={styles.textGroup}>
        <Text style={styles.title}>MESH ACTIVE</Text>
        <Text style={styles.subtitle}>
          {peerCount} PEERS · {hopCount} HOP{hopCount !== 1 ? 'S' : ''} TO CONNECTIVITY
        </Text>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>→</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mesh + '12',
    borderWidth: 1,
    borderColor: colors.mesh + '30',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mesh,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.mesh,
  },
  subtitle: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: colors.textFaint,
    marginTop: 2,
  },
  chevron: {
    padding: spacing.xs,
  },
  chevronText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 14,
    color: colors.mesh,
  },
});
