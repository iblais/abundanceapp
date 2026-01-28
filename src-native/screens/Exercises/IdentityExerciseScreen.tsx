/**
 * Abundance Recode - Identity Exercise Screen
 *
 * Structured written exercises for defining and embodying a new identity
 * Based on memory reconsolidation and identity activation principles
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
  Icon,
  Button,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useJournalStore } from '@store/useJournalStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { RootStackParamList } from '@navigation/types';
import { IDENTITY_EXERCISES } from '@content/identityExercises';

type IdentityExerciseNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'IdentityExercise'
>;
type IdentityExerciseRouteProp = RouteProp<RootStackParamList, 'IdentityExercise'>;

export const IdentityExerciseScreen: React.FC = () => {
  const navigation = useNavigation<IdentityExerciseNavigationProp>();
  const route = useRoute<IdentityExerciseRouteProp>();
  const theme = useAppTheme();
  const { addEntry } = useJournalStore();

  const { exerciseId } = route.params;
  const exercise = IDENTITY_EXERCISES.find((e) => e.id === exerciseId);

  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});

  if (!exercise) {
    return null;
  }

  const currentQuestion = exercise.questions[currentStep];
  const isLastStep = currentStep === exercise.questions.length - 1;
  const canProceed = responses[currentStep]?.trim().length > 0;

  const handleNext = () => {
    if (isLastStep) {
      // Save all responses as a journal entry
      const content = exercise.questions
        .map((q, i) => `**${q}**\n${responses[i] || ''}`)
        .join('\n\n');

      addEntry({
        type: 'identity',
        title: exercise.title,
        content,
        tags: ['identity', 'exercise'],
        isFavorite: false,
      });

      navigation.goBack();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Icon
            name={currentStep > 0 ? 'chevronLeft' : 'close'}
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <View style={styles.progressIndicator}>
          {exercise.questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index <= currentStep
                      ? theme.colors.accent.gold
                      : theme.colors.glass.backgroundMedium,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Exercise Title */}
        <View style={styles.titleSection}>
          <BodySmall color={theme.colors.accent.gold}>
            {exercise.category}
          </BodySmall>
          <H2 style={styles.title}>{exercise.title}</H2>
          {currentStep === 0 && (
            <Body color={theme.colors.text.secondary} style={styles.description}>
              {exercise.description}
            </Body>
          )}
        </View>

        {/* Current Question */}
        <GlassCard variant="accent" style={styles.questionCard}>
          <Body style={styles.questionText}>{currentQuestion}</Body>
        </GlassCard>

        {/* Response Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              textStyles.body,
              { color: theme.colors.text.primary },
            ]}
            placeholder="Take your time to reflect and write your response..."
            placeholderTextColor={theme.colors.text.muted}
            value={responses[currentStep] || ''}
            onChangeText={(text) =>
              setResponses((prev) => ({ ...prev, [currentStep]: text }))
            }
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Guidance Note */}
        <View style={styles.guidanceSection}>
          <Icon
            name="sparkle"
            size={sizing.iconSm}
            color={theme.colors.text.muted}
          />
          <BodySmall color={theme.colors.text.muted} style={styles.guidanceText}>
            Write as if you are already this version of yourself. Feel the
            emotions as you write.
          </BodySmall>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLastStep ? 'Complete Exercise' : 'Continue'}
          onPress={handleNext}
          variant="primary"
          size="large"
          fullWidth
          disabled={!canProceed}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerButton: {
    width: 44,
    padding: spacing.sm,
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  description: {
    lineHeight: 24,
  },
  questionCard: {
    marginBottom: spacing.xl,
  },
  questionText: {
    fontStyle: 'italic',
    lineHeight: 26,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    minHeight: 200,
    paddingVertical: spacing.md,
    lineHeight: 26,
  },
  guidanceSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  guidanceText: {
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
});

export default IdentityExerciseScreen;
