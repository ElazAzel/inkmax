import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Block } from '@/types/page';
import { createBlock } from '@/lib/block-factory';

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
  onReplaceBlocks?: (blocks: Block[]) => void;
  onQuestComplete?: (questKey: string) => void;
}

/**
 * Creates a proper block from AI-generated data by merging with factory defaults
 */
function createBlockFromAI(blockData: { type: string; [key: string]: any }, index: number): Block | null {
  try {
    // Create base block from factory
    const baseBlock = createBlock(blockData.type);
    
    // Generate unique ID
    const id = `${blockData.type}-${Date.now()}-${index}`;
    
    // Merge AI data with base block, AI data takes precedence
    const mergedBlock = {
      ...baseBlock,
      ...blockData,
      id,
    };
    
    return mergedBlock as Block;
  } catch (error) {
    console.warn(`Unknown block type from AI: ${blockData.type}`, error);
    return null;
  }
}

/**
 * Hook to manage AI generator state and handlers
 */
export function useDashboardAI({ onUpdateProfile, onAddBlock, onReplaceBlocks, onQuestComplete }: UseDashboardAIOptions) {
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
      // Mark AI as used for achievements
      localStorage.setItem('linkmax_ai_used', 'true');
      
      // Trigger use_ai quest on any AI result
      onQuestComplete?.('use_ai');
      
      if (aiGeneratorType === 'ai-builder') {
        const { profile, blocks } = result;

        // Update profile if provided
        if (profile) {
          onUpdateProfile(profile);
        }

        // Convert AI blocks to proper Block objects
        const validBlocks: Block[] = [];
        
        blocks.forEach((blockData, index) => {
          const block = createBlockFromAI(blockData, index);
          if (block) {
            validBlocks.push(block);
          }
        });

        // If we have onReplaceBlocks, use it to replace all blocks at once
        // This is better UX than adding one by one
        if (onReplaceBlocks && validBlocks.length > 0) {
          onReplaceBlocks(validBlocks);
          toast.success(`✨ Создано ${validBlocks.length} блоков с помощью AI`);
        } else {
          // Fallback: add blocks one by one
          validBlocks.forEach((block) => {
            onAddBlock(block);
          });
          toast.success(`Добавлено ${validBlocks.length} блоков`);
        }
      }
    },
    [aiGeneratorType, onUpdateProfile, onAddBlock, onReplaceBlocks, onQuestComplete]
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
