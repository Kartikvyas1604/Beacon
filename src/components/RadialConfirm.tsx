import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Svg, Circle } from 'react-native-svg';
import { colors, spacing, radius } from '../theme';

interface Props {
  size?: number;
  duration?: number;
  label: string;
  onConfirm: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function RadialConfirm({ size = 80, duration = 900, label, onConfirm }: Props) {
  const progress = useSharedValue(0);
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
  }, [duration, progress, triggerConfirm]);

  const handlePressOut = useCallback(() => {
    progress.value = withTiming(0, { duration: 200 });
  }, [progress]);

  const animatedStroke = useAnimatedStyle(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 1], [circumference, 0]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.3, 0.8]),
  }));

  return (
    <Animated.View
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
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={completed ? colors.online : colors.signal}
          strokeWidth={2}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedStroke}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Animated.View style={[styles.glow, { width: size, height: size }, glowStyle]} />
      <View style={styles.labelContainer}>
        <Text style={[styles.label, completed && { color: colors.online }]}>
          {completed ? '✓' : label}
        </Text>
      </View>
    </Animated.View>
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
