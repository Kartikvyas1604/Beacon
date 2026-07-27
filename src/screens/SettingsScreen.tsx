import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  Alert, Switch,
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
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted, paddingHorizontal: 4 },
  card: { backgroundColor: colors.bgCard, borderRadius: 14, padding: 4 },
});

function Row({ label, value, onPress, danger }: { label: string; value?: string; onPress?: () => void; danger?: boolean }) {
  return (
    <Pressable style={rowStyles.row} onPress={onPress} disabled={!onPress}>
      <Text style={[rowStyles.label, danger && { color: colors.red }]}>{label}</Text>
      <View style={rowStyles.right}>
        {value && <Text style={rowStyles.value}>{value}</Text>}
        {onPress && <Text style={rowStyles.chevron}>›</Text>}
      </View>
    </Pressable>
  );
}
const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.textPrimary },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  value: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors.textMuted },
  chevron: { fontFamily: 'Inter_400Regular', fontSize: 18, color: colors.textMuted },
});

function ToggleRow({ label, desc, value, onValueChange }: { label: string; desc?: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={toggleStyles.row}>
      <View style={toggleStyles.info}>
        <Text style={toggleStyles.label}>{label}</Text>
        {desc && <Text style={toggleStyles.desc}>{desc}</Text>}
      </View>
      <Switch
        value={value} onValueChange={onValueChange}
        trackColor={{ false: colors.bgElevated, true: colors.accent + '40' }}
        thumbColor={value ? colors.accent : colors.textMuted}
      />
    </View>
  );
}
const toggleStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12 },
  info: { flex: 1, gap: 2 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.textPrimary },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted },
});

