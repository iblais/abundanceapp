/**
 * Abundance Flow - Premium Learn & Grow Screen
 *
 * Matches reference with:
 * - Title "Learn & Grow" and subtitle at top
 * - Horizontal carousel of tall glass cards with gradient thumbnails
 * - Below: stacked glass list of additional articles
 * - Each card: title, duration, arrow icon
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = SCREEN_WIDTH * 0.65;
const FEATURED_CARD_HEIGHT = 220;

type LearnNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Article data
const FEATURED_ARTICLES = [
  {
    id: '1',
    title: 'The Science of Gratitude',
    duration: '5 min read',
    gradient: ['#3a4a6a', '#2a3a5a', '#1a2a4a'],
  },
  {
    id: '2',
    title: 'Building Emotional Resilience',
    duration: '8 min read',
    gradient: ['#4a3a5a', '#3a2a4a', '#2a1a3a'],
  },
  {
    id: '3',
    title: 'Morning Routines for Success',
    duration: '6 min read',
    gradient: ['#3a5a4a', '#2a4a3a', '#1a3a2a'],
  },
];

const MORE_ARTICLES = [
  { id: '4', title: 'Understanding Your Alignment Score', duration: '4 min read' },
  { id: '5', title: 'The Power of Visualization', duration: '7 min read' },
  { id: '6', title: 'Creating Lasting Habits', duration: '5 min read' },
  { id: '7', title: 'Mindfulness in Daily Life', duration: '6 min read' },
];

// Featured article card with gradient thumbnail
interface FeaturedCardProps {
  title: string;
  duration: string;
  gradient: string[];
  onPress: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  duration,
  gradient,
  onPress,
}) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.featuredCard}
    >
      <LinearGradient
        colors={gradient}
        style={styles.featuredGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Glass overlay */}
        <View style={styles.featuredOverlay}>
          {/* Arrow icon */}
          <View style={styles.featuredArrow}>
            <Icon
              name="chevronRight"
              size={sizing.iconSm}
              color={theme.colors.text.secondary}
            />
          </View>

          {/* Content at bottom */}
          <View style={styles.featuredContent}>
            <H4 numberOfLines={2} style={styles.featuredTitle}>
              {title}
            </H4>
            <LabelSmall color={theme.colors.text.muted}>{duration}</LabelSmall>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Article list item
interface ArticleListItemProps {
  title: string;
  duration: string;
  onPress: () => void;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({
  title,
  duration,
  onPress,
}) => {
  const theme = useAppTheme();

  return (
    <GlassCard variant="light" onPress={onPress} padding="base">
      <View style={styles.listItemContent}>
        <View style={styles.listItemText}>
          <H4 numberOfLines={1}>{title}</H4>
          <LabelSmall color={theme.colors.text.muted}>{duration}</LabelSmall>
        </View>
        <Icon
          name="chevronRight"
          size={sizing.iconSm}
          color={theme.colors.text.muted}
        />
      </View>
    </GlassCard>
  );
};

export const LearnScreen: React.FC = () => {
  const navigation = useNavigation<LearnNavigationProp>();
  const theme = useAppTheme();

  const handleArticlePress = (articleId: string) => {
    navigation.navigate('ArticleDetail', { articleId });
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
          <H1>Learn & Grow</H1>
          <Body color={theme.colors.text.secondary} style={styles.subtitle}>
            Evidence-based insights
          </Body>
        </View>

        {/* Featured Carousel */}
        <View style={styles.carouselSection}>
          <BodySmall color={theme.colors.text.muted} style={styles.sectionLabel}>
            FEATURED
          </BodySmall>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            decelerationRate="fast"
            snapToInterval={FEATURED_CARD_WIDTH + spacing.md}
          >
            {FEATURED_ARTICLES.map((article) => (
              <FeaturedCard
                key={article.id}
                title={article.title}
                duration={article.duration}
                gradient={article.gradient}
                onPress={() => handleArticlePress(article.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* More Articles List */}
        <View style={styles.listSection}>
          <BodySmall color={theme.colors.text.muted} style={styles.sectionLabel}>
            MORE ARTICLES
          </BodySmall>
          <View style={styles.listContainer}>
            {MORE_ARTICLES.map((article) => (
              <ArticleListItem
                key={article.id}
                title={article.title}
                duration={article.duration}
                onPress={() => handleArticlePress(article.id)}
              />
            ))}
          </View>
        </View>

        {/* Bottom padding */}
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
    paddingBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  carouselSection: {
    marginBottom: spacing['2xl'],
  },
  sectionLabel: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  carousel: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: spacing.md,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    height: FEATURED_CARD_HEIGHT,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  featuredGradient: {
    flex: 1,
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  featuredArrow: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    gap: spacing.xs,
  },
  featuredTitle: {
    color: '#FFFFFF',
  },
  listSection: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  listContainer: {
    gap: spacing.md,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    flex: 1,
    gap: spacing.xs,
  },
  bottomPadding: {
    height: sizing.tabBarHeight + spacing['2xl'],
  },
});

export default LearnScreen;
