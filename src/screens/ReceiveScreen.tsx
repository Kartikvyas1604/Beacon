import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius, shadow } from '../theme';
import { BackgroundTexture } from '../components';

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
      <Rect width={size} height={size} fill={colors.textPrimary} rx={4} />
      {m.map((row, i) => row.map((c, j) => c ? (
        <Rect key={`${i}-${j}`} x={j * cell} y={i * cell} width={cell} height={cell} fill={colors.bg} />
      ) : null))}
    </Svg>
  );
}

export default function ReceiveScreen() {
  const address = useWalletStore(s => s.address);
  const limits = useWalletStore(s => s.limits);
  const autoPct = (limits.autoSaveBps / 100).toFixed(0);

  const handleCopy = () => {
    Haptics.selectionAsync();
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <View style={styles.content}>
        <Text style={styles.title}>Receive</Text>

        <View style={[styles.qrWrap, shadow.elevated]}>
          <QRPlaceholder size={200} />
        </View>

        <View style={styles.addressBlock}>
          <Text style={styles.addressLabel}>Your Address</Text>
          <Text style={styles.addressText}>{address}</Text>
          <Pressable style={styles.copyBtn} onPress={handleCopy} accessibilityRole="button" accessibilityLabel="Copy address">
            <Text style={styles.copyText}>Copy Address</Text>
          </Pressable>
        </View>

        <View style={styles.autoCard}>
          <View style={styles.autoHeader}>
            <Text style={styles.autoLabel}>Auto-Save Routing</Text>
            <Text style={styles.autoPct}>{autoPct}%</Text>
          </View>
          <Text style={styles.autoDesc}>
            {autoPct}% of incoming funds automatically route to your savings balance.
          </Text>
          <View style={styles.autoBar}>
            <View style={[styles.autoBarFill, { width: `${parseInt(autoPct)}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1, padding: spacing.xl, paddingTop: 56,
    alignItems: 'center', gap: spacing.xxl,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 22,
    color: colors.textPrimary, letterSpacing: -0.5, alignSelf: 'flex-start',
  },
  qrWrap: {
    backgroundColor: colors.textPrimary, padding: spacing.lg,
    borderRadius: radius.lg, marginTop: spacing.xxl,
  },
  addressBlock: { alignItems: 'center', gap: spacing.sm, width: '100%' },
  addressLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textMuted,
  },
  addressText: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 16,
    color: colors.textPrimary, letterSpacing: 1,
  },
  copyBtn: {
    marginTop: spacing.sm, backgroundColor: colors.accentDim,
    borderRadius: radius.pill, paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.accent + '30',
  },
  copyText: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 12,
    letterSpacing: 0.5, color: colors.accent,
  },
  autoCard: {
    width: '100%', backgroundColor: colors.bgCard,
    borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm,
  },
  autoHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  autoLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textMuted,
  },
  autoPct: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 18,
    color: colors.blue, fontVariant: ['tabular-nums'],
  },
  autoDesc: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted, lineHeight: 18,
  },
  autoBar: {
    height: 4, backgroundColor: colors.border,
    borderRadius: 2, overflow: 'hidden', marginTop: spacing.xs,
  },
  autoBarFill: { height: '100%', backgroundColor: colors.blue, borderRadius: 2 },
});
