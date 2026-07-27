import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius, shadow } from '../theme';
import { SignalStatusBar, LedgerRow, FuelGauge, MeshBanner } from '../components';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const balance = useWalletStore(s => s.balance);
  const spendable = useWalletStore(s => s.spendableBalance);
  const savings = useWalletStore(s => s.savingsBalance);
  const limits = useWalletStore(s => s.limits);
  const txs = useWalletStore(s => s.recentTransactions);
  const frozen = useWalletStore(s => s.frozen);
  const connectivity = useWalletStore(s => s.connectivity);
  const peers = useWalletStore(s => s.meshPeers);
  const hops = useWalletStore(s => s.hopCount);
  const accounts = useWalletStore(s => s.accounts);
  const activeAccount = useWalletStore(s => s.activeAccount);
  const setActiveAccount = useWalletStore(s => s.setActiveAccount);
  const dailyLeft = limits.dailyLimit - limits.dailyUsed;
  const [showAccounts, setShowAccounts] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Pressable style={styles.accountPill} onPress={() => setShowAccounts(true)}>
              <Text style={styles.accountName}>{activeAccount.name}</Text>
              <Text style={styles.accountChevron}>▾</Text>
            </Pressable>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={() => nav.navigate('Mesh')}>
              <SignalStatusBar connectivity={connectivity} />
            </Pressable>
            {frozen && (
              <View style={styles.frozenPill}>
                <Text style={styles.frozenText}>FROZEN</Text>
              </View>
            )}
          </View>
        </View>

        {connectivity === 'mesh' && (
          <Pressable onPress={() => nav.navigate('Mesh')}>
            <MeshBanner hopCount={hops} peerCount={peers.length} />
          </Pressable>
        )}

        <View style={[styles.balanceCard, shadow.card]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Spendable</Text>
              <Text style={styles.breakdownValue}>
                {spendable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Savings</Text>
              <Text style={[styles.breakdownValue, { color: colors.blue }]}>
                {savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Pressable style={[styles.quickBtn, { backgroundColor: colors.accent }]} onPress={() => nav.navigate('Send')}>
            <Text style={styles.quickBtnIcon}>↑</Text>
            <Text style={styles.quickBtnLabel}>Send</Text>
          </Pressable>
          <Pressable style={[styles.quickBtn, styles.quickBtnOutline]} onPress={() => nav.navigate('Receive')}>
            <Text style={[styles.quickBtnIcon, { color: colors.accent }]}>↓</Text>
            <Text style={[styles.quickBtnLabel, { color: colors.accent }]}>Receive</Text>
          </Pressable>
          <Pressable style={[styles.quickBtn, styles.quickBtnOutline]} onPress={() => nav.navigate('Swap')}>
            <Text style={[styles.quickBtnIcon, { color: colors.accent }]}>⇄</Text>
            <Text style={[styles.quickBtnLabel, { color: colors.accent }]}>Swap</Text>
          </Pressable>
        </View>

        <FuelGauge label="Daily Limit" value={dailyLeft} max={limits.dailyLimit} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => nav.navigate('History')}>
              <Text style={styles.sectionAction}>View All</Text>
            </Pressable>
          </View>
          {txs.slice(0, 5).map((tx, i) => (
            <React.Fragment key={tx.id}>
              <LedgerRow transaction={tx} />
              {i < 4 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={showAccounts} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowAccounts(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Account</Text>
            {accounts.map(account => (
              <Pressable
                key={account.id}
                style={[styles.accountOption, account.id === activeAccount.id && styles.accountActive]}
                onPress={() => { setActiveAccount(account.id); setShowAccounts(false); }}
              >
                <View>
                  <Text style={styles.accountOptionName}>{account.name}</Text>
                  <Text style={styles.accountOptionAddr}>{account.address.slice(0, 16)}...</Text>
                </View>
                {account.id === activeAccount.id && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  accountPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.bgCard, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  accountName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary },
  accountChevron: { fontSize: 10, color: colors.textMuted },
  frozenPill: {
    backgroundColor: colors.redDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  frozenText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1, color: colors.red },
  balanceCard: {
    backgroundColor: colors.bgCard, borderRadius: 20, padding: 24, gap: 4,
  },
  balanceLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted },
  balanceAmount: {
    fontFamily: 'Inter_700Bold', fontSize: 42, color: colors.textPrimary,
    letterSpacing: -1.5, fontVariant: ['tabular-nums'] as any, marginVertical: 4,
  },
  balanceBreakdown: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8,
    paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
  breakdownItem: { flex: 1, gap: 2 },
  breakdownLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  breakdownValue: {
    fontFamily: 'JetBrainsMono_400Regular', fontSize: 15, color: colors.textPrimary,
    fontVariant: ['tabular-nums'] as any,
  },
  breakdownDivider: { width: 1, height: 28, backgroundColor: colors.border },
  quickActions: { flexDirection: 'row', gap: 10 },
  quickBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 14, borderRadius: 14,
  },
  quickBtnOutline: { borderWidth: 1.5, borderColor: colors.accent, backgroundColor: 'transparent' },
  quickBtnIcon: { fontSize: 16, color: colors.bg },
  quickBtnLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.bg },
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary },
  sectionAction: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.accent },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgCard, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingTop: 12, gap: 8, paddingBottom: 40,
  },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  accountOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderRadius: 12, backgroundColor: colors.bgElevated,
  },
  accountActive: { borderWidth: 1, borderColor: colors.accent },
  accountOptionName: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary },
  accountOptionAddr: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors.textMuted },
  checkmark: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.accent },
});
