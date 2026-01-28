/**
 * Abundance Recode - Journal Prompts
 *
 * Open-ended prompts for reflection, not simple answers
 */

import { JournalType } from '@store/useJournalStore';

export const JOURNAL_PROMPTS: Record<JournalType, string[]> = {
  gratitude: [
    "What is one small piece of evidence today that things are moving in the right direction?",
    "Describe a time you felt completely in flow. What were the conditions that allowed for that?",
    "What simple pleasure did you experience today that deserves your appreciation?",
    "Who has positively influenced your journey recently? What did they do or say?",
    "What challenge from your past are you now grateful for? How did it shape you?",
    "What aspect of your physical body are you grateful for today?",
    "What opportunity is present in your life right now that you might be taking for granted?",
    "What quality in yourself are you beginning to appreciate more?",
    "Describe a moment of connection you experienced recently.",
    "What did you learn today that you're grateful to know?",
    "What resource do you have access to that many people don't?",
    "What has gone right this week that you haven't fully acknowledged?",
    "Who believed in you before you believed in yourself? How did that impact you?",
    "What comfort or convenience do you enjoy that your ancestors would marvel at?",
    "What growth can you see in yourself compared to a year ago?",
  ],
  identity: [
    "If your Future Self could give you one piece of advice today, what would it be?",
    "Write a short paragraph describing your life one year from now, as if it has already happened. Start with: 'I am so grateful now that...'",
    "What beliefs about yourself have you outgrown? What new beliefs are you stepping into?",
    "How does the most confident version of you handle setbacks? Describe their inner dialogue.",
    "What does your ideal morning look like? Who are you in that morning?",
    "If you fully trusted yourself, what would you do differently?",
    "Describe how the version of you who has achieved your goals makes decisions.",
    "What would you attempt if you knew you couldn't fail? How does that person feel?",
    "What qualities do you admire in others that are actually dormant within you?",
    "Write a letter from your future self to your current self, offering encouragement.",
    "What story about yourself are you ready to release?",
    "How does the most authentic version of you spend their time?",
    "What boundaries does your highest self maintain?",
    "Describe the energy and presence of who you're becoming.",
    "What does success feel like in your body? Describe the physical sensations.",
  ],
  freeform: [
    "What's on your mind right now? Write without filtering.",
    "What are you avoiding thinking about? Explore it here safely.",
    "If you had no obligations today, how would you spend your time?",
    "What conversation do you need to have that you've been putting off?",
    "What does your intuition keep whispering to you?",
    "Write about a dream or aspiration you haven't shared with anyone.",
    "What's something you're curious about lately?",
    "Describe a memory that surfaced recently. Why do you think it appeared?",
    "What pattern in your life would you like to change?",
    "What brings you energy? What drains it?",
    "Write about something you're processing emotionally.",
    "What do you need to forgive yourself for?",
    "What question are you sitting with right now?",
    "What does your ideal day look like, moment by moment?",
    "What part of yourself do you keep hidden from others?",
  ],
  reflection: [
    "What did you learn about yourself this week?",
    "Where did you notice resistance today? What might it be telling you?",
    "What emotional pattern showed up recently? How did you respond?",
    "Reflect on a decision you made recently. What guided that choice?",
    "What assumption did you discover was wrong?",
    "Where did you show up as your best self this week?",
    "What feedback have you received lately? How do you feel about it?",
    "What would you do differently if you could replay today?",
    "How are your actions aligned or misaligned with your values?",
    "What are you learning about your relationship with [work/money/time/relationships]?",
    "Where did you experience growth today, even if small?",
    "What fear came up recently? What truth might be beneath it?",
    "How has your perspective shifted on something important to you?",
    "What are you proud of that no one else knows about?",
    "What insight emerged from today's meditation or practice?",
  ],
};

export default JOURNAL_PROMPTS;
