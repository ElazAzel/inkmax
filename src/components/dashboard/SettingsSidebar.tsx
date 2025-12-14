import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Grid3X3, MessageCircle, Sparkles, X, Bell, Send } from 'lucide-react';
import { openPremiumPurchase } from '@/lib/upgrade-utils';
import type { ProfileBlock, GridConfig, EditorMode } from '@/types/page';

interface SettingsSidebarProps {
  show: boolean;
  onClose: () => void;
  usernameInput: string;
  onUsernameChange: (value: string) => void;
  onUpdateUsername: () => void;
  usernameSaving: boolean;
  profileBlock?: ProfileBlock;
  onUpdateProfile: (updates: Partial<ProfileBlock>) => void;
  isPremium: boolean;
  premiumLoading: boolean;
  chatbotContext: string;
  onChatbotContextChange: (value: string) => void;
  onSave: () => void;
  onOpenSEOGenerator: () => void;
  editorMode?: EditorMode;
  gridConfig?: GridConfig;
  onGridConfigChange?: (config: Partial<GridConfig>) => void;
  emailNotificationsEnabled?: boolean;
  onEmailNotificationsChange?: (enabled: boolean) => void;
  telegramEnabled?: boolean;
  telegramChatId?: string;
  onTelegramChange?: (enabled: boolean, chatId: string | null) => void;
}

export function SettingsSidebar({
  show,
  onClose,
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
  editorMode,
  gridConfig,
  onGridConfigChange,
  emailNotificationsEnabled,
  onEmailNotificationsChange,
  telegramEnabled,
  telegramChatId,
  onTelegramChange,
}: SettingsSidebarProps) {
  const [localTelegramChatId, setLocalTelegramChatId] = useState(telegramChatId || '');

  if (!show) return null;

  const getStringValue = (value: string | { ru?: string; en?: string; kk?: string } | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.ru || value.en || value.kk || '';
  };

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-card/50 backdrop-blur-2xl border border-border/30 rounded-2xl shadow-glass-lg z-40 overflow-y-auto hidden md:block">
      <div className="p-6 space-y-6">
        {/* Close Button */}
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-foreground/5">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid Settings - only show in grid mode */}
        {editorMode === 'grid' && onGridConfigChange && (
          <Card className="p-4 bg-card/60 backdrop-blur-xl border-border/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Grid3X3 className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Grid Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Desktop Columns</Label>
                <Select
                  value={String(gridConfig?.columnsDesktop || 3)}
                  onValueChange={(val) => onGridConfigChange({ columnsDesktop: parseInt(val) })}
                >
                  <SelectTrigger className="bg-background/50 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 columns</SelectItem>
                    <SelectItem value="3">3 columns</SelectItem>
                    <SelectItem value="4">4 columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Mobile Columns</Label>
                <Select
                  value={String(gridConfig?.columnsMobile || 2)}
                  onValueChange={(val) => onGridConfigChange({ columnsMobile: parseInt(val) })}
                >
                  <SelectTrigger className="bg-background/50 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 column</SelectItem>
                    <SelectItem value="2">2 columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {/* Username Settings */}
        <Card className="p-4 bg-card/60 backdrop-blur-xl border-border/30">
          <h3 className="font-semibold mb-4">Your Link</h3>
          <div className="space-y-3">
            <div>
              <Label>Username</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={usernameInput}
                  onChange={(e) =>
                    onUsernameChange(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))
                  }
                  placeholder="username"
                  maxLength={30}
                  disabled={usernameSaving}
                  className="bg-background/50"
                />
                <Button
                  size="sm"
                  onClick={onUpdateUsername}
                  disabled={usernameSaving || !usernameInput.trim()}
                >
                  {usernameSaving ? '...' : 'Save'}
                </Button>
              </div>
              {usernameInput && (
                <p className="text-xs text-muted-foreground mt-1">
                  Your link: {window.location.origin}/{usernameInput}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Settings */}
        {profileBlock && (
          <Card className="p-4 bg-card/60 backdrop-blur-xl border-border/30">
            <h3 className="font-semibold mb-4">Profile</h3>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input
                  value={getStringValue(profileBlock.name)}
                  onChange={(e) => onUpdateProfile({ name: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={getStringValue(profileBlock.bio)}
                  onChange={(e) => onUpdateProfile({ bio: e.target.value })}
                  rows={3}
                  className="bg-background/50"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Premium Status */}
        {!premiumLoading && (
          <Card
            className={`p-4 backdrop-blur-xl border-border/30 ${
              isPremium ? 'bg-primary/10' : 'bg-card/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${isPremium ? 'bg-primary/20' : 'bg-muted'}`}>
                <Crown
                  className={`h-4 w-4 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`}
                />
              </div>
              <span className="font-semibold">{isPremium ? 'Premium Active' : 'Free Plan'}</span>
            </div>
            {!isPremium && (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  Upgrade to unlock all blocks and features
                </p>
                <Button
                  size="sm"
                  onClick={openPremiumPurchase}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25"
                >
                  <Crown className="h-3.5 w-3.5 mr-1.5" />
                  Upgrade to Premium
                </Button>
              </>
            )}
          </Card>
        )}

        {/* Notifications Settings */}
        <Card className="p-4 bg-card/60 backdrop-blur-xl border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-green-500/10">
              <Bell className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Email</Label>
                <p className="text-xs text-muted-foreground">Get notified via email</p>
              </div>
              <Switch
                checked={emailNotificationsEnabled ?? true}
                onCheckedChange={onEmailNotificationsChange}
              />
            </div>
            
            {/* Telegram */}
            <div className="space-y-2 pt-2 border-t border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-500" />
                  <Label className="text-sm">Telegram</Label>
                </div>
                <Switch
                  checked={telegramEnabled ?? false}
                  onCheckedChange={(enabled) => {
                    onTelegramChange?.(enabled, enabled ? localTelegramChatId : null);
                  }}
                />
              </div>
              {telegramEnabled && (
                <div className="space-y-1">
                  <Input
                    placeholder="Chat ID (from @userinfobot)"
                    value={localTelegramChatId}
                    onChange={(e) => setLocalTelegramChatId(e.target.value)}
                    onBlur={() => onTelegramChange?.(true, localTelegramChatId)}
                    className="bg-background/50 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Send /start to @userinfobot to get your ID
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </Card>
        <Card className="p-4 bg-card/60 backdrop-blur-xl border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <MessageCircle className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="font-semibold">AI Chatbot Context</h3>
          </div>
          <div className="space-y-2">
            <Label>Hidden Information</Label>
            <Textarea
              value={chatbotContext}
              onChange={(e) => onChatbotContextChange(e.target.value)}
              onBlur={onSave}
              placeholder="Add context for the AI chatbot..."
              rows={6}
              className="text-sm bg-background/50"
            />
          </div>
        </Card>

        {/* AI Tools */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 via-violet-500/5 to-blue-500/10 backdrop-blur-xl border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold">AI Tools</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-background/50 hover:bg-background/70"
            onClick={onOpenSEOGenerator}
          >
            <Sparkles className="h-3 w-3 mr-2" />
            SEO Generator
          </Button>
        </Card>
      </div>
    </div>
  );
}
