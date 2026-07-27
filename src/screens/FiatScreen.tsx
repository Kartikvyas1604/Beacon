import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, radius } from '../theme';

const ANCHORS = [
  { id: 'a1', name: 'Stellar Anchor', domain: 'anchor.stellar.org', currency: 'USD', fee: 0.5, verified: true, deposit: true, withdraw: true },
  { id: 'a2', name: 'Beans App', domain: 'beans.app', currency: 'USD', fee: 1.0, verified: true, deposit: true, withdraw: true },
  { id: 'a3', name: 'LOBSTR', domain: 'lobstr.co', currency: 'USD', fee: 0.75, verified: true, deposit: true, withdraw: false },
  { id: 'a4', name: 'Transak', domain: 'transak.com', currency: 'NGN', fee: 2.0, verified: true, deposit: true, withdraw: true },
  { id: 'a5', name: 'MoonPay', domain: 'moonpay.com', currency: 'EUR', fee: 1.5, verified: false, deposit: true, withdraw: true },
];

export default function FiatScreen() {
  const nav = useNavigation<any>();
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fiat</Text>
        <Text style={styles.subtitle}>Deposit and withdraw via regulated anchors (SEP-0024)</Text>

        <View style={styles.tabs}>
          <Pressable style={[styles.tab, tab === 'deposit' && styles.tabActive]} onPress={() => setTab('deposit')}>
            <Text style={[styles.tabText, tab === 'deposit' && styles.tabTextActive]}>Deposit</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'withdraw' && styles.tabActive]} onPress={() => setTab('withdraw')}>
            <Text style={[styles.tabText, tab === 'withdraw' && styles.tabTextActive]}>Withdraw</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {ANCHORS.filter(a => tab === 'deposit' ? a.deposit : a.withdraw).map(anchor => (
            <Pressable key={anchor.id} style={styles.anchorCard}>
              <View style={styles.anchorHeader}>
                <View style={styles.anchorLeft}>
                  <Text style={styles.anchorName}>{anchor.name}</Text>
                  <Text style={styles.anchorDomain}>{anchor.domain}</Text>
                </View>
                <View style={styles.anchorRight}>
                  {anchor.verified && <Text style={styles.verified}>✓ Verified</Text>}
                </View>
              </View>
              <View style={styles.anchorDetails}>
                <View style={styles.anchorRow}>
                  <Text style={styles.anchorLabel}>Currency</Text>
                  <Text style={styles.anchorValue}>{anchor.currency}</Text>
                </View>
                <View style={styles.anchorRow}>
                  <Text style={styles.anchorLabel}>Fee</Text>
                  <Text style={styles.anchorValue}>{anchor.fee}%</Text>
                </View>
                <View style={styles.anchorRow}>
                  <Text style={styles.anchorLabel}>Type</Text>
                  <Text style={styles.anchorValue}>{tab === 'deposit' ? 'Fiat → Crypto' : 'Crypto → Fiat'}</Text>
                </View>
              </View>
              <Pressable style={styles.actionBtn}>
                <Text style={styles.actionText}>{tab === 'deposit' ? 'Deposit' : 'Withdraw'} {anchor.currency}</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.bgCard, alignItems: 'center' },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: colors.bg },
  list: { gap: 12 },
  anchorCard: {
    backgroundColor: colors.bgCard, borderRadius: 16, padding: 16, gap: 12,
  },
  anchorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  anchorLeft: { gap: 2 },
  anchorName: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary },
  anchorDomain: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
  anchorRight: {},
  verified: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.green },
  anchorDetails: { gap: 8 },
  anchorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  anchorLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary },
  anchorValue: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.textPrimary },
  actionBtn: {
    backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, alignItems: 'center',
  },
  actionText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.bg },
});
