import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { Panel } from '../components';

function StepperIndicator({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.stepper}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.stepDot, i <= step && styles.stepDotActive]} />
      ))}
    </View>
  );
}

const STEPS = ['welcome', 'address', 'limits', 'done'] as const;

export default function OnboardingScreen() {
  const completeOnboarding = useWalletStore(s => s.completeOnboarding);
  const setLimits = useWalletStore(s => s.setLimits);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [dailyLimit, setDailyLimit] = useState('100');
  const [perTxMax, setPerTxMax] = useState('25');
  const [autoSave, setAutoSave] = useState('5');

  const canAdvance = step === 0 ? name.length > 0 : true;

  const handleNext = () => {
    Haptics.selectionAsync();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setLimits({
        dailyLimit: parseFloat(dailyLimit) || 100,
        perTxMax: parseFloat(perTxMax) || 25,
        autoSaveBps: Math.round((parseFloat(autoSave) || 5) * 100),
      });
      completeOnboarding();
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <StepperIndicator step={step} total={STEPS.length} />

          {step === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Welcome to Beacon</Text>
              <Text style={styles.desc}>
                A mesh-resilient wallet built for environments where connectivity
                is unreliable. Your funds, always accessible.
              </Text>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  value={name} onChangeText={setName}
                  placeholder="e.g. Captain Ria" placeholderTextColor={colors.textFaint}
                  autoFocus
                />
              </View>
              <Text style={styles.hint}>Used locally only — never transmitted.</Text>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Key Address</Text>
              <Text style={styles.desc}>
                This is your Stellar address. It will be generated on first launch
                and used for all transactions — on-chain and mesh-relayed.
              </Text>
              <Panel title="Your Address">
                <Text style={styles.mockAddr}>
                  GCKFBEIYTKPVYM7STKSJ7VJNQJZ3XG5XGF4F2YMXZQ5S2K7Q4H5X7M3A
                </Text>
              </Panel>
              <Text style={styles.hint}>Tap "Next" to continue with this address.</Text>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Spending Limits</Text>
              <Text style={styles.desc}>
                Configure your daily and per-transaction spending limits.
                These are enforced on-chain via Soroban smart contracts.
              </Text>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Daily Limit</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  value={dailyLimit} onChangeText={setDailyLimit}
                  keyboardType="decimal-pad" placeholderTextColor={colors.textFaint}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Per-Transaction Max</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  value={perTxMax} onChangeText={setPerTxMax}
                  keyboardType="decimal-pad" placeholderTextColor={colors.textFaint}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Auto-Save (%)</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  value={autoSave} onChangeText={setAutoSave}
                  keyboardType="decimal-pad" placeholderTextColor={colors.textFaint}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>You're Ready</Text>
              <Text style={styles.desc}>
                {name}'s wallet is configured. You can send, receive, and relay
                via mesh — even offline. Limits are enforced on-chain.
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Daily limit</Text>
                  <Text style={styles.summaryVal}>{parseFloat(dailyLimit) || 100}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Per-tx cap</Text>
                  <Text style={styles.summaryVal}>{parseFloat(perTxMax) || 25}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Auto-save</Text>
                  <Text style={styles.summaryVal}>{parseFloat(autoSave) || 5}%</Text>
                </View>
              </View>
            </View>
          )}

          <Pressable
            style={[styles.nextBtn, !canAdvance && { opacity: 0.4 }]}
            onPress={handleNext}
            disabled={!canAdvance}
            accessibilityRole="button"
          >
            <Text style={styles.nextTxt}>{step === STEPS.length - 1 ? 'Launch Wallet' : 'Next'}</Text>
          </Pressable>

          {step > 0 && step < STEPS.length - 1 && (
            <Pressable style={styles.backBtn} onPress={() => setStep(step - 1)} accessibilityRole="button">
              <Text style={styles.backTxt}>Back</Text>
            </Pressable>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingTop: 64, gap: spacing.xxl },
  stepContent: { gap: spacing.lg },
  stepper: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  stepDot: {
    width: 32, height: 3, borderRadius: 1.5, backgroundColor: colors.border,
  },
  stepDotActive: { backgroundColor: colors.accent },
  title: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 26,
    color: colors.textPrimary, letterSpacing: -0.5,
  },
  desc: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 13,
    color: colors.textMuted, lineHeight: 20,
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
    fontFamily: 'Fraunces_600SemiBold', fontSize: 24,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 11,
    color: colors.textFaint,
  },
  mockAddr: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 13,
    color: colors.textPrimary, letterSpacing: 0.5, lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: spacing.lg, gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textMuted,
  },
  summaryVal: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 16,
    color: colors.textPrimary, fontVariant: ['tabular-nums'],
  },
  nextBtn: {
    backgroundColor: colors.accent, borderRadius: radius.pill,
    paddingVertical: 14, alignItems: 'center',
  },
  nextTxt: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 14,
    letterSpacing: 0.5, color: colors.bg,
  },
  backBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  backTxt: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted, letterSpacing: 0.5,
  },
});
