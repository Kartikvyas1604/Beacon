import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius, shadow } from '../theme';
import { SignalStatusBar, LedgerRow, FuelGauge, Panel, MeshBanner } from '../components';

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
  const dailyLeft = limits.dailyLimit - limits.dailyUsed;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <SignalStatusBar onPress={() => nav.navigate('Mesh')} />
          <Pressable
            style={[styles.freezeBtn, frozen && styles.freezeBtnActive]}
            onPress={() => nav.navigate('Freeze')}
            accessibilityRole="button"
            accessibilityLabel="Emergency freeze"
          >
            <Text style={[styles.freezeTxt, frozen && { color: colors.red }]}>
              {frozen ? 'FROZEN' : 'FREEZE'}
            </Text>
          </Pressable>
        </View>

        {connectivity === 'mesh' && (
          <Pressable onPress={() => nav.navigate('Mesh')}>
            <MeshBanner hopCount={hops} peerCount={peers.length} />
          </Pressable>
        )}

        <View style={styles.balanceCard}>
          <Text style={styles.balLabel}>Spendable Balance</Text>
          <Text style={styles.balAmount}>
            {spendable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.balMeta}>
            <View style={styles.balMetaItem}>
              <Text style={styles.balMetaLabel}>Total</Text>
              <Text style={styles.balMetaValue}>
                {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.balDivider} />
            <View style={styles.balMetaItem}>
              <Text style={styles.balMetaLabel}>Savings</Text>
              <Text style={[styles.balMetaValue, { color: colors.blue }]}>
                {savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        <FuelGauge label="Daily Limit" value={dailyLeft} max={limits.dailyLimit} />

        <Pressable
          style={styles.savingsCard}
          onPress={() => nav.navigate('Limits')}
          accessibilityRole="button"
        >
          <View style={styles.savingsLeft}>
            <Text style={styles.savingsLabel}>Auto-Save</Text>
            <Text style={styles.savingsPct}>{(limits.autoSaveBps / 100).toFixed(0)}%</Text>
          </View>
          <Text style={styles.savingsArrow}>&rarr;</Text>
        </Pressable>

        <Panel
          title="Recent Transactions"
          right={<Text style={styles.txCount}>{txs.length}</Text>}
        >
          {txs.slice(0, 6).map((tx, i) => (
            <React.Fragment key={tx.id}>
              <LedgerRow transaction={tx} />
              {i < 5 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </Panel>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          style={[styles.actionBtn, styles.sendBtn]}
          onPress={() => nav.navigate('Send')}
          accessibilityRole="button"
          accessibilityLabel="Send payment"
        >
          <Text style={styles.sendTxt}>Send</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.receiveBtn]}
          onPress={() => nav.navigate('Receive')}
          accessibilityRole="button"
          accessibilityLabel="Receive payment"
        >
          <Text style={styles.receiveTxt}>Receive</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingTop: 56, gap: spacing.lg },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  freezeBtn: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  freezeBtnActive: {
    backgroundColor: colors.redDim,
    borderColor: colors.red + '40',
  },
  freezeTxt: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 11,
    letterSpacing: 0.5, color: colors.textMuted,
  },
  balanceCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  balLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 13,
    color: colors.textMuted,
  },
  balAmount: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 50,
    color: colors.textPrimary, letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    marginVertical: spacing.xs,
  },
  balMeta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.lg,
    marginTop: spacing.xs,
  },
  balMetaItem: { gap: 2 },
  balMetaLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 11,
    color: colors.textMuted,
  },
  balMetaValue: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 14,
    color: colors.textPrimary, fontVariant: ['tabular-nums'],
  },
  balDivider: {
    width: 1, height: 28, backgroundColor: colors.border,
  },
  savingsCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: spacing.lg,
  },
  savingsLeft: { gap: 2 },
  savingsLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted,
  },
  savingsPct: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 20,
    color: colors.blue, fontVariant: ['tabular-nums'],
  },
  savingsArrow: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 18,
    color: colors.textMuted,
  },
  txCount: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 11,
    color: colors.textMuted,
  },
  divider: {
    height: 1, backgroundColor: colors.hairline,
  },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', padding: spacing.xl,
    paddingBottom: 36, gap: spacing.sm,
    backgroundColor: colors.bg,
  },
  actionBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: radius.pill, alignItems: 'center',
  },
  sendBtn: { backgroundColor: colors.accent },
  receiveBtn: { borderWidth: 1.5, borderColor: colors.accent },
  sendTxt: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 14,
    letterSpacing: 0.5, color: colors.bg,
  },
  receiveTxt: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 14,
    letterSpacing: 0.5, color: colors.accent,
  },
});
