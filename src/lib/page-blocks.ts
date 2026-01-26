import type { Block, BlockType } from '@/types/page';
import { BLOCK_TYPES } from '@/types/page';

export interface SavePageBlockPayload {
  type: BlockType;
  position: number;
  title: string | null;
  content: Block;
  style: Record<string, unknown>;
  schedule: Record<string, unknown> | null;
}

const blockTypeSet = new Set<BlockType>(BLOCK_TYPES);

function isBlockType(value: string): value is BlockType {
  return blockTypeSet.has(value as BlockType);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function buildBlocksPayload(
  blocks: Block[],
  getTitle: (block: Block) => string | null
): SavePageBlockPayload[] {
  return blocks.map((block, index) => {
    if (!block || typeof block !== 'object') {
      throw new Error(`Invalid block at position ${index}`);
    }

    if (typeof block.id !== 'string' || !block.id.trim()) {
      throw new Error(`Invalid block id at position ${index}`);
    }

    if (!isBlockType(block.type)) {
      throw new Error(`Unsupported block type: ${String(block.type)}`);
    }

    const content = structuredClone(block);

    if (!isRecord(content)) {
      throw new Error(`Invalid block content at position ${index}`);
    }

    const schedule = 'schedule' in block && isRecord(block.schedule) ? block.schedule : null;

    return {
      type: block.type,
      position: index,
      title: getTitle(block),
      content,
      style: {},
      schedule,
    };
  });
}
