/**
 * Abundance Flow - Meditation Library Screen
 *
 * Browsable, filterable library of guided meditations
 * Categories: Confidence, Calm, Focus, Gratitude, Abundance, Identity
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
  H2,
  H4,
  Body,
  BodySmall,
  Label,
  LabelSmall,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useMeditationStore, MeditationCategory } from '@store/useMeditationStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';
import { MEDITATIONS_DATA } from '@content/meditations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MeditationLibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CategoryFilterProps {
  selected: MeditationCategory | 'all';
  onSelect: (category: MeditationCategory | 'all') => void;
}

const CATEGORIES: { key: MeditationCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'gratitude', label: 'Gratitude' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'calm', label: 'Calm' },
  { key: 'focus', label: 'Focus' },
  { key: 'abundance', label: 'Abundance' },
  { key: 'identity', label: 'Identity' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  const theme = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
    >
      {CATEGORIES.map((category) => {
        const isSelected = selected === category.key;
        return (
          <TouchableOpacity
            key={category.key}
            onPress={() => onSelect(category.key)}
            style={[
              styles.filterChip,
              {
                backgroundColor: isSelected
                  ? theme.colors.accent.goldSoft
                  : theme.colors.glass.background,
                borderColor: isSelected
                  ? theme.colors.accent.gold
                  : 'transparent',
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
              {category.label}
            </Label>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

interface MeditationCardProps {
  meditation: (typeof MEDITATIONS_DATA)[0];
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MeditationCard: React.FC<MeditationCardProps> = ({
  meditation,
  onPress,
  isFavorite,
  onToggleFavorite,
}) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassCard variant="light" style={styles.meditationCard}>
        <View style={styles.meditationContent}>
          <View
            style={[
              styles.meditationIcon,
              { backgroundColor: theme.colors.accent.goldSoft },
            ]}
          >
            <Icon
              name="meditation"
              size={sizing.iconBase}
              color={theme.colors.accent.gold}
            />
          </View>
          <View style={styles.meditationInfo}>
            <H4 numberOfLines={1}>{meditation.title}</H4>
            <BodySmall
              color={theme.colors.text.tertiary}
              numberOfLines={2}
            >
              {meditation.description}
            </BodySmall>
            <View style={styles.meditationMeta}>
              <View style={styles.durationTags}>
                {meditation.durations.map((dur) => (
                  <View
                    key={dur}
                    style={[
                      styles.durationTag,
                      { backgroundColor: theme.colors.glass.background },
                    ]}
                  >
                    <LabelSmall color={theme.colors.text.tertiary}>
                      {dur} min
                    </LabelSmall>
                  </View>
                ))}
              </View>
              {meditation.isPremium && (
                <View
                  style={[
                    styles.premiumBadge,
                    { backgroundColor: theme.colors.accent.goldSoft },
                  ]}
                >
                  <LabelSmall color={theme.colors.accent.gold}>
                    Premium
                  </LabelSmall>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.favoriteButton}
          >
            <Icon
              name={isFavorite ? 'heartFilled' : 'heart'}
              size={sizing.iconBase}
              color={
                isFavorite
                  ? theme.colors.accent.gold
                  : theme.colors.text.muted
              }
            />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

export const MeditationLibraryScreen: React.FC = () => {
  const navigation = useNavigation<MeditationLibraryNavigationProp>();
  const theme = useAppTheme();
  const { favorites, toggleFavorite, recentlyPlayed } = useMeditationStore();
  const [selectedCategory, setSelectedCategory] = useState<
    MeditationCategory | 'all'
  >('all');

  const filteredMeditations = useMemo(() => {
    if (selectedCategory === 'all') {
      return MEDITATIONS_DATA;
    }
    return MEDITATIONS_DATA.filter((m) => m.category === selectedCategory);
  }, [selectedCategory]);

  const recentMeditations = useMemo(() => {
    return recentlyPlayed
      .slice(0, 3)
      .map((id) => MEDITATIONS_DATA.find((m) => m.id === id))
      .filter(Boolean);
  }, [recentlyPlayed]);

  const handleMeditationPress = (meditationId: string) => {
    navigation.navigate('MeditationPlayer', {
      meditationId,
      duration: 8, // Default duration
    });
  };

  return (
    <ScreenWrapper padded={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <H2>Meditations</H2>
          <Body color={theme.colors.text.secondary}>
            Guided practices for transformation
          </Body>
        </View>

        {/* Category Filter */}
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Recently Played */}
        {recentMeditations.length > 0 && selectedCategory === 'all' && (
          <View style={styles.section}>
            <H4 style={styles.sectionTitle}>Recently Played</H4>
            {recentMeditations.map((meditation) => (
              <MeditationCard
                key={meditation!.id}
                meditation={meditation!}
                onPress={() => handleMeditationPress(meditation!.id)}
                isFavorite={favorites.includes(meditation!.id)}
                onToggleFavorite={() => toggleFavorite(meditation!.id)}
              />
            ))}
          </View>
        )}

        {/* All Meditations */}
        <View style={styles.section}>
          {selectedCategory === 'all' && recentMeditations.length > 0 && (
            <H4 style={styles.sectionTitle}>All Meditations</H4>
          )}
          {filteredMeditations.map((meditation) => (
            <MeditationCard
              key={meditation.id}
              meditation={meditation}
              onPress={() => handleMeditationPress(meditation.id)}
              isFavorite={favorites.includes(meditation.id)}
              onToggleFavorite={() => toggleFavorite(meditation.id)}
            />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  meditationCard: {
    marginBottom: spacing.md,
  },
  meditationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  meditationIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  meditationInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  meditationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  durationTags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  durationTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  premiumBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginLeft: spacing.sm,
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  bottomPadding: {
    height: sizing.tabBarHeight + spacing['2xl'],
  },
});

export default MeditationLibraryScreen;
