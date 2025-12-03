/**
 * Abundance Flow - Premium Glass Card Component
 *
 * Glassmorphic card matching the reference screens exactly:
 * - Blur radius medium-high
 * - Fill: glassFill (white 10-14% opacity)
 * - Border: 1px glassBorder
 * - Inner gradient: top white at 5-8% to bottom transparent
 * - Soft outside shadow to lift the card off background
 */

import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { useAppTheme } from '@theme/ThemeContext';
import { borderRadius, spacing, layout } from '@theme/spacing';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'light' | 'medium' | 'accent' | 'elevated';
  padding?: keyof typeof spacing | number;
  noPadding?: boolean;
  onPress?: () => void;
  blurAmount?: number;
  rounded?: keyof typeof borderRadius;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'lg',
  noPadding = false,
  onPress,
  blurAmount = 20,
  rounded = '3xl',
}) => {
  const theme = useAppTheme();

  // Get background gradient colors based on variant
  const getGradientColors = (): string[] => {
    switch (variant) {
      case 'light':
        return [
          theme.colors.glass.fillLight,
          theme.colors.glass.fill,
        ];
      case 'medium':
        return [
          theme.colors.glass.fillMedium,
          theme.colors.glass.fillLight,
        ];
      case 'accent':
        return theme.colors.gradients.softViolet;
      case 'elevated':
        return [
          'rgba(255, 255, 255, 0.18)',
          'rgba(255, 255, 255, 0.08)',
        ];
      default:
        return theme.colors.gradients.glassCard;
    }
  };

  // Inner highlight gradient (top white shimmer)
  const getHighlightColors = (): string[] => {
    return [
      'rgba(255, 255, 255, 0.08)',
      'rgba(255, 255, 255, 0.02)',
      'rgba(255, 255, 255, 0)',
    ];
  };

  const paddingValue = noPadding
    ? 0
    : typeof padding === 'number'
    ? padding
    : spacing[padding];

  const radiusValue = borderRadius[rounded];

  // Shadow for elevation effect
  const shadowStyle: ViewStyle = {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  };

  const content = (
    <View style={[styles.container, { borderRadius: radiusValue }, shadowStyle, style]}>
      {/* Blur background (iOS only for performance) */}
      {Platform.OS === 'ios' && (
        <BlurView
          style={[StyleSheet.absoluteFill, { borderRadius: radiusValue }]}
          blurType={theme.isDark ? 'dark' : 'light'}
          blurAmount={blurAmount}
        />
      )}

      {/* Main gradient fill */}
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            borderRadius: radiusValue,
            borderColor: theme.colors.glass.border,
            padding: paddingValue,
          },
        ]}
      >
        {/* Inner highlight shimmer */}
        <LinearGradient
          colors={getHighlightColors()}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={[styles.highlight, { borderRadius: radiusValue - 1 }]}
        />

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});

export default GlassCard;
