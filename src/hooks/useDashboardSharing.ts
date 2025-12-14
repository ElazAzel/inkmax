import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getPublicPageUrl, copyToClipboard } from '@/lib/url-helpers';

const STORAGE_KEYS = {
  INSTALL_PROMPT_SHOWN: 'linkmax_install_prompt_shown',
} as const;

interface UseDashboardSharingOptions {
  onPublish: () => Promise<string | null>;
  onSave: () => Promise<void>;
  onQuestComplete?: (questKey: string) => void;
}

/**
 * Hook to manage sharing, preview, and install prompt logic
 */
export function useDashboardSharing({ onPublish, onSave, onQuestComplete }: UseDashboardSharingOptions) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  const handleShare = useCallback(async () => {
    const slug = await onPublish();
    if (!slug) return;

    const url = getPublicPageUrl(slug);
    const copied = await copyToClipboard(url);

    if (copied) {
      toast.success('Link copied to clipboard!');
      // Trigger share_page quest
      onQuestComplete?.('share_page');
    } else {
      toast.error('Failed to copy link');
    }

    // Show install prompt for first-time publishers
    const hasSeenInstallPrompt = localStorage.getItem(STORAGE_KEYS.INSTALL_PROMPT_SHOWN);
    if (!hasSeenInstallPrompt) {
      setPublishedUrl(url);
      setTimeout(() => setShowInstallPrompt(true), 1000);
      localStorage.setItem(STORAGE_KEYS.INSTALL_PROMPT_SHOWN, 'true');
    }
  }, [onPublish, onQuestComplete]);

  const handlePreview = useCallback(async () => {
    await onSave();
    const slug = await onPublish();
    if (slug) {
      window.open(`/${slug}`, '_blank');
    }
  }, [onSave, onPublish]);

  const closeInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false);
  }, []);

  return {
    showInstallPrompt,
    publishedUrl,
    handleShare,
    handlePreview,
    closeInstallPrompt,
  };
}
