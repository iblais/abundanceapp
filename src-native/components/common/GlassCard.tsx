/**
 * Abundance Recode - Glass Card Component
 *
 * Premium glassmorphic card with translucent effect
 * Default border radius: 20px as per spec
 */

import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '@theme/ThemeContext';
import { borderRadius, spacing } from '@theme/spacing';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'light' | 'medium' | 'accent';
  padding?: keyof typeof spacing | number;
  noPadding?: boolean;
  onPress?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'lg',
  noPadding = false,
}) => {
  const theme = useAppTheme();

  const getBackgroundColors = () => {
    switch (variant) {
      case 'light':
        return [
          theme.colors.glass.backgroundLight,
          theme.colors.glass.background,
        ];
      case 'medium':
        return [
          theme.colors.glass.backgroundMedium,
          theme.colors.glass.backgroundLight,
        ];
      case 'accent':
        return theme.colors.gradients.softPurple;
      default:
        return theme.colors.gradients.cardGlass;
    }
  };

  const paddingValue = noPadding
    ? 0
    : typeof padding === 'number'
    ? padding
    : spacing[padding];

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getBackgroundColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            borderColor: theme.colors.glass.border,
            padding: paddingValue,
          },
        ]}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
  },
  gradient: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});

export default GlassCard;
