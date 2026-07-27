import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { typography } from '../theme/typography';
import {
  SignalStatusBar,
  LedgerRow,
  FuelGauge,
  Panel,
  BackgroundTexture,
} from '../components';

const STAGGER = 50;

function StaggerItem({ index, children }: { index: number; children: React.ReactNode }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(
      index * STAGGER,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );
    translateY.value = withDelay(
      index * STAGGER,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
    );
  }, [index, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const balance = useWalletStore((s) => s.balance);
  const spendableBalance = useWalletStore((s) => s.spendableBalance);
  const savingsBalance = useWalletStore((s) => s.savingsBalance);
  const limits = useWalletStore((s) => s.limits);
  const recentTransactions = useWalletStore((s) => s.recentTransactions);
  const frozen = useWalletStore((s) => s.frozen);

  const dailyRemaining = limits.dailyLimit - limits.dailyUsed;

  return (
    <View style={styles.screen}>
      <BackgroundTexture />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StaggerItem index={0}>
          <SignalStatusBar onPress={() => nav.navigate('Mesh')} />
        </StaggerItem>

        <StaggerItem index={1}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>SPENDABLE</Text>
            <Text style={styles.balanceAmount}>
              ₤{spendableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.totalBalance}>
              TOTAL ₤{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </StaggerItem>

        <StaggerItem index={2}>
          <FuelGauge
            label="DAILY LIMIT REMAINING"
            value={dailyRemaining}
            max={limits.dailyLimit}
          />
        </StaggerItem>

        <StaggerItem index={3}>
          <Pressable
            style={styles.savingsRow}
            onPress={() => nav.navigate('Limits')}
          >
            <View>
              <Text style={styles.savingsLabel}>SAVINGS</Text>
              <Text style={styles.savingsAmount}>
                ₤{savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <Text style={styles.savingsAuto}>
              AUTO-SAVE {(limits.autoSaveBps / 100).toFixed(0)}%
            </Text>
          </Pressable>
        </StaggerItem>

        <StaggerItem index={4}>
          <Panel
            title="RECENT TRANSACTIONS"
            rightElement={
              <Text style={styles.txCount}>
                {recentTransactions.length}
              </Text>
            }
          >
            {recentTransactions.slice(0, 6).map((tx) => (
              <LedgerRow key={tx.id} transaction={tx} />
            ))}
          </Panel>
        </StaggerItem>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          style={[styles.actionBtn, styles.sendBtn]}
          onPress={() => nav.navigate('Send')}
          accessibilityRole="button"
          accessibilityLabel="Send payment"
        >
          <Text style={styles.sendText}>SEND</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.receiveBtn]}
          onPress={() => nav.navigate('Receive')}
          accessibilityRole="button"
          accessibilityLabel="Receive payment"
        >
          <Text style={styles.receiveText}>RECEIVE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 60,
    gap: spacing.xl,
  },
  balanceSection: {
    gap: spacing.xs,
  },
  balanceLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  balanceAmount: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 52,
    color: colors.textPrimary,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  totalBalance: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: colors.textFaint,
    marginTop: -4,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  savingsLabel: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.savings,
  },
  savingsAmount: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    color: colors.savings,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  savingsAuto: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textFaint,
  },
  txCount: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    color: colors.textFaint,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.sm,
    zIndex: 2,
    backgroundColor: colors.bg + 'CC',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: colors.signal,
  },
  receiveBtn: {
    borderWidth: 1,
    borderColor: colors.signal,
  },
  sendText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.bg,
  },
  receiveText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.signal,
  },
});
