/**
 * Centralized AI generation helpers
 * Handles all AI-powered content generation
 */

import { supabase } from '@/platform/supabase/client';
import { toast } from 'sonner';

export interface MagicTitleInput {
  url: string;
}

export interface SalesCopyInput {
  productName: string;
  price: string | number;
  currency?: string;
}

export interface SEOInput {
  name: string;
  bio?: string;
  links?: string[];
}

export interface AIBuilderInput {
  description: string;
}

type AIGenerationType = 'magic-title' | 'sales-copy' | 'seo' | 'ai-builder';

interface AIInvokeResponse<TResult> {
  result: TResult;
}

export interface SEOResult {
  title: string;
  description: string;
  keywords?: string[];
}

/**
 * Generic AI content generator
 */
async function generateAIContent<TInput, TResult>(
  type: AIGenerationType,
  input: TInput
): Promise<TResult> {
  try {
    const { data, error } = await supabase.functions.invoke<AIInvokeResponse<TResult>>('ai-content-generator', {
      body: { type, input },
    });

    if (error) throw error;
    if (!data) {
      throw new Error('AI response is empty');
    }
    return data.result;
  } catch (error) {
    console.error(`AI ${type} generation error:`, error);
    throw error;
  }
}

/**
 * Generate a catchy title from URL
 */
export async function generateMagicTitle(url: string): Promise<string> {
  if (!url) {
    toast.error('Please enter a URL first');
    throw new Error('URL is required');
  }

  try {
    const result = await generateAIContent<MagicTitleInput, string>('magic-title', { url });
    if (typeof result !== 'string') {
      throw new Error('Unexpected AI response');
    }
    toast.success('Title generated!');
    return result;
  } catch (error) {
    toast.error('Failed to generate title');
    throw error;
  }
}

/**
 * Generate product description
 */
export async function generateSalesCopy(input: SalesCopyInput): Promise<string> {
  if (!input.productName || !input.price) {
    toast.error('Please enter product name and price first');
    throw new Error('Product name and price are required');
  }

  try {
    const result = await generateAIContent<SalesCopyInput, string>('sales-copy', {
      productName: input.productName,
      price: input.price,
      currency: input.currency || 'KZT',
    });
    if (typeof result !== 'string') {
      throw new Error('Unexpected AI response');
    }
    toast.success('Description generated!');
    return result;
  } catch (error) {
    toast.error('Failed to generate description');
    throw error;
  }
}

/**
 * Generate SEO meta tags
 */
export async function generateSEO(input: SEOInput): Promise<SEOResult> {
  try {
    const result = await generateAIContent<SEOInput, SEOResult>('seo', input);
    toast.success('SEO meta tags generated!');
    return result;
  } catch (error) {
    toast.error('Failed to generate SEO tags');
    throw error;
  }
}

/**
 * Generate complete page layout
 */
export async function generatePageLayout(description: string): Promise<unknown> {
  if (!description) {
    toast.error('Please describe your page');
    throw new Error('Description is required');
  }

  try {
    const result = await generateAIContent<AIBuilderInput, unknown>('ai-builder', { description });
    toast.success('Page layout generated!');
    return result;
  } catch (error) {
    toast.error('Failed to generate page layout');
    throw error;
  }
}
