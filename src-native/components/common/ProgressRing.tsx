/**
 * Abundance Flow - Premium Progress Ring / Circular Meter
 *
 * Circular progress ring matching reference screens:
 * - SVG arc with gradient from haloViolet to accentGold
 * - Center numeric value (large) with label below
 * - Soft outer glow using haloSoft blur
 * - Background track arc using semi-transparent white
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeContext';
import { sizing } from '@theme/spacing';
import { duration } from '@theme/animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  strokeWidth?: number;
  showGlow?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
  variant?: 'default' | 'gold' | 'violet';
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 'large',
  strokeWidth,
  showGlow = true,
  children,
  style,
  animated = true,
  variant = 'default',
}) => {
  const theme = useAppTheme();
  const animatedProgress = useSharedValue(0);

  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return { diameter: sizing.progressRingXs, stroke: 6 };
      case 'small':
        return { diameter: sizing.progressRingSm, stroke: 8 };
      case 'medium':
        return { diameter: sizing.progressRingMd, stroke: 10 };
      case 'xl':
        return { diameter: sizing.progressRingXl, stroke: 14 };
      default: // large
        return { diameter: sizing.progressRingLg, stroke: 12 };
    }
  };

  const { diameter, stroke } = getDimensions();
  const actualStroke = strokeWidth || stroke;
  const radius = (diameter - actualStroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(progress, {
        duration: duration.slower,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      animatedProgress.value,
      [0, 100],
      [circumference, 0]
    );
    return {
      strokeDashoffset,
    };
  });

  // Gradient colors based on variant
  const getGradientColors = () => {
    switch (variant) {
      case 'gold':
        return {
          start: theme.colors.accent.gold,
          end: theme.colors.accent.goldSoft,
        };
      case 'violet':
        return {
          start: theme.colors.halo.violet,
          end: theme.colors.halo.violetSoft,
        };
      default:
        // Default: violet to gold gradient (matching reference)
        return {
          start: theme.colors.halo.violet,
          end: theme.colors.accent.gold,
        };
    }
  };

  const gradientColors = getGradientColors();

  // Glow styles
  const glowStyle: ViewStyle = showGlow ? {
    shadowColor: theme.colors.halo.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  } : {};

  return (
    <View style={[styles.container, { width: diameter, height: diameter }, glowStyle, style]}>
      <Svg width={diameter} height={diameter} style={styles.svg}>
        <Defs>
          {/* Progress gradient (violet to gold) */}
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors.start} />
            <Stop offset="100%" stopColor={gradientColors.end} />
          </LinearGradient>
          {/* Glow gradient for outer effect */}
          <LinearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.halo.violetGlow} />
            <Stop offset="50%" stopColor={theme.colors.accent.goldGlow} />
            <Stop offset="100%" stopColor="transparent" />
          </LinearGradient>
        </Defs>

        {/* Background track arc (semi-transparent white) */}
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={actualStroke}
          fill="transparent"
        />

        {/* Outer glow effect */}
        {showGlow && (
          <AnimatedCircle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="url(#glowGradient)"
            strokeWidth={actualStroke + 12}
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
            opacity={0.3}
          />
        )}

        {/* Progress arc with gradient */}
        <AnimatedCircle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={actualStroke}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
        />
      </Svg>

      {/* Center content (score and label) */}
      <View style={styles.centerContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressRing;
