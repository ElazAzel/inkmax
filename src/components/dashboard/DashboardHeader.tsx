import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { AutoSaveIndicator, SaveStatus } from '@/components/editor/AutoSaveIndicator';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { StreakDisplay } from '@/components/streak/StreakDisplay';
import { TokenBalanceDisplay } from '@/components/tokens/TokenBalanceDisplay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  Save,
  Eye,
  Upload,
  Wand2,
  LayoutTemplate,
  Trophy,
  Users,
  Crown,
  MoreHorizontal,
  Settings,
  ImageIcon,
  Coins,
} from 'lucide-react';

interface DashboardHeaderProps {
  saving: boolean;
  saveStatus: SaveStatus;
  achievementCount: number;
  showSettings: boolean;
  onToggleSettings: () => void;
  onSave: () => void;
  onPreview: () => void;
  onShare: () => void;
  onSignOut: () => void;
  onOpenAIBuilder: () => void;
  onOpenTemplates: () => void;
  onOpenAchievements: () => void;
  onOpenCRM: () => void;
  userId?: string;
  onOpenGallery: () => void;
  onOpenTokens: () => void;
}

export function DashboardHeader({
  saving,
  saveStatus,
  achievementCount,
  showSettings,
  onToggleSettings,
  onSave,
  onPreview,
  onShare,
  onSignOut,
  onOpenAIBuilder,
  onOpenTemplates,
  onOpenAchievements,
  onOpenCRM,
  onOpenGallery,
  userId,
  onOpenTokens,
}: DashboardHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 hidden md:block">
      <div className="mx-5 mt-4">
        <div className="backdrop-blur-2xl bg-card/60 border border-border/30 rounded-3xl shadow-glass-lg">
          <div className="container mx-auto px-5 h-16 flex items-center justify-between gap-3">
            {/* Logo - BOLD */}
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl" />
                <img
                  src="/logo.png"
                  alt="LinkMAX"
                  className="relative h-10 w-10 animate-scale-in hover-scale rounded-2xl shadow-glass"
                />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">LinkMAX</h1>
              <AutoSaveIndicator status={saveStatus} />
            </div>

            {/* Actions - Compact with overflow handling */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              {/* Create Group */}
              <Button variant="ghost" size="sm" onClick={onOpenAIBuilder} className="h-10 px-3 rounded-xl font-bold shrink-0">
                <Wand2 className="h-4 w-4 lg:mr-1.5" />
                <span className="hidden lg:inline">AI</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={onOpenTemplates} className="h-10 px-3 rounded-xl font-bold shrink-0">
                <LayoutTemplate className="h-4 w-4 lg:mr-1.5" />
                <span className="hidden xl:inline">{t('templates.title', 'Шаблоны')}</span>
              </Button>

              <div className="h-6 w-px bg-border/40 shrink-0" />

              {/* Business Group */}
              <Button variant="ghost" size="sm" onClick={onOpenCRM} className="h-10 px-3 rounded-xl font-bold shrink-0">
                <Users className="h-4 w-4 lg:mr-1.5" />
                <span className="hidden lg:inline">CRM</span>
              </Button>

              <Button
                variant={showSettings ? 'default' : 'ghost'}
                size="sm"
                onClick={onToggleSettings}
                className="h-10 px-3 rounded-xl font-bold shrink-0"
              >
                <Settings className="h-4 w-4 lg:mr-1.5" />
                <span className="hidden xl:inline">{t('common.settings', 'Настройки')}</span>
              </Button>

              <div className="h-6 w-px bg-border/40 shrink-0" />

              {/* Gamification & Community Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-10 px-3 rounded-xl font-bold shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                    {achievementCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground shadow-glass">
                        {achievementCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                  <DropdownMenuLabel className="text-sm font-bold">{t('menu.gamification', 'Геймификация')}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={onOpenAchievements} className="rounded-xl py-3 font-medium">
                    <Trophy className="h-5 w-5 mr-3" />
                    {t('achievements.title', 'Достижения')}
                    {achievementCount > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground text-sm px-2 py-0.5 rounded-lg font-bold">
                        {achievementCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onOpenTokens} className="rounded-xl py-3 font-medium">
                    <Coins className="h-5 w-5 mr-3" />
                    {t('tokens.title', 'Токены')}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuLabel className="text-sm font-bold">{t('menu.community', 'Сообщество')}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={onOpenGallery} className="rounded-xl py-3 font-medium">
                    <ImageIcon className="h-5 w-5 mr-3" />
                    {t('gallery.title', 'Галерея')}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => navigate('/pricing')} className="rounded-xl py-3 font-medium">
                    <Crown className="h-5 w-5 mr-3" />
                    {t('pricing.title', 'Тарифы')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Compact Streak */}
              <StreakDisplay userId={userId} compact />

              {/* Token Balance */}
              <TokenBalanceDisplay onClick={onOpenTokens} compact />

              <LanguageSwitcher />

              <div className="h-6 w-px bg-border/40 shrink-0" />

              {/* Main Actions */}
              <Button variant="outline" size="sm" onClick={onSave} disabled={saving} className="h-10 px-3 rounded-xl font-bold shrink-0">
                <Save className="h-4 w-4 lg:mr-1.5" />
                <span className="hidden lg:inline">{saving ? '...' : t('common.save', 'Сохранить')}</span>
              </Button>

              <Button variant="outline" size="sm" onClick={onPreview} className="h-10 px-3 rounded-xl font-bold shrink-0">
                <Eye className="h-4 w-4 xl:mr-1.5" />
                <span className="hidden xl:inline">{t('common.preview', 'Предпросмотр')}</span>
              </Button>

              <Button size="sm" onClick={onShare} data-onboarding="share-button" className="h-10 px-4 rounded-xl font-bold shadow-glass-lg shrink-0">
                <Upload className="h-4 w-4 lg:mr-1.5" />
                <span className="hidden lg:inline">{t('common.share', 'Поделиться')}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onSignOut}
                className="hover:bg-destructive/10 hover:text-destructive h-10 w-10 rounded-xl shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
