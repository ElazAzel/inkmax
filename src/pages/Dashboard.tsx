import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, LogOut, Save, Upload, Crown, Video, Images, Code, Sparkles, Wand2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCloudPageState } from '@/hooks/useCloudPageState';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { BlockRenderer } from '@/components/BlockRenderer';
import { LocalStorageMigration } from '@/components/LocalStorageMigration';
import { DraggableBlockList } from '@/components/DraggableBlockList';
import { BlockEditor } from '@/components/BlockEditor';
import { AIGenerator } from '@/components/AIGenerator';
import { toast } from 'sonner';
import type { Block } from '@/types/page';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isPremium, isLoading: premiumLoading } = usePremiumStatus();
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
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [aiGeneratorType, setAiGeneratorType] = useState<'magic-title' | 'sales-copy' | 'seo' | 'ai-builder'>('magic-title');

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleAddLink = () => {
    const newBlock: Block = {
      id: `link-${Date.now()}`,
      type: 'link',
      title: 'New Link',
      url: 'https://example.com',
      icon: 'globe',
      style: 'rounded',
    };
    addBlock(newBlock);
    toast.success('Link added');
  };

  const handleAddProduct = () => {
    const newBlock: Block = {
      id: `product-${Date.now()}`,
      type: 'product',
      name: 'New Product',
      description: 'Product description',
      price: 0,
      currency: '$',
    };
    addBlock(newBlock);
    toast.success('Product added');
  };

  const handleAddVideo = () => {
    if (!isPremium) {
      toast.error('Video blocks require Premium');
      return;
    }

    const newBlock: Block = {
      id: `video-${Date.now()}`,
      type: 'video',
      title: 'My Video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube',
      aspectRatio: '16:9',
    };
    addBlock(newBlock);
    toast.success('Video block added');
  };

  const handleAddCarousel = () => {
    if (!isPremium) {
      toast.error('Carousel blocks require Premium');
      return;
    }

    const newBlock: Block = {
      id: `carousel-${Date.now()}`,
      type: 'carousel',
      title: 'Image Carousel',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800',
          alt: 'Sample image 1',
        },
        {
          url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
          alt: 'Sample image 2',
        },
      ],
      autoPlay: true,
      interval: 3000,
    };
    addBlock(newBlock);
    toast.success('Carousel added');
  };

  const handleAddCustomCode = () => {
    if (!isPremium) {
      toast.error('Custom code blocks require Premium');
      return;
    }

    const newBlock: Block = {
      id: `custom-${Date.now()}`,
      type: 'custom_code',
      title: 'Custom HTML/CSS',
      html: '<div class="custom-block"><h3>Custom Content</h3><p>Add your HTML here</p></div>',
      css: '.custom-block { padding: 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white; }',
      isPremium: true,
    };
    addBlock(newBlock);
    toast.success('Custom code block added');
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

  const handleEditBlock = (id: string) => {
    const block = pageData?.blocks.find(b => b.id === id);
    if (block) {
      setEditingBlock(block);
      setEditorOpen(true);
    }
  };

  const handleSaveBlock = (updates: Partial<Block>) => {
    if (editingBlock) {
      updateBlock(editingBlock.id, updates);
    }
  };

  const handleAIResult = (result: any) => {
    if (aiGeneratorType === 'ai-builder') {
      // AI Builder creates entire page structure
      const { profile, blocks } = result;
      
      // Update profile if exists
      if (profile && profileBlock) {
        updateBlock(profileBlock.id, { 
          name: profile.name, 
          bio: profile.bio 
        });
      }
      
      // Add suggested blocks
      blocks.forEach((blockData: any, index: number) => {
        const newBlock: Block = {
          id: `${blockData.type}-${Date.now()}-${index}`,
          ...blockData,
        };
        addBlock(newBlock);
      });
      
      toast.success(`Added ${blocks.length} blocks from AI suggestion`);
    } else if (aiGeneratorType === 'seo') {
      // Update SEO meta tags
      const { title, description, keywords } = result;
      if (pageData) {
        pageData.seo = {
          title,
          description,
          keywords,
        };
        toast.success('SEO meta tags updated');
      }
    }
    // For magic-title and sales-copy, result will be used in the context where it's called
  };

  const openAIGenerator = (type: typeof aiGeneratorType) => {
    setAiGeneratorType(type);
    setAiGeneratorOpen(true);
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">LinkMAX</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button variant="outline" size="sm" onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handleShare}>
              <Upload className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
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

            <Card className="p-6">
              <Tabs defaultValue="content">
                <TabsList className="w-full">
                  <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                  <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  {/* Profile Settings */}
                  {profileBlock && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-semibold">Profile</h3>
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
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Premium Status */}
                  {!premiumLoading && (
                    <div className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Crown className={`h-4 w-4 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">
                          {isPremium ? 'Premium Active' : 'Free Plan'}
                        </span>
                      </div>
                      {!isPremium && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Upgrade to unlock video, carousel, and custom code blocks
                        </p>
                      )}
                    </div>
                  )}

                  {/* AI Tools */}
                  <div className="space-y-3 p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">AI Tools</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openAIGenerator('ai-builder')}
                        className="justify-start"
                      >
                        <Wand2 className="h-3 w-3 mr-2" />
                        AI Builder
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openAIGenerator('seo')}
                        className="justify-start"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        SEO Generator
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use AI to build your page or optimize for search engines
                    </p>
                  </div>

                  {/* Chatbot Settings */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <h3 className="font-semibold">AI Chatbot</h3>
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Context (Hidden)</Label>
                      <Textarea
                        value={chatbotContext}
                        onChange={(e) => setChatbotContext(e.target.value)}
                        onBlur={save}
                        placeholder="Add information for the chatbot to use when answering questions. This is not visible to visitors but helps the AI provide better answers about your services, pricing, availability, etc."
                        rows={4}
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        This info helps the AI chatbot answer visitor questions more accurately
                      </p>
                    </div>
                  </div>

                  {/* Add Blocks */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Add Blocks</h3>
                    
                    {/* Basic Blocks */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Basic</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={handleAddLink} className="justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          Link
                        </Button>
                        <Button variant="outline" onClick={handleAddProduct} className="justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          Product
                        </Button>
                      </div>
                    </div>

                    {/* Premium Blocks */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">Premium</p>
                        <Crown className="h-3 w-3 text-primary" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant={isPremium ? "outline" : "ghost"} 
                          onClick={handleAddVideo}
                          disabled={!isPremium}
                          className="justify-start"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Video
                        </Button>
                        <Button 
                          variant={isPremium ? "outline" : "ghost"}
                          onClick={handleAddCarousel}
                          disabled={!isPremium}
                          className="justify-start"
                        >
                          <Images className="h-4 w-4 mr-2" />
                          Carousel
                        </Button>
                        <Button 
                          variant={isPremium ? "outline" : "ghost"}
                          onClick={handleAddCustomCode}
                          disabled={!isPremium}
                          className="justify-start col-span-2"
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Custom HTML/CSS
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Block List with Drag & Drop */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Your Blocks</h3>
                    <DraggableBlockList
                      blocks={pageData.blocks}
                      onReorder={reorderBlocks}
                      onDelete={deleteBlock}
                      onEdit={handleEditBlock}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4 mt-4">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">Theme Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Button Style</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {(['default', 'rounded', 'pill'] as const).map(style => (
                            <Button
                              key={style}
                              variant={pageData.theme.buttonStyle === style ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateTheme({ buttonStyle: style })}
                              className="capitalize"
                            >
                              {style}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-b from-primary/10 to-background p-4">
                <div className="aspect-[9/16] max-h-[600px] mx-auto bg-card rounded-2xl shadow-xl overflow-auto">
                  <div className="p-4 space-y-4">
                    {pageData.blocks.map(block => (
                      <BlockRenderer key={block.id} block={block} isPreview />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Block Editor Dialog */}
      <BlockEditor
        block={editingBlock}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSaveBlock}
      />

      {/* AI Generator Dialog */}
      <AIGenerator
        type={aiGeneratorType}
        isOpen={aiGeneratorOpen}
        onClose={() => setAiGeneratorOpen(false)}
        onResult={handleAIResult}
        currentData={profileBlock}
      />
    </div>
  );
}
