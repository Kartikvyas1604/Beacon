import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSharedValue, withTiming, Easing, interpolate, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Svg, Circle } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  size?: number;
  duration?: number;
  label: string;
  onConfirm: () => void;
}

export function RadialConfirm({ size = 80, duration = 900, label, onConfirm }: Props) {
  const progress = useSharedValue(0);
  const [progressVal, setProgressVal] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);

  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;

  const triggerConfirm = useCallback(() => {
    setCompleted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm();
    setTimeout(() => setCompleted(false), 1500);
  }, [onConfirm]);

  const handlePressIn = useCallback(() => {
    progress.value = withTiming(1, {
      duration,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) {
        runOnJS(triggerConfirm)();
      }
    });

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgressVal(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, [duration, progress, triggerConfirm]);

  const handlePressOut = useCallback(() => {
    progress.value = withTiming(0, { duration: 200 });
    setProgressVal(0);
  }, [progress]);

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.hairline}
          strokeWidth={2}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={completed ? colors.online : colors.signal}
          strokeWidth={2}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progressVal)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={[
          styles.glow,
          { width: size, height: size, opacity: progressVal * 0.8 },
        ]}
      />
      <View style={styles.labelContainer}>
        <Text style={[styles.label, completed && { color: colors.online }]}>
          {completed ? '✓' : label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.signalGlow,
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.signal,
    textTransform: 'uppercase',
  },
});
