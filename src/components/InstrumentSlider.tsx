import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Svg, Circle, Line } from 'react-native-svg';
import { colors, spacing } from '../theme';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

const TICK_COUNT = 20;

export function InstrumentSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: Props) {
  const width = 280;
  const height = 120;
  const cx = width / 2;
  const cy = height - 10;
  const radius = 90;
  const startAngle = -Math.PI;
  const endAngle = 0;
  const angleRange = endAngle - startAngle;

  const normalized = (value - min) / (max - min);
  const currentAngle = startAngle + normalized * angleRange;

  const rotation = useSharedValue(normalized);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const dx = e.x - cx;
      const dy = e.y - cy;
      let angle = Math.atan2(dy, dx);
      if (angle < startAngle) angle = startAngle;
      if (angle > endAngle) angle = endAngle;
      const norm = (angle - startAngle) / angleRange;
      rotation.value = Math.max(0, Math.min(1, norm));
    })
    .onEnd(() => {
      const snapped = Math.round(rotation.value * (max - min) / step) * step + min;
      const clamped = Math.max(min, Math.min(max, snapped));
      rotation.value = withSpring((clamped - min) / (max - min));
      Haptics.selectionAsync();
      onChange(clamped);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(rotation.value, [0, 1], [-90, 0])}deg` }],
  }));

  const ticks = [];
  for (let i = 0; i <= TICK_COUNT; i++) {
    const t = i / TICK_COUNT;
    const angle = startAngle + t * angleRange;
    const isMajor = i % 5 === 0;
    const innerR = isMajor ? radius - 12 : radius - 6;
    ticks.push(
      <Line
        key={i}
        x1={cx + Math.cos(angle) * innerR}
        y1={cy + Math.sin(angle) * innerR}
        x2={cx + Math.cos(angle) * radius}
        y2={cy + Math.sin(angle) * radius}
        stroke={t <= normalized ? colors.signal : colors.hairline}
        strokeWidth={isMajor ? 2 : 1}
      />
    );
  }

  const needleAngle = startAngle + normalized * angleRange;
  const needleLen = radius - 20;

  return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.dial, { width, height }]}>
          <Svg width={width} height={height}>
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              stroke={colors.hairline}
              strokeWidth={1}
              fill="none"
              strokeDasharray="4 4"
            />
            {ticks}
            <Line
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(needleAngle) * needleLen}
              y2={cy + Math.sin(needleAngle) * needleLen}
              stroke={colors.signal}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Circle cx={cx} cy={cy} r={4} fill={colors.signal} />
          </Svg>
          <GestureDetector gesture={gesture}>
            <View style={StyleSheet.absoluteFill} />
          </GestureDetector>
        </View>
        <Text style={styles.value}>
          {value.toLocaleString()}{unit}
        </Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  dial: {
    position: 'relative',
  },
  value: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    color: colors.signal,
    fontVariant: ['tabular-nums'],
  },
});
