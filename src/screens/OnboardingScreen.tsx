import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Svg, Circle, Path, Line, Rect } from 'react-native-svg';
import { colors, spacing, radius } from '../theme';
import { mockOnboardingSlides } from '../mocks/mockChain';

const { width: SCREEN_W } = Dimensions.get('window');

function SignalIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Path
        d="M32 48 C32 48 16 36 16 24 C16 12 26 4 32 4 C38 4 48 12 48 24 C48 36 32 48 32 48Z"
        stroke={colors.signal}
        strokeWidth={1.5}
        fill="none"
      />
      <Circle cx={32} cy={24} r={3} fill={colors.signal} opacity={0.6} />
      <Line x1={20} y1={32} x2={44} y2={32} stroke={colors.signal} strokeWidth={0.5} opacity={0.3} />
      <Line x1={22} y1={26} x2={42} y2={26} stroke={colors.signal} strokeWidth={0.5} opacity={0.2} />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Path
        d="M32 8 L52 18 L52 34 C52 46 32 56 32 56 C32 56 12 46 12 34 L12 18 Z"
        stroke={colors.signal}
        strokeWidth={1.5}
        fill="none"
      />
      <Line x1={32} y1={22} x2={32} y2={38} stroke={colors.signal} strokeWidth={1.5} />
      <Line x1={24} y1={30} x2={40} y2={30} stroke={colors.signal} strokeWidth={1.5} />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Rect x={18} y={30} width={28} height={22} rx={3} stroke={colors.signal} strokeWidth={1.5} fill="none" />
      <Path
        d="M24 30 V22 C24 14 28 10 32 10 C36 10 40 14 40 22 V30"
        stroke={colors.signal}
        strokeWidth={1.5}
        fill="none"
      />
      <Circle cx={32} cy={41} r={3} fill={colors.signal} opacity={0.6} />
    </Svg>
  );
}

const ICONS = {
  signal: SignalIcon,
  shield: ShieldIcon,
  lock: LockIcon,
};

interface Props {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentSlide < mockOnboardingSlides.length - 1) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      scrollRef.current?.scrollTo({ x: next * SCREEN_W, animated: true });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <View style={styles.screen}>
      <Pressable style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>SKIP</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {mockOnboardingSlides.map((slide, i) => {
          const IconComponent = ICONS[slide.icon];
          return (
            <OnboardingSlide
              key={i}
              index={i}
              title={slide.title}
              subtitle={slide.subtitle}
              IconComponent={IconComponent}
              isActive={i === currentSlide}
            />
          );
        })}
      </ScrollView>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {mockOnboardingSlides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <Pressable style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentSlide === mockOnboardingSlides.length - 1 ? 'GET STARTED' : 'NEXT'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function OnboardingSlide({
  index,
  title,
  subtitle,
  IconComponent,
  isActive,
}: {
  index: number;
  title: string;
  subtitle: string;
  IconComponent: React.FC;
  isActive: boolean;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    if (isActive) {
      opacity.value = withDelay(100, withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }));
      translateY.value = withDelay(100, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
    } else {
      opacity.value = 0;
      translateY.value = 20;
    }
  }, [isActive, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.slide, { width: SCREEN_W }]}>
      <Animated.View style={[styles.slideContent, style]}>
        <IconComponent />
        <Text style={styles.slideTitle}>{title}</Text>
        <Text style={styles.slideSubtitle}>{subtitle}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: spacing.xl,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.textFaint,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideContent: {
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.xxxl,
  },
  slideTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  slideSubtitle: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.hairline,
  },
  dotActive: {
    backgroundColor: colors.signal,
    width: 20,
  },
  nextBtn: {
    backgroundColor: colors.signal,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  nextText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.bg,
  },
});
