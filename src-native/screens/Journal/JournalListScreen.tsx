/**
 * Abundance Flow - Journal List Screen
 *
 * Displays journal entries with access to gratitude, freeform,
 * identity exercises, and the Reality Shift Board
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H2,
  H3,
  H4,
  Body,
  BodySmall,
  Label,
  LabelSmall,
  Icon,
  Button,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useJournalStore, JournalEntry, JournalType } from '@store/useJournalStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type JournalListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface JournalTabProps {
  selected: JournalType | 'all';
  onSelect: (type: JournalType | 'all') => void;
}

const JOURNAL_TABS: { key: JournalType | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'journal' },
  { key: 'gratitude', label: 'Gratitude', icon: 'heart' },
  { key: 'identity', label: 'Identity', icon: 'sparkle' },
  { key: 'freeform', label: 'Freeform', icon: 'edit' },
];

const JournalTabs: React.FC<JournalTabProps> = ({ selected, onSelect }) => {
  const theme = useAppTheme();

  return (
    <View style={styles.tabsContainer}>
      {JOURNAL_TABS.map((tab) => {
        const isSelected = selected === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[
              styles.tab,
              {
                backgroundColor: isSelected
                  ? theme.colors.accent.goldSoft
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
              {tab.label}
            </Label>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  color,
}) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.quickAction}>
      <GlassCard variant="light" style={styles.quickActionCard}>
        <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
          <Icon name={icon as any} size={sizing.iconBase} color={color} />
        </View>
        <H4 style={styles.quickActionTitle}>{title}</H4>
        <LabelSmall color={theme.colors.text.tertiary}>{subtitle}</LabelSmall>
      </GlassCard>
    </TouchableOpacity>
  );
};

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onPress }) => {
  const theme = useAppTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: JournalType) => {
    switch (type) {
      case 'gratitude':
        return 'heart';
      case 'identity':
        return 'sparkle';
      case 'reflection':
        return 'brain';
      default:
        return 'journal';
    }
  };

  const getTypeColor = (type: JournalType) => {
    switch (type) {
      case 'gratitude':
        return theme.colors.accent.gold;
      case 'identity':
        return theme.colors.primary.lavender;
      case 'reflection':
        return theme.colors.semantic.info;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassCard variant="light" style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <View style={styles.entryTypeIndicator}>
            <Icon
              name={getTypeIcon(entry.type) as any}
              size={sizing.iconSm}
              color={getTypeColor(entry.type)}
            />
          </View>
          <View style={styles.entryMeta}>
            <LabelSmall color={theme.colors.text.tertiary}>
              {formatDate(entry.createdAt)}
            </LabelSmall>
            {entry.isFavorite && (
              <Icon
                name="heartFilled"
                size={sizing.iconXs}
                color={theme.colors.accent.gold}
              />
            )}
          </View>
        </View>
        {entry.title && <H4 numberOfLines={1}>{entry.title}</H4>}
        <Body
          color={theme.colors.text.secondary}
          numberOfLines={2}
          style={styles.entryContent}
        >
          {entry.content}
        </Body>
      </GlassCard>
    </TouchableOpacity>
  );
};

export const JournalListScreen: React.FC = () => {
  const navigation = useNavigation<JournalListNavigationProp>();
  const theme = useAppTheme();
  const { entries } = useJournalStore();
  const [selectedTab, setSelectedTab] = useState<JournalType | 'all'>('all');

  const filteredEntries = useMemo(() => {
    if (selectedTab === 'all') {
      return entries;
    }
    return entries.filter((e) => e.type === selectedTab);
  }, [entries, selectedTab]);

  const handleNewEntry = (type: JournalType) => {
    navigation.navigate('JournalEntry', { type });
  };

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('JournalEntry', { entryId });
  };

  const handleShiftBoard = () => {
    // Navigate to Reality Shift Board
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
          <H2>Journal</H2>
          <Body color={theme.colors.text.secondary}>
            Capture your thoughts and transformations
          </Body>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            <QuickAction
              title="Gratitude"
              subtitle="What are you grateful for?"
              icon="heart"
              onPress={() => handleNewEntry('gratitude')}
              color={theme.colors.accent.gold}
            />
            <QuickAction
              title="Identity"
              subtitle="Embody your future self"
              icon="sparkle"
              onPress={() => handleNewEntry('identity')}
              color={theme.colors.primary.lavender}
            />
            <QuickAction
              title="Shift Board"
              subtitle="Vision & goals"
              icon="grid"
              onPress={handleShiftBoard}
              color={theme.colors.semantic.info}
            />
            <QuickAction
              title="Freeform"
              subtitle="Open writing"
              icon="edit"
              onPress={() => handleNewEntry('freeform')}
              color={theme.colors.text.secondary}
            />
          </ScrollView>
        </View>

        {/* Tabs */}
        <JournalTabs selected={selectedTab} onSelect={setSelectedTab} />

        {/* Entries List */}
        <View style={styles.entriesSection}>
          {filteredEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name="journal"
                size={sizing.iconXl}
                color={theme.colors.text.muted}
              />
              <Body
                color={theme.colors.text.tertiary}
                align="center"
                style={styles.emptyText}
              >
                No entries yet.{'\n'}Start by creating your first journal entry.
              </Body>
              <Button
                title="Start Writing"
                onPress={() => handleNewEntry('gratitude')}
                variant="primary"
                size="medium"
              />
            </View>
          ) : (
            filteredEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onPress={() => handleEntryPress(entry.id)}
              />
            ))
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* FAB for new entry */}
      {entries.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.accent.gold }]}
          onPress={() => handleNewEntry('gratitude')}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={sizing.iconBase} color={theme.colors.neutral.gray900} />
        </TouchableOpacity>
      )}
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
  quickActionsContainer: {
    marginBottom: spacing.lg,
  },
  quickActionsScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  quickAction: {
    width: 140,
  },
  quickActionCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    marginBottom: spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  entriesSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  entryCard: {
    marginBottom: spacing.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  entryTypeIndicator: {
    opacity: 0.8,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  entryContent: {
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    marginVertical: spacing.lg,
  },
  bottomPadding: {
    height: sizing.tabBarHeight + spacing['2xl'],
  },
  fab: {
    position: 'absolute',
    bottom: sizing.tabBarHeight + spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default JournalListScreen;
