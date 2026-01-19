/**
 * Abundance Recode - Button Component
 *
 * Premium pill-shaped buttons with Muted Gold accent
 * Supports multiple variants: primary, secondary, ghost
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
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
    scale.value = withSpring(0.98, springConfig.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig.snappy);
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return sizing.buttonSm;
      case 'large':
        return sizing.buttonXl;
      default:
        return sizing.buttonLg;
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

  const getTextColor = () => {
    if (disabled) {
      return theme.colors.text.muted;
    }
    switch (variant) {
      case 'primary':
        return theme.colors.neutral.gray900;
      case 'ghost':
      case 'outline':
        return theme.colors.accent.gold;
      default:
        return theme.colors.text.primary;
    }
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={getTextColor()}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              getTextStyle(),
              { color: getTextColor() },
              icon && iconPosition === 'left' && { marginLeft: spacing.sm },
              icon && iconPosition === 'right' && { marginRight: spacing.sm },
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  const buttonStyle: ViewStyle = {
    height: getHeight(),
    paddingHorizontal: size === 'small' ? spacing.lg : spacing.xl,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled ? 0.5 : 1,
    ...(fullWidth && { width: '100%' }),
  };

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={theme.colors.gradients.goldButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={buttonStyle}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

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
          backgroundColor: theme.colors.glass.backgroundMedium,
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

const styles = StyleSheet.create({});

export default Button;
