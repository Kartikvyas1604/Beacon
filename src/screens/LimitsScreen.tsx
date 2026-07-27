import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { InstrumentSlider, Panel, BackgroundTexture } from '../components';

export default function LimitsScreen() {
  const limits = useWalletStore((s) => s.limits);
  const updateLimits = useWalletStore((s) => s.updateLimits);

  const [dailyLimit, setDailyLimit] = useState(limits.dailyLimit);
  const [perTxMax, setPerTxMax] = useState(limits.perTxMax);
  const [hourlyVelocity, setHourlyVelocity] = useState(limits.hourlyVelocity);
  const [autoSaveBps, setAutoSaveBps] = useState(limits.autoSaveBps);

  const handleDailyChange = (val: number) => {
    setDailyLimit(val);
    updateLimits({ dailyLimit: val });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handlePerTxChange = (val: number) => {
    setPerTxMax(val);
    updateLimits({ perTxMax: val });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleVelocityChange = (val: number) => {
    setHourlyVelocity(val);
    updateLimits({ hourlyVelocity: val });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAutoSaveChange = (val: number) => {
    setAutoSaveBps(val);
    updateLimits({ autoSaveBps: val });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>LIMITS & CONTROLS</Text>

        <Panel title="DAILY SPENDING LIMIT">
          <InstrumentSlider
            label="DAILY LIMIT"
            value={dailyLimit}
            min={500}
            max={20000}
            step={500}
            onChange={handleDailyChange}
          />
        </Panel>

        <Panel title="PER-TRANSACTION CAP">
          <InstrumentSlider
            label="MAX PER TX"
            value={perTxMax}
            min={100}
            max={5000}
            step={100}
            onChange={handlePerTxChange}
          />
        </Panel>

        <Panel title="HOURLY VELOCITY">
          <InstrumentSlider
            label="MAX TX / HOUR"
            value={hourlyVelocity}
            min={1}
            max={50}
            step={1}
            onChange={handleVelocityChange}
          />
        </Panel>

        <Panel title="AUTO-SAVE BASIS POINTS">
          <InstrumentSlider
            label="AUTO-SAVE %"
            value={autoSaveBps / 100}
            min={0}
            max={100}
            step={5}
            unit="%"
            onChange={(val) => handleAutoSaveChange(val * 100)}
          />
          <Text style={styles.bpsNote}>
            {autoSaveBps} BPS = {(autoSaveBps / 100).toFixed(0)}% of incoming funds
          </Text>
        </Panel>

        <View style={styles.summaryPanel}>
          <Text style={styles.summaryTitle}>CURRENT CONFIGURATION</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily limit</Text>
            <Text style={styles.summaryValue}>₤{dailyLimit.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Per-tx cap</Text>
            <Text style={styles.summaryValue}>₤{perTxMax.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hourly velocity</Text>
            <Text style={styles.summaryValue}>{hourlyVelocity} tx/hr</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Auto-save</Text>
            <Text style={styles.summaryValue}>{(autoSaveBps / 100).toFixed(0)}%</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: spacing.xl,
    paddingTop: 60,
    gap: spacing.lg,
  },
  title: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  bpsNote: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  summaryPanel: {
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  summaryLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    color: colors.signal,
    fontVariant: ['tabular-nums'],
  },
});
