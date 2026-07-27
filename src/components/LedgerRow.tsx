import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Transaction } from '../mocks/mockChain';

interface Props {
  transaction: Transaction;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function LedgerRow({ transaction }: Props) {
  const isReceived = transaction.to === 'GA7QHN3XH...K8M2P4';
  const statusColor =
    transaction.status === 'confirmed' ? colors.green
    : transaction.status === 'relayed' ? colors.amber
    : colors.textMuted;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: isReceived ? colors.greenDim : colors.accentDim }]}>
          <Text style={[styles.icon, { color: isReceived ? colors.green : colors.accent }]}>
            {isReceived ? '↓' : '↑'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.address} numberOfLines={1}>
            {isReceived ? transaction.from : transaction.to}
          </Text>
          <View style={styles.meta}>
            <View style={[styles.badge, { backgroundColor: statusColor + '18' }]}>
              <Text style={[styles.badgeText, { color: statusColor }]}>
                {transaction.status === 'confirmed' ? 'confirmed' : transaction.status === 'relayed' ? 'mesh' : 'pending'}
              </Text>
            </View>
            <Text style={styles.time}>{timeAgo(transaction.timestamp)}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.amount, { color: isReceived ? colors.green : colors.textPrimary }]}>
        {isReceived ? '+' : '-'} ₤{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  address: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
    color: colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  badgeText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  time: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: colors.textMuted,
  },
  amount: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
});
