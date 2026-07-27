import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function MeshBanner({ hopCount, peerCount }: { hopCount: number; peerCount: number }) {
  return (
    <View style={styles.banner}>
      <View style={styles.dot} />
      <View style={styles.info}>
        <Text style={styles.title}>Mesh Active</Text>
        <Text style={styles.desc}>
          {peerCount} device{peerCount !== 1 ? 's' : ''} nearby · {hopCount} hop{hopCount !== 1 ? 's' : ''} relay
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.amberDim,
    borderRadius: 12,
    padding: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.amber },
  info: { flex: 1, gap: 2 },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.amber },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary },
});
