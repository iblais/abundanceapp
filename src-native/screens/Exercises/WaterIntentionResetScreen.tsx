/**
 * Abundance Flow - Water Intention Reset Screen
 *
 * Matches reference with:
 * - Title "Water Intention Reset" at top
 * - Abstract wave pattern in background
 * - Water glass icon (SVG outline)
 * - Subtitle "Set an intention for this moment"
 * - Glass text input field
 * - Gold gradient "Complete Reset" button at bottom
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Rect, G } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H1,
  Body,
  BodySmall,
  Button,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type WaterIntentionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Water glass SVG icon
const WaterGlassIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 80,
  color = 'rgba(255, 255, 255, 0.7)',
}) => (
  <Svg width={size} height={size * 1.2} viewBox="0 0 80 96">
    <Defs>
      <SvgLinearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="rgba(200, 168, 255, 0.3)" />
        <Stop offset="100%" stopColor="rgba(200, 168, 255, 0.1)" />
      </SvgLinearGradient>
    </Defs>
    {/* Glass outline */}
    <Path
      d="M15 10 L65 10 L60 85 Q60 90 55 90 L25 90 Q20 90 20 85 L15 10 Z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    {/* Water inside */}
    <Path
      d="M20 35 L60 35 L57 82 Q57 85 54 85 L26 85 Q23 85 23 82 L20 35 Z"
      fill="url(#waterFill)"
    />
    {/* Water surface */}
    <Path
      d="M20 35 Q30 40 40 35 Q50 30 60 35"
      stroke="rgba(200, 168, 255, 0.5)"
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

// Abstract wave background
const WaveBackground: React.FC = () => {
  const theme = useAppTheme();

  return (
    <View style={styles.waveContainer}>
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT * 0.4}
        viewBox={`0 0 ${SCREEN_WIDTH} 300`}
        preserveAspectRatio="none"
      >
        <Defs>
          <SvgLinearGradient id="wave1" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="rgba(200, 168, 255, 0.08)" />
            <Stop offset="100%" stopColor="rgba(200, 168, 255, 0.02)" />
          </SvgLinearGradient>
          <SvgLinearGradient id="wave2" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="rgba(244, 209, 128, 0.05)" />
            <Stop offset="100%" stopColor="rgba(244, 209, 128, 0.01)" />
          </SvgLinearGradient>
        </Defs>
        {/* Wave 1 */}
        <Path
          d={`M0 150 Q${SCREEN_WIDTH * 0.25} 100 ${SCREEN_WIDTH * 0.5} 150 Q${SCREEN_WIDTH * 0.75} 200 ${SCREEN_WIDTH} 150 L${SCREEN_WIDTH} 300 L0 300 Z`}
          fill="url(#wave1)"
        />
        {/* Wave 2 */}
        <Path
          d={`M0 180 Q${SCREEN_WIDTH * 0.25} 220 ${SCREEN_WIDTH * 0.5} 180 Q${SCREEN_WIDTH * 0.75} 140 ${SCREEN_WIDTH} 180 L${SCREEN_WIDTH} 300 L0 300 Z`}
          fill="url(#wave2)"
        />
        {/* Wave 3 */}
        <Path
          d={`M0 200 Q${SCREEN_WIDTH * 0.3} 170 ${SCREEN_WIDTH * 0.6} 210 Q${SCREEN_WIDTH * 0.85} 250 ${SCREEN_WIDTH} 200 L${SCREEN_WIDTH} 300 L0 300 Z`}
          fill="url(#wave1)"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
};

export const WaterIntentionResetScreen: React.FC = () => {
  const navigation = useNavigation<WaterIntentionNavigationProp>();
  const theme = useAppTheme();

  const [intention, setIntention] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    if (!intention.trim()) return;

    setIsCompleting(true);

    // Simulate completion animation
    setTimeout(() => {
      setIsCompleting(false);
      navigation.goBack();
    }, 1500);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper padded={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Wave background */}
        <WaveBackground />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon
              name="close"
              size={sizing.iconBase}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <H1 align="center" style={styles.title}>
            Water Intention{'\n'}Reset
          </H1>

          {/* Water glass icon */}
          <View style={styles.iconContainer}>
            <WaterGlassIcon
              size={100}
              color={theme.colors.text.secondary}
            />
          </View>

          {/* Subtitle */}
          <Body
            align="center"
            color={theme.colors.text.secondary}
            style={styles.subtitle}
          >
            Set an intention for this moment
          </Body>

          {/* Input field */}
          <GlassCard variant="light" padding="base" style={styles.inputCard}>
            <TextInput
              value={intention}
              onChangeText={setIntention}
              placeholder="Enter your intention..."
              placeholderTextColor={theme.colors.text.muted}
              style={[
                styles.input,
                { color: theme.colors.text.primary },
              ]}
              multiline
              maxLength={200}
              textAlign="center"
            />
          </GlassCard>
        </View>

        {/* Bottom button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Complete Reset"
            onPress={handleComplete}
            variant="primary"
            size="large"
            fullWidth
            loading={isCompleting}
            disabled={!intention.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing['3xl'],
  },
  title: {
    marginBottom: spacing['2xl'],
  },
  iconContainer: {
    marginBottom: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  inputCard: {
    width: '100%',
    minHeight: 56,
  },
  input: {
    ...textStyles.body,
    minHeight: 40,
    paddingVertical: spacing.sm,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing['2xl'],
  },
});

export default WaterIntentionResetScreen;
