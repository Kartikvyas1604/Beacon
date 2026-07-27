import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { typography } from '../theme/typography';
import { RadialConfirm, Panel, BackgroundTexture } from '../components';

export default function SendScreen() {
  const nav = useNavigation();
  const limits = useWalletStore((s) => s.limits);
  const connectivity = useWalletStore((s) => s.connectivity);
  const frozen = useWalletStore((s) => s.frozen);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const dailyRemaining = limits.dailyLimit - limits.dailyUsed;
  const willExceedDaily = amountNum > dailyRemaining;
  const willExceedPerTx = amountNum > limits.perTxMax;
  const willExceedVelocity = limits.hourlyCount >= limits.hourlyVelocity;

  const validAmount = amountNum > 0 && !willExceedDaily && !willExceedPerTx && !willExceedVelocity;
  const canSend = recipient.length > 0 && validAmount && !frozen;

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
    setTimeout(() => {
      nav.goBack();
    }, 2000);
  }, [nav]);

  const isOffline = connectivity === 'mesh';

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>SEND</Text>

          {isOffline && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineGlyph}>◐</Text>
              <Text style={styles.offlineText}>
                This transaction will relay via nearby mesh devices and confirm once connectivity resumes.
              </Text>
            </View>
          )}

          {frozen && (
            <View style={[styles.offlineBanner, { borderColor: colors.frozen + '40' }]}>
              <Text style={[styles.offlineGlyph, { color: colors.frozen }]}>●</Text>
              <Text style={[styles.offlineText, { color: colors.frozen }]}>
                WALLET FROZEN — UNFREEZE TO SEND
              </Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>RECIPIENT ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="G..."
              placeholderTextColor={colors.textFaint}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              editable={!frozen}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>AMOUNT (₤)</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textFaint}
              keyboardType="decimal-pad"
              editable={!frozen}
            />
          </View>

          <Panel title="LIMIT IMPACT PREVIEW">
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Daily remaining</Text>
              <Text
                style={[
                  styles.impactValue,
                  willExceedDaily && { color: colors.frozen },
                ]}
              >
                ₤{dailyRemaining.toLocaleString()} → ₤{(dailyRemaining - amountNum).toLocaleString()}
              </Text>
            </View>
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Per-tx cap</Text>
              <Text
                style={[
                  styles.impactValue,
                  willExceedPerTx && { color: colors.frozen },
                ]}
              >
                ₤{limits.perTxMax.toLocaleString()}
                {willExceedPerTx ? ' EXCEEDED' : ''}
              </Text>
            </View>
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Hourly velocity</Text>
              <Text
                style={[
                  styles.impactValue,
                  willExceedVelocity && { color: colors.frozen },
                ]}
              >
                {limits.hourlyCount}/{limits.hourlyVelocity}
                {willExceedVelocity ? ' MAXED' : ''}
              </Text>
            </View>
          </Panel>

          {amountNum > 0 && (
            <View style={styles.autoSaveRow}>
              <Text style={styles.autoSaveLabel}>AUTO-SAVE ROUTING</Text>
              <Text style={styles.autoSaveValue}>
                ₤{(amountNum * (limits.autoSaveBps / 10000)).toFixed(2)} → savings
              </Text>
            </View>
          )}

          {confirmed ? (
            <View style={styles.confirmedBox}>
              <Text style={styles.confirmedGlyph}>●</Text>
              <Text style={styles.confirmedText}>
                {isOffline ? 'RELAYING VIA MESH' : 'SUBMITTED TO NETWORK'}
              </Text>
            </View>
          ) : canSend ? (
            <View style={styles.confirmRow}>
              <RadialConfirm
                label="HOLD TO SEND"
                onConfirm={handleConfirm}
                size={80}
                duration={900}
              />
              <Text style={styles.holdHint}>PRESS AND HOLD TO CONFIRM</Text>
            </View>
          ) : (
            <View style={styles.disabledRow}>
              <Text style={styles.disabledText}>
                {frozen
                  ? 'WALLET FROZEN'
                  : !recipient
                  ? 'ENTER RECIPIENT'
                  : !amountNum
                  ? 'ENTER AMOUNT'
                  : willExceedDaily
                  ? 'EXCEEDS DAILY LIMIT'
                  : willExceedPerTx
                  ? 'EXCEEDS PER-TX LIMIT'
                  : willExceedVelocity
                  ? 'VELOCITY LIMIT REACHED'
                  : ''}
              </Text>
            </View>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { padding: spacing.xl, paddingTop: 60, gap: spacing.lg },
  title: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.signalGlow,
    borderWidth: 1,
    borderColor: colors.mesh + '40',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  offlineGlyph: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 14,
    color: colors.mesh,
    marginTop: 1,
  },
  offlineText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  fieldGroup: { gap: spacing.xs },
  fieldLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  input: {
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  amountInput: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    letterSpacing: -0.5,
    paddingVertical: spacing.lg,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  impactLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: colors.textSecondary,
  },
  impactValue: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  autoSaveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoSaveLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textFaint,
  },
  autoSaveValue: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    color: colors.savings,
    fontVariant: ['tabular-nums'],
  },
  confirmRow: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  holdHint: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.textFaint,
  },
  disabledRow: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  disabledText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.textFaint,
  },
  confirmedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  confirmedGlyph: {
    color: colors.online,
    fontSize: 14,
  },
  confirmedText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.online,
  },
});
