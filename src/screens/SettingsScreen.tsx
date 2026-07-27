import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, Alert, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={secStyles.wrap}>
      <Text style={secStyles.title}>{title}</Text>
      <View style={secStyles.card}>{children}</View>
    </View>
  );
}

const secStyles = StyleSheet.create({
  wrap: { gap: 8 },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 4,
  },
});

function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable style={rowStyles.row} onPress={onPress} disabled={!onPress}>
      <Text style={rowStyles.label}>{label}</Text>
      <View style={rowStyles.right}>
        {value && <Text style={rowStyles.value}>{value}</Text>}
        {onPress && <Text style={rowStyles.chevron}>›</Text>}
      </View>
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  value: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 13,
    color: colors.textMuted,
  },
  chevron: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: colors.textMuted,
  },
});

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  const limits = useWalletStore(s => s.limits);
  const frozen = useWalletStore(s => s.frozen);
  const address = useWalletStore(s => s.address);
  const setLimits = useWalletStore(s => s.setLimits);
  const freezeWallet = useWalletStore(s => s.freezeWallet);
  const unfreezeWallet = useWalletStore(s => s.unfreezeWallet);
  const [editing, setEditing] = useState<string | null>(null);
  const [dailyVal, setDailyVal] = useState(String(limits.dailyLimit));
  const [perTxVal, setPerTxVal] = useState(String(limits.perTxMax));
  const [autoSaveVal, setAutoSaveVal] = useState(String(limits.autoSaveBps / 100));

  const handleSave = () => {
    setLimits({
      dailyLimit: parseFloat(dailyVal) || limits.dailyLimit,
      perTxMax: parseFloat(perTxVal) || limits.perTxMax,
      autoSaveBps: Math.round((parseFloat(autoSaveVal) || 5) * 100),
    });
    setEditing(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleFreezeToggle = () => {
    if (frozen) {
      Alert.alert('Unfreeze Wallet', 'Restore normal transaction capability?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unfreeze', onPress: () => unfreezeWallet() },
      ]);
    } else {
      Alert.alert(
        'Emergency Freeze',
        'This blocks ALL outbound transactions at the protocol level. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Freeze', style: 'destructive', onPress: () => freezeWallet() },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Section title="Spending Limits">
        {editing === 'limits' ? (
          <View style={styles.editForm}>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Daily Limit</Text>
              <TextInput
                style={styles.editInput}
                value={dailyVal} onChangeText={setDailyVal}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Per-Tx Max</Text>
              <TextInput
                style={styles.editInput}
                value={perTxVal} onChangeText={setPerTxVal}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Auto-Save %</Text>
              <TextInput
                style={styles.editInput}
                value={autoSaveVal} onChangeText={setAutoSaveVal}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.editActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditing(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <Row label="Daily Limit" value={`${limits.dailyLimit.toLocaleString()}`} onPress={() => { setEditing('limits'); setDailyVal(String(limits.dailyLimit)); }} />
            <View style={styles.rowDivider} />
            <Row label="Per-Transaction Max" value={`${limits.perTxMax.toLocaleString()}`} onPress={() => { setEditing('limits'); setPerTxVal(String(limits.perTxMax)); }} />
            <View style={styles.rowDivider} />
            <Row label="Auto-Save" value={`${(limits.autoSaveBps / 100).toFixed(0)}%`} onPress={() => { setEditing('limits'); setAutoSaveVal(String(limits.autoSaveBps / 100)); }} />
            <View style={styles.rowDivider} />
            <Row label="Velocity" value={`${limits.hourlyCount}/${limits.hourlyVelocity} per hour`} />
          </>
        )}
      </Section>

      <Section title="Security">
        <View style={styles.freezeRow}>
          <View style={styles.freezeInfo}>
            <Text style={styles.freezeLabel}>Emergency Freeze</Text>
            <Text style={styles.freezeDesc}>
              {frozen ? 'Active — all outbound blocked' : 'Blocks all outbound transactions'}
            </Text>
          </View>
          <Switch
            value={frozen}
            onValueChange={handleFreezeToggle}
            trackColor={{ false: colors.bgElevated, true: colors.redDim }}
            thumbColor={frozen ? colors.red : colors.textMuted}
          />
        </View>
      </Section>

      <Section title="Wallet">
        <Row label="Address" value={address.slice(0, 12) + '...'} />
        <View style={styles.rowDivider} />
        <Row label="Network" value="Stellar Testnet" />
        <View style={styles.rowDivider} />
        <Row label="Chain" value="Soroban" />
        <View style={styles.rowDivider} />
        <Row label="Mesh Relay" value="Active" onPress={() => nav.navigate('Mesh')} />
      </Section>

      <Section title="About">
        <Row label="Version" value="1.0.0" />
        <View style={styles.rowDivider} />
        <Row label="Build" value="Beacon" />
      </Section>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 24 },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  freezeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  freezeInfo: { gap: 2 },
  freezeLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  freezeDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textMuted,
  },
  editForm: { padding: 12, gap: 12 },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  editInput: {
    backgroundColor: colors.bgElevated,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    textAlign: 'right',
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
  },
  cancelText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  saveBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.bg,
  },
});
