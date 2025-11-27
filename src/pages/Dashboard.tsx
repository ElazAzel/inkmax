import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  LogOut, 
  Save, 
  Eye, 
  Upload, 
  Crown, 
  Sparkles, 
  Wand2, 
  MessageCircle,
  LayoutTemplate,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCloudPageState } from '@/hooks/useCloudPageState';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useBlockHints } from '@/hooks/useBlockHints';
import { useAchievements } from '@/hooks/useAchievements';
import { PreviewEditor } from '@/components/editor/PreviewEditor';
import { TemplateGallery } from '@/components/editor/TemplateGallery';
import { ThemeSelector } from '@/components/editor/ThemeSelector';
import { BlockEditor } from '@/components/BlockEditor';
import { AIGenerator } from '@/components/AIGenerator';
import { LocalStorageMigration } from '@/components/LocalStorageMigration';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { AchievementNotification } from '@/components/achievements/AchievementNotification';
import { AchievementsPanel } from '@/components/achievements/AchievementsPanel';
import { Card } from '@/components/ui/card';
import { createBlock } from '@/lib/block-factory';
import { toast } from 'sonner';
import type { Block } from '@/types/page';
import type { UserStats } from '@/types/achievements';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isPremium, isLoading: premiumLoading } = usePremiumStatus();
  const blockHints = useBlockHints();
  const achievements = useAchievements();
  const {
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
  } = useCloudPageState();

  const [migrationKey, setMigrationKey] = useState(0);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [aiGeneratorType, setAiGeneratorType] = useState<'magic-title' | 'sales-copy' | 'seo' | 'ai-builder'>('ai-builder');
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Check achievements whenever blocks or features change
  useEffect(() => {
    if (!pageData || achievements.loading || !user) return;

    const blocksUsed = new Set(pageData.blocks.map(b => b.type));
    const featuresUsed = new Set<string>();
    
    // Track feature usage
    if (chatbotContext && chatbotContext.length > 0) {
      featuresUsed.add('chatbot');
    }

    const stats: UserStats = {
      blocksUsed,
      totalBlocks: pageData.blocks.length,
      featuresUsed,
      pageViews: 0, // Will be fetched from database in future
      published: false, // Will be fetched from database in future
    };

    achievements.checkAchievements(stats);
  }, [pageData, chatbotContext, achievements, user]);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('linkmax_onboarding_completed');
    if (!hasCompletedOnboarding && user && pageData) {
      // Show onboarding after a short delay to let the page load
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, [user, pageData]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleInsertBlock = (blockType: string, _position: number) => {
    try {
      const newBlock = createBlock(blockType);
      
      // Check premium status for premium blocks
      const premiumBlocks = ['video', 'carousel', 'custom_code', 'form', 'newsletter', 'testimonial', 'scratch', 'search'];
      if (premiumBlocks.includes(blockType) && !isPremium) {
        toast.error('This block requires Premium');
        return;
      }

      addBlock(newBlock);
      toast.success('Block added');
      
      // Показываем подсказку при первом использовании блока
      blockHints.showHint(blockType, newBlock.id);
    } catch (error) {
      toast.error('Failed to add block');
      console.error(error);
    }
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setEditorOpen(true);
  };

  const handleSaveBlock = (updates: Partial<Block>) => {
    if (editingBlock) {
      updateBlock(editingBlock.id, updates);
    }
  };

  const handleApplyTemplate = (blocks: Block[]) => {
    blocks.forEach((block, index) => {
      addBlock({ ...block, id: `${block.type}-${Date.now()}-${index}` });
    });
    toast.success(`Added ${blocks.length} blocks from template`);
  };

  const handleAIResult = (result: any) => {
    if (aiGeneratorType === 'ai-builder') {
      const { profile, blocks } = result;
      
      const profileBlock = pageData?.blocks.find(b => b.type === 'profile');
      if (profile && profileBlock) {
        updateBlock(profileBlock.id, { 
          name: profile.name, 
          bio: profile.bio 
        });
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
  };

  const handleShare = async () => {
    const slug = await publish();
    if (slug) {
      const url = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePreview = async () => {
    await save();
    const slug = await publish();
    if (slug) {
      window.open(`/${slug}`, '_blank');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('linkmax_onboarding_completed', 'true');
    setShowOnboarding(false);
    toast.success('Добро пожаловать! Начните создавать свою страницу.');
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('linkmax_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your page...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load page</p>
        </div>
      </div>
    );
  }

  const profileBlock = pageData.blocks.find(b => b.type === 'profile');

  return (
    <div className="min-h-screen bg-background">
      {/* Migration Notice */}
      {user && (
        <LocalStorageMigration 
          key={migrationKey}
          userId={user.id} 
          onMigrated={() => {
            setMigrationKey(prev => prev + 1);
            window.location.reload();
          }}
        />
      )}

      {/* Top Toolbar - Mobile Optimized */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-primary">LinkMAX</h1>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* AI Tools - Hidden on mobile */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setAiGeneratorType('ai-builder');
                setAiGeneratorOpen(true);
              }}
              className="hidden md:inline-flex"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              AI Builder
            </Button>

            {/* Templates - Hidden on mobile */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setTemplateGalleryOpen(true)}
              className="hidden md:inline-flex"
            >
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Templates
            </Button>

            {/* Settings Toggle */}
            <Button 
              variant={showSettings ? "default" : "ghost"} 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="hidden sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>

            {/* Achievements Button - Mobile Optimized */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAchievements(true)}
              className="relative"
            >
              <Trophy className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Достижения</span>
              {achievements.getProgress().unlocked > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  {achievements.getProgress().unlocked}
                </span>
              )}
            </Button>

            <div className="h-6 w-px bg-border hidden sm:block" />

            {/* Save */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={save} 
              disabled={saving}
            >
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
            </Button>

            {/* Preview - Hidden on mobile */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreview}
              className="hidden sm:inline-flex"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            {/* Publish/Share */}
            <Button size="sm" onClick={handleShare} data-onboarding="share-button">
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            <div className="h-6 w-px bg-border hidden sm:block" />

            {/* Sign Out */}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative">
        {/* Settings Sidebar - Mobile Optimized */}
        {showSettings && (
          <div className="fixed left-0 top-14 bottom-0 w-full sm:w-80 bg-card border-r shadow-lg z-40 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Profile Settings */}
              {profileBlock && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={profileBlock.name}
                        onChange={(e) => updateBlock(profileBlock.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        value={profileBlock.bio}
                        onChange={(e) => updateBlock(profileBlock.id, { bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Theme Selector */}
              <Card className="p-4">
                <ThemeSelector 
                  currentTheme={pageData.theme}
                  onThemeChange={updateTheme}
                />
              </Card>

              {/* Premium Status */}
              {!premiumLoading && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className={`h-4 w-4 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-semibold">
                      {isPremium ? 'Premium Active' : 'Free Plan'}
                    </span>
                  </div>
                  {!isPremium && (
                    <p className="text-xs text-muted-foreground">
                      Upgrade to unlock all blocks and features
                    </p>
                  )}
                </Card>
              )}

              {/* Chatbot Settings */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-4 w-4" />
                  <h3 className="font-semibold">AI Chatbot Context</h3>
                </div>
                <div className="space-y-2">
                  <Label>Hidden Information</Label>
                  <Textarea
                    value={chatbotContext}
                    onChange={(e) => setChatbotContext(e.target.value)}
                    onBlur={save}
                    placeholder="Add context for the AI chatbot (pricing, services, availability, etc.)"
                    rows={6}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps the AI answer visitor questions accurately
                  </p>
                </div>
              </Card>

              {/* AI Tools */}
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">AI Tools</h3>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setAiGeneratorType('seo');
                      setAiGeneratorOpen(true);
                    }}
                  >
                    <Sparkles className="h-3 w-3 mr-2" />
                    SEO Generator
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Preview Editor - Mobile Optimized */}
        <div className={`transition-all duration-300 ${showSettings ? 'sm:ml-80' : ''}`}>
          <div className="py-4 sm:py-8">
            <PreviewEditor
              blocks={pageData.blocks}
              isPremium={isPremium}
              onInsertBlock={handleInsertBlock}
              onEditBlock={handleEditBlock}
              onDeleteBlock={deleteBlock}
              onReorderBlocks={reorderBlocks}
              activeBlockHint={blockHints.activeHint}
              onDismissHint={blockHints.dismissHint}
            />
          </div>
        </div>
      </div>

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

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Achievement Notification */}
      {achievements.newAchievement && (
        <AchievementNotification
          achievement={achievements.newAchievement}
          onDismiss={achievements.dismissAchievementNotification}
        />
      )}

      {/* Achievements Panel */}
      {showAchievements && (
        <AchievementsPanel onClose={() => setShowAchievements(false)} />
      )}
    </div>
  );
}
