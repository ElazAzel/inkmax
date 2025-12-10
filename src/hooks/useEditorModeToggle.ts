import { useCallback } from 'react';
import type { Block, EditorMode, PageData } from '@/types/page';
import { DEFAULT_GRID_CONFIG } from './useGridLayout';

interface UseEditorModeToggleOptions {
  pageData: PageData | null;
  updatePageData: (updates: Partial<PageData>) => void;
}

/**
 * Hook to handle switching between linear and grid editor modes
 */
export function useEditorModeToggle({ pageData, updatePageData }: UseEditorModeToggleOptions) {
  const currentMode = pageData?.editorMode || 'linear';

  // Convert blocks to grid mode (vertical stack initially)
  const convertToGridMode = useCallback((blocks: Block[]): Block[] => {
    const columns = DEFAULT_GRID_CONFIG.columnsDesktop;
    
    return blocks.map((block, index) => {
      // Profile block stays at top spanning full width
      if (block.type === 'profile') {
        return {
          ...block,
          gridLayout: {
            gridColumn: 1,
            gridRow: 1,
            gridWidth: columns,
            gridHeight: 1,
          },
          createdAt: block.createdAt || new Date().toISOString(),
        } as Block;
      }
      
      // Content blocks stack vertically in first column
      const contentIndex = index - (blocks.some(b => b.type === 'profile') ? 1 : 0);
      return {
        ...block,
        gridLayout: {
          gridColumn: 1,
          gridRow: contentIndex + 2, // After profile
          gridWidth: 1,
          gridHeight: 1,
        },
        createdAt: block.createdAt || new Date().toISOString(),
      } as Block;
    });
  }, []);

  // Convert blocks back to linear mode (sorted by createdAt)
  const convertToLinearMode = useCallback((blocks: Block[]): Block[] => {
    // Separate profile and content blocks
    const profileBlock = blocks.find(b => b.type === 'profile');
    const contentBlocks = blocks.filter(b => b.type !== 'profile');
    
    // Sort content blocks by createdAt
    const sortedContent = [...contentBlocks].sort((a, b) => {
      const aTime = a.createdAt || '0';
      const bTime = b.createdAt || '0';
      return aTime.localeCompare(bTime);
    });
    
    // Remove grid layout data
    const cleanedBlocks = sortedContent.map(block => {
      const { gridLayout, ...rest } = block;
      return rest as Block;
    });
    
    // Profile always first
    if (profileBlock) {
      const { gridLayout, ...cleanProfile } = profileBlock;
      return [cleanProfile as Block, ...cleanedBlocks];
    }
    
    return cleanedBlocks;
  }, []);

  // Toggle between modes
  const toggleMode = useCallback(() => {
    if (!pageData) return;
    
    const newMode: EditorMode = currentMode === 'linear' ? 'grid' : 'linear';
    
    let newBlocks: Block[];
    if (newMode === 'grid') {
      newBlocks = convertToGridMode(pageData.blocks);
    } else {
      newBlocks = convertToLinearMode(pageData.blocks);
    }
    
    updatePageData({
      blocks: newBlocks,
      editorMode: newMode,
      gridConfig: newMode === 'grid' ? (pageData.gridConfig || DEFAULT_GRID_CONFIG) : undefined,
    });
  }, [pageData, currentMode, convertToGridMode, convertToLinearMode, updatePageData]);

  // Set specific mode
  const setMode = useCallback((mode: EditorMode) => {
    if (!pageData || currentMode === mode) return;
    toggleMode();
  }, [pageData, currentMode, toggleMode]);

  return {
    currentMode,
    toggleMode,
    setMode,
    isGridMode: currentMode === 'grid',
    isLinearMode: currentMode === 'linear',
  };
}
