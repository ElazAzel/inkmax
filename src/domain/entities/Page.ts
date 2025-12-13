/**
 * Page Entity - Core domain model for user pages
 * Pure business logic, no external dependencies
 */

import type { BaseBlock, BlockType } from './Block';

// ============= Value Objects =============

export type EditorMode = 'linear' | 'grid';

export interface PageTheme {
  backgroundColor: string;
  backgroundGradient?: string;
  textColor: string;
  buttonStyle: 'default' | 'rounded' | 'pill' | 'gradient';
  fontFamily: 'sans' | 'serif' | 'mono';
  darkMode?: boolean;
}

export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface PageMetrics {
  googleAnalytics?: string;
  facebookPixel?: string;
  yandexMetrika?: string;
  tiktokPixel?: string;
}

export interface GridConfig {
  columnsDesktop: number;
  columnsMobile: number;
  gapSize: number;
  cellHeight: number;
}

// ============= Page Entity =============

export interface Page<TBlock extends BaseBlock = BaseBlock> {
  id: string;
  userId?: string;
  slug?: string;
  blocks: TBlock[];
  theme: PageTheme;
  seo: PageSeo;
  isPremium?: boolean;
  isPublished?: boolean;
  metrics?: PageMetrics;
  editorMode?: EditorMode;
  gridConfig?: GridConfig;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============= Default Values =============

export const DEFAULT_THEME: PageTheme = {
  backgroundColor: 'hsl(var(--background))',
  textColor: 'hsl(var(--foreground))',
  buttonStyle: 'rounded',
  fontFamily: 'sans',
};

export const DEFAULT_SEO: PageSeo = {
  title: 'My LinkMAX Page',
  description: 'Check out my links',
  keywords: [],
};

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columnsDesktop: 3,
  columnsMobile: 2,
  gapSize: 16,
  cellHeight: 100,
};

// ============= Domain Logic =============

/**
 * Check if page has premium content
 */
export function hasPremiumContent(page: Page, isPremiumBlockType: (type: BlockType) => boolean): boolean {
  return page.blocks.some(block => isPremiumBlockType(block.type));
}

/**
 * Get block count by type
 */
export function getBlockCountByType(page: Page): Record<BlockType, number> {
  const counts = {} as Record<BlockType, number>;
  
  for (const block of page.blocks) {
    counts[block.type] = (counts[block.type] || 0) + 1;
  }
  
  return counts;
}

/**
 * Find block by ID
 */
export function findBlockById<TBlock extends BaseBlock>(
  page: Page<TBlock>,
  blockId: string
): TBlock | undefined {
  return page.blocks.find(block => block.id === blockId);
}

/**
 * Find block index by ID
 */
export function findBlockIndexById(page: Page, blockId: string): number {
  return page.blocks.findIndex(block => block.id === blockId);
}

/**
 * Check if page can be published
 */
export function canPublishPage(page: Page): { canPublish: boolean; reason?: string } {
  if (page.blocks.length === 0) {
    return { canPublish: false, reason: 'Page must have at least one block' };
  }
  
  const hasProfile = page.blocks.some(block => block.type === 'profile');
  if (!hasProfile) {
    return { canPublish: false, reason: 'Page must have a profile block' };
  }
  
  return { canPublish: true };
}

/**
 * Validate page structure
 */
export function validatePage(page: Page): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!page.id) {
    errors.push('Page ID is required');
  }
  
  if (!page.theme) {
    errors.push('Page theme is required');
  }
  
  if (!page.seo) {
    errors.push('Page SEO is required');
  }
  
  if (!Array.isArray(page.blocks)) {
    errors.push('Page blocks must be an array');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Reorder blocks by moving a block from one index to another
 */
export function reorderBlocks<TBlock extends BaseBlock>(
  blocks: TBlock[],
  fromIndex: number,
  toIndex: number
): TBlock[] {
  if (fromIndex < 0 || fromIndex >= blocks.length) {
    return blocks;
  }
  if (toIndex < 0 || toIndex >= blocks.length) {
    return blocks;
  }
  
  const result = [...blocks];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  return result;
}
