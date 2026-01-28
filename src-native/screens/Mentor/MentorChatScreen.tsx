/**
 * Abundance Recode - Inner Mentor Chat Screen
 *
 * AI-powered chat interface for guidance and reflection
 * Clinical-warm tone with encouragement and gentle guidance
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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H3,
  Body,
  BodySmall,
  Label,
  Icon,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { duration } from '@theme/animations';
import { RootStackParamList } from '@navigation/types';

type MentorChatNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MentorChat'
>;

interface Message {
  id: string;
  content: string;
  role: 'user' | 'mentor';
  timestamp: Date;
}

// Pre-defined mentor responses for different topics
const MENTOR_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Welcome back. I'm here to support your journey. What's on your mind today?",
    "It's good to see you. Take a moment to settle in. What would you like to explore?",
    "Hello. This is a space for reflection and growth. How can I support you?",
  ],
  gratitude: [
    "Gratitude is a powerful state. Research suggests that regularly acknowledging what we're thankful for can shift our baseline emotional state. What small moment today brought you a sense of appreciation?",
    "When we focus on gratitude, we're training our minds to notice abundance rather than scarcity. What's something you might be taking for granted that deserves your attention?",
  ],
  challenge: [
    "I hear that you're facing a challenge. Remember, difficulties often contain opportunities for growth. What might this situation be teaching you?",
    "It takes courage to acknowledge when things feel hard. Let's explore this together. What would the most centered version of yourself say about this situation?",
  ],
  confidence: [
    "Confidence isn't about never feeling doubt—it's about moving forward anyway. What's one small step you could take today that would reinforce your sense of capability?",
    "Your past experiences have prepared you more than you might realize. What evidence do you have that you can handle challenges?",
  ],
  meditation: [
    "I'd recommend starting with a short gratitude meditation. Even 5 minutes of intentional practice can shift your state. Would you like me to suggest one from your library?",
    "The Morning Visioneering meditation is excellent for setting intentions. It helps you connect with your future self and carry that energy into your day.",
  ],
  default: [
    "Thank you for sharing that. Let's explore it together. What feels most important about this for you right now?",
    "I'm here to listen and reflect with you. What would feel most supportive in this moment?",
    "Your awareness of this is significant. What does your intuition tell you about the next step?",
  ],
};

// Typing indicator component
const TypingIndicator: React.FC = () => {
  const theme = useAppTheme();
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      dot1.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      );
      setTimeout(() => {
        dot2.value = withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 })
        );
      }, 150);
      setTimeout(() => {
        dot3.value = withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 })
        );
      }, 300);
    };

    animate();
    const interval = setInterval(animate, 900);
    return () => clearInterval(interval);
  }, []);

  const dotStyle = (dotValue: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      opacity: 0.4 + dotValue.value * 0.6,
      transform: [{ translateY: -dotValue.value * 4 }],
    }));

  return (
    <View style={styles.typingContainer}>
      <GlassCard variant="light" style={styles.typingCard} noPadding>
        <View style={styles.typingDots}>
          <Animated.View
            style={[
              styles.typingDot,
              { backgroundColor: theme.colors.primary.lavender },
              dotStyle(dot1),
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              { backgroundColor: theme.colors.primary.lavender },
              dotStyle(dot2),
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              { backgroundColor: theme.colors.primary.lavender },
              dotStyle(dot3),
            ]}
          />
        </View>
      </GlassCard>
    </View>
  );
};

// Message bubble component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const theme = useAppTheme();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.messageUser : styles.messageMentor,
      ]}
    >
      {!isUser && (
        <View
          style={[
            styles.mentorAvatar,
            { backgroundColor: theme.colors.accent.goldSoft },
          ]}
        >
          <Icon
            name="sparkle"
            size={sizing.iconSm}
            color={theme.colors.accent.gold}
          />
        </View>
      )}
      <GlassCard
        variant={isUser ? 'accent' : 'light'}
        style={[
          styles.messageBubble,
          isUser ? styles.bubbleUser : styles.bubbleMentor,
        ]}
        noPadding
      >
        <Body
          style={styles.messageText}
          color={theme.colors.text.primary}
        >
          {message.content}
        </Body>
      </GlassCard>
    </View>
  );
};

export const MentorChatScreen: React.FC = () => {
  const navigation = useNavigation<MentorChatNavigationProp>();
  const theme = useAppTheme();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: MENTOR_RESPONSES.greeting[0],
      role: 'mentor',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getMentorResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes('grateful') ||
      lowerMessage.includes('thankful') ||
      lowerMessage.includes('gratitude')
    ) {
      const responses = MENTOR_RESPONSES.gratitude;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes('struggle') ||
      lowerMessage.includes('hard') ||
      lowerMessage.includes('difficult') ||
      lowerMessage.includes('challenge')
    ) {
      const responses = MENTOR_RESPONSES.challenge;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes('confident') ||
      lowerMessage.includes('confidence') ||
      lowerMessage.includes('doubt') ||
      lowerMessage.includes('afraid')
    ) {
      const responses = MENTOR_RESPONSES.confidence;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes('meditat') ||
      lowerMessage.includes('practice') ||
      lowerMessage.includes('exercise')
    ) {
      const responses = MENTOR_RESPONSES.meditation;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    const responses = MENTOR_RESPONSES.default;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate mentor thinking
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getMentorResponse(userMessage.content),
        role: 'mentor',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mentorResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <ScreenWrapper padded={false}>
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
          <H3>Inner Mentor</H3>
          <BodySmall color={theme.colors.text.secondary}>
            Your personal guide
          </BodySmall>
        </View>
        <View style={styles.headerButton} />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <GlassCard variant="light" style={styles.inputCard} noPadding>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  textStyles.body,
                  { color: theme.colors.text.primary },
                ]}
                placeholder="Share your thoughts..."
                placeholderTextColor={theme.colors.text.muted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim()}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: inputText.trim()
                      ? theme.colors.accent.gold
                      : theme.colors.glass.background,
                  },
                ]}
              >
                <Icon
                  name="send"
                  size={sizing.iconSm}
                  color={
                    inputText.trim()
                      ? theme.colors.neutral.gray900
                      : theme.colors.text.muted
                  }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerButton: {
    width: 44,
    padding: spacing.sm,
  },
  headerTitle: {
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  messageUser: {
    justifyContent: 'flex-end',
  },
  messageMentor: {
    justifyContent: 'flex-start',
  },
  mentorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  bubbleUser: {
    borderBottomRightRadius: spacing.xs,
  },
  bubbleMentor: {
    borderBottomLeftRadius: spacing.xs,
  },
  messageText: {
    lineHeight: 22,
  },
  typingContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingLeft: 40,
  },
  typingCard: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  inputCard: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: spacing.sm,
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
