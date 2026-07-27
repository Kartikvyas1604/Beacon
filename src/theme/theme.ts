import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#222831',
  bgCard: '#393E46',
  bgElevated: '#3d4350',
  bgInput: '#3d4350',
  hairline: '#393E46',
  border: '#4a5060',

  accent: '#FD7014',
  accentDim: 'rgba(253,112,20,0.12)',
  accentGlow: 'rgba(253,112,20,0.06)',

  green: '#66BB6A',
  greenDim: 'rgba(102,187,106,0.12)',
  amber: '#FFB300',
  amberDim: 'rgba(255,179,0,0.12)',
  red: '#EF5350',
  redDim: 'rgba(239,83,80,0.12)',
  blue: '#5C9CE6',
  blueDim: 'rgba(92,156,230,0.12)',

  textPrimary: '#EEEEEE',
  textSecondary: '#b0b0b0',
  textMuted: '#7a7a7a',
  textFaint: '#4a4a4a',
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
