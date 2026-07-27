import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, FlatList,
} from 'react-native';
import { colors, radius } from '../theme';

interface DApp {
  id: string;
  name: string;
  desc: string;
  category: string;
  url: string;
  icon: string;
  verified: boolean;
}

const DAPPS: DApp[] = [
  { id: '1', name: 'StellarTerm', desc: 'Decentralized exchange for Stellar assets', category: 'DeFi', url: 'https://stellarterm.com', icon: '◆', verified: true },
  { id: '2', name: 'Lobstr', desc: 'Swap and manage Stellar assets', category: 'Wallet', url: 'https://lobstr.co', icon: '◉', verified: true },
  { id: '3', name: 'Soroban DEX', desc: 'Smart contract-powered token swaps', category: 'DeFi', url: 'https://soroban-dex.com', icon: '⬡', verified: true },
  { id: '4', name: 'StellarX', desc: 'Professional-grade Stellar trading', category: 'Exchange', url: 'https://stellarx.com', icon: '△', verified: false },
  { id: '5', name: 'Beans App', desc: 'Stellar rewards and loyalty tokens', category: 'Rewards', url: 'https://beans.app', icon: '○', verified: true },
  { id: '6', name: 'Solar Wallet', desc: 'Web wallet for Stellar ecosystem', category: 'Wallet', url: 'https://solarwallet.io', icon: '◎', verified: false },
  { id: '7', name: 'Freighter', desc: 'Browser extension for Stellar', category: 'Tools', url: 'https://freighter.app', icon: '⬢', verified: true },
  { id: '8', name: 'StellarGuard', desc: 'Multi-sig security for Stellar', category: 'Security', url: 'https://stellarguard.com', icon: '⊕', verified: true },
];

const CATEGORIES = ['All', 'DeFi', 'Wallet', 'Exchange', 'Tools', 'Rewards', 'Security'];

export default function BrowserScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = DAPPS.filter(d => {
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Stellar ecosystem dApps and tools</Text>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            value={search} onChangeText={setSearch}
            placeholder="Search dApps..."
            placeholderTextColor={colors.textFaint}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              style={[styles.catBtn, selectedCategory === cat && styles.catBtnActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.dappList}>
          {filtered.map(dapp => (
            <Pressable key={dapp.id} style={styles.dappCard}>
              <View style={styles.dappIcon}>
                <Text style={styles.dappIconText}>{dapp.icon}</Text>
              </View>
              <View style={styles.dappInfo}>
                <View style={styles.dappHeader}>
                  <Text style={styles.dappName}>{dapp.name}</Text>
                  {dapp.verified && <Text style={styles.verified}>✓</Text>}
                </View>
                <Text style={styles.dappDesc}>{dapp.desc}</Text>
                <View style={styles.dappMeta}>
                  <Text style={styles.dappCategory}>{dapp.category}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.meshSection}>
          <Text style={styles.sectionTitle}>Mesh Network</Text>
          <View style={styles.meshCard}>
            <View style={styles.meshRow}>
              <Text style={styles.meshLabel}>Status</Text>
              <View style={styles.meshDotRow}>
                <View style={[styles.meshDot, { backgroundColor: colors.green }]} />
                <Text style={styles.meshValue}>Active</Text>
              </View>
            </View>
            <View style={styles.meshRow}>
              <Text style={styles.meshLabel}>Connected Devices</Text>
              <Text style={styles.meshValue}>3</Text>
            </View>
            <View style={styles.meshRow}>
              <Text style={styles.meshLabel}>Network Type</Text>
              <Text style={styles.meshValue}>Stellar Mesh</Text>
            </View>
            <View style={styles.meshRow}>
              <Text style={styles.meshLabel}>Relay Protocol</Text>
              <Text style={styles.meshValue}>v2.1</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 16 },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.textMuted,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  categories: {
    gap: 8,
    paddingVertical: 4,
  },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.bgCard,
  },
  catBtnActive: {
    backgroundColor: colors.accent,
  },
  catText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  catTextActive: {
    color: colors.bg,
  },
  dappList: { gap: 10 },
  dappCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  dappIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dappIconText: { fontSize: 20, color: colors.accent },
  dappInfo: { flex: 1, gap: 4 },
  dappHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dappName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
  },
  verified: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.green,
  },
  dappDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  dappMeta: { flexDirection: 'row', gap: 8 },
  dappCategory: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  meshSection: { gap: 12 },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  meshCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  meshRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meshLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  meshValue: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 13,
    color: colors.textPrimary,
  },
  meshDotRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meshDot: { width: 6, height: 6, borderRadius: 3 },
});
