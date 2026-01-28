/**
 * Abundance Recode - Meditation Player Screen
 *
 * Full-featured audio player for guided meditations
 * Minimalist design with soft glowing wave animation
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H3,
  H4,
  Body,
  BodySmall,
  Label,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useMeditationStore, MeditationDuration } from '@store/useMeditationStore';
import { useProgressStore } from '@store/useProgressStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { duration as animDuration } from '@theme/animations';
import { RootStackParamList } from '@navigation/types';
import { MEDITATIONS_DATA } from '@content/meditations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MeditationPlayerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MeditationPlayer'
>;
type MeditationPlayerRouteProp = RouteProp<RootStackParamList, 'MeditationPlayer'>;

// Animated wave background component
const WaveBackground: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const theme = useAppTheme();
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      wave1.value = withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      wave2.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 500 }),
          withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      wave3.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 800 }),
          withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [isPlaying]);

  const wave1Style = useAnimatedStyle(() => ({
    opacity: interpolate(wave1.value, [0, 0.5, 1], [0.1, 0.3, 0.1]),
    transform: [
      { scale: interpolate(wave1.value, [0, 1], [1, 1.2]) },
    ],
  }));

  const wave2Style = useAnimatedStyle(() => ({
    opacity: interpolate(wave2.value, [0, 0.5, 1], [0.08, 0.2, 0.08]),
    transform: [
      { scale: interpolate(wave2.value, [0, 1], [1.1, 1.4]) },
    ],
  }));

  const wave3Style = useAnimatedStyle(() => ({
    opacity: interpolate(wave3.value, [0, 0.5, 1], [0.05, 0.15, 0.05]),
    transform: [
      { scale: interpolate(wave3.value, [0, 1], [1.2, 1.6]) },
    ],
  }));

  return (
    <View style={styles.waveContainer}>
      <Animated.View
        style={[
          styles.wave,
          { backgroundColor: theme.colors.accent.goldSoft },
          wave3Style,
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          { backgroundColor: theme.colors.primary.lavender },
          wave2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          { backgroundColor: theme.colors.accent.gold },
          wave1Style,
        ]}
      />
    </View>
  );
};

// Duration selector component
const DurationSelector: React.FC<{
  durations: MeditationDuration[];
  selected: MeditationDuration;
  onSelect: (duration: MeditationDuration) => void;
  disabled: boolean;
}> = ({ durations, selected, onSelect, disabled }) => {
  const theme = useAppTheme();

  return (
    <View style={styles.durationSelector}>
      {durations.map((dur) => {
        const isSelected = selected === dur;
        return (
          <TouchableOpacity
            key={dur}
            onPress={() => !disabled && onSelect(dur)}
            disabled={disabled}
            style={[
              styles.durationButton,
              {
                backgroundColor: isSelected
                  ? theme.colors.accent.goldSoft
                  : theme.colors.glass.background,
                borderColor: isSelected
                  ? theme.colors.accent.gold
                  : 'transparent',
                opacity: disabled && !isSelected ? 0.5 : 1,
              },
            ]}
            activeOpacity={0.7}
          >
            <Label
              color={
                isSelected
                  ? theme.colors.accent.gold
                  : theme.colors.text.secondary
              }
            >
              {dur} min
            </Label>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const MeditationPlayerScreen: React.FC = () => {
  const navigation = useNavigation<MeditationPlayerNavigationProp>();
  const route = useRoute<MeditationPlayerRouteProp>();
  const theme = useAppTheme();
  const { completeMeditation } = useProgressStore();
  const { startMeditation, pauseMeditation, resumeMeditation, stopMeditation } =
    useMeditationStore();

  const { meditationId, duration: initialDuration } = route.params;
  const meditation = MEDITATIONS_DATA.find((m) => m.id === meditationId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedDuration, setSelectedDuration] =
    useState<MeditationDuration>(initialDuration);
  const totalDuration = selectedDuration * 60; // in seconds

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentPosition < totalDuration) {
      interval = setInterval(() => {
        setCurrentPosition((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            handleMeditationComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const handleMeditationComplete = () => {
    completeMeditation(selectedDuration);
    // Could show completion modal here
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMeditation();
    } else {
      if (currentPosition === 0 && meditation) {
        startMeditation(meditation as any, selectedDuration);
      } else {
        resumeMeditation();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentPosition(0);
    stopMeditation();
  };

  const handleSeek = (value: number) => {
    setCurrentPosition(value);
  };

  const handleDurationChange = (duration: MeditationDuration) => {
    if (!isPlaying) {
      setSelectedDuration(duration);
      setCurrentPosition(0);
    }
  };

  const handleClose = () => {
    handleStop();
    navigation.goBack();
  };

  if (!meditation) {
    return null;
  }

  return (
    <ScreenWrapper style={styles.container}>
      {/* Wave animation background */}
      <WaveBackground isPlaying={isPlaying} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Icon
          name="close"
          size={sizing.iconBase}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Meditation info */}
        <View style={styles.infoSection}>
          <H3 align="center">{meditation.title}</H3>
          <Body
            align="center"
            color={theme.colors.text.secondary}
            style={styles.description}
          >
            {meditation.description}
          </Body>
        </View>

        {/* Duration selector */}
        <DurationSelector
          durations={meditation.durations}
          selected={selectedDuration}
          onSelect={handleDurationChange}
          disabled={isPlaying}
        />

        {/* Progress slider */}
        <View style={styles.progressSection}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={totalDuration}
            value={currentPosition}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={theme.colors.accent.gold}
            maximumTrackTintColor={theme.colors.glass.backgroundMedium}
            thumbTintColor={theme.colors.accent.gold}
          />
          <View style={styles.timeLabels}>
            <BodySmall color={theme.colors.text.tertiary}>
              {formatTime(currentPosition)}
            </BodySmall>
            <BodySmall color={theme.colors.text.tertiary}>
              {formatTime(totalDuration)}
            </BodySmall>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={() => setCurrentPosition(Math.max(0, currentPosition - 15))}
          >
            <Icon
              name="back"
              size={sizing.iconMd}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playButton,
              { backgroundColor: theme.colors.accent.gold },
            ]}
            onPress={handlePlayPause}
          >
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={sizing.iconLg}
              color={theme.colors.neutral.gray900}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={() =>
              setCurrentPosition(Math.min(totalDuration, currentPosition + 15))
            }
          >
            <Icon
              name="forward"
              size={sizing.iconMd}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Background sound selector */}
        <TouchableOpacity style={styles.soundSelector}>
          <GlassCard variant="light" style={styles.soundCard} noPadding>
            <View style={styles.soundContent}>
              <Icon
                name="volume"
                size={sizing.iconSm}
                color={theme.colors.text.secondary}
              />
              <BodySmall color={theme.colors.text.secondary}>
                Background Sound: Gentle Rain
              </BodySmall>
              <Icon
                name="chevronRight"
                size={sizing.iconSm}
                color={theme.colors.text.muted}
              />
            </View>
          </GlassCard>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waveContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
    borderRadius: SCREEN_WIDTH * 0.75,
  },
  closeButton: {
    position: 'absolute',
    top: spacing['3xl'],
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  description: {
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  durationButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  progressSection: {
    marginBottom: spacing['2xl'],
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2xl'],
    marginBottom: spacing['3xl'],
  },
  secondaryControl: {
    padding: spacing.md,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundSelector: {
    marginTop: 'auto',
  },
  soundCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  soundContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

export default MeditationPlayerScreen;
