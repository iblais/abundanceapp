/**
 * Abundance Recode - Onboarding Screen
 *
 * 4-screen sequence introducing core concepts
 * Universal, science-forward approach
 */

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper, Button, H2, Body, GlassCard } from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing, borderRadius } from '@theme/spacing';
import { duration } from '@theme/animations';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Your Identity Signals Your Future',
    description:
      "You don't attract what you want—you attract what you are. Become the version of yourself who effortlessly receives abundance.",
    icon: 'identity',
  },
  {
    id: '2',
    title: 'The Science of Transformation',
    description:
      'Research suggests your brain can form new neural pathways at any age. Through consistent practice, you can reshape your patterns of thought and emotion.',
    icon: 'brain',
  },
  {
    id: '3',
    title: 'Your Tools for Change',
    description:
      'Guided meditations, journaling practices, and personalized insights designed to help you shift your internal state and align with your goals.',
    icon: 'tools',
  },
  {
    id: '4',
    title: 'Your Daily Rhythm',
    description:
      'Consistency creates transformation. Set your morning and evening practice times to build the habits that reshape your reality.',
    icon: 'rhythm',
  },
];

// Progress indicator component
const ProgressIndicator: React.FC<{ currentIndex: number; total: number }> = ({
  currentIndex,
  total,
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            {
              backgroundColor:
                index === currentIndex
                  ? theme.colors.accent.gold
                  : theme.colors.glass.backgroundMedium,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Slide component
const OnboardingSlideComponent: React.FC<{
  slide: OnboardingSlide;
  index: number;
  scrollX: Animated.SharedValue<number>;
}> = ({ slide, index, scrollX }) => {
  const theme = useAppTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [20, 0, 20],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <Animated.View style={[styles.slideContent, animatedStyle]}>
        <View style={styles.iconContainer}>
          <GlassCard variant="accent" style={styles.iconCard}>
            <View style={styles.iconInner} />
          </GlassCard>
        </View>

        <H2 align="center" style={styles.slideTitle}>
          {slide.title}
        </H2>

        <Body align="center" style={styles.slideDescription}>
          {slide.description}
        </Body>
      </Animated.View>
    </View>
  );
};

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const theme = useAppTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleContinue = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate('RhythmScheduler', { fromOnboarding: true });
    }
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <ScreenWrapper style={styles.container} padded={false}>
      {/* Progress indicator */}
      <View style={styles.header}>
        <ProgressIndicator
          currentIndex={currentIndex}
          total={ONBOARDING_SLIDES.length}
        />
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={({ item, index }) => (
          <OnboardingSlideComponent
            slide={item}
            index={index}
            scrollX={scrollX}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Continue button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 340,
  },
  iconContainer: {
    marginBottom: spacing['3xl'],
  },
  iconCard: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  slideTitle: {
    marginBottom: spacing.lg,
  },
  slideDescription: {
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
});

export default OnboardingScreen;
