import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Svg, Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { RadarPeerView, BackgroundTexture } from '../components';

function RadarSweep() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%">
        <Line
          x1="50%"
          y1="50%"
          x2="50%"
          y2="0"
          stroke={colors.signal}
          strokeWidth={1.5}
          opacity={0.6}
        />
      </Svg>
    </Animated.View>
  );
}

export default function MeshStatusScreen() {
  const meshPeers = useWalletStore((s) => s.meshPeers);
  const connectivity = useWalletStore((s) => s.connectivity);
  const hopCount = useWalletStore((s) => s.hopCount);

  const radarSize = 260;
  const center = radarSize / 2;

  const ringOpacities = [0.15, 0.1, 0.07, 0.04];

  const fadeIn = useSharedValue(0);
  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
  }, [fadeIn]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>MESH STATUS</Text>

        <Animated.View style={[styles.radarContainer, containerStyle]}>
          <View style={[styles.radar, { width: radarSize, height: radarSize }]}>
            <Svg width={radarSize} height={radarSize}>
              <Defs>
                <RadialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={colors.signal} stopOpacity={0.08} />
                  <Stop offset="100%" stopColor={colors.signal} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              {ringOpacities.map((op, i) => (
                <Circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={(i + 1) * (center / 4)}
                  stroke={colors.signal}
                  strokeWidth={0.5}
                  fill="none"
                  opacity={op}
                />
              ))}
              <Circle
                cx={center}
                cy={center}
                r={center}
                stroke={colors.signal}
                strokeWidth={1}
                fill="none"
                opacity={0.2}
              />
              <Circle cx={center} cy={center} r={3} fill={colors.signal} />
              {meshPeers.map((peer) => {
                const angle =
                  (meshPeers.indexOf(peer) / meshPeers.length) * Math.PI * 2 -
                  Math.PI / 2;
                const dist = (peer.hops / 3) * (center - 20) + 20;
                const px = center + Math.cos(angle) * dist;
                const py = center + Math.sin(angle) * dist;
                return (
                  <React.Fragment key={peer.id}>
                    <Line
                      x1={center}
                      y1={center}
                      x2={px}
                      y2={py}
                      stroke={colors.mesh}
                      strokeWidth={0.5}
                      opacity={0.3}
                      strokeDasharray="4 4"
                    />
                    <Circle
                      cx={px}
                      cy={py}
                      r={4}
                      fill={colors.mesh}
                      opacity={peer.signalStrength}
                    />
                  </React.Fragment>
                );
              })}
            </Svg>
            <RadarSweep />
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>STATUS</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: connectivity === 'online' ? colors.online : colors.mesh },
                ]}
              >
                {connectivity.toUpperCase()}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>HOPS</Text>
              <Text style={[styles.statusValue, { color: colors.mesh }]}>
                {hopCount}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>PEERS</Text>
              <Text style={styles.statusValue}>{meshPeers.length}</Text>
            </View>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>CONNECTED PEERS</Text>
        <View style={styles.peerList}>
          {meshPeers
            .sort((a, b) => a.hops - b.hops)
            .map((peer) => (
              <RadarPeerView key={peer.id} peer={peer} />
            ))}
        </View>

        <Text style={styles.sectionTitle}>PENDING RELAYS</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyGlyph}>○</Text>
          <Text style={styles.emptyText}>NO PENDING RELAYS</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: spacing.xl,
    paddingTop: 60,
    alignItems: 'center',
    gap: spacing.xl,
  },
  title: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
    alignSelf: 'flex-start',
  },
  radarContainer: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  radar: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.signal + '20',
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgElevated,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.xxxl,
  },
  statusItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  statusValue: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
    alignSelf: 'flex-start',
  },
  peerList: {
    width: '100%',
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    width: '100%',
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
  },
  emptyGlyph: {
    fontSize: 20,
    color: colors.textFaint,
  },
  emptyText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.textFaint,
  },
});
