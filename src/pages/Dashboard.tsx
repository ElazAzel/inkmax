import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCloudPageState } from '@/hooks/useCloudPageState';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useBlockHints } from '@/hooks/useBlockHints';
import { useAchievements } from '@/hooks/useAchievements';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { PreviewEditor } from '@/components/editor/PreviewEditor';
import { TemplateGallery } from '@/components/editor/TemplateGallery';
import { MobileToolbar } from '@/components/editor/MobileToolbar';
import { MobileSettingsSheet } from '@/components/editor/MobileSettingsSheet';
import { PullToRefresh } from '@/components/editor/PullToRefresh';
import { BlockEditor } from '@/components/BlockEditor';
import { AIGenerator } from '@/components/AIGenerator';
import { LocalStorageMigration } from '@/components/LocalStorageMigration';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { NicheOnboarding } from '@/components/onboarding/NicheOnboarding';
import { AchievementNotification } from '@/components/achievements/AchievementNotification';
import { InstallPromptDialog } from '@/components/InstallPromptDialog';
import { AchievementsPanel } from '@/components/achievements/AchievementsPanel';
import { LeadsPanel } from '@/components/crm/LeadsPanel';
import {
  DashboardHeader,
  MobileHeader,
  SettingsSidebar,
  LoadingState,
  ErrorState,
  BackgroundEffects,
} from '@/components/dashboard';
import { createBlock } from '@/lib/block-factory';
import { PREMIUM_BLOCK_TYPES, APP_CONFIG } from '@/lib/constants';
import { toast } from 'sonner';
import type { Block, ProfileBlock } from '@/types/page';
import type { UserStats } from '@/types/achievements';

type AIGeneratorType = 'magic-title' | 'sales-copy' | 'seo' | 'ai-builder';

