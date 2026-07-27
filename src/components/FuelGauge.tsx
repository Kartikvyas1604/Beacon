import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { typography } from '../theme/typography';

interface Props {
  label: string;
  value: number;
  max: number;
  color?: string;
}

export function FuelGauge({ label, value, max, color = colors.signal }: Props) {
  const pct = Math.min(value / max, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.value}>
        ₤{value.toLocaleString('en-US', { minimumFractionDigits: 0 })} / {max.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  barBg: {
    height: 4,
    backgroundColor: colors.hairline,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  value: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});
