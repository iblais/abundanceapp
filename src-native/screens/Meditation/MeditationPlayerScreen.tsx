/**
 * Abundance Flow - Premium Meditation Player Screen
 *
 * Matches reference with:
 * - Top third: abstract gradient waves
 * - Center: large title text
 * - Glowing circular play button
 * - Progress bar with accentGold and muted track
 * - Duration pill buttons (5 min, 8 min, 12 min)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradientView from 'react-native-linear-gradient';
import {
  ScreenWrapper,
  H1,
  H3,
  Body,
  BodySmall,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useMeditationStore, MeditationDuration } from '@store/useMeditationStore';
import { useProgressStore } from '@store/useProgressStore';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { RootStackParamList } from '@navigation/types';
import { MEDITATIONS_DATA } from '@content/meditations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MeditationPlayerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MeditationPlayer'
>;
type MeditationPlayerRouteProp = RouteProp<RootStackParamList, 'MeditationPlayer'>;

// Abstract gradient wave background
const AbstractWaves: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const theme = useAppTheme();
  const animation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      animation.value = withRepeat(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    }
  }, [isPlaying]);

  const wave1Style = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 0.5, 1], [0.3, 0.5, 0.3]),
    transform: [{ translateY: interpolate(animation.value, [0, 1], [0, 20]) }],
  }));

  const wave2Style = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 0.5, 1], [0.2, 0.4, 0.2]),
    transform: [{ translateY: interpolate(animation.value, [0, 1], [10, -10]) }],
  }));

  return (
    <View style={styles.wavesContainer}>
      <Svg width={SCREEN_WIDTH} height={260} style={styles.wavesSvg}>
        <Defs>
          <LinearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.halo.violet} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={theme.colors.accent.gold} stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.accent.gold} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={theme.colors.halo.violetSoft} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        {/* Soft abstract shapes */}
        <Animated.View style={wave1Style}>
          <Ellipse cx={SCREEN_WIDTH * 0.3} cy="100" rx="180" ry="100" fill="url(#wave1)" />
        </Animated.View>
        <Animated.View style={wave2Style}>
          <Ellipse cx={SCREEN_WIDTH * 0.7} cy="140" rx="200" ry="120" fill="url(#wave2)" />
        </Animated.View>
      </Svg>
    </View>
  );
};

// Duration pill button
interface DurationPillProps {
  minutes: number;
  isSelected: boolean;
  onPress: () => void;
}

const DurationPill: React.FC<DurationPillProps> = ({ minutes, isSelected, onPress }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.durationPill,
        {
          backgroundColor: isSelected
            ? theme.colors.accent.gold
            : theme.colors.glass.fill,
          borderColor: isSelected
            ? theme.colors.accent.gold
            : theme.colors.glass.border,
        },
      ]}
    >
      <Text
        style={[
          textStyles.label,
          {
            color: isSelected
              ? theme.colors.text.inverse
              : theme.colors.text.primary,
          },
        ]}
      >
        {minutes} min
      </Text>
    </TouchableOpacity>
  );
};

// Glowing play button
interface PlayButtonProps {
  isPlaying: boolean;
  onPress: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onPress }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.playButtonOuter}
    >
      <LinearGradientView
        colors={theme.colors.gradients.goldButton}
        style={styles.playButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon
          name={isPlaying ? 'pause' : 'play'}
          size={32}
          color={theme.colors.text.inverse}
        />
      </LinearGradientView>
    </TouchableOpacity>
  );
};

export const MeditationPlayerScreen: React.FC = () => {
  const navigation = useNavigation<MeditationPlayerNavigationProp>();
  const route = useRoute<MeditationPlayerRouteProp>();
  const theme = useAppTheme();
  const { completeMeditation } = useProgressStore();

  const { meditationId, duration: initialDuration } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(initialDuration || 8);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(selectedDuration * 60);

  // Get meditation data
  const meditation = MEDITATIONS_DATA.find((m) => m.id === meditationId);

  // Update total time when duration changes
  useEffect(() => {
    setTotalTime(selectedDuration * 60);
    setCurrentTime(0);
  }, [selectedDuration]);

  // Playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < totalTime) {
      interval = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, totalTime));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalTime]);

  // Check if completed
  useEffect(() => {
    if (currentTime >= totalTime && totalTime > 0) {
      setIsPlaying(false);
      completeMeditation(meditationId, selectedDuration);
    }
  }, [currentTime, totalTime]);

  const handleClose = () => {
    navigation.goBack();
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? currentTime / totalTime : 0;

  return (
    <ScreenWrapper padded={false}>
      {/* Close button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="close" size={sizing.iconBase} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Abstract waves background */}
      <AbstractWaves isPlaying={isPlaying} />

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <H1 align="center" style={styles.title}>
            {meditation?.title || 'Meditation'}
          </H1>
          <BodySmall color={theme.colors.text.muted} align="center">
            {meditation?.description || 'Guided meditation'}
          </BodySmall>
        </View>

        {/* Play button */}
        <View style={styles.playContainer}>
          <PlayButton isPlaying={isPlaying} onPress={togglePlayback} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <LinearGradientView
              colors={theme.colors.gradients.progressRing}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <View style={styles.timeRow}>
            <BodySmall color={theme.colors.text.muted}>
              {formatTime(currentTime)}
            </BodySmall>
            <BodySmall color={theme.colors.text.muted}>
              {formatTime(totalTime)}
            </BodySmall>
          </View>
        </View>

        {/* Duration pills */}
        <View style={styles.durationContainer}>
          {[5, 8, 12].map((mins) => (
            <DurationPill
              key={mins}
              minutes={mins}
              isSelected={selectedDuration === mins}
              onPress={() => setSelectedDuration(mins)}
            />
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wavesContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 260,
    overflow: 'hidden',
  },
  wavesSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    justifyContent: 'center',
    paddingTop: 80,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  title: {
    marginBottom: spacing.sm,
  },
  playContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  playButtonOuter: {
    shadowColor: '#F4D180',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: spacing['2xl'],
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  durationPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
});

export default MeditationPlayerScreen;
