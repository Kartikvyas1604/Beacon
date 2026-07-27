import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

function QRPlaceholder({ size }: { size: number }) {
  const cell = size / 25;
  const m: number[][] = [];
  for (let i = 0; i < 25; i++) {
    m[i] = [];
    for (let j = 0; j < 25; j++) {
      const finder = (i < 7 && j < 7) || (i < 7 && j >= 18) || (i >= 18 && j < 7);
      if (finder) {
        const bi = i < 7 ? i : i - 18;
        const bj = j < 7 ? j : j - 18;
        m[i][j] = bi === 0 || bi === 6 || bj === 0 || bj === 6 || (bi >= 2 && bi <= 4 && bj >= 2 && bj <= 4) ? 1 : 0;
      } else {
        m[i][j] = (i * 7 + j * 13 + i * j) % 3 === 0 ? 1 : 0;
      }
    }
  }
  return (
    <Svg width={size} height={size}>
      <Rect width={size} height={size} fill="#EEEEEE" rx={4} />
      {m.map((row, i) => row.map((c, j) => c ? (
        <Rect key={`${i}-${j}`} x={j * cell} y={i * cell} width={cell} height={cell} fill={colors.bg} />
      ) : null))}
    </Svg>
  );
}

export default function ReceiveScreen() {
  const address = useWalletStore(s => s.address);
  const limits = useWalletStore(s => s.limits);
  const federationAddress = useWalletStore(s => s.federationAddress);
  const autoPct = (limits.autoSaveBps / 100).toFixed(0);

  const handleCopy = () => {
    Haptics.selectionAsync();
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Receive</Text>

        <View style={styles.qrCard}>
          <QRPlaceholder size={200} />
        </View>

        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>YOUR ADDRESS</Text>
          <Text style={styles.addressText}>{address}</Text>
          <Pressable style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyText}>Copy Address</Text>
          </Pressable>
        </View>

        {federationAddress && (
          <View style={styles.fedCard}>
            <Text style={styles.fedLabel}>FEDERATION ADDRESS</Text>
            <Text style={styles.fedText}>{federationAddress}</Text>
            <Text style={styles.fedDesc}>Share this human-readable address instead of the long key.</Text>
          </View>
        )}

        <View style={styles.saveCard}>
          <View style={styles.saveHeader}>
            <Text style={styles.saveLabel}>Auto-Save Routing</Text>
            <Text style={styles.savePct}>{autoPct}%</Text>
          </View>
          <Text style={styles.saveDesc}>
            {autoPct}% of incoming funds automatically route to savings.
          </Text>
          <View style={styles.saveTrack}>
            <View style={[styles.saveFill, { width: `${parseInt(autoPct)}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 20, paddingTop: 60, alignItems: 'center', gap: 20 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary, alignSelf: 'flex-start' },
  qrCard: { backgroundColor: '#EEEEEE', padding: 16, borderRadius: 20 },
  addressCard: {
    width: '100%', backgroundColor: colors.bgCard, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 10,
  },
  addressLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, color: colors.textMuted },
  addressText: {
    fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.textPrimary,
    textAlign: 'center', lineHeight: 20,
  },
  copyBtn: {
    backgroundColor: colors.accentDim, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.accent + '30',
  },
  copyText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.accent },
  fedCard: {
    width: '100%', backgroundColor: colors.bgCard, borderRadius: 16, padding: 16, gap: 6,
  },
  fedLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, color: colors.textMuted },
  fedText: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 15, color: colors.accent },
  fedDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  saveCard: {
    width: '100%', backgroundColor: colors.bgCard, borderRadius: 16, padding: 16, gap: 10,
  },
  saveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saveLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary },
  savePct: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.blue },
  saveDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  saveTrack: { height: 4, backgroundColor: colors.bgElevated, borderRadius: 2, overflow: 'hidden' },
  saveFill: { height: '100%', backgroundColor: colors.blue, borderRadius: 2 },
});
