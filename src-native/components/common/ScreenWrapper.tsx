/**
 * Abundance Flow - Premium Screen Wrapper Component
 *
 * Provides consistent screen layout with:
 * - Deep indigo gradient background (bgPrimaryStart to bgPrimaryEnd)
 * - Safe area handling
 * - Optional radial halo effect
 */

import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  StyleProp,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '@theme/ThemeContext';
import { layout, spacing } from '@theme/spacing';

interface ScreenWrapperProps {
  children: ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  safeArea?: boolean;
  keyboardAvoiding?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  showHeader?: boolean;
  headerComponent?: ReactNode;
  backgroundColor?: string[];
  showHalo?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  padded = true,
  safeArea = true,
  keyboardAvoiding = false,
  style,
  contentStyle,
  showHeader = false,
  headerComponent,
  backgroundColor,
  showHalo = false,
}) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  // Use new premium background gradient
  const gradientColors = backgroundColor || theme.colors.gradients.primaryBackground;

  const paddingStyle: ViewStyle = padded
    ? {
        paddingHorizontal: layout.screenPaddingHorizontal,
      }
    : {};

  const safeAreaStyle: ViewStyle = safeArea
    ? {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }
    : {};

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            paddingStyle,
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.content, paddingStyle, contentStyle]}>
        {children}
      </View>
    );
  };

  const renderInner = () => (
    <View style={[styles.innerContainer, safeAreaStyle, style]}>
      {showHeader && headerComponent}
      {renderContent()}
    </View>
  );

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Optional halo glow effect */}
      {showHalo && (
        <LinearGradient
          colors={theme.colors.gradients.haloGlow}
          style={styles.haloGlow}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      )}

      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {renderInner()}
        </KeyboardAvoidingView>
      ) : (
        renderInner()
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing['3xl'],
  },
  haloGlow: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
});

export default ScreenWrapper;
