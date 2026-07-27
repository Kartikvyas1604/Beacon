import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme';

export function SignalStatusBar({ onPress, connectivity = 'online' }: { onPress?: () => void; connectivity?: string }) {
  const dotColor = connectivity === 'online' ? colors.green
    : connectivity === 'mesh' ? colors.amber : colors.red;
  const label = connectivity === 'online' ? 'Online'
    : connectivity === 'mesh' ? 'Mesh' : 'Offline';

  return (
    <Pressable style={styles.bar} onPress={onPress} accessibilityRole="button">
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
});
