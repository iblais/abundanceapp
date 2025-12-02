/**
 * Abundance Flow - Journal Entry Screen
 *
 * Rich text editor for journaling with prompts
 * Supports gratitude, identity, freeform, and reflection entries
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
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
  Button,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useJournalStore, JournalType } from '@store/useJournalStore';
import { useProgressStore } from '@store/useProgressStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { RootStackParamList } from '@navigation/types';
import { JOURNAL_PROMPTS } from '@content/journalPrompts';

type JournalEntryNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'JournalEntry'
>;
type JournalEntryRouteProp = RouteProp<RootStackParamList, 'JournalEntry'>;

const TYPE_CONFIG: Record<
  JournalType,
  { title: string; icon: string; color: string }
> = {
  gratitude: {
    title: 'Gratitude Journal',
    icon: 'heart',
    color: '#C9A961',
  },
  identity: {
    title: 'Identity Exercise',
    icon: 'sparkle',
    color: '#8B7BB8',
  },
  freeform: {
    title: 'Free Writing',
    icon: 'edit',
    color: '#8E8E93',
  },
  reflection: {
    title: 'Reflection',
    icon: 'brain',
    color: '#5AC8FA',
  },
};

export const JournalEntryScreen: React.FC = () => {
  const navigation = useNavigation<JournalEntryNavigationProp>();
  const route = useRoute<JournalEntryRouteProp>();
  const theme = useAppTheme();
  const { entries, addEntry, updateEntry } = useJournalStore();
  const { addJournalEntry } = useProgressStore();

  const { entryId, type: initialType } = route.params || {};

  // Find existing entry if editing
  const existingEntry = entryId
    ? entries.find((e) => e.id === entryId)
    : null;

  const entryType: JournalType = existingEntry?.type || initialType || 'gratitude';
  const config = TYPE_CONFIG[entryType];

  const [content, setContent] = useState(existingEntry?.content || '');
  const [title, setTitle] = useState(existingEntry?.title || '');
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const contentRef = useRef<TextInput>(null);

  // Select a random prompt for the type
  useEffect(() => {
    if (!existingEntry) {
      const prompts = JOURNAL_PROMPTS[entryType] || [];
      if (prompts.length > 0) {
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setCurrentPrompt(randomPrompt);
      }
    }
  }, [entryType, existingEntry]);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);

    try {
      if (existingEntry) {
        updateEntry(existingEntry.id, {
          content: content.trim(),
          title: title.trim() || undefined,
        });
      } else {
        addEntry({
          type: entryType,
          content: content.trim(),
          title: title.trim() || undefined,
          promptText: currentPrompt || undefined,
          tags: [],
          isFavorite: false,
        });
        addJournalEntry();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRefreshPrompt = () => {
    const prompts = JOURNAL_PROMPTS[entryType] || [];
    if (prompts.length > 0) {
      let newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      // Make sure it's different from current
      while (newPrompt === currentPrompt && prompts.length > 1) {
        newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      }
      setCurrentPrompt(newPrompt);
    }
  };

  return (
    <ScreenWrapper keyboardAvoiding>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
          <Icon
            name="close"
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Icon
            name={config.icon as any}
            size={sizing.iconSm}
            color={config.color}
          />
          <Label style={styles.headerLabel}>{config.title}</Label>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={!content.trim() || isSaving}
        >
          <Label
            color={
              content.trim()
                ? theme.colors.accent.gold
                : theme.colors.text.muted
            }
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Label>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Prompt Card */}
        {currentPrompt && !existingEntry && (
          <GlassCard variant="accent" style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <BodySmall color={theme.colors.text.secondary}>
                Today's Prompt
              </BodySmall>
              <TouchableOpacity onPress={handleRefreshPrompt}>
                <Icon
                  name="refresh"
                  size={sizing.iconSm}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
            <Body style={styles.promptText}>{currentPrompt}</Body>
          </GlassCard>
        )}

        {/* Title Input (optional) */}
        <TextInput
          style={[
            styles.titleInput,
            textStyles.h3,
            { color: theme.colors.text.primary },
          ]}
          placeholder="Title (optional)"
          placeholderTextColor={theme.colors.text.muted}
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          onSubmitEditing={() => contentRef.current?.focus()}
        />

        {/* Content Input */}
        <TextInput
          ref={contentRef}
          style={[
            styles.contentInput,
            textStyles.body,
            { color: theme.colors.text.primary },
          ]}
          placeholder="Start writing..."
          placeholderTextColor={theme.colors.text.muted}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          autoFocus={!currentPrompt}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  headerButton: {
    padding: spacing.sm,
    minWidth: 60,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLabel: {
    marginLeft: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  promptCard: {
    marginBottom: spacing.xl,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  promptText: {
    fontStyle: 'italic',
    lineHeight: 24,
  },
  titleInput: {
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  contentInput: {
    flex: 1,
    minHeight: 300,
    paddingVertical: spacing.sm,
    lineHeight: 26,
  },
});

export default JournalEntryScreen;
