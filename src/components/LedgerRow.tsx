import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function LedgerRow({ transaction }: { transaction: any }) {
  const isSent = transaction.type === 'send';

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: isSent ? colors.redDim : colors.greenDim }]}>
        <Text style={styles.iconText}>{isSent ? '↑' : '↓'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{transaction.recipient || transaction.sender || 'Unknown'}</Text>
        <Text style={styles.time}>
          {transaction.status === 'confirmed' ? 'Confirmed' : 'Pending'}
          {transaction.meshRelayed ? ' · Mesh' : ''}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isSent ? colors.red : colors.green }]}>
        {isSent ? '-' : '+'}{transaction.amount.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  icon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 16, color: colors.textPrimary },
  info: { flex: 1, gap: 2 },
  name: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textPrimary },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  amount: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    fontVariant: ['tabular-nums'] as any,
  },
});
