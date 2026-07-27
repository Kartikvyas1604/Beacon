import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const typography = StyleSheet.create({
  balanceHero: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 54,
    color: colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  balanceLarge: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 36,
    color: colors.textPrimary,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  balanceMedium: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  balanceSmall: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subheading: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  body: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
  },
  mono: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  monoBold: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
    color: colors.textPrimary,
  },
  small: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: colors.textMuted,
  },
  tiny: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  freezeHeadline: {
    fontFamily: 'Fraunces_500Medium_Italic',
    fontSize: 42,
    color: colors.red,
    letterSpacing: -1,
  },
  amount: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    textAlign: 'right' as const,
  },
  address: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
});
