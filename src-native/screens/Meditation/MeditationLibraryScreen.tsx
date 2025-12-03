/**
 * Abundance Flow - Premium Meditation Library Screen
 *
 * Matches reference screen with:
 * - Horizontal filter chips at top (glass pills)
 * - 3-column grid of glass cards
 * - Each card with title, duration, play icon
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H1,
  H4,
  Body,
  BodySmall,
  Label,
  LabelSmall,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useMeditationStore, MeditationCategory } from '@store/useMeditationStore';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';
import { MEDITATIONS_DATA } from '@content/meditations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SPACING = spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - layout.screenPaddingHorizontal * 2 - GRID_SPACING * 2) / 3;

type MeditationLibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Category filter chips
const CATEGORIES: { key: MeditationCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'focus', label: 'Focus' },
  { key: 'calm', label: 'Calm' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'abundance', label: 'Abundance' },
];

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isSelected, onPress }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: isSelected
            ? theme.colors.accent.goldOverlay
            : theme.colors.glass.fill,
          borderColor: isSelected
            ? theme.colors.accent.gold
            : theme.colors.glass.border,
        },
      ]}
      activeOpacity={0.7}
    >
      <Label
        color={
          isSelected ? theme.colors.accent.gold : theme.colors.text.secondary
        }
      >
        {label}
      </Label>
    </TouchableOpacity>
  );
};

interface MeditationGridCardProps {
  title: string;
  duration: string;
  onPress: () => void;
}

const MeditationGridCard: React.FC<MeditationGridCardProps> = ({
  title,
  duration,
  onPress,
}) => {
  const theme = useAppTheme();

  return (
    <GlassCard
      variant="light"
      onPress={onPress}
      style={styles.gridCard}
      padding="base"
      rounded="2xl"
    >
      <View style={styles.gridCardContent}>
        <H4 numberOfLines={2} style={styles.gridCardTitle}>
          {title}
        </H4>
        <View style={styles.gridCardMeta}>
          <LabelSmall color={theme.colors.text.muted}>{duration}</LabelSmall>
          <View
            style={[
              styles.playIcon,
              { backgroundColor: theme.colors.glass.fill },
            ]}
          >
            <Icon
              name="play"
              size={sizing.iconSm}
              color={theme.colors.text.secondary}
            />
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

export const MeditationLibraryScreen: React.FC = () => {
  const navigation = useNavigation<MeditationLibraryNavigationProp>();
  const theme = useAppTheme();
  const { favorites, toggleFavorite } = useMeditationStore();
  const [selectedCategory, setSelectedCategory] = useState<
    MeditationCategory | 'all'
  >('all');

  const filteredMeditations = useMemo(() => {
    if (selectedCategory === 'all') {
      return MEDITATIONS_DATA;
    }
    return MEDITATIONS_DATA.filter((m) => m.category === selectedCategory);
  }, [selectedCategory]);

  const handleMeditationPress = (meditationId: string) => {
    navigation.navigate('MeditationPlayer', {
      meditationId,
      duration: 8,
    });
  };

  // Group meditations into rows of 3
  const rows = useMemo(() => {
    const result: (typeof MEDITATIONS_DATA)[] = [];
    for (let i = 0; i < filteredMeditations.length; i += 3) {
      result.push(filteredMeditations.slice(i, i + 3));
    }
    return result;
  }, [filteredMeditations]);

  return (
    <ScreenWrapper padded={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <H1>Meditations</H1>
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {CATEGORIES.map((category) => (
            <FilterChip
              key={category.key}
              label={category.label}
              isSelected={selectedCategory === category.key}
              onPress={() => setSelectedCategory(category.key)}
            />
          ))}
        </ScrollView>

        {/* Meditation Grid */}
        <View style={styles.gridContainer}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((meditation) => (
                <MeditationGridCard
                  key={meditation.id}
                  title={meditation.title}
                  duration={`${meditation.durations[0]}-${meditation.durations[meditation.durations.length - 1]} min`}
                  onPress={() => handleMeditationPress(meditation.id)}
                />
              ))}
              {/* Fill empty spaces in last row */}
              {row.length < 3 &&
                Array(3 - row.length)
                  .fill(null)
                  .map((_, i) => (
                    <View key={`empty-${i}`} style={styles.gridCardEmpty} />
                  ))}
            </View>
          ))}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
    paddingBottom: spacing.base,
  },
  filterContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  gridContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  gridRow: {
    flexDirection: 'row',
    gap: GRID_SPACING,
    marginBottom: GRID_SPACING,
  },
  gridCard: {
    width: CARD_WIDTH,
    minHeight: 120,
  },
  gridCardEmpty: {
    width: CARD_WIDTH,
  },
  gridCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridCardTitle: {
    marginBottom: spacing.sm,
  },
  gridCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPadding: {
    height: sizing.tabBarHeight + spacing['2xl'],
  },
});

export default MeditationLibraryScreen;
