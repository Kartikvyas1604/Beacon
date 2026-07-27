import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Defs, RadialGradient, Stop, Pattern, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme';

export function BackgroundTexture() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="g1" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor={colors.bgElevated} stopOpacity={0.6} />
            <Stop offset="100%" stopColor={colors.bg} stopOpacity={0} />
          </RadialGradient>
          <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <Circle cx="10" cy="10" r="0.5" fill={colors.textFaint} opacity={0.15} />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={colors.bg} />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
});
