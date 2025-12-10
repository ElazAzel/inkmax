import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Block } from '@/types/page';

export type AIGeneratorType = 'magic-title' | 'sales-copy' | 'seo' | 'ai-builder';

interface AIBuilderResult {
  profile?: {
    name: string;
    bio: string;
  };
  blocks: Array<{
    type: string;
    [key: string]: any;
  }>;
}

interface UseDashboardAIOptions {
  onUpdateProfile: (updates: { name: string; bio: string }) => void;
  onAddBlock: (block: Block) => void;
}

/**
 * Hook to manage AI generator state and handlers
 */
export function useDashboardAI({ onUpdateProfile, onAddBlock }: UseDashboardAIOptions) {
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [aiGeneratorType, setAiGeneratorType] = useState<AIGeneratorType>('ai-builder');

  const openAIBuilder = useCallback(() => {
    setAiGeneratorType('ai-builder');
    setAiGeneratorOpen(true);
  }, []);

  const openSEOGenerator = useCallback(() => {
    setAiGeneratorType('seo');
    setAiGeneratorOpen(true);
  }, []);

  const openMagicTitle = useCallback(() => {
    setAiGeneratorType('magic-title');
    setAiGeneratorOpen(true);
  }, []);

  const openSalesCopy = useCallback(() => {
    setAiGeneratorType('sales-copy');
    setAiGeneratorOpen(true);
  }, []);

  const closeAIGenerator = useCallback(() => {
    setAiGeneratorOpen(false);
  }, []);

  const handleAIResult = useCallback(
    (result: AIBuilderResult) => {
      if (aiGeneratorType === 'ai-builder') {
        const { profile, blocks } = result;

        // Update profile if provided
        if (profile) {
          onUpdateProfile(profile);
        }

        // Add generated blocks
        blocks.forEach((blockData, index) => {
          const newBlock: Block = {
            id: `${blockData.type}-${Date.now()}-${index}`,
            ...blockData,
          } as Block;
          onAddBlock(newBlock);
        });

        toast.success(`Added ${blocks.length} blocks from AI`);
      }
    },
    [aiGeneratorType, onUpdateProfile, onAddBlock]
  );

  return {
    aiGeneratorOpen,
    aiGeneratorType,
    openAIBuilder,
    openSEOGenerator,
    openMagicTitle,
    openSalesCopy,
    closeAIGenerator,
    handleAIResult,
  };
}
