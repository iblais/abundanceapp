/**
 * Abundance Recode - Welcome Screen
 *
 * Initial screen for new users with logo and tagline
 * "Shift your state. Reshape your reality."
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { ScreenWrapper, Button, H1, Body } from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing } from '@theme/spacing';
import { duration } from '@theme/animations';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type WelcomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

// Abundance Recode Logo Component
const Logo: React.FC<{ size: number }> = ({ size }) => {
  const theme = useAppTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.neutral.white} stopOpacity="1" />
          <Stop offset="100%" stopColor={theme.colors.primary.lavenderLight} stopOpacity="0.8" />
        </LinearGradient>
        <LinearGradient id="glowGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor={theme.colors.neutral.white} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={theme.colors.neutral.white} stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Glow effect */}
      <Circle cx="50" cy="50" r="48" fill="url(#glowGradient)" />

      {/* Main swirl logo - flowing abundance symbol */}
      <G transform="translate(15, 15) scale(0.7)">
        <Path
          d="M50 10 C80 10, 90 40, 70 60 C50 80, 30 70, 30 50 C30 30, 50 20, 70 30"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M50 90 C20 90, 10 60, 30 40 C50 20, 70 30, 70 50 C70 70, 50 80, 30 70"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="50" cy="50" r="8" fill="url(#logoGradient)" />
      </G>
    </Svg>
  );
};

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();
  const theme = useAppTheme();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: duration.slower });
    logoScale.value = withTiming(1, {
      duration: duration.slower,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // Text animation (delayed)
    textOpacity.value = withDelay(
      400,
      withTiming(1, { duration: duration.slow })
    );
    textTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: duration.slow })
    );

    // Button animation (more delayed)
    buttonOpacity.value = withDelay(
      800,
      withTiming(1, { duration: duration.slow })
    );
    buttonTranslateY.value = withDelay(
      800,
      withTiming(0, { duration: duration.slow })
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const handleBegin = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoGlow}>
            <Logo size={120} />
          </View>
        </Animated.View>

        {/* Title and Tagline */}
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <H1 align="center" style={styles.title}>
            Abundance Recode
          </H1>
          <Body align="center" style={styles.tagline}>
            Shift your state. Reshape your reality.
          </Body>
        </Animated.View>
      </View>

      {/* Begin Button */}
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <Button
          title="Begin"
          onPress={handleBegin}
          variant="primary"
          size="large"
          fullWidth
        />
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing['3xl'],
  },
  logoGlow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.md,
  },
  tagline: {
    opacity: 0.8,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
});

export default WelcomeScreen;
