import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#08090D',
  bgCard: '#111318',
  bgElevated: '#161921',
  bgInput: '#1A1D26',
  hairline: '#1F2330',
  border: '#2A2F3E',

  accent: '#FF9F43',
  accentDim: 'rgba(255,159,67,0.12)',
  accentGlow: 'rgba(255,159,67,0.06)',

  green: '#34D399',
  greenDim: 'rgba(52,211,153,0.12)',
  amber: '#FBBF24',
  amberDim: 'rgba(251,191,36,0.12)',
  red: '#F87171',
  redDim: 'rgba(248,113,113,0.12)',
  blue: '#60A5FA',
  blueDim: 'rgba(96,165,250,0.12)',

  textPrimary: '#F5F5F4',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textFaint: '#374151',
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
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  }),
} as const;

export const baseStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
