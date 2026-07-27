import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { BackgroundTexture } from '../components';

function QRCodePlaceholder({ size }: { size: number }) {
  const cellSize = size / 25;
  const modules: number[][] = [];
  for (let i = 0; i < 25; i++) {
    modules[i] = [];
    for (let j = 0; j < 25; j++) {
      const inFinder =
        (i < 7 && j < 7) ||
        (i < 7 && j >= 18) ||
        (i >= 18 && j < 7);
      if (inFinder) {
        const bi = i < 7 ? i : i - 18;
        const bj = j < 7 ? j : j - 18;
        modules[i][j] =
          bi === 0 || bi === 6 || bj === 0 || bj === 6 || (bi >= 2 && bi <= 4 && bj >= 2 && bj <= 4)
            ? 1
            : 0;
      } else {
        modules[i][j] = ((i * 7 + j * 13 + i * j) % 3 === 0) ? 1 : 0;
      }
    }
  }

  return (
    <Svg width={size} height={size}>
      <Rect width={size} height={size} fill={colors.textPrimary} rx={4} />
      {modules.map((row, i) =>
        row.map((cell, j) =>
          cell ? (
            <Rect
              key={`${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize}
              height={cellSize}
              fill={colors.bg}
            />
          ) : null
        )
      )}
    </Svg>
  );
}

export default function ReceiveScreen() {
  const address = useWalletStore((s) => s.address);
  const limits = useWalletStore((s) => s.limits);
  const autoSavePct = (limits.autoSaveBps / 100).toFixed(0);

  const handleCopy = () => {
    Haptics.selectionAsync();
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <View style={styles.content}>
        <Text style={styles.title}>RECEIVE</Text>

        <View style={styles.qrContainer}>
          <View style={styles.qrFrame}>
            <QRCodePlaceholder size={220} />
          </View>
        </View>

        <View style={styles.addressBlock}>
          <Text style={styles.addressLabel}>YOUR ADDRESS</Text>
          <Text style={styles.addressText}>{address}</Text>
          <Pressable
            style={styles.copyBtn}
            onPress={handleCopy}
            accessibilityRole="button"
            accessibilityLabel="Copy address"
          >
            <Text style={styles.copyText}>COPY ADDRESS</Text>
          </Pressable>
        </View>

        <View style={styles.autoSavePreview}>
          <Text style={styles.autoSaveLabel}>AUTO-SAVE ROUTING</Text>
          <Text style={styles.autoSaveValue}>
            {autoSavePct}% of incoming funds route to savings
          </Text>
          <View style={styles.autoSaveBar}>
            <View
              style={[
                styles.autoSaveFill,
                { width: `${parseInt(autoSavePct)}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1,
    padding: spacing.xl,
    paddingTop: 60,
    alignItems: 'center',
    gap: spacing.xl,
  },
  title: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
    alignSelf: 'flex-start',
  },
  qrContainer: {
    paddingVertical: spacing.xxxl,
  },
  qrFrame: {
    backgroundColor: colors.textPrimary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.signal,
  },
  addressBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  addressLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  addressText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 16,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  copyBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.signalGlow,
    borderWidth: 1,
    borderColor: colors.signal + '40',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  copyText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.signal,
  },
  autoSavePreview: {
    width: '100%',
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  autoSaveLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  autoSaveValue: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: colors.savings,
  },
  autoSaveBar: {
    height: 3,
    backgroundColor: colors.hairline,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  autoSaveFill: {
    height: '100%',
    backgroundColor: colors.savings,
    borderRadius: 1.5,
  },
});
