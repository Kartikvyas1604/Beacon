import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Svg, Circle } from 'react-native-svg';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { BackgroundTexture } from '../components';

export default function FreezeScreen() {
  const frozen = useWalletStore((s) => s.frozen);
  const setFrozen = useWalletStore((s) => s.setFrozen);
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  const size = 160;
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;

  const bgPulse = useSharedValue(1);

  React.useEffect(() => {
    if (frozen) {
      bgPulse.value = withSequence(
        withTiming(1.02, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [frozen, bgPulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgPulse.value }],
  }));

  const handlePressIn = useCallback(() => {
    setAnimating(true);
    let start = Date.now();
    const duration = 900;

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setAnimating(false);
        setProgress(0);
        Haptics.notificationAsync(
          frozen
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning
        );
        setFrozen(!frozen);
      }
    };
    requestAnimationFrame(tick);
  }, [frozen, setFrozen]);

  const handlePressOut = useCallback(() => {
    setAnimating(false);
    setProgress(0);
  }, []);

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <View style={styles.content}>
        <Text style={styles.title}>EMERGENCY FREEZE</Text>

        <Animated.View style={[styles.center, pulseStyle]}>
          {frozen ? (
            <View style={styles.frozenState}>
              <Text style={styles.frozenHeadline}>Wallet Frozen</Text>
              <Text style={styles.frozenSubtext}>
                ALL OUTGOING TRANSACTIONS ARE BLOCKED
              </Text>
            </View>
          ) : (
            <View style={styles.activeState}>
              <Text style={styles.activeHeadline}>ACTIVE</Text>
              <Text style={styles.activeSubtext}>
                YOUR WALLET IS OPERATIONAL
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.controlArea}>
          <Pressable
            style={styles.freezeBtn}
            onTouchStart={handlePressIn}
            onTouchEnd={handlePressOut}
            onTouchCancel={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel={frozen ? 'Unfreeze wallet' : 'Freeze wallet'}
          >
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={frozen ? colors.online : colors.frozen}
                strokeWidth={2}
                fill="none"
                opacity={0.3}
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={frozen ? colors.online : colors.frozen}
                strokeWidth={3}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={r - 20}
                stroke={frozen ? colors.online : colors.frozen}
                strokeWidth={1}
                fill="none"
                opacity={0.15}
                strokeDasharray="4 4"
              />
            </Svg>
            <View style={styles.btnLabel}>
              <Text
                style={[
                  styles.btnLabelText,
                  { color: frozen ? colors.online : colors.frozen },
                ]}
              >
                {frozen ? 'UNFREEZE' : 'FREEZE'}
              </Text>
              <Text style={styles.btnHint}>HOLD 1 SECOND</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.statusPanel}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>STATUS</Text>
            <Text
              style={[
                styles.statusValue,
                { color: frozen ? colors.frozen : colors.online },
              ]}
            >
              {frozen ? 'FROZEN' : 'ACTIVE'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>OUTGOING TX</Text>
            <Text style={[styles.statusValue, { color: frozen ? colors.frozen : colors.online }]}>
              {frozen ? 'BLOCKED' : 'ALLOWED'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>INCOMING TX</Text>
            <Text style={[styles.statusValue, { color: colors.online }]}>ALLOWED</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1,
    padding: spacing.xl,
    paddingTop: 60,
    alignItems: 'center',
    gap: spacing.xxl,
  },
  title: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
    alignSelf: 'flex-start',
  },
  center: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  frozenState: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  frozenHeadline: {
    fontFamily: 'Fraunces_500Medium_Italic',
    fontSize: 40,
    color: colors.frozen,
    letterSpacing: -1,
  },
  frozenSubtext: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.frozen,
    opacity: 0.7,
  },
  activeState: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  activeHeadline: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 14,
    letterSpacing: 2,
    color: colors.online,
  },
  activeSubtext: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textFaint,
  },
  controlArea: {
    alignItems: 'center',
  },
  freezeBtn: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  btnLabelText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 14,
    letterSpacing: 2,
  },
  btnHint: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 8,
    letterSpacing: 1,
    color: colors.textFaint,
  },
  statusPanel: {
    width: '100%',
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  statusLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textFaint,
  },
  statusValue: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1,
  },
});
