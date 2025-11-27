import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { savePage, loadUserPage, publishPage } from '@/lib/database';
import type { PageData, Block } from '@/types/page';
import { toast } from 'sonner';

export function useCloudPageState() {
  const { user } = useAuth();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [chatbotContext, setChatbotContext] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load page data when user logs in
  useEffect(() => {
    if (user) {
      loadPage();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPage = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, chatbotContext: context, error } = await loadUserPage(user.id);
    
    if (error) {
      console.error('Error loading page:', error);
      toast.error('Failed to load your page');
    } else if (data) {
      setPageData(data);
      setChatbotContext(context || '');
    }
    
    setLoading(false);
  };

  const save = async () => {
    if (!user || !pageData) return;
    
    setSaving(true);
    const { error } = await savePage(pageData, user.id, chatbotContext);
    
    if (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save changes');
    } else {
      toast.success('Changes saved!');
    }
    
    setSaving(false);
  };

  const publish = async () => {
    if (!user) return null;
    
    // Save first
    await save();
    
    const { slug, error } = await publishPage(user.id);
    
    if (error) {
      console.error('Error publishing page:', error);
      toast.error('Failed to publish page');
      return null;
    }
    
    toast.success('Page published!');
    return slug;
  };

  const addBlock = (block: Block) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      blocks: [...pageData.blocks, block],
    };
    setPageData(newPageData);
    // Auto-save after adding block
    setTimeout(() => {
      if (user) {
        savePage(newPageData, user.id, chatbotContext);
      }
    }, 500);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      blocks: pageData.blocks.map(block =>
        block.id === id ? { ...block, ...updates } as Block : block
      ),
    };
    setPageData(newPageData);
    // Auto-save after updating block
    setTimeout(() => {
      if (user) {
        savePage(newPageData, user.id, chatbotContext);
      }
    }, 1000);
  };

  const deleteBlock = (id: string) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      blocks: pageData.blocks.filter(block => block.id !== id),
    };
    setPageData(newPageData);
    // Auto-save after deleting block
    setTimeout(() => {
      if (user) {
        savePage(newPageData, user.id, chatbotContext);
      }
    }, 500);
  };

  const reorderBlocks = (blocks: Block[]) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      blocks,
    });
  };

  const updateTheme = (theme: Partial<PageData['theme']>) => {
    if (!pageData) return;
    const newPageData = {
      ...pageData,
      theme: { ...pageData.theme, ...theme },
    };
    setPageData(newPageData);
    // Auto-save after updating theme
    setTimeout(() => {
      if (user) {
        savePage(newPageData, user.id, chatbotContext);
      }
    }, 1000);
  };

  return {
    pageData,
    chatbotContext,
    setChatbotContext,
    loading,
    saving,
    save,
    publish,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    updateTheme,
  };
}
