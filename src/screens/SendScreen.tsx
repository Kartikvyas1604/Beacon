import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius, shadow } from '../theme';
import { RadialConfirm, Panel, BackgroundTexture } from '../components';

export default function SendScreen() {
  const nav = useNavigation();
  const limits = useWalletStore(s => s.limits);
  const connectivity = useWalletStore(s => s.connectivity);
  const frozen = useWalletStore(s => s.frozen);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const amt = parseFloat(amount) || 0;
  const dailyLeft = limits.dailyLimit - limits.dailyUsed;
  const overDaily = amt > dailyLeft;
  const overPerTx = amt > limits.perTxMax;
  const overVelocity = limits.hourlyCount >= limits.hourlyVelocity;
  const valid = amt > 0 && !overDaily && !overPerTx && !overVelocity;
  const canSend = recipient.length > 0 && valid && !frozen;

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
    setTimeout(() => nav.goBack(), 2000);
  }, [nav]);

  const isMesh = connectivity === 'mesh';

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Send Payment</Text>

          {isMesh && (
            <View style={styles.meshBanner}>
              <Text style={styles.meshDot}>◐</Text>
              <Text style={styles.meshText}>
                This transaction will relay via nearby mesh devices and confirm once connectivity resumes.
              </Text>
            </View>
          )}

          {frozen && (
            <View style={[styles.meshBanner, { backgroundColor: colors.redDim, borderColor: colors.red + '30' }]}>
              <Text style={[styles.meshDot, { color: colors.red }]}>●</Text>
              <Text style={[styles.meshText, { color: colors.red }]}>Wallet frozen — unfreeze to send</Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Recipient</Text>
            <TextInput
              style={styles.input}
              value={recipient} onChangeText={setRecipient}
              placeholder="G..." placeholderTextColor={colors.textFaint}
              autoCapitalize="none" autoCorrect={false} spellCheck={false} editable={!frozen}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Amount</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              value={amount} onChangeText={setAmount}
              placeholder="0.00" placeholderTextColor={colors.textFaint}
              keyboardType="decimal-pad" editable={!frozen}
            />
          </View>

          <Panel title="Transaction Impact">
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Daily remaining</Text>
              <Text style={[styles.impactVal, overDaily && { color: colors.red }]}>
                ₤{dailyLeft.toLocaleString()} → ₤{(dailyLeft - amt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Per-tx cap</Text>
              <Text style={[styles.impactVal, overPerTx && { color: colors.red }]}>
                ₤{limits.perTxMax.toLocaleString()}{overPerTx ? ' EXCEEDED' : ''}
              </Text>
            </View>
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Hourly velocity</Text>
              <Text style={[styles.impactVal, overVelocity && { color: colors.red }]}>
                {limits.hourlyCount}/{limits.hourlyVelocity}{overVelocity ? ' MAXED' : ''}
              </Text>
            </View>
          </Panel>

          {amt > 0 && (
            <View style={styles.autoSaveRow}>
              <Text style={styles.autoSaveLabel}>Auto-save routing</Text>
              <Text style={styles.autoSaveVal}>
                ₤{(amt * (limits.autoSaveBps / 10000)).toFixed(2)} → savings
              </Text>
            </View>
          )}

          {confirmed ? (
            <View style={styles.confirmedBox}>
              <Text style={styles.confirmedGlyph}>✓</Text>
              <Text style={styles.confirmedText}>
                {isMesh ? 'Relaying via mesh' : 'Submitted to network'}
              </Text>
            </View>
          ) : canSend ? (
            <View style={styles.confirmRow}>
              <RadialConfirm label="Hold to send" onConfirm={handleConfirm} size={72} duration={900} />
              <Text style={styles.holdHint}>Press and hold to confirm</Text>
            </View>
          ) : (
            <View style={styles.disabledBox}>
              <Text style={styles.disabledText}>
                {frozen ? 'WALLET FROZEN' : !recipient ? 'ENTER RECIPIENT' : !amt ? 'ENTER AMOUNT'
                  : overDaily ? 'EXCEEDS DAILY LIMIT' : overPerTx ? 'EXCEEDS PER-TX LIMIT' : 'VELOCITY REACHED'}
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingTop: 56, gap: spacing.lg },
  title: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 22,
    color: colors.textPrimary, letterSpacing: -0.5,
  },
  meshBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.amberDim, borderRadius: radius.sm,
    padding: spacing.md, borderWidth: 1, borderColor: colors.amber + '25',
  },
  meshDot: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 14, color: colors.amber, marginTop: 1 },
  meshText: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textSecondary, flex: 1, lineHeight: 18,
  },
  field: { gap: spacing.xs },
  fieldLabel: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 11,
    letterSpacing: 0.8, textTransform: 'uppercase', color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 14, color: colors.textPrimary,
  },
  amountInput: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 32,
    paddingVertical: spacing.xl, letterSpacing: -0.5,
  },
  impactRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.hairline,
  },
  impactLabel: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textSecondary },
  impactVal: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 12,
    color: colors.textPrimary, fontVariant: ['tabular-nums'],
  },
  autoSaveRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  autoSaveLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textMuted,
  },
  autoSaveVal: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 12,
    color: colors.blue, fontVariant: ['tabular-nums'],
  },
  confirmRow: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  holdHint: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 11,
    color: colors.textMuted, letterSpacing: 0.5,
  },
  disabledBox: { alignItems: 'center', paddingVertical: spacing.xxl },
  disabledText: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 11,
    letterSpacing: 1, color: colors.textMuted,
  },
  confirmedBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.xxl,
  },
  confirmedGlyph: { color: colors.green, fontSize: 18 },
  confirmedText: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 13,
    letterSpacing: 0.5, color: colors.green,
  },
});
