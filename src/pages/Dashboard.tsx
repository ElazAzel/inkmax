import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Share2, Trash2, Sparkles, LogOut, Save, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCloudPageState } from '@/hooks/useCloudPageState';
import { BlockRenderer } from '@/components/BlockRenderer';
import { LocalStorageMigration } from '@/components/LocalStorageMigration';
import { toast } from 'sonner';
import type { Block } from '@/types/page';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    pageData,
    loading,
    saving,
    save,
    publish,
    addBlock,
    updateBlock,
    deleteBlock,
    updateTheme,
  } = useCloudPageState();
  const [migrationKey, setMigrationKey] = useState(0);

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

                  {/* Add Blocks */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Add Blocks</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleAddLink} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Link
                      </Button>
                      <Button variant="outline" onClick={handleAddProduct} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Product
                      </Button>
                    </div>
                  </div>

                  {/* Block List */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Your Blocks</h3>
                    {pageData.blocks
                      .filter(b => b.type !== 'profile')
                      .map(block => (
                        <Card key={block.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {block.type}: {block.type === 'link' && block.title}
                              {block.type === 'product' && block.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBlock(block.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4 mt-4">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Theme Settings
                    </h3>
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
    </div>
  );
}
