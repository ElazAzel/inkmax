import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  MessageCircle, 
  Sparkles, 
  User, 
  Link2,
  LogOut,
  X,
} from 'lucide-react';
import { openPremiumPurchase } from '@/lib/upgrade-utils';
import type { ProfileBlock } from '@/types/page';

interface MobileSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Username settings
  usernameInput: string;
  onUsernameChange: (value: string) => void;
  onUpdateUsername: () => void;
  usernameSaving: boolean;
  
  // Profile settings
  profileBlock?: ProfileBlock;
  onUpdateProfile: (updates: Partial<ProfileBlock>) => void;
  
  // Premium status
  isPremium: boolean;
  premiumLoading: boolean;
  
  // Chatbot settings
  chatbotContext: string;
  onChatbotContextChange: (value: string) => void;
  onSave: () => void;
  
  // AI Tools
  onOpenSEOGenerator: () => void;
  
  // Sign out
  onSignOut: () => void;
}

export const MobileSettingsSheet = memo(function MobileSettingsSheet({
  open,
  onOpenChange,
  usernameInput,
  onUsernameChange,
  onUpdateUsername,
  usernameSaving,
  profileBlock,
  onUpdateProfile,
  isPremium,
  premiumLoading,
  chatbotContext,
  onChatbotContextChange,
  onSave,
  onOpenSEOGenerator,
  onSignOut,
}: MobileSettingsSheetProps) {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-[2rem] bg-card/80 backdrop-blur-2xl border-t border-border/30 shadow-glass-xl">
        <SheetHeader className="p-5 pb-3 border-b border-border/20 sticky top-0 bg-card/60 backdrop-blur-xl z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Settings</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full hover:bg-card/60">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SheetDescription className="sr-only">Page and account settings</SheetDescription>
        </SheetHeader>
        
        <div className="overflow-y-auto h-full pb-24">
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="w-full sticky top-0 bg-card/60 backdrop-blur-xl z-10 h-14 rounded-none border-b border-border/20 p-1.5 gap-1">
              <TabsTrigger value="link" className="flex-1 gap-1.5 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl">
                <Link2 className="h-4 w-4" />
                <span className="hidden xs:inline">Link</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-1 gap-1.5 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl">
                <User className="h-4 w-4" />
                <span className="hidden xs:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="flex-1 gap-1.5 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden xs:inline">AI</span>
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex-1 gap-1.5 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-xl">
                <Crown className="h-4 w-4" />
                <span className="hidden xs:inline">Plan</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Link Tab */}
            <TabsContent value="link" className="p-4 space-y-4 mt-0">
              <Card className="p-5 bg-card/40 backdrop-blur-xl border border-border/20 rounded-2xl shadow-glass">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Link2 className="h-4 w-4 text-primary" />
                  </div>
                  Your Link
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Username</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={usernameInput}
                        onChange={(e) => onUsernameChange(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        placeholder="username"
                        maxLength={30}
                        disabled={usernameSaving}
                        className="bg-card/60 backdrop-blur-xl border-border/30 rounded-xl"
                      />
                      <Button 
                        size="sm" 
                        onClick={onUpdateUsername}
                        disabled={usernameSaving || !usernameInput.trim()}
                        className="rounded-xl shadow-glass"
                      >
                        {usernameSaving ? '...' : 'Save'}
                      </Button>
                    </div>
                    {usernameInput && (
                      <p className="text-xs text-muted-foreground mt-3 break-all bg-muted/30 backdrop-blur-xl p-2 rounded-lg">
                        {window.location.origin}/{usernameInput}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="p-4 space-y-4 mt-0">
              {profileBlock && (
                <Card className="p-5 bg-card/40 backdrop-blur-xl border border-border/20 rounded-2xl shadow-glass">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    Profile Info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <Input
                        value={typeof profileBlock.name === 'string' ? profileBlock.name : profileBlock.name?.ru || ''}
                        onChange={(e) => onUpdateProfile({ name: e.target.value })}
                        className="mt-2 bg-card/60 backdrop-blur-xl border-border/30 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Bio</Label>
                      <Textarea
                        value={typeof profileBlock.bio === 'string' ? profileBlock.bio : profileBlock.bio?.ru || ''}
                        onChange={(e) => onUpdateProfile({ bio: e.target.value })}
                        rows={3}
                        className="mt-2 bg-card/60 backdrop-blur-xl border-border/30 rounded-xl"
                      />
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
            
            {/* Chatbot Tab */}
            <TabsContent value="chatbot" className="p-4 space-y-4 mt-0">
              <Card className="p-5 bg-card/40 backdrop-blur-xl border border-border/20 rounded-2xl shadow-glass">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  AI Chatbot Context
                </h3>
                <div className="space-y-3">
                  <Textarea
                    value={chatbotContext}
                    onChange={(e) => onChatbotContextChange(e.target.value)}
                    onBlur={onSave}
                    placeholder="Add hidden context for the AI chatbot (pricing, services, availability...)"
                    rows={6}
                    className="text-sm bg-card/60 backdrop-blur-xl border-border/30 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps the AI answer visitor questions accurately
                  </p>
                </div>
              </Card>
              
              <Card className="p-5 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent backdrop-blur-xl border border-primary/20 rounded-2xl shadow-glass">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  AI Tools
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start rounded-xl bg-card/40 backdrop-blur-xl border-border/30 hover:bg-card/60"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenSEOGenerator();
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  SEO Generator
                </Button>
              </Card>
            </TabsContent>
            
            {/* Premium Tab */}
            <TabsContent value="premium" className="p-4 space-y-4 mt-0">
              {!premiumLoading && (
                <Card className={`p-5 backdrop-blur-xl border rounded-2xl shadow-glass ${isPremium ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border-amber-500/30' : 'bg-card/40 border-border/20'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center backdrop-blur-xl ${isPremium ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30' : 'bg-muted/50'}`}>
                      <Crown className={`h-6 w-6 ${isPremium ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {isPremium ? 'Premium Active' : 'Free Plan'}
                      </h3>
                      {!isPremium && (
                        <p className="text-sm text-muted-foreground">
                          Upgrade to unlock all features
                        </p>
                      )}
                    </div>
                  </div>
                  {!isPremium && (
                    <Button 
                      onClick={openPremiumPurchase}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-glass-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  )}
                </Card>
              )}
              
              {/* Sign Out */}
              <Card className="p-5 bg-card/40 backdrop-blur-xl border border-border/20 rounded-2xl shadow-glass">
                <Button 
                  variant="outline" 
                  onClick={onSignOut}
                  className="w-full text-destructive hover:text-destructive rounded-xl bg-destructive/5 border-destructive/20 hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
});
