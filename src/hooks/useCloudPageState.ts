import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useUserPage, useSavePageMutation, usePublishPageMutation, pageQueryKeys } from '@/hooks/usePageCache';
import type { PageData, Block } from '@/types/page';
import { toast } from 'sonner';

export function useCloudPageState() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [chatbotContext, setChatbotContext] = useState<string>('');
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use React Query for cached page loading
  const { data: userData, isLoading: loading, refetch } = useUserPage(user?.id);
  const savePageMutation = useSavePageMutation(user?.id);
  const publishPageMutation = usePublishPageMutation(user?.id);

  // Update local state when cached data loads
  useEffect(() => {
    if (userData) {
      setPageData(userData.pageData);
      setChatbotContext(userData.chatbotContext || '');
    }
  }, [userData]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const autoSaveAndPublish = useCallback((data: PageData, context: string) => {
    if (!user) return;
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Debounce auto-save and publish
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        // Save first
        await savePageMutation.mutateAsync({ 
          pageData: data, 
          chatbotContext: context 
        });
        
        // Then auto-publish
        await publishPageMutation.mutateAsync();
      } catch (error) {
        console.error('Auto-save/publish error:', error);
      }
    }, 1500);
  }, [user, savePageMutation, publishPageMutation]);

  const save = useCallback(async () => {
    if (!user || !pageData) return;
    
    // Clear any pending auto-save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    await savePageMutation.mutateAsync({ 
      pageData, 
      chatbotContext 
    });
    await publishPageMutation.mutateAsync();
    toast.success('Changes saved and published!');
  }, [user, pageData, chatbotContext, savePageMutation, publishPageMutation]);

  const publish = useCallback(async () => {
    if (!user || !pageData) return null;
    
    // Clear any pending auto-save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    await savePageMutation.mutateAsync({ 
      pageData, 
      chatbotContext 
    });
    const slug = await publishPageMutation.mutateAsync();
    return slug;
  }, [user, pageData, chatbotContext, savePageMutation, publishPageMutation]);

  const addBlock = useCallback((block: Block, position?: number) => {
    if (!pageData) return;
    
    let newBlocks: Block[];
    if (typeof position === 'number') {
      // Find the profile block index (always at position 0)
      const profileIndex = pageData.blocks.findIndex(b => b.type === 'profile');
      // Calculate actual insertion index (after profile + position in content blocks)
      const insertIndex = profileIndex >= 0 ? profileIndex + 1 + position : position;
      newBlocks = [
        ...pageData.blocks.slice(0, insertIndex),
        block,
        ...pageData.blocks.slice(insertIndex),
      ];
    } else {
      newBlocks = [...pageData.blocks, block];
    }
    
    const newPageData = {
      ...pageData,
      blocks: newBlocks,
    };
    setPageData(newPageData);
    
    // Auto-save and publish
    autoSaveAndPublish(newPageData, chatbotContext);
  }, [pageData, chatbotContext, autoSaveAndPublish]);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      blocks: pageData.blocks.map(block =>
        block.id === id ? { ...block, ...updates } as Block : block
      ),
    };
    setPageData(newPageData);
    
    // Auto-save and publish
    autoSaveAndPublish(newPageData, chatbotContext);
  }, [pageData, chatbotContext, autoSaveAndPublish]);

  const deleteBlock = useCallback((id: string) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      blocks: pageData.blocks.filter(block => block.id !== id),
    };
    setPageData(newPageData);
    
    // Auto-save and publish
    autoSaveAndPublish(newPageData, chatbotContext);
  }, [pageData, chatbotContext, autoSaveAndPublish]);

  const reorderBlocks = useCallback((blocks: Block[]) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      blocks,
    };
    setPageData(newPageData);
    
    // Auto-save and publish
    autoSaveAndPublish(newPageData, chatbotContext);
  }, [pageData, chatbotContext, autoSaveAndPublish]);

  const updateTheme = useCallback((theme: Partial<PageData['theme']>) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      theme: { ...pageData.theme, ...theme },
    };
    setPageData(newPageData);
    
    // Auto-save and publish
    autoSaveAndPublish(newPageData, chatbotContext);
  }, [pageData, chatbotContext, autoSaveAndPublish]);

  const refresh = useCallback(async () => {
    if (user?.id) {
      await queryClient.invalidateQueries({ 
        queryKey: pageQueryKeys.userPage(user.id) 
      });
      await refetch();
    }
  }, [user?.id, queryClient, refetch]);

  return {
    pageData,
    chatbotContext,
    setChatbotContext,
    loading,
    saving: savePageMutation.isPending || publishPageMutation.isPending,
    save,
    publish,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    updateTheme,
    refresh,
  };
}
