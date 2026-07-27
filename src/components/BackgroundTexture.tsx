import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme';

export function BackgroundTexture() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%">
        <Rect width="100%" height="100%" fill={colors.bg} />
        <Circle cx="50%" cy="25%" r="200" fill={colors.accentGlow} />
        <Circle cx="30%" cy="70%" r="150" fill={colors.bgCard} opacity={0.3} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 0,
  },
});
