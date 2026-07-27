import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { Panel, InstrumentSlider, BackgroundTexture } from '../components';

export default function LimitsScreen() {
  const nav = useNavigation();
  const limits = useWalletStore(s => s.limits);
  const dailyLeft = limits.dailyLimit - limits.dailyUsed;
  const dailyPct = limits.dailyUsed / limits.dailyLimit;
  const hourlyPct = limits.hourlyCount / limits.hourlyVelocity;

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <View style={styles.content}>
        <Text style={styles.title}>Spending Limits</Text>
        <Text style={styles.sub}>Chain-enforced daily and per-transaction controls</Text>

        <Panel title="Daily Limit">
          <View style={styles.gaugeRow}>
            <View style={styles.gaugeWrap}>
              <InstrumentSlider
                value={limits.dailyUsed}
                max={limits.dailyLimit}
                size={120}
                strokeWidth={8}
                color={dailyPct > 0.8 ? colors.red : dailyPct > 0.5 ? colors.amber : colors.green}
              />
            </View>
            <View style={styles.gaugeMeta}>
              <Text style={styles.gaugePrimary}>₤{dailyLeft.toLocaleString()}</Text>
              <Text style={styles.gaugeSecondary}>remaining of ₤{limits.dailyLimit.toLocaleString()}</Text>
              <Text style={styles.gaugeTertiary}>{(dailyPct * 100).toFixed(0)}% used</Text>
            </View>
          </View>
        </Panel>

        <Panel title="Per-Transaction Cap">
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Maximum single transfer</Text>
            <Text style={styles.metricValue}>₤{limits.perTxMax.toLocaleString()}</Text>
          </View>
        </Panel>

        <Panel title="Velocity">
          <View style={styles.gaugeRow}>
            <View style={styles.gaugeWrap}>
              <InstrumentSlider
                value={limits.hourlyCount}
                max={limits.hourlyVelocity}
                size={100}
                strokeWidth={7}
                color={hourlyPct > 0.8 ? colors.red : hourlyPct > 0.5 ? colors.amber : colors.green}
              />
            </View>
            <View style={styles.gaugeMeta}>
              <Text style={styles.gaugePrimary}>{limits.hourlyCount} / {limits.hourlyVelocity}</Text>
              <Text style={styles.gaugeSecondary}>hourly transactions</Text>
              <Text style={styles.gaugeTertiary}>Resets next hour</Text>
            </View>
          </View>
        </Panel>

        <Panel title="Chain Details">
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Chain</Text>
            <Text style={styles.detailVal}>Stellar (testnet)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Network cap</Text>
            <Text style={styles.detailVal}>Unlimited</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Per-tx limit</Text>
            <Text style={styles.detailVal}>Contract-enforced</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Velocity limit</Text>
            <Text style={styles.detailVal}>Time-locked</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Daily reset</Text>
            <Text style={styles.detailVal}>Permissionless (epoch)</Text>
          </View>
        </Panel>

        <View style={{ height: 40 }} />
      </View>
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
  sub: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted, lineHeight: 18,
  },
  gaugeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  gaugeWrap: { flexShrink: 0 },
  gaugeMeta: { flex: 1, gap: spacing.xs },
  gaugePrimary: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 24,
    color: colors.textPrimary, fontVariant: ['tabular-nums'],
  },
  gaugeSecondary: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textMuted,
  },
  gaugeTertiary: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 11,
    color: colors.textFaint, letterSpacing: 0.5,
  },
  metricRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  metricLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textMuted,
  },
  metricValue: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 20,
    color: colors.textPrimary, fontVariant: ['tabular-nums'],
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.hairline,
  },
  detailLabel: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: colors.textSecondary,
  },
  detailVal: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 12,
    color: colors.textPrimary, letterSpacing: 0.3,
  },
});
