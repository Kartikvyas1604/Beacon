import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

export default function SwapScreen() {
  const nav = useNavigation<any>();
  const assets = useWalletStore(s => s.assets);
  const openOrders = useWalletStore(s => s.openOrders);
  const cancelOrder = useWalletStore(s => s.cancelOrder);
  const [sellAsset, setSellAsset] = useState('XLM');
  const [buyAsset, setBuyAsset] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [tab, setTab] = useState<'swap' | 'orders'>('swap');

  const sellBalance = assets.find(a => a.code === sellAsset)?.balance || 0;
  const rate = sellAsset === 'XLM' && buyAsset === 'USDC' ? 0.125 : 8.0;
  const estimatedReceive = (parseFloat(amount) || 0) * rate;
  const priceImpact = parseFloat(amount) > 1000 ? 0.3 : 0;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Swap</Text>

        <View style={styles.tabs}>
          <Pressable style={[styles.tab, tab === 'swap' && styles.tabActive]} onPress={() => setTab('swap')}>
            <Text style={[styles.tabText, tab === 'swap' && styles.tabTextActive]}>Swap</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'orders' && styles.tabActive]} onPress={() => setTab('orders')}>
            <Text style={[styles.tabText, tab === 'orders' && styles.tabTextActive]}>Open Orders ({openOrders.length})</Text>
          </Pressable>
        </View>

        {tab === 'swap' && (
          <>
            <View style={styles.swapCard}>
              <View style={styles.swapField}>
                <Text style={styles.fieldLabel}>SELL</Text>
                <View style={styles.assetSelect}>
                  <Text style={styles.assetCode}>{sellAsset}</Text>
                </View>
                <TextInput
                  style={styles.amountInput}
                  value={amount} onChangeText={setAmount}
                  placeholder="0.00" placeholderTextColor={colors.textFaint}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.balance}>Balance: {sellBalance.toLocaleString()}</Text>
              </View>

              <Pressable style={styles.swapBtn} onPress={() => { const t = sellAsset; setSellAsset(buyAsset); setBuyAsset(t); }}>
                <Text style={styles.swapIcon}>↕</Text>
              </Pressable>

              <View style={styles.swapField}>
                <Text style={styles.fieldLabel}>BUY</Text>
                <View style={styles.assetSelect}>
                  <Text style={styles.assetCode}>{buyAsset}</Text>
                </View>
                <Text style={styles.receiveAmount}>{estimatedReceive.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.preview}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Rate</Text>
                <Text style={styles.previewValue}>1 {sellAsset} = {rate} {buyAsset}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Slippage</Text>
                <Text style={styles.previewValue}>{slippage}%</Text>
              </View>
              {priceImpact > 0 && (
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Price Impact</Text>
                  <Text style={[styles.previewValue, { color: colors.amber }]}>{priceImpact}%</Text>
                </View>
              )}
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Network Fee</Text>
                <Text style={styles.previewValue}>0.00001 XLM</Text>
              </View>
            </View>

            <Pressable style={[styles.swapAction, !amount && { opacity: 0.4 }]} disabled={!amount}>
              <Text style={styles.swapActionText}>Swap via Stellar DEX</Text>
            </Pressable>
          </>
        )}

        {tab === 'orders' && (
          <View style={styles.ordersList}>
            {openOrders.length === 0 ? (
              <Text style={styles.emptyText}>No open orders</Text>
            ) : (
              openOrders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderPair}>{order.selling} → {order.buying}</Text>
                    <Text style={styles.orderDetails}>
                      {order.amount} @ {order.price}
                    </Text>
                  </View>
                  <Pressable style={styles.cancelBtn} onPress={() => cancelOrder(order.id)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </View>
              ))
            )}
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
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.bgCard, alignItems: 'center' },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: colors.bg },
  swapCard: {
    backgroundColor: colors.bgCard, borderRadius: 16, padding: 16, gap: 4,
  },
  swapField: { gap: 6 },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, color: colors.textMuted,
  },
  assetSelect: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  assetCode: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors.textPrimary },
  amountInput: {
    fontFamily: 'Inter_700Bold', fontSize: 32, color: colors.textPrimary,
    paddingVertical: 4,
  },
  receiveAmount: {
    fontFamily: 'Inter_700Bold', fontSize: 32, color: colors.textPrimary,
    paddingVertical: 4,
  },
  balance: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors.textMuted },
  swapBtn: {
    alignSelf: 'center', width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginVertical: 4,
  },
  swapIcon: { fontSize: 18, color: colors.textSecondary },
  preview: {
    backgroundColor: colors.bgCard, borderRadius: 12, padding: 14, gap: 10,
  },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  previewLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary },
  previewValue: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.textPrimary },
  swapAction: {
    backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  swapActionText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.bg },
  ordersList: { gap: 10 },
  orderCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: 12, padding: 14,
  },
  orderInfo: { gap: 4 },
  orderPair: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary },
  orderDetails: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors.textMuted },
  cancelBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    backgroundColor: colors.redDim,
  },
  cancelText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.red },
  emptyText: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textMuted,
    textAlign: 'center', paddingVertical: 32,
  },
});
