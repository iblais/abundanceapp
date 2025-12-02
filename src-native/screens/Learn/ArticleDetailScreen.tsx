/**
 * Abundance Flow - Article Detail Screen
 *
 * Beautiful reading view for educational articles
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  H2,
  H4,
  Body,
  BodySmall,
  Label,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';
import { ARTICLES } from '@content/articles';

type ArticleDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ArticleDetail'
>;
type ArticleDetailRouteProp = RouteProp<RootStackParamList, 'ArticleDetail'>;

export const ArticleDetailScreen: React.FC = () => {
  const navigation = useNavigation<ArticleDetailNavigationProp>();
  const route = useRoute<ArticleDetailRouteProp>();
  const theme = useAppTheme();

  const { articleId } = route.params;
  const article = ARTICLES.find((a) => a.id === articleId);

  const handleBack = () => {
    navigation.goBack();
  };

  if (!article) {
    return null;
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <H4 key={index} style={styles.heading}>
            {paragraph.replace('## ', '')}
          </H4>
        );
      }
      return (
        <Body
          key={index}
          color={theme.colors.text.secondary}
          style={styles.paragraph}
        >
          {paragraph}
        </Body>
      );
    });
  };

  return (
    <ScreenWrapper padded={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon
            name="chevronLeft"
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Header */}
        <View style={styles.articleHeader}>
          <BodySmall color={theme.colors.accent.gold} style={styles.category}>
            {article.category}
          </BodySmall>
          <H2 style={styles.title}>{article.title}</H2>
          <BodySmall color={theme.colors.text.muted}>
            {article.readTime} read
          </BodySmall>
        </View>

        {/* Article Content */}
        <View style={styles.content}>{renderContent(article.content)}</View>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <View style={styles.tagsSection}>
            {article.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme.colors.glass.background },
                ]}
              >
                <BodySmall color={theme.colors.text.tertiary}>{tag}</BodySmall>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  articleHeader: {
    marginBottom: spacing['2xl'],
  },
  category: {
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.md,
    lineHeight: 40,
  },
  content: {},
  heading: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  paragraph: {
    marginBottom: spacing.base,
    lineHeight: 26,
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
});

export default ArticleDetailScreen;
