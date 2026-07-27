import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

function Stepper({ step, total }: { step: number; total: number }) {
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
          <Stepper step={step} total={STEPS.length} />

          {step === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.logo}>⬡</Text>
              <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>Welcome to Beacon</Text>
              <Text style={styles.desc}>
                A mesh-resilient wallet for environments where connectivity
                is unreliable. Your funds, always accessible.
              </Text>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>YOUR NAME</Text>
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
              <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>Your Address</Text>
              <Text style={styles.desc}>
                This is your Stellar address for all transactions — on-chain and mesh-relayed.
              </Text>
              <View style={styles.addrCard}>
                <Text style={styles.addrLabel}>STELLAR ADDRESS</Text>
                <Text style={styles.addrText}>
                  GCKFBEIYTKPVYM7STKSJ7VJNQJZ3XG5XGF4F2YMXZQ5S2K7Q4H5X7M3A
                </Text>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>Spending Limits</Text>
              <Text style={styles.desc}>
                Configure limits enforced on-chain via Soroban smart contracts.
              </Text>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>DAILY LIMIT</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  value={dailyLimit} onChangeText={setDailyLimit}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>PER-TRANSACTION MAX</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  value={perTxMax} onChangeText={setPerTxMax}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>AUTO-SAVE (%)</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  value={autoSave} onChangeText={setAutoSave}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.readyIcon}>✓</Text>
              <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>You're Ready</Text>
              <Text style={styles.desc}>
                {name}'s wallet is configured. Send, receive, and relay via mesh.
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Daily limit</Text>
                  <Text style={styles.summaryValue}>{parseFloat(dailyLimit) || 100}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Per-tx cap</Text>
                  <Text style={styles.summaryValue}>{parseFloat(perTxMax) || 25}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Auto-save</Text>
                  <Text style={styles.summaryValue}>{parseFloat(autoSave) || 5}%</Text>
                </View>
              </View>
            </View>
          )}

          <Pressable
            style={[styles.nextBtn, !canAdvance && { opacity: 0.4 }]}
            onPress={handleNext}
            disabled={!canAdvance}
          >
            <Text style={styles.nextText} numberOfLines={1} adjustsFontSizeToFit>
              {step === STEPS.length - 1 ? 'Launch Wallet' : 'Continue'}
            </Text>
          </Pressable>

          {step > 0 && step < STEPS.length - 1 && (
            <Pressable style={styles.backBtn} onPress={() => setStep(step - 1)}>
              <Text style={styles.backText}>Back</Text>
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
  content: { padding: 20, paddingTop: 80, gap: 24 },
  stepper: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  stepDot: {
    width: 32, height: 3, borderRadius: 2,
    backgroundColor: colors.bgElevated,
  },
  stepDotActive: { backgroundColor: colors.accent },
  stepContent: { gap: 16, alignItems: 'center', width: '100%' },
  logo: {
    fontSize: 48,
    color: colors.accent,
    marginBottom: 8,
  },
  readyIcon: {
    fontSize: 48,
    color: colors.green,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
  },
  desc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  field: {
    width: '100%',
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  amountInput: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  hint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textFaint,
  },
  addrCard: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    alignItems: 'center',
  },
  addrLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  addrText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  nextBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  nextText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.bg,
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textMuted,
  },
});
