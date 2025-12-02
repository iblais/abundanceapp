/**
 * Abundance Flow - Meditations Data
 *
 * Library of guided meditations with synchronized 5, 8, and 12-minute versions
 */

import { MeditationCategory, MeditationDuration } from '@store/useMeditationStore';

export interface MeditationData {
  id: string;
  title: string;
  description: string;
  category: MeditationCategory;
  durations: MeditationDuration[];
  audioFiles: {
    5?: string;
    8?: string;
    12?: string;
  };
  coverImage?: string;
  isPremium: boolean;
  tags: string[];
  script: string;
}

export const MEDITATIONS_DATA: MeditationData[] = [
  {
    id: 'morning-visioneering',
    title: 'Morning Visioneering',
    description: 'Start your day by connecting with your highest potential and setting powerful intentions.',
    category: 'morning',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'morning_visioneering_5.mp3',
      8: 'morning_visioneering_8.mp3',
      12: 'morning_visioneering_12.mp3',
    },
    isPremium: false,
    tags: ['morning', 'visualization', 'intention'],
    script: `Welcome. Find a comfortable position and gently close your eyes.

Let's begin by taking a slow, deep breath in through your nose... and out through your mouth. Feel your body settling into this moment.

Take another breath, and as you exhale, release any tension you may be holding. This is your time. This is your space.

Now, I invite you to connect with your future self—the version of you who has already achieved what you desire. What does this person feel like? How do they carry themselves?

Imagine stepping into this version of yourself. Feel the confidence. Notice the calm certainty. This isn't a distant dream—this is who you are becoming.

As you breathe, allow this feeling to expand. Let it fill your chest, your arms, your entire being. You are not hoping for this future—you are aligning with it right now.

Set one clear intention for today. Not what you want to do, but who you want to be. How do you want to show up?

Hold this intention gently. Trust that as you move through your day, this energy will guide you.

Take one more deep breath, and as you exhale, know that you carry this aligned state with you. You are ready.

Slowly begin to return your awareness to the room. When you're ready, open your eyes, carrying this vision into your day.`
  },
  {
    id: 'gratitude-expansion',
    title: 'Gratitude Expansion',
    description: 'Cultivate a deep sense of appreciation that naturally attracts more abundance into your life.',
    category: 'gratitude',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'gratitude_expansion_5.mp3',
      8: 'gratitude_expansion_8.mp3',
      12: 'gratitude_expansion_12.mp3',
    },
    isPremium: false,
    tags: ['gratitude', 'abundance', 'appreciation'],
    script: `Welcome to this moment of gratitude. Close your eyes and settle into a comfortable position.

Begin with three slow breaths. With each exhale, let go of any rushing thoughts. There is nowhere else you need to be.

Bring to mind one thing you're grateful for today. It can be something small—the warmth of sunlight, a kind word, a moment of quiet. Let yourself really feel this appreciation.

Notice how gratitude feels in your body. Perhaps a warmth in your chest, a softening in your face. This feeling is a signal—it tells your mind what to look for more of.

Now expand this feeling. Think of another thing you appreciate. And another. Let gratitude build like a gentle wave.

Research suggests that regular gratitude practice can shift your baseline emotional state. You're not just feeling good in this moment—you're training your brain to notice abundance everywhere.

As you breathe, imagine this gratitude radiating outward from your heart. It touches everything in your life. It prepares the way for more good to come.

Rest here in this expanded state. Know that you can return to this feeling anytime.

When you're ready, take a deep breath and gently return. Carry this gratitude with you.`
  },
  {
    id: 'confidence-activation',
    title: 'Confidence Activation',
    description: 'Awaken your inner certainty and step into challenges with calm assurance.',
    category: 'confidence',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'confidence_activation_5.mp3',
      8: 'confidence_activation_8.mp3',
      12: 'confidence_activation_12.mp3',
    },
    isPremium: false,
    tags: ['confidence', 'empowerment', 'self-belief'],
    script: `Welcome. Take a comfortable position and close your eyes.

Begin by grounding yourself with three deep breaths. Feel your feet on the floor, your body supported. You are here. You are present.

Now, I want you to recall a time when you felt completely confident. It doesn't have to be a big moment—just a time when you knew you could handle whatever came your way. Remember that feeling.

Where do you feel this confidence in your body? In your chest? Your shoulders? Your core? Locate it and let it grow.

Confidence isn't about never feeling doubt—it's about trusting yourself to navigate whatever arises. You have done hard things before. You have surprised yourself with your resilience.

Imagine this inner certainty as a steady flame within you. It doesn't waver with external circumstances. It simply is.

As you breathe, let this flame grow stronger. Feel it warming your entire being. This is who you are at your core—capable, resourceful, enough.

Before any challenge, you can return to this inner flame. It is always available to you.

Take one more deep breath. Feel your natural confidence. When you're ready, open your eyes, carrying this certainty forward.`
  },
  {
    id: 'calm-reset',
    title: 'Calm Reset',
    description: 'Return to a state of peaceful clarity when life feels overwhelming.',
    category: 'calm',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'calm_reset_5.mp3',
      8: 'calm_reset_8.mp3',
      12: 'calm_reset_12.mp3',
    },
    isPremium: false,
    tags: ['calm', 'stress relief', 'peace'],
    script: `Welcome. This is a space of calm.

Close your eyes and begin to slow your breath. There's no need to control it—just notice it becoming slower, deeper, more natural.

If your mind is busy, that's okay. Simply acknowledge the thoughts and let them pass like clouds. You don't need to chase them or push them away.

Now, imagine a wave of calm washing over you. It starts at the top of your head, relaxing your forehead, your eyes, your jaw. Feel the tension melting away.

This calm wave moves down your neck, across your shoulders, down your arms. Let your hands soften. Let your fingers relax.

The wave continues down your spine, through your chest, your belly. Each breath deepens this sense of peace.

Your brain is designed to return to balance. You're simply creating the conditions for your natural calm to emerge.

Rest here in this quiet space. There is nothing you need to figure out right now. Nothing you need to solve. Just breathe.

Know that you can return to this calm reset anytime you need it. It lives within you always.

When you're ready, take a gentle breath and slowly return, carrying this peace with you.`
  },
  {
    id: 'focus-flow',
    title: 'Focus Flow',
    description: 'Clear mental clutter and enter a state of deep, productive focus.',
    category: 'focus',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'focus_flow_5.mp3',
      8: 'focus_flow_8.mp3',
      12: 'focus_flow_12.mp3',
    },
    isPremium: true,
    tags: ['focus', 'productivity', 'clarity'],
    script: `Welcome. Let's prepare your mind for deep focus.

Close your eyes and take three clearing breaths. With each exhale, release distractions. Let them go.

Imagine your mind as a clear, still lake. When thoughts arise, they create small ripples—but the lake always returns to stillness. This is your natural state.

Focus is not about forcing. It's about gently directing your attention and letting go of everything else.

Now, bring to mind what you want to focus on. Don't worry about the details yet—just hold the general intention. Feel yourself drawn toward it naturally.

Imagine a gentle spotlight illuminating your task. Everything else fades into soft shadow—not gone, just not important right now.

Your attention is a powerful resource. When you direct it intentionally, you access a state of flow where effort becomes ease.

Feel yourself becoming absorbed. The boundary between you and your work begins to dissolve. This is flow—being fully present, fully engaged.

Take a deep breath and prepare to begin. Your mind is clear. Your focus is sharp. You are ready.

Open your eyes when you're ready, carrying this focused state into your work.`
  },
  {
    id: 'abundance-alignment',
    title: 'Abundance Alignment',
    description: 'Tune your energy to the frequency of abundance and open yourself to receive.',
    category: 'abundance',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'abundance_alignment_5.mp3',
      8: 'abundance_alignment_8.mp3',
      12: 'abundance_alignment_12.mp3',
    },
    isPremium: true,
    tags: ['abundance', 'manifestation', 'receiving'],
    script: `Welcome to this practice of abundance alignment.

Close your eyes and settle into your breath. Let each exhale release any sense of lack or scarcity.

Abundance is not just about money or possessions. It's a state of being—a recognition that life is generous and you are worthy of receiving.

Begin by acknowledging the abundance already present in your life. The air you breathe. The people who care about you. The experiences that have shaped you.

Now, imagine that you are surrounded by a field of energy. This is your personal signal—the frequency you're broadcasting to the world. What does it feel like right now?

Let's shift this field. Feel it expanding, becoming lighter, more open. You are not grasping for abundance—you are allowing it. There's a difference.

Imagine yourself already living in the abundance you desire. Not future tense—present tense. Feel the ease. Feel the flow. Feel the gratitude.

You don't attract what you want. You attract what you are. In this moment, you are aligning your being with abundance.

Breathe this alignment into every cell. Trust that as you shift internally, external circumstances will follow.

Take one more deep breath. Know that this aligned state is available to you always.

When you're ready, return gently, carrying this abundance consciousness into your day.`
  },
  {
    id: 'identity-embodiment',
    title: 'Identity Embodiment',
    description: 'Step fully into the version of yourself who already has what you desire.',
    category: 'identity',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'identity_embodiment_5.mp3',
      8: 'identity_embodiment_8.mp3',
      12: 'identity_embodiment_12.mp3',
    },
    isPremium: true,
    tags: ['identity', 'transformation', 'embodiment'],
    script: `Welcome. This practice will help you embody your highest self.

Close your eyes and take several slow, grounding breaths. Feel yourself becoming fully present.

You are not just working toward a better future—you are stepping into a new identity. The version of you who has achieved your goals thinks, feels, and acts differently than the current you. Let's explore who that person is.

Imagine your future self standing before you. This is the you who has already succeeded. How do they hold their body? What is their facial expression? What energy do they radiate?

Notice the details. What do they wear? How do they speak? What do they do first thing in the morning?

Now, step forward and merge with this future self. Feel yourself becoming them. Their confidence becomes your confidence. Their certainty becomes your certainty.

This isn't pretending—this is remembering. This version of you already exists in potential. You are simply bringing it into the present.

Ask your future self: What do I need to know? What do I need to let go of? Listen for the answer.

Breathe into this new identity. Let it settle into your bones. You are not becoming someone new—you are becoming more fully yourself.

When you're ready, return slowly. Carry this embodied identity with you. Act from this place today.`
  },
  {
    id: 'evening-integration',
    title: 'Evening Integration',
    description: 'Process the day, celebrate your growth, and prepare for restorative sleep.',
    category: 'evening',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'evening_integration_5.mp3',
      8: 'evening_integration_8.mp3',
      12: 'evening_integration_12.mp3',
    },
    isPremium: false,
    tags: ['evening', 'sleep', 'integration'],
    script: `Welcome to this evening practice. This is your time to integrate and release.

Close your eyes and let your body begin to relax. You've done enough today. It's time to rest.

Take a deep breath in, and as you exhale, let go of the day. Any stress, any tension, any unfinished business—let it wait until tomorrow.

Reflect gently on your day. What are you grateful for? What small victories occurred? What moments of alignment did you experience?

Don't judge the difficult moments. Simply acknowledge them and let them go. Tomorrow is a new opportunity.

Now, imagine any remaining tension draining from your body like water. Your head relaxes. Your face softens. Your shoulders drop.

Feel a warm, peaceful energy wrapping around you like a blanket. You are safe. You are supported. All is well.

As you drift toward sleep, your subconscious will continue integrating today's experiences. Trust the process.

Set a gentle intention for tomorrow. Not a to-do list—just a feeling of how you want to be.

Take one more deep breath. Release fully. Allow sleep to come naturally.

Rest well. Your transformation continues even as you dream.`
  },
  {
    id: 'deep-sleep',
    title: 'Deep Sleep Journey',
    description: 'Guided relaxation to help you fall into deep, restorative sleep.',
    category: 'sleep',
    durations: [8, 12],
    audioFiles: {
      8: 'deep_sleep_8.mp3',
      12: 'deep_sleep_12.mp3',
    },
    isPremium: true,
    tags: ['sleep', 'relaxation', 'rest'],
    script: `Welcome. Tonight, you will sleep deeply and peacefully.

Settle into your most comfortable sleeping position. Let your body sink into the bed.

Begin by relaxing your face. Let your forehead smooth. Let your eyes become heavy. Let your jaw release.

Your neck relaxes. Your shoulders melt. Any remaining tension simply dissolves.

With each breath, you sink deeper. Your arms are heavy. Your hands are soft. Your fingers are loose.

A wave of relaxation moves down your spine. Your back releases into the bed. Your hips relax. Your legs become heavy.

Your feet are warm and relaxed. Your entire body is at peace.

Now, imagine yourself floating gently. Not falling—floating. Supported completely. Safe completely.

Count slowly backward from ten. With each number, sink deeper into sleep.

Ten... deeper... Nine... more relaxed... Eight... letting go... Seven... drifting... Six... peaceful... Five... heavy... Four... warm... Three... floating... Two... almost there... One... sleep.

Your body knows how to heal. Your mind knows how to restore. Trust the wisdom of sleep.

Rest now. Dream well. Wake renewed.`
  },
  {
    id: 'inner-peace',
    title: 'Inner Peace',
    description: 'Find your center of calm regardless of external circumstances.',
    category: 'calm',
    durations: [5, 8, 12],
    audioFiles: {
      5: 'inner_peace_5.mp3',
      8: 'inner_peace_8.mp3',
      12: 'inner_peace_12.mp3',
    },
    isPremium: true,
    tags: ['peace', 'centeredness', 'balance'],
    script: `Welcome. Let's find the peace that lives within you.

Close your eyes and begin with slow, natural breaths. No need to control—just observe.

Peace is not the absence of challenges. It's the presence of a calm center that remains steady regardless of what's happening around you.

Imagine a still point at the center of your being. It might be in your heart, your belly, or somewhere else. Find it now.

This still point has always been there. It cannot be disturbed by thoughts. It cannot be shaken by emotions. It simply is.

Rest your attention gently on this center. When thoughts pull you away, simply return. No judgment—just return.

From this place of inner stillness, external chaos loses its power. You can observe without being overwhelmed. You can respond without reacting.

This peace is your birthright. It doesn't need to be created—only uncovered. Layer by layer, you are returning to what was always true.

Breathe with your still center. Feel its stability. Feel its wisdom.

Know that you can return here anytime. Amid any storm, this peace awaits you.

Take one more breath. Carry this inner peace with you as you return to the world.`
  },
];

export default MEDITATIONS_DATA;
