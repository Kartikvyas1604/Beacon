import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function FuelGauge({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(1, value / max);
  const barColor = pct > 0.8 ? colors.green : pct > 0.4 ? colors.amber : colors.red;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(pct * 100)}% remaining</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(2, pct * 100)}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.detail}>{value.toLocaleString()} left</Text>
        <Text style={styles.detail}>of {max.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
  value: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textMuted },
  track: {
    height: 6, backgroundColor: colors.bgElevated, borderRadius: 3, overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  detail: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: colors.textMuted },
});
