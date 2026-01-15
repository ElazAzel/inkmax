/**
 * AppTabBar - Main mobile navigation component (iOS-style)
 * Fixed bottom tab bar with: Projects, Editor, CRM, Analytics, Gallery, Settings
 */
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  PenTool, 
  Users, 
  BarChart3, 
  ImageIcon, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: number;
}

interface AppTabBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  crmBadge?: number;
}

export const AppTabBar = memo(function AppTabBar({ 
  activeTab,
  onTabChange,
  crmBadge 
}: AppTabBarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs: TabItem[] = [
    {
      id: 'projects',
      icon: FolderOpen,
      label: t('tabbar.projects', 'Проекты'),
      path: '/dashboard',
    },
    {
      id: 'editor',
      icon: PenTool,
      label: t('tabbar.editor', 'Редактор'),
      path: '/dashboard?tab=editor',
    },
    {
      id: 'crm',
      icon: Users,
      label: t('tabbar.crm', 'CRM'),
      path: '/dashboard?tab=crm',
      badge: crmBadge,
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: t('tabbar.analytics', 'Аналитика'),
      path: '/dashboard?tab=analytics',
    },
    {
      id: 'gallery',
      icon: ImageIcon,
      label: t('tabbar.gallery', 'Галерея'),
      path: '/gallery',
    },
    {
      id: 'settings',
      icon: Settings,
      label: t('tabbar.settings', 'Настройки'),
      path: '/dashboard?tab=settings',
    },
  ];

  // Determine active tab from URL or prop
  const currentTab = activeTab || (() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) return tab;
    if (location.pathname === '/gallery') return 'gallery';
    if (location.pathname === '/dashboard') return 'projects';
    return 'projects';
  })();

  const handleTabClick = (tab: TabItem) => {
    if (onTabChange) {
      onTabChange(tab.id);
    } else {
      navigate(tab.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom md:hidden">
      {/* Glass background */}
      <div className="mx-3 mb-3 bg-card/85 backdrop-blur-2xl border border-border/20 rounded-[24px] shadow-2xl shadow-black/15 overflow-hidden">
        <div className="grid grid-cols-6 h-[72px]">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 transition-all duration-300 active:scale-90",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary animate-scale-in" />
                )}
                
                {/* Icon with badge */}
                <div className="relative">
                  <Icon className={cn(
                    "transition-all duration-300",
                    isActive ? "h-6 w-6" : "h-5 w-5"
                  )} />
                  
                  {/* Badge */}
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold animate-scale-in">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-[10px] font-semibold leading-tight transition-all duration-300",
                  isActive && "font-bold"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});
