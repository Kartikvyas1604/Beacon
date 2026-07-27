import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const typography = StyleSheet.create({
  balanceLarge: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 56,
    color: colors.textPrimary,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  balanceMedium: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 36,
    color: colors.textPrimary,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  balanceSmall: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 24,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  headingLarge: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headingMedium: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  freezeHeadline: {
    fontFamily: 'Fraunces_500Medium_Italic',
    fontSize: 40,
    color: colors.frozen,
    letterSpacing: -1,
  },
  monoLarge: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  monoMedium: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  monoSmall: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: colors.textSecondary,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: colors.textSecondary,
  },
  labelText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: colors.textFaint,
  },
  bodyMono: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  amount: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    textAlign: 'right' as const,
  },
  address: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
});
