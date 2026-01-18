/**
 * Abundance Recode - AI Mentor Service
 *
 * Handles AI-powered responses for the Inner Mentor Chat
 * Supports Gemini API, OpenAI GPT-4, or fallback to local responses
 */

// System prompt for the AI mentor persona
export const MENTOR_SYSTEM_PROMPT = `You are the Inner Mentor, the voice of the user's highest self. You speak with calm wisdom, compassion, and deep insight.

Your role is to:
- Help users connect with their inner wisdom
- Ask thoughtful, reflective questions that guide them to their own answers
- Offer gentle perspectives that expand their awareness
- Support their journey of personal transformation and abundance
- Never give direct advice, but help them discover their own truth

Your tone is:
- Warm and nurturing, like a wise inner guide
- Calm and centered, never rushed
- Supportive without being patronizing
- Spiritually aware but grounded
- Curious and genuinely interested in their growth

Keep responses concise (2-4 sentences) and always end with a reflective question or gentle invitation to explore deeper.`;

// Fallback responses when API is unavailable
const wisdomResponses = [
  "What would your wisest self say about this?",
  "I sense there is more beneath the surface. What feels true in your heart?",
  "You already know the answer. What is it whispering to you?",
  "Pause for a moment. What does your body tell you about this?",
  "If fear were not a factor, what would you choose?",
  "What is the kindest interpretation of this situation?",
  "You are more powerful than you realize. What strength are you overlooking?",
  "What would you tell a dear friend facing this same challenge?",
  "The universe is always conspiring in your favor. What gift might be hidden here?",
  "You are on the right path. What small step feels right in this moment?",
  "Trust the timing of your life. What are you learning right now?",
  "Your intuition speaks softly. What is it saying?",
  "Release the need to know everything. What can you surrender today?",
  "You are worthy of all that you desire. What limiting belief is ready to dissolve?",
  "Every challenge is an invitation to grow. What is this one teaching you?",
];

// Contextual responses based on message content
const getContextualResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
    return "I feel your unease. Place your hand on your heart and take a deep breath. Your nervous system is simply protecting you. What would help you feel safe enough to relax into this moment?";
  }
  if (lowerMessage.includes('stuck') || lowerMessage.includes('confused') || lowerMessage.includes('lost')) {
    return "Sometimes the path forward reveals itself when we stop trying so hard to find it. What would emerge if you allowed yourself to simply be with this uncertainty?";
  }
  if (lowerMessage.includes('fear') || lowerMessage.includes('scared') || lowerMessage.includes('afraid')) {
    return "Fear often guards our greatest transformations. It's a signal that something important lies ahead. What lies on the other side of this fear that your soul longs for?";
  }
  if (lowerMessage.includes('love') || lowerMessage.includes('relationship')) {
    return "Love begins as an inner state before it manifests in our relationships. What does your heart truly desire to give and receive in this area of your life?";
  }
  if (lowerMessage.includes('money') || lowerMessage.includes('abundance') || lowerMessage.includes('wealth')) {
    return "Abundance flows naturally to those who align with its frequency. What old story about money or worthiness is asking to be released from your consciousness?";
  }
  if (lowerMessage.includes('purpose') || lowerMessage.includes('meaning') || lowerMessage.includes('calling')) {
    return "Your purpose is not something external to find—it is the fullest expression of who you already are. What activities make you lose track of time and feel most alive?";
  }
  if (lowerMessage.includes('grateful') || lowerMessage.includes('thankful') || lowerMessage.includes('blessed')) {
    return "Gratitude opens the door to receiving more blessings. Your heart knows abundance already. What else in your life is quietly asking to be appreciated?";
  }
  if (lowerMessage.includes('help') || lowerMessage.includes('need')) {
    return "You are never truly alone on this journey. The guidance you seek is already within you, waiting to be heard. What does your deepest knowing want you to understand?";
  }
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
    return "Your feelings are valid messengers, not enemies. Sadness often carries wisdom about what truly matters to us. What is this emotion trying to show you about your needs?";
  }
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('upset')) {
    return "Anger is often a guardian of our boundaries and values. Something important to you may need protection or expression. What underlying need is seeking to be honored?";
  }

  // Return a random wisdom response for general messages
  return wisdomResponses[Math.floor(Math.random() * wisdomResponses.length)];
};

// AI Mentor Service
export const aiMentorService = {
  /**
   * Get a response from the AI mentor
   * Tries API first, falls back to local responses
   */
  getResponse: async (userMessage: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<{ response: string; error: string | null }> => {
    // Try Gemini API first
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'demo-api-key') {
      try {
        const response = await callGeminiAPI(userMessage, conversationHistory, geminiKey);
        if (response) {
          return { response, error: null };
        }
      } catch (error) {
        console.log('Gemini API unavailable, using fallback');
      }
    }

    // Try OpenAI API second
    const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'demo-api-key') {
      try {
        const response = await callOpenAIAPI(userMessage, conversationHistory, openaiKey);
        if (response) {
          return { response, error: null };
        }
      } catch (error) {
        console.log('OpenAI API unavailable, using fallback');
      }
    }

    // Fallback to local contextual responses
    const response = getContextualResponse(userMessage);
    return { response, error: null };
  },
};

// Call Gemini API
async function callGeminiAPI(
  message: string,
  history: Array<{ role: string; content: string }> | undefined,
  apiKey: string
): Promise<string | null> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: MENTOR_SYSTEM_PROMPT },
              ...(history || []).map(msg => ({ text: `${msg.role}: ${msg.content}` })),
              { text: `user: ${message}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}

// Call OpenAI API
async function callOpenAIAPI(
  message: string,
  history: Array<{ role: string; content: string }> | undefined,
  apiKey: string
): Promise<string | null> {
  try {
    const messages = [
      { role: 'system', content: MENTOR_SYSTEM_PROMPT },
      ...(history || []).map(msg => ({
        role: msg.role === 'mentor' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

export default aiMentorService;
