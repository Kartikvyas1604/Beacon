import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme';

interface Props {
  width: number | string;
  height: number;
  borderRadius?: number;
}

export function Skeleton({ width, height, borderRadius = 4 }: Props) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.hairline,
        },
        style,
      ]}
    />
  );
}

export function SkeletonBalance() {
  return (
    <View style={skeletonStyles.group}>
      <Skeleton width={80} height={10} />
      <Skeleton width={220} height={52} borderRadius={4} />
      <Skeleton width={140} height={12} />
    </View>
  );
}

export function SkeletonLedgerRow() {
  return (
    <View style={skeletonStyles.row}>
      <Skeleton width={6} height={6} borderRadius={3} />
      <View style={skeletonStyles.rowContent}>
        <Skeleton width={100} height={12} />
        <Skeleton width={60} height={10} />
      </View>
      <View style={skeletonStyles.rowRight}>
        <Skeleton width={70} height={14} />
        <Skeleton width={50} height={10} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  group: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
