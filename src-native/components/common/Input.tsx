/**
 * Abundance Recode - Input Component
 *
 * Glassmorphic text input with consistent styling
 */

import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  ViewStyle,
  StyleProp,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeContext';
import { borderRadius, spacing, sizing } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { duration } from '@theme/animations';
import { Label, Caption } from './Typography';
import { Icon, IconName } from './Icon';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  size?: 'small' | 'medium' | 'large';
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      size = 'medium',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const borderOpacity = useSharedValue(0);

    const animatedBorderStyle = useAnimatedStyle(() => ({
      borderColor: `rgba(201, 169, 97, ${borderOpacity.value})`,
    }));

    const handleFocus = (e: any) => {
      setIsFocused(true);
      borderOpacity.value = withTiming(1, { duration: duration.fast });
      props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      borderOpacity.value = withTiming(0, { duration: duration.fast });
      props.onBlur?.(e);
    };

    const getHeight = () => {
      switch (size) {
        case 'small':
          return sizing.inputSm;
        case 'large':
          return sizing.inputLg;
        default:
          return sizing.inputBase;
      }
    };

    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Label
            style={styles.label}
            color={hasError ? theme.colors.semantic.error : undefined}
          >
            {label}
          </Label>
        )}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              height: getHeight(),
              backgroundColor: theme.colors.glass.background,
              borderColor: hasError
                ? theme.colors.semantic.error
                : theme.colors.glass.border,
            },
            !hasError && animatedBorderStyle,
          ]}
        >
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={sizing.iconSm}
              color={theme.colors.text.tertiary}
              style={styles.leftIcon}
            />
          )}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              textStyles.body,
              { color: theme.colors.text.primary },
              leftIcon && { paddingLeft: 0 },
              rightIcon && { paddingRight: 0 },
              style,
            ]}
            placeholderTextColor={theme.colors.text.muted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && (
            <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
              <Icon
                name={rightIcon}
                size={sizing.iconSm}
                color={theme.colors.text.tertiary}
              />
            </Pressable>
          )}
        </Animated.View>
        {(error || helper) && (
          <Caption
            style={styles.helper}
            color={hasError ? theme.colors.semantic.error : undefined}
          >
            {error || helper}
          </Caption>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.base,
    borderWidth: 1,
    paddingHorizontal: spacing.base,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  leftIcon: {
    marginRight: spacing.md,
  },
  rightIcon: {
    marginLeft: spacing.md,
    padding: spacing.xs,
  },
  helper: {
    marginTop: spacing.xs,
  },
});

Input.displayName = 'Input';

export default Input;
