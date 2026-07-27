import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { RadialConfirm, BackgroundTexture } from '../components';

export default function FreezeScreen() {
  const nav = useNavigation();
  const frozen = useWalletStore(s => s.frozen);
  const freeze = useWalletStore(s => s.freezeWallet);
  const unfreeze = useWalletStore(s => s.unfreezeWallet);

  const [step, setStep] = useState<'idle' | 'confirming' | 'done'>('idle');

  const handleFreeze = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    freeze();
    setStep('done');
    setTimeout(() => nav.goBack(), 1800);
  }, [freeze, nav]);

  const handleUnfreeze = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    unfreeze();
    setStep('done');
    setTimeout(() => nav.goBack(), 1800);
  }, [unfreeze, nav]);

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <View style={styles.content}>
        {step === 'done' ? (
          <View style={styles.doneWrap}>
            <Text style={styles.doneGlyph}>{frozen ? '⊘' : '✓'}</Text>
            <Text style={styles.doneTitle}>
              {frozen ? 'WALLET FROZEN' : 'WALLET UNFROZEN'}
            </Text>
            <Text style={styles.doneDesc}>
              {frozen
                ? 'All outbound transactions blocked. On-chain enforced. Incoming mesh messages queued.'
                : 'Normal operation restored. Queued mesh messages will relay.'}
            </Text>
          </View>
        ) : frozen ? (
          <>
            <Text style={styles.title}>Emergency Freeze</Text>
            <View style={styles.frozenCard}>
              <Text style={styles.frozenGlyph}>⊘</Text>
              <Text style={styles.frozenTitle}>WALLET FROZEN</Text>
              <Text style={styles.frozenDesc}>
                Outbound transactions are blocked at the protocol level. No funds
                can leave until unfrozen. Incoming mesh messages are queued.
              </Text>
            </View>
            <View style={styles.unfreezeRow}>
              <Text style={styles.unfreezeLabel}>Confirm unfreeze</Text>
              <RadialConfirm
                label="Hold to unfreeze"
                onConfirm={handleUnfreeze}
                size={72}
                duration={1200}
              />
              <Text style={styles.holdHint}>Press and hold for 1.2 seconds</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Emergency Freeze</Text>
            <Text style={styles.desc}>
              Freeze your wallet to block all outbound transactions at the
              protocol level. This is enforced on-chain and cannot be bypassed.
            </Text>
            <View style={styles.freezeRow}>
              <RadialConfirm
                label="Hold to freeze"
                onConfirm={handleFreeze}
                size={72}
                duration={900}
              />
              <Text style={styles.holdHint}>Press and hold for 0.9 seconds</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1, padding: spacing.xl, paddingTop: 56,
    gap: spacing.xxl, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 22,
    color: colors.textPrimary, letterSpacing: -0.5, alignSelf: 'flex-start',
  },
  desc: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 13,
    color: colors.textMuted, lineHeight: 20, alignSelf: 'flex-start',
  },
  frozenCard: {
    backgroundColor: colors.redDim, borderRadius: radius.md,
    padding: spacing.xl, gap: spacing.md, width: '100%',
    borderWidth: 1, borderColor: colors.red + '25',
  },
  frozenGlyph: {
    fontSize: 32, color: colors.red, textAlign: 'center',
  },
  frozenTitle: {
    fontFamily: 'IBMPlexMono_700Bold', fontSize: 13,
    letterSpacing: 1.5, color: colors.red, textAlign: 'center',
  },
  frozenDesc: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted, textAlign: 'center', lineHeight: 18,
  },
  freezeRow: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  unfreezeRow: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  unfreezeLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted,
  },
  holdHint: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 11,
    color: colors.textMuted, letterSpacing: 0.5,
  },
  doneWrap: { alignItems: 'center', gap: spacing.md },
  doneGlyph: { fontSize: 36, color: colors.textPrimary },
  doneTitle: {
    fontFamily: 'IBMPlexMono_700Bold', fontSize: 14,
    letterSpacing: 1.5, color: colors.textPrimary,
  },
  doneDesc: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted, textAlign: 'center', lineHeight: 18,
    maxWidth: 260,
  },
});
