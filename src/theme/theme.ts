import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#222831',
  bgCard: '#2A2F3A',
  bgElevated: '#393E46',
  bgInput: '#313640',
  hairline: '#393E46',
  border: '#444C58',

  accent: '#FD7014',
  accentDim: 'rgba(253,112,20,0.10)',
  accentGlow: 'rgba(253,112,20,0.05)',
  accentMuted: '#D45A0F',

  green: '#22C55E',
  greenDim: 'rgba(34,197,94,0.10)',
  amber: '#F59E0B',
  amberDim: 'rgba(245,158,11,0.10)',
  red: '#EF4444',
  redDim: 'rgba(239,68,68,0.10)',
  blue: '#3B82F6',
  blueDim: 'rgba(59,130,246,0.10)',

  textPrimary: '#EEEEEE',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textFaint: '#4B5563',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  x4l: 40,
  x5l: 48,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

export const baseStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