function Divider() {
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: 12 }} />;
}

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  const limits = useWalletStore(s => s.limits);
  const frozen = useWalletStore(s => s.frozen);
  const address = useWalletStore(s => s.address);
  const meshSettings = useWalletStore(s => s.meshSettings);
  const networkSettings = useWalletStore(s => s.networkSettings);
  const notificationSettings = useWalletStore(s => s.notificationSettings);
  const seedVerified = useWalletStore(s => s.seedVerified);
  const biometricEnabled = useWalletStore(s => s.biometricEnabled);
  const setLimits = useWalletStore(s => s.setLimits);
  const freezeWallet = useWalletStore(s => s.freezeWallet);
  const unfreezeWallet = useWalletStore(s => s.unfreezeWallet);
  const updateMeshSettings = useWalletStore(s => s.updateMeshSettings);
  const updateNetworkSettings = useWalletStore(s => s.updateNetworkSettings);
  const updateNotificationSettings = useWalletStore(s => s.updateNotificationSettings);
  const setBiometric = useWalletStore(s => s.setBiometric);
  const addAuditLog = useWalletStore(s => s.addAuditLog);
  const connectedDApps = useWalletStore(s => s.connectedDApps);
  const revokeDApp = useWalletStore(s => s.revokeDApp);

  const [editingLimits, setEditingLimits] = useState(false);
  const [dailyVal, setDailyVal] = useState(String(limits.dailyLimit));
  const [perTxVal, setPerTxVal] = useState(String(limits.perTxMax));
  const [autoSaveVal, setAutoSaveVal] = useState(String(limits.autoSaveBps / 100));

  const handleSaveLimits = () => {
    const newDaily = parseFloat(dailyVal) || limits.dailyLimit;
    const newPerTx = parseFloat(perTxVal) || limits.perTxMax;
    const newAuto = Math.round((parseFloat(autoSaveVal) || 5) * 100);

    if (newDaily !== limits.dailyLimit) addAuditLog({ action: 'updated', field: 'dailyLimit', oldValue: String(limits.dailyLimit), newValue: String(newDaily), onChainTxHash: 'pending' });
    if (newPerTx !== limits.perTxMax) addAuditLog({ action: 'updated', field: 'perTxMax', oldValue: String(limits.perTxMax), newValue: String(newPerTx), onChainTxHash: 'pending' });
    if (newAuto !== limits.autoSaveBps) addAuditLog({ action: 'updated', field: 'autoSaveBps', oldValue: String(limits.autoSaveBps), newValue: String(newAuto), onChainTxHash: 'pending' });

    setLimits({ dailyLimit: newDaily, perTxMax: newPerTx, autoSaveBps: newAuto });
    setEditingLimits(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleFreezeToggle = () => {
    if (frozen) {
      Alert.alert('Unfreeze Wallet', 'Restore normal operation?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unfreeze', onPress: () => { addAuditLog({ action: 'unfroze', field: 'frozen', oldValue: 'true', newValue: 'false', onChainTxHash: 'pending' }); unfreezeWallet(); } },
      ]);
    } else {
      Alert.alert('Emergency Freeze', 'This blocks ALL outbound transactions at the protocol level.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Freeze', style: 'destructive', onPress: () => { addAuditLog({ action: 'froze', field: 'frozen', oldValue: 'false', newValue: 'true', onChainTxHash: 'pending' }); freezeWallet(); } },
      ]);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Section title="Spending Controls">
        {editingLimits ? (
          <View style={styles.editForm}>
            <View style={styles.editRow}><Text style={styles.editLabel}>Daily Limit</Text><TextInput style={styles.editInput} value={dailyVal} onChangeText={setDailyVal} keyboardType="decimal-pad" /></View>
            <View style={styles.editRow}><Text style={styles.editLabel}>Per-Tx Max</Text><TextInput style={styles.editInput} value={perTxVal} onChangeText={setPerTxVal} keyboardType="decimal-pad" /></View>
            <View style={styles.editRow}><Text style={styles.editLabel}>Auto-Save %</Text><TextInput style={styles.editInput} value={autoSaveVal} onChangeText={setAutoSaveVal} keyboardType="decimal-pad" /></View>
            <View style={styles.editActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditingLimits(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSaveLimits}><Text style={styles.saveBtnText}>Save</Text></Pressable>
            </View>
          </View>
        ) : (
          <>
            <Row label="Daily Limit" value={`${limits.dailyLimit.toLocaleString()}`} onPress={() => { setEditingLimits(true); setDailyVal(String(limits.dailyLimit)); }} />
            <Divider />
            <Row label="Per-Transaction Max" value={`${limits.perTxMax.toLocaleString()}`} onPress={() => { setEditingLimits(true); setPerTxVal(String(limits.perTxMax)); }} />
            <Divider />
            <Row label="Auto-Save" value={`${(limits.autoSaveBps / 100).toFixed(0)}%`} onPress={() => { setEditingLimits(true); setAutoSaveVal(String(limits.autoSaveBps / 100)); }} />
            <Divider />
            <Row label="Velocity" value={`${limits.hourlyCount}/${limits.hourlyVelocity}/hr`} />
            <Divider />
            <Row label="On-Chain Audit Log" onPress={() => nav.navigate('AuditLog')} />
          </>
        )}
      </Section>

      <Section title="Security">
        <ToggleRow label="Biometric Unlock" desc="Use Face ID / fingerprint" value={biometricEnabled} onValueChange={setBiometric} />
        <Divider />
        <Row label="Change PIN" onPress={() => Alert.alert('PIN', 'PIN change flow coming soon')} />
        <Divider />
        <Row label="Auto-Lock Timer" value="1 min" onPress={() => {}} />
        <Divider />
        <Row label="Reveal Seed Phrase" onPress={() => Alert.alert('Security', 'This requires re-authentication')} />
        <Divider />
        <Row label="Emergency Freeze" danger onPress={handleFreezeToggle} />
      </Section>

      <Section title="Mesh Network">
        <ToggleRow label="Mesh Relay" desc="Sign and relay transactions via Bluetooth" value={meshSettings.enabled} onValueChange={(v) => updateMeshSettings({ enabled: v })} />
        <Divider />
        <ToggleRow label="Relay for Others" desc="Help relay other people's transactions (uses battery)" value={meshSettings.relayForOthers} onValueChange={(v) => updateMeshSettings({ relayForOthers: v })} />
        <Divider />
        <Row label="Max Hop Count" value={String(meshSettings.maxHops)} onPress={() => nav.navigate('Mesh')} />
        <Divider />
        <Row label="Mesh Status" onPress={() => nav.navigate('Mesh')} />
      </Section>

      <Section title="Network">
        <Row label="Network" value={networkSettings.network} onPress={() => {}} />
        <Divider />
        <Row label="Custom Horizon Endpoint" value={networkSettings.customHorizon || 'Default'} onPress={() => {}} />
        <Divider />
        <Row label="Custom RPC Endpoint" value={networkSettings.customRpc || 'Default'} onPress={() => {}} />
      </Section>

      <Section title="Connected dApps">
        {connectedDApps.map((dapp, i) => (
          <React.Fragment key={dapp.id}>
            {i > 0 && <Divider />}
            <View style={styles.dappRow}>
              <View style={styles.dappInfo}>
                <Text style={styles.dappName}>{dapp.icon} {dapp.name}</Text>
                <Text style={styles.dappPerms}>{dapp.permissions.join(', ')}</Text>
              </View>
              {dapp.connected ? (
                <Pressable style={styles.revokeBtn} onPress={() => revokeDApp(dapp.id)}>
                  <Text style={styles.revokeText}>Revoke</Text>
                </Pressable>
              ) : (
                <Text style={styles.disconnectedBadge}>Disconnected</Text>
              )}
            </View>
          </React.Fragment>
        ))}
      </Section>

      <Section title="Notifications">
        <ToggleRow label="Payments" value={notificationSettings.payments} onValueChange={(v) => updateNotificationSettings({ payments: v })} />
        <Divider />
        <ToggleRow label="Limit Warnings" value={notificationSettings.limitWarnings} onValueChange={(v) => updateNotificationSettings({ limitWarnings: v })} />
        <Divider />
        <ToggleRow label="Mesh Confirmations" value={notificationSettings.meshConfirmations} onValueChange={(v) => updateNotificationSettings({ meshConfirmations: v })} />
        <Divider />
        <ToggleRow label="Security Alerts" value={notificationSettings.securityAlerts} onValueChange={(v) => updateNotificationSettings({ securityAlerts: v })} />
      </Section>

      <Section title="Backup & Recovery">
        <Row label="Seed Phrase Status" value={seedVerified ? 'Verified ✓' : 'Not Verified'} />
        <Divider />
        <Row label="Re-run Seed Quiz" onPress={() => Alert.alert('Backup', 'Seed phrase quiz coming soon')} />
      </Section>

      <Section title="About">
        <Row label="Version" value="1.0.0" />
        <Divider />
        <Row label="Smart Contract" value="Soroban" />
        <Divider />
        <Row label="Audit Reports" onPress={() => {}} />
        <Divider />
        <Row label="Open Source Licenses" onPress={() => {}} />
        <Divider />
        <Row label="Support" onPress={() => {}} />
      </Section>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 24 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary },
  editForm: { padding: 12, gap: 12 },
  editRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary },
  editInput: {
    backgroundColor: colors.bgElevated, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    width: 100, textAlign: 'right', fontFamily: 'JetBrainsMono_400Regular', fontSize: 14, color: colors.textPrimary,
  },
  editActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: colors.bgElevated },
  cancelText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textSecondary },
  saveBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: colors.accent },
  saveBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.bg },
  dappRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12 },
  dappInfo: { gap: 2 },
  dappName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textPrimary },
  dappPerms: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textMuted },
  revokeBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: colors.redDim },
  revokeText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.red },
  disconnectedBadge: { fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.textMuted },
});
