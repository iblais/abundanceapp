/**
 * Abundance Flow - Premium Soundscapes Screen
 *
 * Matches reference with:
 * - Title "Soundscapes" and subtitle at top
 * - 2-column grid of glass cards with gradient thumbnails
 * - Each card: name, duration, play icon
 * - Mini player bar at bottom
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import {
  ScreenWrapper,
  GlassCard,
  H1,
  H4,
  Body,
  BodySmall,
  LabelSmall,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { textStyles } from '@theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - layout.screenPaddingHorizontal * 2 - CARD_GAP) / 2;

// Soundscape data
const SOUNDSCAPES = [
  { id: '1', name: 'Forest Rain', duration: '45:30', gradient: ['#1a472a', '#2d5a3f', '#3d6b4f'] },
  { id: '2', name: 'Ocean Waves', duration: '52:15', gradient: ['#1a3a4a', '#2a5a6a', '#3a7a8a'] },
  { id: '3', name: 'Gentle Piano', duration: '40:00', gradient: ['#4a3a5a', '#6a5a7a', '#8a7a9a'] },
  { id: '4', name: 'Mountain Breeze', duration: '38:45', gradient: ['#3a4a3a', '#5a6a5a', '#7a8a7a'] },
  { id: '5', name: 'Quiet Cafe', duration: '50:10', gradient: ['#5a4a3a', '#7a6a5a', '#9a8a7a'] },
  { id: '6', name: 'Sunset Hues', duration: '47:20', gradient: ['#5a3a4a', '#8a5a6a', '#ba7a8a'] },
];

// Abstract gradient thumbnail
interface GradientThumbnailProps {
  colors: string[];
  size: number;
}

const GradientThumbnail: React.FC<GradientThumbnailProps> = ({ colors, size }) => {
  return (
    <View style={[styles.thumbnail, { width: size, height: size }]}>
      <LinearGradient
        colors={colors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Abstract wave pattern overlay */}
      <Svg width={size} height={size} style={styles.thumbnailOverlay}>
        <Defs>
          <SvgGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </SvgGradient>
        </Defs>
        <Path
          d={`M 0 ${size * 0.6} Q ${size * 0.25} ${size * 0.4}, ${size * 0.5} ${size * 0.55} T ${size} ${size * 0.45} L ${size} ${size} L 0 ${size} Z`}
          fill="url(#waveGrad)"
        />
      </Svg>
    </View>
  );
};

// Soundscape card
interface SoundscapeCardProps {
  name: string;
  duration: string;
  gradient: string[];
  isPlaying: boolean;
  onPress: () => void;
}

const SoundscapeCard: React.FC<SoundscapeCardProps> = ({
  name,
  duration,
  gradient,
  isPlaying,
  onPress,
}) => {
  const theme = useAppTheme();

  return (
    <GlassCard
      variant="light"
      onPress={onPress}
      style={styles.soundscapeCard}
      padding={0}
      rounded="2xl"
    >
      <View style={styles.cardContent}>
        <GradientThumbnail colors={gradient} size={CARD_WIDTH - 2} />
        <View style={styles.cardInfo}>
          <H4 numberOfLines={1} style={styles.cardTitle}>{name}</H4>
          <View style={styles.cardMeta}>
            <LabelSmall color={theme.colors.text.muted}>{duration}</LabelSmall>
            <View style={[styles.playIconSmall, { backgroundColor: theme.colors.glass.fill }]}>
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={12}
                color={theme.colors.text.secondary}
              />
            </View>
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

// Mini player bar
interface MiniPlayerProps {
  soundscape: typeof SOUNDSCAPES[0] | null;
  isPlaying: boolean;
  currentTime: string;
  onPlayPause: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  soundscape,
  isPlaying,
  currentTime,
  onPlayPause,
}) => {
  const theme = useAppTheme();

  if (!soundscape) return null;

  return (
    <GlassCard variant="medium" style={styles.miniPlayer} padding="md" rounded="2xl">
      <View style={styles.miniPlayerContent}>
        {/* Thumbnail */}
        <View style={styles.miniThumbnail}>
          <LinearGradient
            colors={soundscape.gradient}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>

        {/* Info */}
        <View style={styles.miniInfo}>
          <BodySmall color={theme.colors.text.primary} numberOfLines={1}>
            {soundscape.name}
          </BodySmall>
          <LabelSmall color={theme.colors.text.muted}>
            {currentTime} / {soundscape.duration}
          </LabelSmall>
        </View>

        {/* Controls */}
        <View style={styles.miniControls}>
          <TouchableOpacity onPress={onPlayPause} style={styles.miniPlayButton}>
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={sizing.iconBase}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );
};

export const SoundscapesScreen: React.FC = () => {
  const theme = useAppTheme();
  const [currentSoundscape, setCurrentSoundscape] = useState<typeof SOUNDSCAPES[0] | null>(SOUNDSCAPES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState('12:45');

  const handleSoundscapePress = (soundscape: typeof SOUNDSCAPES[0]) => {
    setCurrentSoundscape(soundscape);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Group soundscapes into rows of 2
  const rows = [];
  for (let i = 0; i < SOUNDSCAPES.length; i += 2) {
    rows.push(SOUNDSCAPES.slice(i, i + 2));
  }

  return (
    <ScreenWrapper padded={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <H1>Soundscapes</H1>
          <Body color={theme.colors.text.secondary} style={styles.subtitle}>
            Ambient audio for focus & flow
          </Body>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((soundscape) => (
                <SoundscapeCard
                  key={soundscape.id}
                  name={soundscape.name}
                  duration={soundscape.duration}
                  gradient={soundscape.gradient}
                  isPlaying={isPlaying && currentSoundscape?.id === soundscape.id}
                  onPress={() => handleSoundscapePress(soundscape)}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Bottom padding for mini player */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Mini Player */}
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer
          soundscape={currentSoundscape}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onPlayPause={handlePlayPause}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  grid: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  gridRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  soundscapeCard: {
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardContent: {
    overflow: 'hidden',
    borderRadius: borderRadius['2xl'],
  },
  thumbnail: {
    overflow: 'hidden',
    borderTopLeftRadius: borderRadius['2xl'] - 1,
    borderTopRightRadius: borderRadius['2xl'] - 1,
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardInfo: {
    padding: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPadding: {
    height: 120,
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: layout.screenPaddingHorizontal,
    right: layout.screenPaddingHorizontal,
  },
  miniPlayer: {
    marginBottom: 0,
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniThumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  miniInfo: {
    flex: 1,
  },
  miniControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  miniPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SoundscapesScreen;
