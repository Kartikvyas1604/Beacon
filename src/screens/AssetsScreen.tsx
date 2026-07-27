import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

export default function AssetsScreen() {
  const nav = useNavigation<any>();
  const assets = useWalletStore(s => s.assets);
  const pools = useWalletStore(s => s.liquidityPools);
  const balance = useWalletStore(s => s.balance);
  const [tab, setTab] = useState<'tokens' | 'pools'>('tokens');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Assets</Text>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Value</Text>
          <Text style={styles.totalAmount}>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        </View>

        <View style={styles.tabs}>
          <Pressable style={[styles.tab, tab === 'tokens' && styles.tabActive]} onPress={() => setTab('tokens')}>
            <Text style={[styles.tabText, tab === 'tokens' && styles.tabTextActive]}>Tokens</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'pools' && styles.tabActive]} onPress={() => setTab('pools')}>
            <Text style={[styles.tabText, tab === 'pools' && styles.tabTextActive]}>Liquidity Pools</Text>
          </Pressable>
        </View>

        {tab === 'tokens' && (
          <View style={styles.list}>
            {assets.filter(a => a.balance > 0 || a.code === 'XLM').map(asset => (
              <View key={asset.id} style={styles.assetCard}>
                <View style={styles.assetLeft}>
                  <View style={[styles.assetIcon, { backgroundColor: asset.code === 'XLM' ? colors.accent + '20' : colors.blueDim }]}>
                    <Text style={styles.assetIconText}>{asset.code.slice(0, 2)}</Text>
                  </View>
                  <View>
                    <View style={styles.assetNameRow}>
                      <Text style={styles.assetCode}>{asset.code}</Text>
                      {asset.verified && <Text style={styles.verified}>✓</Text>}
                    </View>
                    <Text style={styles.issuer}>{asset.issuerName}</Text>
                  </View>
                </View>
                <View style={styles.assetRight}>
                  <Text style={styles.assetBalance}>{asset.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                  <Text style={[styles.assetChange, { color: asset.change24h >= 0 ? colors.green : colors.red }]}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                  </Text>
                </View>
              </View>
            ))}
            <Pressable style={styles.addTrustline} onPress={() => nav.navigate('AddTrustline')}>
              <Text style={styles.addText}>+ Add Trustline</Text>
            </Pressable>
          </View>
        )}

        {tab === 'pools' && (
          <View style={styles.list}>
            {pools.map(pool => (
              <View key={pool.id} style={styles.poolCard}>
                <View style={styles.poolHeader}>
                  <Text style={styles.poolPair}>{pool.tokenA}/{pool.tokenB}</Text>
                  <Text style={styles.poolApr}>{pool.apr}% APR</Text>
                </View>
                <View style={styles.poolRow}>
                  <Text style={styles.poolLabel}>Your share</Text>
                  <Text style={styles.poolValue}>{pool.shareBalance.toFixed(2)}</Text>
                </View>
                <View style={styles.poolRow}>
                  <Text style={styles.poolLabel}>Pooled {pool.tokenA}</Text>
                  <Text style={styles.poolValue}>{pool.balanceA.toLocaleString()}</Text>
                </View>
                <View style={styles.poolRow}>
                  <Text style={styles.poolLabel}>Pooled {pool.tokenB}</Text>
                  <Text style={styles.poolValue}>{pool.balanceB.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary },
  totalCard: {
    backgroundColor: colors.bgCard, borderRadius: 16, padding: 20, gap: 4,
  },
  totalLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted },
  totalAmount: {
    fontFamily: 'Inter_700Bold', fontSize: 36, color: colors.textPrimary,
    letterSpacing: -1, fontVariant: ['tabular-nums'] as any,
  },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    backgroundColor: colors.bgCard, alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: colors.bg },
  list: { gap: 10 },
  assetCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: 14, padding: 14,
  },
  assetLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  assetIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  assetIconText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.textPrimary },
  assetNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  assetCode: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary },
  verified: { fontFamily: 'Inter_700Bold', fontSize: 10, color: colors.green },
  issuer: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  assetRight: { alignItems: 'flex-end', gap: 2 },
  assetBalance: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 14, color: colors.textPrimary },
  assetChange: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  addTrustline: {
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
    borderRadius: 14, padding: 14, alignItems: 'center',
  },
  addText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.accent },
  poolCard: {
    backgroundColor: colors.bgCard, borderRadius: 14, padding: 14, gap: 10,
  },
  poolHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  poolPair: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary },
  poolApr: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.green },
  poolRow: { flexDirection: 'row', justifyContent: 'space-between' },
  poolLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted },
  poolValue: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.textPrimary },
});
