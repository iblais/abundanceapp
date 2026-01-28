import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  imageUrl?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    // Enhance the prompt for better vision board results
    const enhancedPrompt = `Create a beautiful, inspiring vision board image: ${prompt}. Style: Aspirational, high-quality, photorealistic or artistic, suitable for manifestation and visualization. Make it positive, uplifting, and visually stunning.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'Failed to generate image'
      });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image URL returned' });
    }

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
}