interface DeletedBlockInfo {
  block: Block;
  position: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isPremium, isLoading: premiumLoading } = usePremiumStatus();
  const blockHints = useBlockHints();
  const achievements = useAchievements();
  const userProfile = useUserProfile(user?.id);
  const { playAdd, playDelete, playError } = useSoundEffects();
  const isMobile = useIsMobile();
  const haptic = useHapticFeedback();

  const {
    pageData,
    chatbotContext,
    setChatbotContext,
    loading,
    saving,
    saveStatus,
    save,
    publish,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    refresh,
  } = useCloudPageState();

  // UI State
  const [migrationKey, setMigrationKey] = useState(0);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [aiGeneratorType, setAiGeneratorType] = useState<AIGeneratorType>('ai-builder');
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNicheOnboarding, setShowNicheOnboarding] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  // Undo functionality
  const [lastDeletedBlock, setLastDeletedBlock] = useState<DeletedBlockInfo | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle delete with undo capability
  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      if (!pageData) return;

      const blockIndex = pageData.blocks.findIndex((b) => b.id === blockId);
      const block = pageData.blocks.find((b) => b.id === blockId);

      if (!block || block.type === 'profile') return;

      // Store for undo
      setLastDeletedBlock({ block, position: blockIndex });

      // Clear previous timeout
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      // Set timeout to clear undo option
      undoTimeoutRef.current = setTimeout(() => {
        setLastDeletedBlock(null);
        undoTimeoutRef.current = null;
      }, APP_CONFIG.undoTimeout);

      // Delete the block
      deleteBlock(blockId);
      playDelete();

      // Show toast with undo button
      toast(
        <div className="flex items-center gap-3">
          <span>Block deleted</span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 gap-1"
            onClick={(e) => {
              e.stopPropagation();
              haptic.success();
              addBlock(block, blockIndex);
              setLastDeletedBlock(null);
              if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current);
                undoTimeoutRef.current = null;
              }
              toast.success('Block restored');
            }}
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </Button>
        </div>,
        { duration: APP_CONFIG.undoTimeout }
      );
    },
    [pageData, deleteBlock, playDelete, addBlock, haptic]
  );

  // Check achievements
  useEffect(() => {
    if (!pageData || achievements.loading || !user) return;

    const blocksUsed = new Set(pageData.blocks.map((b) => b.type));
    const featuresUsed = new Set<string>();

    if (chatbotContext && chatbotContext.length > 0) {
      featuresUsed.add('chatbot');
    }

    const stats: UserStats = {
      blocksUsed,
      totalBlocks: pageData.blocks.length,
      featuresUsed,
      pageViews: 0,
      published: false,
    };

    achievements.checkAchievements(stats);
  }, [pageData, chatbotContext, achievements, user]);

  // Initialize username
  useEffect(() => {
    if (userProfile.profile?.username) {
      setUsernameInput(userProfile.profile.username);
    }
  }, [userProfile.profile]);

  // Check onboarding
  useEffect(() => {
    const hasCompletedNicheOnboarding = localStorage.getItem('linkmax_niche_onboarding_completed');
    const hasCompletedOnboarding = localStorage.getItem('linkmax_onboarding_completed');

    if (!hasCompletedNicheOnboarding && user && pageData) {
      setTimeout(() => setShowNicheOnboarding(true), 500);
    } else if (!hasCompletedOnboarding && user && pageData) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, [user, pageData]);

  // Auth redirect
  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handlers
  const handleInsertBlock = useCallback(
    (blockType: string, position: number) => {
      try {
        const newBlock = createBlock(blockType);

        if (PREMIUM_BLOCK_TYPES.includes(blockType as any) && !isPremium) {
          toast.error('This block requires Premium');
          playError();
          return;
        }

        addBlock(newBlock, position);
        playAdd();
        toast.success('Block added');
        blockHints.showHint(blockType, newBlock.id);
      } catch (error) {
        toast.error('Failed to add block');
        playError();
        console.error(error);
      }
    },
    [isPremium, addBlock, playAdd, playError, blockHints]
  );

  const handleEditBlock = useCallback((block: Block) => {
    setEditingBlock(block);
    setEditorOpen(true);
  }, []);

  const handleSaveBlock = useCallback(
    (updates: Partial<Block>) => {
      if (editingBlock) {
        updateBlock(editingBlock.id, updates);
      }
    },
    [editingBlock, updateBlock]
  );

  const handleApplyTemplate = useCallback(
    (blocks: Block[]) => {
      blocks.forEach((block, index) => {
        addBlock({ ...block, id: `${block.type}-${Date.now()}-${index}` });
      });
      toast.success(`Added ${blocks.length} blocks from template`);
    },
    [addBlock]
  );

  const handleAIResult = useCallback(
    (result: any) => {
      if (aiGeneratorType === 'ai-builder') {
        const { profile, blocks } = result;

        const profileBlock = pageData?.blocks.find((b) => b.type === 'profile');
        if (profile && profileBlock) {
          updateBlock(profileBlock.id, { name: profile.name, bio: profile.bio });
        }

        blocks.forEach((blockData: any, index: number) => {
          const newBlock: Block = {
            id: `${blockData.type}-${Date.now()}-${index}`,
            ...blockData,
          };
          addBlock(newBlock);
        });

        toast.success(`Added ${blocks.length} blocks from AI`);
      }
    },
    [aiGeneratorType, pageData, updateBlock, addBlock]
  );

  const handleUpdateUsername = useCallback(async () => {
    if (!usernameInput.trim()) {
      toast.error('Please enter a username');
      return;
    }

    const success = await userProfile.updateUsername(usernameInput.trim());
    if (success) {
      await save();
    }
  }, [usernameInput, userProfile, save]);

  const handleShare = useCallback(async () => {
    const slug = await publish();
    if (slug) {
      const url = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');

      const hasSeenInstallPrompt = localStorage.getItem('linkmax_install_prompt_shown');
      if (!hasSeenInstallPrompt) {
        setPublishedUrl(url);
        setTimeout(() => setShowInstallPrompt(true), 1000);
        localStorage.setItem('linkmax_install_prompt_shown', 'true');
      }
    }
  }, [publish]);

  const handlePreview = useCallback(async () => {
    await save();
    const slug = await publish();
    if (slug) {
      window.open(`/${slug}`, '_blank');
    }
  }, [save, publish]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('linkmax_onboarding_completed', 'true');
    setShowOnboarding(false);
    toast.success('Добро пожаловать! Начните создавать свою страницу.');
  }, []);

  const handleOnboardingSkip = useCallback(() => {
    localStorage.setItem('linkmax_onboarding_completed', 'true');
    setShowOnboarding(false);
  }, []);

  const handleNicheOnboardingComplete = useCallback(
    (profile: { name: string; bio: string }, blocks: Block[]) => {
      const profileBlock = pageData?.blocks.find((b) => b.type === 'profile');
      if (profile && profileBlock) {
        updateBlock(profileBlock.id, { name: profile.name, bio: profile.bio });
      }

      blocks.forEach((block) => addBlock(block));
      setShowNicheOnboarding(false);
      setTimeout(() => setShowOnboarding(true), 500);
    },
    [pageData, updateBlock, addBlock]
  );

  const handleUpdateProfile = useCallback(
    (updates: Partial<ProfileBlock>) => {
      const profileBlock = pageData?.blocks.find((b) => b.type === 'profile');
      if (profileBlock) {
        updateBlock(profileBlock.id, updates);
      }
    },
    [pageData, updateBlock]
  );

  const openAIBuilder = useCallback(() => {
    setAiGeneratorType('ai-builder');
    setAiGeneratorOpen(true);
  }, []);

  const openSEOGenerator = useCallback(() => {
    setAiGeneratorType('seo');
    setAiGeneratorOpen(true);
  }, []);

  // Loading/Error states
  if (loading) return <LoadingState />;
  if (!pageData) return <ErrorState />;

  const profileBlock = pageData.blocks.find((b) => b.type === 'profile') as ProfileBlock | undefined;

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />

      {/* Migration Notice */}
      {user && (
        <LocalStorageMigration
          key={migrationKey}
          userId={user.id}
          onMigrated={() => {
            setMigrationKey((prev) => prev + 1);
            window.location.reload();
          }}
        />
      )}

      {/* Desktop Header */}
      <DashboardHeader
        saving={saving}
        saveStatus={saveStatus}
        achievementCount={achievements.getProgress().unlocked}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onSave={save}
        onPreview={handlePreview}
        onShare={handleShare}
        onSignOut={handleSignOut}
        onOpenAIBuilder={openAIBuilder}
        onOpenTemplates={() => setTemplateGalleryOpen(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenCRM={() => setShowLeads(true)}
      />

      {/* Mobile Header */}
      <MobileHeader onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="relative">
        {/* Settings Sidebar */}
        <SettingsSidebar
          show={showSettings && !isMobile}
          onClose={() => setShowSettings(false)}
          usernameInput={usernameInput}
          onUsernameChange={setUsernameInput}
          onUpdateUsername={handleUpdateUsername}
          usernameSaving={userProfile.saving}
          profileBlock={profileBlock}
          onUpdateProfile={handleUpdateProfile}
          isPremium={isPremium}
          premiumLoading={premiumLoading}
          chatbotContext={chatbotContext}
          onChatbotContextChange={setChatbotContext}
          onSave={save}
          onOpenSEOGenerator={openSEOGenerator}
        />

        {/* Preview Editor */}
        <div className={`transition-all duration-300 ${showSettings && !isMobile ? 'md:ml-80' : ''}`}>
          <PullToRefresh
            onRefresh={async () => {
              if (refresh) {
                await refresh();
                toast.success('Page refreshed');
              }
            }}
            disabled={loading || saving}
          >
            <div className="py-4 pb-24 md:pb-8">
              <PreviewEditor
                blocks={pageData.blocks}
                isPremium={isPremium}
                onInsertBlock={handleInsertBlock}
                onEditBlock={handleEditBlock}
                onDeleteBlock={handleDeleteBlock}
                onReorderBlocks={reorderBlocks}
                onUpdateBlock={updateBlock}
                activeBlockHint={blockHints.activeHint}
                onDismissHint={blockHints.dismissHint}
              />
            </div>
          </PullToRefresh>
        </div>
      </div>

      {/* Mobile Bottom Toolbar */}
      {isMobile && (
        <MobileToolbar
          saving={saving}
          saveStatus={saveStatus}
          onSave={save}
          onPreview={handlePreview}
          onShare={handleShare}
          onOpenSettings={() => setShowMobileSettings(true)}
          onOpenAIBuilder={openAIBuilder}
          onOpenTemplates={() => setTemplateGalleryOpen(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenCRM={() => setShowLeads(true)}
          achievementCount={achievements.getProgress().unlocked}
        />
      )}

      {/* Mobile Settings Sheet */}
      <MobileSettingsSheet
        open={showMobileSettings}
        onOpenChange={setShowMobileSettings}
        usernameInput={usernameInput}
        onUsernameChange={setUsernameInput}
        onUpdateUsername={handleUpdateUsername}
        usernameSaving={userProfile.saving}
        profileBlock={profileBlock}
        onUpdateProfile={handleUpdateProfile}
        isPremium={isPremium}
        premiumLoading={premiumLoading}
        chatbotContext={chatbotContext}
        onChatbotContextChange={setChatbotContext}
        onSave={save}
        onOpenSEOGenerator={openSEOGenerator}
        onSignOut={handleSignOut}
      />

      {/* Modals */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveBlock}
        />
      )}

      <TemplateGallery
        open={templateGalleryOpen}
        onClose={() => setTemplateGalleryOpen(false)}
        onSelect={handleApplyTemplate}
      />

      {aiGeneratorOpen && (
        <AIGenerator
          type={aiGeneratorType}
          isOpen={aiGeneratorOpen}
          onClose={() => setAiGeneratorOpen(false)}
          onResult={handleAIResult}
        />
      )}

      {/* Niche Onboarding */}
      {showNicheOnboarding && (
        <NicheOnboarding
          isOpen={showNicheOnboarding}
          onClose={() => {
            localStorage.setItem('linkmax_niche_onboarding_completed', 'true');
            setShowNicheOnboarding(false);
          }}
          onComplete={handleNicheOnboardingComplete}
        />
      )}

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}

      {/* Achievement Notification */}
      {achievements.newAchievement && (
        <AchievementNotification
          achievement={achievements.newAchievement}
          onDismiss={achievements.dismissAchievementNotification}
        />
      )}

      {/* Achievements Panel */}
      {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}

      {/* Leads Panel (CRM) */}
      <LeadsPanel open={showLeads} onOpenChange={setShowLeads} />

      {/* Install Prompt Dialog */}
      <InstallPromptDialog
        open={showInstallPrompt}
        onClose={() => setShowInstallPrompt(false)}
        pageUrl={publishedUrl}
      />
    </div>
  );
}
