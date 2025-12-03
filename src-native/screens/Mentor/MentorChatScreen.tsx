/**
 * Abundance Flow - Premium Inner Mentor Chat Screen
 *
 * Matches reference with:
 * - Title "Inner Mentor" and subtitle at top
 * - Blurred background with glass chat bubbles
 * - Outgoing bubbles on right, incoming on left
 * - Glass input row at bottom with send icon
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H1,
  Body,
  BodySmall,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MentorChatNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MentorChat'>;

interface Message {
  id: string;
  content: string;
  role: 'user' | 'mentor';
  timestamp: Date;
}

// Sample mentor responses
const MENTOR_RESPONSES = [
  "I hear you. Let's explore that feeling together. What does your intuition tell you about the next step?",
  "That's a profound observation. Remember, every challenge contains a seed of growth.",
  "Your awareness of this is the first step toward transformation. What would feel most supportive right now?",
];

// Chat bubble component
interface ChatBubbleProps {
  message: Message;
  index: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, index }) => {
  const theme = useAppTheme();
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(300)}
      style={[
        styles.bubbleContainer,
        isUser ? styles.bubbleContainerRight : styles.bubbleContainerLeft,
      ]}
    >
      <LinearGradient
        colors={
          isUser
            ? [theme.colors.accent.goldOverlay, 'rgba(244, 209, 128, 0.08)']
            : [theme.colors.glass.fillLight, theme.colors.glass.fill]
        }
        style={[
          styles.bubble,
          isUser ? styles.bubbleRight : styles.bubbleLeft,
          {
            borderColor: isUser
              ? theme.colors.accent.goldGlow
              : theme.colors.glass.border,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Body color={theme.colors.text.primary}>{message.content}</Body>
      </LinearGradient>
    </Animated.View>
  );
};

// Suggestion chip
interface SuggestionChipProps {
  text: string;
  onPress: () => void;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ text, onPress }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.suggestionChip, { borderColor: theme.colors.glass.border }]}
    >
      <BodySmall color={theme.colors.text.secondary}>{text}</BodySmall>
    </TouchableOpacity>
  );
};

export const MentorChatScreen: React.FC = () => {
  const navigation = useNavigation<MentorChatNavigationProp>();
  const theme = useAppTheme();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome back. I'm here to support your journey to alignment. What's on your mind today?",
      role: 'mentor',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const suggestions = [
    "I'm feeling stuck",
    "Help me set intentions",
    "I need motivation",
  ];

  const handleSend = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate mentor response
    setTimeout(() => {
      const mentorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: MENTOR_RESPONSES[Math.floor(Math.random() * MENTOR_RESPONSES.length)],
        role: 'mentor',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mentorMessage]);
    }, 1000);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <ScreenWrapper padded={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={sizing.iconBase} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <H1>Inner Mentor</H1>
            <BodySmall color={theme.colors.text.muted}>
              Your guide to alignment
            </BodySmall>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Chat messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ChatBubble message={item} index={index} />
          )}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            messages.length === 1 ? (
              <View style={styles.suggestionsContainer}>
                <BodySmall color={theme.colors.text.muted} style={styles.suggestionsLabel}>
                  Try saying:
                </BodySmall>
                <View style={styles.suggestions}>
                  {suggestions.map((suggestion, index) => (
                    <SuggestionChip
                      key={index}
                      text={suggestion}
                      onPress={() => handleSend(suggestion)}
                    />
                  ))}
                </View>
              </View>
            ) : null
          }
        />

        {/* Input row */}
        <View style={styles.inputContainer}>
          <GlassCard variant="light" padding="sm" style={styles.inputCard}>
            <View style={styles.inputRow}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Share what's on your mind..."
                placeholderTextColor={theme.colors.text.muted}
                style={[
                  styles.input,
                  { color: theme.colors.text.primary },
                ]}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={() => handleSend()}
                disabled={!inputText.trim()}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: inputText.trim()
                      ? theme.colors.accent.gold
                      : theme.colors.glass.fill,
                  },
                ]}
              >
                <Icon
                  name="send"
                  size={sizing.iconSm}
                  color={inputText.trim() ? theme.colors.text.inverse : theme.colors.text.muted}
                />
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  chatContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  bubbleContainer: {
    marginBottom: spacing.md,
    maxWidth: '85%',
  },
  bubbleContainerLeft: {
    alignSelf: 'flex-start',
  },
  bubbleContainerRight: {
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  bubbleLeft: {
    borderTopLeftRadius: spacing.xs,
  },
  bubbleRight: {
    borderTopRightRadius: spacing.xs,
  },
  suggestionsContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  suggestionsLabel: {
    marginBottom: spacing.md,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  suggestionChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  inputContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  inputCard: {
    marginBottom: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    ...textStyles.body,
    maxHeight: 100,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});

export default MentorChatScreen;
