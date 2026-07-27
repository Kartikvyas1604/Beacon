import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Svg, Circle } from 'react-native-svg';
import { colors, spacing, radius } from '../theme';

interface Props {
  size?: number;
  duration?: number;
  label: string;
  onConfirm: () => void;
}

export function RadialConfirm({ size = 72, duration = 900, label, onConfirm }: Props) {
  const [progress, setProgress] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;

  const triggerConfirm = useCallback(() => {
    setCompleted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm();
    setTimeout(() => setCompleted(false), 1500);
  }, [onConfirm]);

  const handlePressIn = useCallback(() => {
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else triggerConfirm();
    };
    requestAnimationFrame(tick);
  }, [duration, triggerConfirm]);

  const handlePressOut = useCallback(() => {
    setProgress(0);
  }, []);

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={r} stroke={colors.border} strokeWidth={2} fill="none" />
        <Circle
          cx={size/2} cy={size/2} r={r}
          stroke={completed ? colors.green : colors.accent}
          strokeWidth={2.5} fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </Svg>
      <View style={styles.labelWrap}>
        <Text style={[styles.label, completed && { color: colors.green }]}>
          {completed ? '✓' : label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  labelWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1,
    color: colors.accent,
    textTransform: 'uppercase',
  },
});
