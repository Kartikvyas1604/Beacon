import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Defs, RadialGradient, Stop, Pattern, Circle } from 'react-native-svg';
import { colors } from '../theme';

export function BackgroundTexture() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="bgGrad" cx="50%" cy="35%" r="65%">
            <Stop offset="0%" stopColor={colors.bgElevated} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors.bg} stopOpacity={1} />
          </RadialGradient>
          <Pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="1" fill={colors.textFaint} opacity={0.03} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGrad)" />
        <Rect width="100%" height="100%" fill="url(#dotGrid)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
