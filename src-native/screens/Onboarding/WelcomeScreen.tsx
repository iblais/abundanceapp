/**
 * Abundance Flow - Premium Welcome Screen
 *
 * Matches reference screen exactly:
 * - Centered logo glyph with halo glow
 * - Title "Abundance Flow" and subtitle below
 * - Single primary pill CTA at bottom ("Begin")
 * - Rounded shell frame around device canvas
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, RadialGradient } from 'react-native-svg';
import LinearGradientView from 'react-native-linear-gradient';
import { ScreenWrapper, Button, H1, Body } from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing, borderRadius } from '@theme/spacing';
import { duration } from '@theme/animations';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type WelcomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

// Premium Abundance Flow Logo with halo glow
const Logo: React.FC<{ size: number }> = ({ size }) => {
  const theme = useAppTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        {/* Radial glow behind logo */}
        <RadialGradient id="haloGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <Stop offset="50%" stopColor={theme.colors.halo.violet} stopOpacity="0.2" />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </RadialGradient>
        {/* Logo gradient */}
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="100%" stopColor={theme.colors.halo.violetSoft} stopOpacity="0.9" />
        </LinearGradient>
      </Defs>

      {/* Halo glow background */}
      <Circle cx="50" cy="50" r="48" fill="url(#haloGlow)" />

      {/* Main flowing swirl logo (matching reference) */}
      <G transform="translate(18, 18) scale(0.64)">
        {/* Top flowing curve */}
        <Path
          d="M50 15 C75 15, 85 35, 75 55 C65 75, 45 80, 35 65 C25 50, 35 35, 50 35 C65 35, 70 50, 60 60"
          stroke="url(#logoGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Bottom flowing curve (mirrored) */}
        <Path
          d="M50 85 C25 85, 15 65, 25 45 C35 25, 55 20, 65 35 C75 50, 65 65, 50 65 C35 65, 30 50, 40 40"
          stroke="url(#logoGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <Circle cx="50" cy="50" r="6" fill="url(#logoGradient)" />
      </G>
    </Svg>
  );
};

// Device frame shell (rounded border like reference)
const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppTheme();

  return (
    <View style={styles.frameContainer}>
      <LinearGradientView
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.frameBorder}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.frameInner}>
          {children}
        </View>
      </LinearGradientView>
    </View>
  );
};

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();
  const theme = useAppTheme();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);
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
    <ScreenWrapper style={styles.container} showHalo>
      <DeviceFrame>
        <View style={styles.content}>
          {/* Logo with halo glow */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logoGlow}>
              <Logo size={140} />
            </View>
          </Animated.View>

          {/* Title and Tagline */}
          <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
            <H1 align="center" style={styles.title}>
              Abundance Flow
            </H1>
            <Body
              align="center"
              color={theme.colors.text.secondary}
              style={styles.tagline}
            >
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
            size="medium"
            fullWidth
          />
        </Animated.View>
      </DeviceFrame>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xl,
  },
  frameBorder: {
    flex: 1,
    borderRadius: borderRadius['3xl'],
    padding: 2,
  },
  frameInner: {
    flex: 1,
    borderRadius: borderRadius['3xl'] - 2,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: spacing['3xl'],
  },
  logoGlow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 0,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.md,
    color: '#FFFFFF',
  },
  tagline: {
    opacity: 0.85,
  },
  buttonContainer: {
    paddingBottom: spacing.xl,
  },
});

export default WelcomeScreen;
