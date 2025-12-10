import { useState } from 'react';
import { toast } from 'sonner';
import { useDashboard } from '@/hooks/useDashboard';
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

export default function Dashboard() {
  const dashboard = useDashboard();

  // Local UI state
  const [migrationKey, setMigrationKey] = useState(0);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeads, setShowLeads] = useState(false);

  // Loading/Error states
  if (dashboard.loading) return <LoadingState />;
  if (!dashboard.pageData) return <ErrorState />;

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />

      {/* Migration Notice */}
      {dashboard.user && (
        <LocalStorageMigration
          key={migrationKey}
          userId={dashboard.user.id}
          onMigrated={() => {
            setMigrationKey((prev) => prev + 1);
            window.location.reload();
          }}
        />
      )}

      {/* Desktop Header */}
      <DashboardHeader
        saving={dashboard.saving}
        saveStatus={dashboard.saveStatus}
        achievementCount={dashboard.achievements.getProgress().unlocked}
        showSettings={showSettings}
        editorMode={dashboard.pageData?.editorMode || 'linear'}
        onToggleEditorMode={dashboard.toggleEditorMode}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onSave={dashboard.save}
        onPreview={dashboard.sharingState.handlePreview}
        onShare={dashboard.sharingState.handleShare}
        onSignOut={dashboard.handleSignOut}
        onOpenAIBuilder={dashboard.aiState.openAIBuilder}
        onOpenTemplates={() => setTemplateGalleryOpen(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenCRM={() => setShowLeads(true)}
      />

      {/* Mobile Header */}
      <MobileHeader onSignOut={dashboard.handleSignOut} />

      {/* Main Content */}
      <div className="relative">
        {/* Settings Sidebar */}
        <SettingsSidebar
          show={showSettings && !dashboard.isMobile}
          onClose={() => setShowSettings(false)}
          usernameInput={dashboard.usernameState.usernameInput}
          onUsernameChange={dashboard.usernameState.setUsernameInput}
          onUpdateUsername={dashboard.usernameState.handleUpdateUsername}
          usernameSaving={dashboard.usernameState.saving}
          profileBlock={dashboard.profileBlock}
          onUpdateProfile={dashboard.handleUpdateProfile}
          isPremium={dashboard.isPremium}
          premiumLoading={dashboard.premiumLoading}
          chatbotContext={dashboard.chatbotContext}
          onChatbotContextChange={dashboard.setChatbotContext}
          onSave={dashboard.save}
          onOpenSEOGenerator={dashboard.aiState.openSEOGenerator}
        />

        {/* Preview Editor */}
        <div
          className={`transition-all duration-300 ${
            showSettings && !dashboard.isMobile ? 'md:ml-80' : ''
          }`}
        >
          <PullToRefresh
            onRefresh={async () => {
              if (dashboard.refresh) {
                await dashboard.refresh();
                toast.success('Page refreshed');
              }
            }}
            disabled={dashboard.loading || dashboard.saving}
          >
            <div className="py-4 pb-24 md:pb-8">
              <PreviewEditor
                blocks={dashboard.pageData.blocks}
                isPremium={dashboard.isPremium}
                onInsertBlock={dashboard.blockEditor.handleInsertBlock}
                onEditBlock={dashboard.blockEditor.handleEditBlock}
                onDeleteBlock={dashboard.blockEditor.handleDeleteBlock}
                onReorderBlocks={dashboard.reorderBlocks}
                onUpdateBlock={dashboard.updateBlock}
                activeBlockHint={dashboard.blockHints.activeHint}
                onDismissHint={dashboard.blockHints.dismissHint}
              />
            </div>
          </PullToRefresh>
        </div>
      </div>

      {/* Mobile Bottom Toolbar */}
      {dashboard.isMobile && (
        <MobileToolbar
          saving={dashboard.saving}
          saveStatus={dashboard.saveStatus}
          onSave={dashboard.save}
          onPreview={dashboard.sharingState.handlePreview}
          onShare={dashboard.sharingState.handleShare}
          onOpenSettings={() => setShowMobileSettings(true)}
          onOpenAIBuilder={dashboard.aiState.openAIBuilder}
          onOpenTemplates={() => setTemplateGalleryOpen(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenCRM={() => setShowLeads(true)}
          achievementCount={dashboard.achievements.getProgress().unlocked}
        />
      )}

      {/* Mobile Settings Sheet */}
      <MobileSettingsSheet
        open={showMobileSettings}
        onOpenChange={setShowMobileSettings}
        usernameInput={dashboard.usernameState.usernameInput}
        onUsernameChange={dashboard.usernameState.setUsernameInput}
        onUpdateUsername={dashboard.usernameState.handleUpdateUsername}
        usernameSaving={dashboard.usernameState.saving}
        profileBlock={dashboard.profileBlock}
        onUpdateProfile={dashboard.handleUpdateProfile}
        isPremium={dashboard.isPremium}
        premiumLoading={dashboard.premiumLoading}
        chatbotContext={dashboard.chatbotContext}
        onChatbotContextChange={dashboard.setChatbotContext}
        onSave={dashboard.save}
        onOpenSEOGenerator={dashboard.aiState.openSEOGenerator}
        onSignOut={dashboard.handleSignOut}
      />

      {/* Block Editor Modal */}
      {dashboard.blockEditor.editingBlock && (
        <BlockEditor
          block={dashboard.blockEditor.editingBlock}
          isOpen={dashboard.blockEditor.editorOpen}
          onClose={dashboard.blockEditor.closeEditor}
          onSave={dashboard.blockEditor.handleSaveBlock}
        />
      )}

      {/* Template Gallery */}
      <TemplateGallery
        open={templateGalleryOpen}
        onClose={() => setTemplateGalleryOpen(false)}
        onSelect={dashboard.handleApplyTemplate}
      />

      {/* AI Generator */}
      {dashboard.aiState.aiGeneratorOpen && (
        <AIGenerator
          type={dashboard.aiState.aiGeneratorType}
          isOpen={dashboard.aiState.aiGeneratorOpen}
          onClose={dashboard.aiState.closeAIGenerator}
          onResult={dashboard.aiState.handleAIResult}
        />
      )}

      {/* Niche Onboarding */}
      {dashboard.onboardingState.showNicheOnboarding && (
        <NicheOnboarding
          isOpen={dashboard.onboardingState.showNicheOnboarding}
          onClose={dashboard.onboardingState.handleNicheOnboardingClose}
          onComplete={dashboard.onboardingState.handleNicheOnboardingComplete}
        />
      )}

      {/* Onboarding Tour */}
      {dashboard.onboardingState.showOnboarding && (
        <OnboardingTour
          onComplete={dashboard.onboardingState.handleOnboardingComplete}
          onSkip={dashboard.onboardingState.handleOnboardingSkip}
        />
      )}

      {/* Achievement Notification */}
      {dashboard.achievements.newAchievement && (
        <AchievementNotification
          achievement={dashboard.achievements.newAchievement}
          onDismiss={dashboard.achievements.dismissAchievementNotification}
        />
      )}

      {/* Achievements Panel */}
      {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}

      {/* Leads Panel (CRM) */}
      <LeadsPanel open={showLeads} onOpenChange={setShowLeads} />

      {/* Install Prompt Dialog */}
      <InstallPromptDialog
        open={dashboard.sharingState.showInstallPrompt}
        onClose={dashboard.sharingState.closeInstallPrompt}
        pageUrl={dashboard.sharingState.publishedUrl}
      />
    </div>
  );
}
