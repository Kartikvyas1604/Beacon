import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform, Modal,
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
  const contacts = useWalletStore(s => s.contacts);
  const address = useWalletStore(s => s.address);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [memoType, setMemoType] = useState<'text' | 'id' | 'hash'>('text');
  const [sent, setSent] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [pathPayment, setPathPayment] = useState(false);

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

  const handleSelectContact = (addr: string) => {
    setRecipient(addr);
    setShowContacts(false);
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
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>RECIPIENT</Text>
              <Pressable onPress={() => setShowContacts(true)}>
                <Text style={styles.contactsLink}>Contacts</Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              value={recipient} onChangeText={setRecipient}
              placeholder="Address, federation, or paste..." placeholderTextColor={colors.textFaint}
              autoCapitalize="none" autoCorrect={false} spellCheck={false} editable={!frozen}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>AMOUNT</Text>
            <View style={styles.amountWrap}>
              <TextInput
                style={styles.amountInput}
                value={amount} onChangeText={setAmount}
                placeholder="0.00" placeholderTextColor={colors.textFaint}
                keyboardType="decimal-pad" editable={!frozen}
              />
            </View>
          </View>

          <View style={styles.memoSection}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>MEMO (Optional)</Text>
              <View style={styles.memoTypeRow}>
                {(['text', 'id', 'hash'] as const).map(t => (
                  <Pressable
                    key={t}
                    style={[styles.memoTypeBtn, memoType === t && styles.memoTypeActive]}
                    onPress={() => setMemoType(t)}
                  >
                    <Text style={[styles.memoTypeText, memoType === t && styles.memoTypeTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <TextInput
              style={styles.input}
              value={memo} onChangeText={setMemo}
              placeholder={memoType === 'hash' ? 'Hex hash...' : memoType === 'id' ? 'Numeric ID...' : 'Text memo...'}
              placeholderTextColor={colors.textFaint}
              editable={!frozen}
            />
          </View>

          <Pressable style={styles.pathToggle} onPress={() => setPathPayment(!pathPayment)}>
            <View style={[styles.toggleDot, pathPayment && styles.toggleDotActive]} />
            <Text style={styles.pathLabel}>Path Payment (auto-convert via DEX)</Text>
          </Pressable>

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
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Network fee</Text>
                <Text style={styles.previewValue}>0.00001 XLM</Text>
              </View>
            </View>
          )}

          {sent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentIcon}>✓</Text>
              <Text style={styles.sentText}>{isMesh ? 'Relaying via mesh...' : 'Submitted to network'}</Text>
            </View>
          ) : (
            <Pressable style={[styles.sendBtn, !canSend && { opacity: 0.4 }]} onPress={handleSend} disabled={!canSend}>
              <Text style={styles.sendBtnText}>{frozen ? 'WALLET FROZEN' : 'Send Payment'}</Text>
            </Pressable>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showContacts} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowContacts(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Contact</Text>
            {contacts.map(c => (
              <Pressable key={c.id} style={styles.contactOption} onPress={() => handleSelectContact(c.address)}>
                <View>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactAddr}>{c.address.slice(0, 16)}...</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary },
  errorBanner: { backgroundColor: colors.redDim, borderRadius: 12, padding: 12 },
  errorText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.red },
  field: { gap: 6 },
  fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, color: colors.textMuted },
  contactsLink: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.accent },
  input: {
    backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    padding: 14, fontFamily: 'JetBrainsMono_400Regular', fontSize: 14, color: colors.textPrimary,
  },
  amountWrap: { backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  amountInput: { padding: 14, fontFamily: 'Inter_700Bold', fontSize: 32, color: colors.textPrimary },
  memoSection: { gap: 6 },
  memoTypeRow: { flexDirection: 'row', gap: 4 },
  memoTypeBtn: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.bgElevated },
  memoTypeActive: { backgroundColor: colors.accent },
  memoTypeText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.textMuted },
  memoTypeTextActive: { color: colors.bg },
  pathToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  toggleDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.border },
  toggleDotActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pathLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary },
  preview: { backgroundColor: colors.bgCard, borderRadius: 12, padding: 14, gap: 10 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary },
  previewValue: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors.textPrimary },
  sendBtn: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sendBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.bg },
  sentBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  sentIcon: { color: colors.green, fontSize: 18 },
  sentText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.green },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.bgCard, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, gap: 8, paddingBottom: 40,
  },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  contactOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderRadius: 12, backgroundColor: colors.bgElevated,
  },
  contactName: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary },
  contactAddr: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors.textMuted },
  chevron: { fontFamily: 'Inter_400Regular', fontSize: 18, color: colors.textMuted },
});
