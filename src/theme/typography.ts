import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#EEEEEE',
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: '#EEEEEE',
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#EEEEEE',
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#EEEEEE',
    lineHeight: 22,
  },
  bodyMuted: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#9CA3AF',
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#9CA3AF',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: '#6B7280',
  },
  mono: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 13,
    color: '#EEEEEE',
  },
  monoSm: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 11,
    color: '#9CA3AF',
  },
  balanceLarge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 42,
    color: '#EEEEEE',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'] as any,
  },
  balanceMedium: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#EEEEEE',
    fontVariant: ['tabular-nums'] as any,
  },
  balanceSmall: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#EEEEEE',
    fontVariant: ['tabular-nums'] as any,
  },
  tabLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
