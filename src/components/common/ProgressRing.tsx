/**
 * Abundance Flow - Progress Ring Component
 *
 * Circular progress ring for Alignment Score display
 * Features animated progress and soft glow effect
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
import { duration, easing as themeEasing } from '@theme/animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  strokeWidth?: number;
  showGlow?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 'large',
  strokeWidth,
  showGlow = true,
  children,
  style,
  animated = true,
}) => {
  const theme = useAppTheme();
  const animatedProgress = useSharedValue(0);

  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { diameter: sizing.progressRingSm, stroke: 8 };
      case 'medium':
        return { diameter: sizing.progressRingMd, stroke: 10 };
      default:
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

  return (
    <View style={[styles.container, { width: diameter, height: diameter }, style]}>
      <Svg width={diameter} height={diameter} style={styles.svg}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.accent.gold} />
            <Stop offset="100%" stopColor={theme.colors.primary.lavender} />
          </LinearGradient>
          <LinearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.accent.goldSoft} />
            <Stop offset="100%" stopColor="transparent" />
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={theme.colors.glass.background}
          strokeWidth={actualStroke}
          fill="transparent"
        />

        {/* Glow effect */}
        {showGlow && (
          <AnimatedCircle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="url(#glowGradient)"
            strokeWidth={actualStroke + 8}
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
            opacity={0.5}
          />
        )}

        {/* Progress circle */}
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

      {/* Center content */}
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
