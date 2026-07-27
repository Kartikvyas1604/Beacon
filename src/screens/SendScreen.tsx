import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';
import { MeshBanner } from '../components';

export default function SendScreen() {
  const nav = useNavigation();
  const limits = useWalletStore(s => s.limits);
  const connectivity = useWalletStore(s => s.connectivity);
  const frozen = useWalletStore(s => s.frozen);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sent, setSent] = useState(false);

  const amt = parseFloat(amount) || 0;
  const dailyLeft = limits.dailyLimit - limits.dailyUsed;
  const overDaily = amt > dailyLeft;
  const overPerTx = amt > limits.perTxMax;
  const canSend = recipient.length > 4 && amt > 0 && !overDaily && !overPerTx && !frozen;

  const handleSend = () => {
    if (!canSend) return;
    setSent(true);
    setTimeout(() => nav.goBack(), 2000);
  };

  const isMesh = connectivity === 'mesh';

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Send Payment</Text>

          {isMesh && <MeshBanner hopCount={0} peerCount={0} />}

          {frozen && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>Wallet frozen — unfreeze to send</Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>RECIPIENT</Text>
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Paste Stellar address..."
              placeholderTextColor={colors.textFaint}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              editable={!frozen}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>AMOUNT</Text>
            <View style={styles.amountWrap}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.textFaint}
                keyboardType="decimal-pad"
                editable={!frozen}
              />
            </View>
          </View>

          {amt > 0 && (
            <View style={styles.preview}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Daily remaining</Text>
                <Text style={[styles.previewValue, overDaily && { color: colors.red }]}>
                  {dailyLeft.toLocaleString()} → {(dailyLeft - amt).toLocaleString()}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Per-tx cap</Text>
                <Text style={[styles.previewValue, overPerTx && { color: colors.red }]}>
                  {limits.perTxMax.toLocaleString()}{overPerTx ? ' EXCEEDED' : ''}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Auto-save</Text>
                <Text style={[styles.previewValue, { color: colors.blue }]}>
                  {(amt * (limits.autoSaveBps / 10000)).toFixed(2)} → savings
                </Text>
              </View>
            </View>
          )}

          {sent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentIcon}>✓</Text>
              <Text style={styles.sentText}>
                {isMesh ? 'Relaying via mesh...' : 'Submitted to network'}
              </Text>
            </View>
          ) : (
            <Pressable
              style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!canSend}
            >
              <Text style={[styles.sendBtnText, !canSend && { opacity: 0.5 }]}>
                {frozen ? 'WALLET FROZEN' : 'Send Payment'}
              </Text>
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
  content: { padding: 20, paddingTop: 60, gap: 20 },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: colors.redDim,
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.red,
  },
  field: { gap: 6 },
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
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  amountWrap: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountInput: {
    padding: 14,
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: colors.textPrimary,
  },
  preview: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  previewValue: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: colors.textPrimary,
  },
  sendBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.bg,
  },
  sentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  sentIcon: { color: colors.green, fontSize: 18 },
  sentText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.green,
  },
});
