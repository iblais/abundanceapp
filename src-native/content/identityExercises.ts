/**
 * Abundance Flow - Identity Exercises
 *
 * Structured written exercises for defining and embodying a new identity
 * Based on memory reconsolidation and identity activation principles
 */

export interface IdentityExercise {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: string[];
  isPremium: boolean;
}

export const IDENTITY_EXERCISES: IdentityExercise[] = [
  {
    id: 'future-self-letter',
    title: 'Letter from Your Future Self',
    description: 'Receive guidance and wisdom from the version of you who has already achieved your goals.',
    category: 'VISUALIZATION',
    questions: [
      "Close your eyes and imagine yourself one year from now. You've achieved what you set out to achieve. What does your life look like? Describe it in vivid detail.",
      "From this future perspective, what advice does your future self have for your current self? What do they want you to know?",
      "What fears or doubts does your future self want to address? What would they say to reassure you?",
      "What daily habits or decisions were most important in becoming this version of yourself?",
      "What message of encouragement would your future self leave you with today?",
    ],
    isPremium: false,
  },
  {
    id: 'identity-statement',
    title: 'Crafting Your Identity Statement',
    description: 'Define who you are becoming with clarity and conviction.',
    category: 'DECLARATION',
    questions: [
      "What qualities do you want to embody? List at least five traits of your ideal self.",
      "How does this version of you handle challenges? Describe their mindset when faced with obstacles.",
      "What does this person believe about themselves and the world? Write three core beliefs.",
      "Write an 'I am' statement that captures your emerging identity. Make it present tense and powerful.",
      "Read your identity statement aloud. How does it feel in your body? What adjustments would make it feel more true?",
    ],
    isPremium: false,
  },
  {
    id: 'belief-transformation',
    title: 'Transforming Limiting Beliefs',
    description: 'Identify and release beliefs that no longer serve your growth.',
    category: 'RELEASE',
    questions: [
      "What belief about yourself has been holding you back? Write it out fully—don't soften it.",
      "Where did this belief come from? When did you first start believing this?",
      "What has this belief cost you? What opportunities or experiences have you missed?",
      "Is this belief absolutely true? Can you find evidence that contradicts it?",
      "What would you like to believe instead? Write a new belief that empowers you. Make it something you can genuinely start to accept.",
    ],
    isPremium: true,
  },
  {
    id: 'values-alignment',
    title: 'Values Alignment Check',
    description: 'Ensure your actions reflect your deepest values and priorities.',
    category: 'ALIGNMENT',
    questions: [
      "What are your top five values? What matters most to you in life?",
      "For each value, rate how well your current life reflects it (1-10). Be honest.",
      "Where is the biggest gap between your values and your daily actions?",
      "What's one specific change you could make this week to better align with your values?",
      "How would living in fuller alignment with your values change your sense of self?",
    ],
    isPremium: true,
  },
  {
    id: 'morning-identity',
    title: 'Morning Identity Activation',
    description: 'Start each day by stepping into your highest self.',
    category: 'DAILY PRACTICE',
    questions: [
      "Who do you choose to be today? Write a brief description of how you want to show up.",
      "What's one quality of your ideal self that you will embody today?",
      "What's one thing your ideal self would definitely do today? Commit to it.",
      "What's one thing your ideal self would definitely NOT do today?",
      "Write one affirmation that captures how you want to feel throughout the day.",
    ],
    isPremium: false,
  },
  {
    id: 'emotional-signature',
    title: 'Your Emotional Signature',
    description: 'Define the emotional state that characterizes your ideal life.',
    category: 'EMBODIMENT',
    questions: [
      "What emotions do you want to feel most often? List your ideal emotional states.",
      "Describe a time you felt exactly how you want to feel regularly. What created that state?",
      "What activities, thoughts, or environments help you access these elevated emotions?",
      "How would your decisions change if you prioritized feeling this way above all else?",
      "Write a commitment to yourself about cultivating your emotional signature.",
    ],
    isPremium: true,
  },
  {
    id: 'shadow-integration',
    title: 'Meeting Your Shadow Self',
    description: 'Acknowledge and integrate the parts of yourself you usually hide.',
    category: 'INTEGRATION',
    questions: [
      "What quality in others bothers you most? Consider: might this quality exist in yourself in some form?",
      "What part of yourself do you try to hide from others? What are you afraid they would think?",
      "What would happen if you fully accepted this part of yourself instead of fighting it?",
      "How might this 'shadow' quality actually have gifts or strengths hidden within it?",
      "Write a message of acceptance to this part of yourself. What does it need to hear?",
    ],
    isPremium: true,
  },
  {
    id: 'success-blueprint',
    title: 'Your Success Blueprint',
    description: 'Map out what success means to you and how to achieve it.',
    category: 'PLANNING',
    questions: [
      "What does success mean to YOU—not to society, not to your parents, but to you personally?",
      "If you achieved this success, how would your daily life be different? Be specific.",
      "What skills, habits, or resources does the successful version of you have?",
      "What's the gap between where you are now and where you want to be?",
      "What's one action you can take today that your successful future self would approve of?",
    ],
    isPremium: false,
  },
  {
    id: 'past-self-gratitude',
    title: 'Honoring Your Past Self',
    description: 'Acknowledge how far you have come and thank your past self for the journey.',
    category: 'GRATITUDE',
    questions: [
      "Think back to yourself five years ago. What challenges were you facing then?",
      "What hard decisions did your past self make that benefited your current self?",
      "What did your past self survive that you might not fully appreciate?",
      "Write a thank you letter to your past self. What do you want to acknowledge?",
      "How does appreciating your past self change how you see your present self?",
    ],
    isPremium: false,
  },
  {
    id: 'purpose-discovery',
    title: 'Uncovering Your Purpose',
    description: 'Explore what gives your life meaning and direction.',
    category: 'PURPOSE',
    questions: [
      "What activities make you lose track of time? What do you love doing for its own sake?",
      "What problems in the world do you feel called to help solve?",
      "If you had unlimited resources and couldn't fail, what would you dedicate your life to?",
      "What do people often come to you for help with? What seems easy to you but hard for others?",
      "Based on your answers, write a purpose statement. Even if imperfect, what feels true?",
    ],
    isPremium: true,
  },
];

export default IDENTITY_EXERCISES;
