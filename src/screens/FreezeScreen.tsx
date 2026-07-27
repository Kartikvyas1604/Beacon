import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

export default function FreezeScreen() {
  const nav = useNavigation();
  const frozen = useWalletStore(s => s.frozen);
  const freezeWallet = useWalletStore(s => s.freezeWallet);
  const unfreezeWallet = useWalletStore(s => s.unfreezeWallet);

  const handleToggle = () => {
    if (frozen) {
      Alert.alert('Unfreeze Wallet', 'Restore normal operation?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfreeze',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            unfreezeWallet();
            nav.goBack();
          },
        },
      ]);
    } else {
      Alert.alert(
        'Emergency Freeze',
        'This blocks ALL outbound transactions at the protocol level. This cannot be bypassed.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Freeze',
            style: 'destructive',
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              freezeWallet();
              nav.goBack();
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Pressable onPress={() => nav.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Emergency Freeze</Text>

        <View style={[styles.card, frozen && styles.cardFrozen]}>
          <Text style={styles.cardIcon}>{frozen ? '⊘' : '⊕'}</Text>
          <Text style={styles.cardTitle}>
            {frozen ? 'WALLET FROZEN' : 'WALLET ACTIVE'}
          </Text>
          <Text style={styles.cardDesc}>
            {frozen
              ? 'All outbound transactions are blocked at the protocol level. Incoming mesh messages are queued.'
              : 'Your wallet is operating normally. All transactions are processed.'}
          </Text>
        </View>

        <Pressable
          style={[styles.actionBtn, frozen ? styles.unfreezeBtn : styles.freezeBtn]}
          onPress={handleToggle}
        >
          <Text style={[styles.actionText, frozen ? styles.unfreezeText : styles.freezeText]}>
            {frozen ? 'Unfreeze Wallet' : 'Freeze Wallet'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 20, paddingTop: 56, gap: 24, justifyContent: 'center' },
  back: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.accent,
    position: 'absolute',
    top: 56,
    left: 20,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  cardFrozen: {
    backgroundColor: colors.redDim,
    borderWidth: 1,
    borderColor: colors.red + '30',
  },
  cardIcon: { fontSize: 48 },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  cardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  freezeBtn: { backgroundColor: colors.red },
  unfreezeBtn: { backgroundColor: colors.accent },
  actionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  freezeText: { color: '#FFFFFF' },
  unfreezeText: { color: colors.bg },
});
