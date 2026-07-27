import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, Line } from 'react-native-svg';
import { colors, spacing } from '../theme';

interface Props {
  label?: string;
  value: number;
  min?: number;
  max: number;
  step?: number;
  unit?: string;
  onChange?: (value: number) => void;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function InstrumentSlider({
  label, value, min = 0, max, step = 1, unit = '', onChange,
  size = 260, strokeWidth, color,
}: Props) {
  const W = size;
  const H = Math.round(size * 0.42);
  const cx = W / 2;
  const cy = H - 8;
  const R = Math.min(W, H) * 0.48;
  const startA = -Math.PI;
  const endA = 0;
  const range = endA - startA;
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const barColor = color || colors.accent;

  const ticks = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const a = startA + t * range;
    const major = i % 5 === 0;
    const inner = major ? R - 10 : R - 5;
    ticks.push(
      <Line
        key={i}
        x1={cx + Math.cos(a) * inner} y1={cy + Math.sin(a) * inner}
        x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R}
        stroke={t <= norm ? barColor : colors.border}
        strokeWidth={major ? 1.5 : 0.8}
      />
    );
  }

  const needleA = startA + norm * range;
  const sw = strokeWidth || (onChange ? 2 : 2);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={{ width: W, height: H }}>
        <Svg width={W} height={H}>
          <Circle cx={cx} cy={cy} r={R} stroke={colors.border} strokeWidth={0.5} fill="none" strokeDasharray="3 3" />
          {ticks}
          <Line
            x1={cx} y1={cy}
            x2={cx + Math.cos(needleA) * (R - 15)} y2={cy + Math.sin(needleA) * (R - 15)}
            stroke={barColor} strokeWidth={sw} strokeLinecap="round"
          />
          <Circle cx={cx} cy={cy} r={3} fill={barColor} />
        </Svg>
      </View>
      <Text style={[styles.value, { color: barColor }]}>
        {value.toLocaleString()}{unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xxs },
  label: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 11,
    letterSpacing: 0.8, textTransform: 'uppercase', color: colors.textMuted,
  },
  value: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 20,
    fontVariant: ['tabular-nums'],
  },
});
