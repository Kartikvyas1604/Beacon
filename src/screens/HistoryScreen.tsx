import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

type FilterType = 'all' | 'payment' | 'swap' | 'trustline' | 'contract' | 'settings' | 'freeze';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'payment', label: 'Payments' },
  { key: 'swap', label: 'Swaps' },
  { key: 'trustline', label: 'Trustlines' },
  { key: 'contract', label: 'Contracts' },
];

function formatDate(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HistoryScreen() {
  const nav = useNavigation<any>();
  const txs = useWalletStore(s => s.recentTransactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all' ? txs : txs.filter(t => t.type === filter);

  const statusColor = (s: string) => s === 'confirmed' ? colors.green : s === 'pending' ? colors.amber : s === 'relayed' ? colors.blue : colors.red;
  const typeIcon = (t: string) => {
    switch (t) {
      case 'payment': return '↗';
      case 'swap': return '⇄';
      case 'trustline': return '+';
      case 'contract': return '◇';
      case 'settings': return '⚙';
      case 'freeze': return '⊘';
      default: return '•';
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Transaction History</Text>
          <Pressable style={styles.exportBtn}>
            <Text style={styles.exportText}>Export CSV</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map(f => (
            <Pressable
              key={f.key}
              style={[styles.filterBtn, filter === f.key && styles.filterActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.txList}>
          {filtered.map(tx => {
            const isExpanded = expanded === tx.id;
            const isSent = tx.from === useWalletStore.getState().address;
            return (
              <Pressable
                key={tx.id}
                style={styles.txCard}
                onPress={() => setExpanded(isExpanded ? null : tx.id)}
              >
                <View style={styles.txRow}>
                  <View style={[styles.txIcon, { backgroundColor: isSent ? colors.redDim : colors.greenDim }]}>
                    <Text style={styles.txIconText}>{isSent ? '↑' : '↓'}</Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txName}>
                      {isSent ? (tx.toName || tx.to.slice(0, 12)) : (tx.fromName || tx.from.slice(0, 12))}
                    </Text>
                    <Text style={styles.txMeta}>
                      {typeIcon(tx.type)} {tx.type} · {formatDate(tx.timestamp)}
                    </Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, { color: isSent ? colors.red : colors.green }]}>
                      {isSent ? '-' : '+'}{tx.amount > 0 ? tx.amount.toLocaleString() : '—'}
                    </Text>
                    <Text style={[styles.txStatus, { color: statusColor(tx.status) }]}>
                      {tx.status}
                    </Text>
                  </View>
                </View>
                {isExpanded && (
                  <View style={styles.txDetail}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Hash</Text>
                      <Text style={styles.detailValue}>{tx.hash.slice(0, 16)}...</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>From</Text>
                      <Text style={styles.detailValue}>{tx.from.slice(0, 16)}...</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>To</Text>
                      <Text style={styles.detailValue}>{tx.to.slice(0, 16)}...</Text>
                    </View>
                    {tx.memo && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Memo</Text>
                        <Text style={styles.detailValue}>{tx.memo}</Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Route</Text>
                      <Text style={styles.detailValue}>{tx.route}{tx.hopPath ? ` (${tx.hopPath.length} hops)` : ''}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Fee</Text>
                      <Text style={styles.detailValue}>{tx.fee} XLM</Text>
                    </View>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary },
  exportBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.bgCard },
  exportText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.accent },
  filters: { gap: 8 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
    backgroundColor: colors.bgCard,
  },
  filterActive: { backgroundColor: colors.accent },
  filterText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
  filterTextActive: { color: colors.bg },
  txList: { gap: 8 },
  txCard: {
    backgroundColor: colors.bgCard, borderRadius: 14, padding: 14,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  txIconText: { fontSize: 16, color: colors.textPrimary },
  txInfo: { flex: 1, gap: 2 },
  txName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textPrimary },
  txMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  txRight: { alignItems: 'flex-end', gap: 2 },
  txAmount: {
    fontFamily: 'JetBrainsMono_400Regular', fontSize: 14,
    fontVariant: ['tabular-nums'] as any,
  },
  txStatus: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  txDetail: {
    marginTop: 12, paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
    gap: 8,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  detailValue: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors.textSecondary },
});
