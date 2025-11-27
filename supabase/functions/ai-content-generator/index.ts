import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if body exists and is not empty
    const text = await req.text();
    if (!text) {
      throw new Error('Request body is empty');
    }
    
    const { type, input } = JSON.parse(text);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'magic-title':
        systemPrompt = 'You are a creative copywriter. Generate catchy, engaging titles for social media links. Keep titles short (2-5 words), action-oriented, and clickable. Return only the title text, nothing else.';
        userPrompt = `Generate a catchy title for this URL: ${input.url}`;
        break;

      case 'sales-copy':
        systemPrompt = 'You are a sales copywriter. Write compelling, benefit-focused product descriptions that drive conversions. Keep it concise (2-3 sentences), highlight key benefits, and include a subtle call-to-action. Return only the description text.';
        userPrompt = `Write a sales description for this product: ${input.productName}. Price: ${input.price} ${input.currency}.`;
        break;

      case 'seo':
        systemPrompt = 'You are an SEO expert. Generate optimized meta tags for link-in-bio pages. Return a JSON object with: title (50-60 chars), description (150-160 chars), and keywords (array of 5-8 relevant keywords). Return ONLY valid JSON, no markdown.';
        userPrompt = `Generate SEO meta tags for a page with this content: Name: ${input.name}, Bio: ${input.bio}, Links: ${input.links?.join(', ') || 'none'}`;
        break;

      case 'ai-builder':
        systemPrompt = `You are a page builder AI. Based on the user's description, suggest a complete page layout with blocks. Return a JSON object with this exact structure:
{
  "profile": { "name": "string", "bio": "string" },
  "blocks": [
    { "type": "link", "title": "string", "url": "string" },
    { "type": "product", "name": "string", "description": "string", "price": number, "currency": "string" },
    { "type": "text", "content": "string", "style": "heading|paragraph|quote" }
  ]
}
Include 3-6 relevant blocks based on the description. Return ONLY valid JSON, no markdown.`;
        userPrompt = `Create a page layout for: ${input.description}`;
        break;

      default:
        throw new Error('Invalid type');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI Gateway error');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // For SEO and AI Builder, parse JSON response
    if (type === 'seo' || type === 'ai-builder') {
      try {
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        return new Response(
          JSON.stringify({ result: parsed }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Failed to parse JSON:', content);
        throw new Error('Invalid JSON response from AI');
      }
    }

    // For text responses
    return new Response(
      JSON.stringify({ result: content.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-content-generator:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
