/**
 * Abundance Flow - Premium Button Component
 *
 * Primary pill button matching reference screens:
 * - Height: 48
 * - Padding horizontal: 24
 * - Background: accentGold gradient to accentGoldSoft
 * - Radius: full (pill shape)
 * - Shadow: soft glow using accentGoldSoft
 * - Text: 16, medium weight
 * - Optional inner highlight at top (white at 15% opacity)
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeContext';
import { borderRadius, sizing, spacing } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { springConfig } from '@theme/animations';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  icon,
  iconPosition = 'left',
}) => {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, springConfig.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig.snappy);
  };

  // Height: 48 for primary pill per spec
  const getHeight = () => {
    switch (size) {
      case 'small':
        return sizing.buttonSm;  // 36
      case 'large':
        return sizing.buttonXl;  // 56
      default:
        return sizing.buttonLg;  // 48 (spec)
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'small':
        return textStyles.buttonSmall;
      case 'large':
        return textStyles.buttonLarge;
      default:
        return textStyles.button;
    }
  };

  // Text color for different variants
  const getTextColor = () => {
    if (disabled) {
      return theme.colors.text.muted;
    }
    switch (variant) {
      case 'primary':
        return theme.colors.text.inverse;  // Dark text on gold
      case 'ghost':
      case 'outline':
        return theme.colors.accent.gold;
      default:
        return theme.colors.text.primary;
    }
  };

  // Padding horizontal: 24 per spec
  const getPaddingHorizontal = () => {
    switch (size) {
      case 'small':
        return spacing.base;  // 16
      case 'large':
        return spacing['2xl']; // 32
      default:
        return spacing.xl;    // 24 (spec)
    }
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              getTextStyle(),
              { color: getTextColor() },
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </>
  );

  // Gold glow shadow for primary buttons
  const goldGlowStyle: ViewStyle = variant === 'primary' ? {
    shadowColor: theme.colors.accent.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  } : {};

  const buttonStyle: ViewStyle = {
    height: getHeight(),
    paddingHorizontal: getPaddingHorizontal(),
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled ? 0.5 : 1,
    ...(fullWidth && { width: '100%' }),
  };

  // Primary gold gradient button
  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.95}
        style={[animatedStyle, goldGlowStyle, style]}
      >
        <LinearGradient
          colors={theme.colors.gradients.goldButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[buttonStyle, styles.gradientContainer]}
        >
          {/* Inner highlight at top (white 15%) */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.05)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.6 }}
            style={styles.innerHighlight}
          />
          {renderContent()}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  // Secondary, ghost, outline variants
  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        animatedStyle,
        buttonStyle,
        variant === 'secondary' && {
          backgroundColor: theme.colors.glass.fill,
          borderWidth: 1,
          borderColor: theme.colors.glass.border,
        },
        variant === 'outline' && {
          borderWidth: 1.5,
          borderColor: theme.colors.accent.gold,
          backgroundColor: 'transparent',
        },
        variant === 'ghost' && {
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      {renderContent()}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderTopLeftRadius: borderRadius.full,
    borderTopRightRadius: borderRadius.full,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});

export default Button;
