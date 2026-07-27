import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function RadarPeerView({ peer }: { peer: any }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.info}>
        <Text style={styles.name}>{peer.name || peer.id}</Text>
        <Text style={styles.meta}>
          {peer.hops} hop{peer.hops !== 1 ? 's' : ''} · {peer.signal || 'Strong'}
        </Text>
      </View>
      <View style={[styles.statusDot, { backgroundColor: peer.online ? colors.green : colors.red }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  info: { flex: 1, gap: 2 },
  name: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textPrimary },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textMuted },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
});
