import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { typography } from '../theme/typography';
import { Transaction } from '../mocks/mockChain';

interface Props {
  transaction: Transaction;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'NOW';
  if (mins < 60) return `${mins}M AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}H AGO`;
  return `${Math.floor(hrs / 24)}D AGO`;
}

export function LedgerRow({ transaction }: Props) {
  const isReceived = transaction.to === 'GA7QHN3XH...K8M2P4';
  const statusColor =
    transaction.status === 'confirmed'
      ? colors.online
      : transaction.status === 'relayed'
      ? colors.mesh
      : colors.textFaint;

  const statusGlyph =
    transaction.status === 'confirmed'
      ? '●'
      : transaction.status === 'relayed'
      ? '◐'
      : '○';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <View>
          <Text style={styles.address} numberOfLines={1}>
            {isReceived ? transaction.from : transaction.to}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.routeTag}>
              {transaction.route === 'mesh' ? 'MESH' : 'ONLINE'}
            </Text>
            <Text style={styles.time}>{timeAgo(transaction.timestamp)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text
          style={[
            styles.amount,
            { color: isReceived ? colors.online : colors.textPrimary },
          ]}
        >
          {isReceived ? '+' : '-'} ₤{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusGlyph} {transaction.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  address: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  routeTag: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 9,
    letterSpacing: 1,
    color: colors.textFaint,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    overflow: 'hidden',
  },
  time: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: colors.textFaint,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  statusText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 9,
    letterSpacing: 1,
  },
});
