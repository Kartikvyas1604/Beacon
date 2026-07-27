import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function Skeleton({ width, height, borderRadius = 8 }: { width: number; height: number; borderRadius?: number }) {
  return <View style={{ width, height, borderRadius, backgroundColor: colors.bgElevated, opacity: 0.5 }} />;
}
