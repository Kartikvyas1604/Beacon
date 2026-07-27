import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0B0E12',
  bgElevated: '#12161C',
  bgPanel: '#171C24',
  hairline: '#242A34',

  signal: '#FF9B3D',
  signalDim: '#7A4B22',
  signalGlow: 'rgba(255,155,61,0.14)',

  online: '#5FBF8A',
  mesh: '#E8C24A',
  frozen: '#D9534F',
  savings: '#6E8FB8',

  textPrimary: '#EDEBE4',
  textSecondary: '#8B92A0',
  textFaint: '#4E5560',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const shadow = {
  panel: {
    borderWidth: 1,
    borderColor: colors.hairline,
  },
} as const;

export const baseStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  panel: {
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  label: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  labelFaint: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  monoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    color: colors.textSecondary,
  },
  displayText: {
    fontFamily: 'Fraunces_600SemiBold',
    color: colors.textPrimary,
  },
});
