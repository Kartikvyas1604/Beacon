import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

function formatDate(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AuditLogScreen() {
  const nav = useNavigation<any>();
  const auditLog = useWalletStore(s => s.auditLog);

  const actionColor = (action: string) => {
    if (action.includes('freeze')) return colors.red;
    if (action.includes('unfreeze')) return colors.green;
    return colors.accent;
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => nav.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>On-Chain Audit Log</Text>
          <Text style={styles.subtitle}>
            Every limit and control change is recorded on-chain with a transaction hash.
          </Text>
        </View>

        <View style={styles.list}>
          {auditLog.map(entry => (
            <View key={entry.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={[styles.badge, { backgroundColor: actionColor(entry.action) + '18' }]}>
                  <Text style={[styles.badgeText, { color: actionColor(entry.action) }]}>
                    {entry.action}
                  </Text>
                </View>
                <Text style={styles.logDate}>{formatDate(entry.timestamp)}</Text>
              </View>
              <View style={styles.logDetail}>
                <Text style={styles.logField}>{entry.field}</Text>
                <View style={styles.logChange}>
                  <Text style={styles.logOld}>{entry.oldValue}</Text>
                  <Text style={styles.logArrow}>→</Text>
                  <Text style={styles.logNew}>{entry.newValue}</Text>
                </View>
              </View>
              <View style={styles.logHash}>
                <Text style={styles.hashLabel}>TX Hash:</Text>
                <Text style={styles.hashValue}>{entry.onChainTxHash.slice(0, 16)}...</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 56, gap: 16 },
  header: { gap: 8 },
  back: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.accent },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  list: { gap: 10 },
  logCard: {
    backgroundColor: colors.bgCard, borderRadius: 14, padding: 14, gap: 10,
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  logDate: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  logDetail: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logField: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textSecondary },
  logChange: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logOld: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.textMuted, textDecorationLine: 'line-through' },
  logArrow: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  logNew: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.textPrimary },
  logHash: { flexDirection: 'row', gap: 6 },
  hashLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textMuted },
  hashValue: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: colors.textFaint },
});
