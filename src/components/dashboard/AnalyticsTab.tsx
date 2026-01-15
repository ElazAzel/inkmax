/**
 * AnalyticsTab - Analytics with AI insights and Apply actions
 * Mobile-optimized with swipeable periods and card-based metrics
 */
import { memo, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import {
  Eye,
  MousePointerClick,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Smartphone,
  Monitor,
  Globe,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/page';
import type { EditorHistoryType } from '@/hooks/useEditorHistory';

interface AnalyticsTabProps {
  pageId: string;
  blocks: Block[];
  isPremium: boolean;
  editorHistory: EditorHistoryType;
  onApplyInsight: (action: { type: string; blockId?: string; data?: any }) => void;
}

type Period = '7d' | '14d' | '30d';

export const AnalyticsTab = memo(function AnalyticsTab({
  pageId,
  blocks,
  isPremium,
  editorHistory,
  onApplyInsight,
}: AnalyticsTabProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('7d');
  const { analytics, loading } = usePageAnalytics();

  // Mock data for demonstration (replace with real data)
  const mockStats = {
    views: 1247,
    viewsChange: 12.5,
    clicks: 342,
    clicksChange: -5.2,
    uniqueVisitors: 892,
    visitorsChange: 8.1,
    topBlocks: [
      { id: '1', type: 'link', title: 'Instagram', clicks: 156, percentage: 45 },
      { id: '2', type: 'link', title: 'Telegram', clicks: 98, percentage: 29 },
      { id: '3', type: 'button', title: 'Записаться', clicks: 88, percentage: 26 },
    ],
    devices: {
      mobile: 78,
      desktop: 18,
      tablet: 4,
    },
    sources: [
      { name: 'Instagram', percentage: 62 },
      { name: 'Telegram', percentage: 24 },
      { name: 'Direct', percentage: 14 },
    ],
  };

  // AI Insights
  const insights = useMemo(() => {
    const hasPricing = blocks.some(b => b.type === 'pricing');
    const hasForm = blocks.some(b => b.type === 'form');
    const hasTestimonials = blocks.some(b => b.type === 'testimonial');

    const suggestions = [];
    
    if (!hasPricing && blocks.length > 3) {
      suggestions.push({
        id: 'add-pricing',
        type: 'add',
        title: 'Добавьте блок с ценами',
        description: 'Страницы с прайсом получают на 40% больше заявок',
        action: () => onApplyInsight({ type: 'add', data: { blockType: 'pricing' } }),
        impact: 'high',
      });
    }

    if (!hasTestimonials && blocks.length > 5) {
      suggestions.push({
        id: 'add-testimonials',
        type: 'add',
        title: 'Добавьте отзывы',
        description: 'Отзывы увеличивают доверие и конверсию на 25%',
        action: () => onApplyInsight({ type: 'add', data: { blockType: 'testimonial' } }),
        impact: 'medium',
      });
    }

    // Mock insight based on analytics
    if (mockStats.topBlocks[0]?.percentage > 40) {
      suggestions.push({
        id: 'duplicate-top',
        type: 'optimize',
        title: 'Продублируйте популярную ссылку',
        description: `"${mockStats.topBlocks[0].title}" получает 45% кликов. Добавьте её выше для большей видимости`,
        action: () => onApplyInsight({ type: 'duplicate', blockId: mockStats.topBlocks[0].id }),
        impact: 'medium',
      });
    }

    return suggestions;
  }, [blocks, onApplyInsight]);

  const renderTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const renderTrendBadge = (change: number) => {
    const isPositive = change > 0;
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "font-bold",
          isPositive ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : 
          change < 0 ? "bg-red-500/15 text-red-600 border-red-500/30" :
          "bg-muted text-muted-foreground"
        )}
      >
        {isPositive && '+'}{change}%
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center safe-area-top">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-top pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-nav px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black">{t('analytics.title', 'Аналитика')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('analytics.subtitle', 'Статистика страницы')}
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(['7d', '14d', '30d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                period === p
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted/50 text-muted-foreground"
              )}
            >
              {p === '7d' && '7 дней'}
              {p === '14d' && '14 дней'}
              {p === '30d' && '30 дней'}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-6 space-y-6">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              {renderTrendIcon(mockStats.viewsChange)}
            </div>
            <div className="text-3xl font-black mb-1">{mockStats.views.toLocaleString()}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('analytics.views', 'Просмотры')}</span>
              {renderTrendBadge(mockStats.viewsChange)}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <MousePointerClick className="h-5 w-5 text-emerald-500" />
              </div>
              {renderTrendIcon(mockStats.clicksChange)}
            </div>
            <div className="text-3xl font-black mb-1">{mockStats.clicks.toLocaleString()}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('analytics.clicks', 'Клики')}</span>
              {renderTrendBadge(mockStats.clicksChange)}
            </div>
          </Card>

          <Card className="p-5 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
              {renderTrendIcon(mockStats.visitorsChange)}
            </div>
            <div className="text-3xl font-black mb-1">{mockStats.uniqueVisitors.toLocaleString()}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('analytics.uniqueVisitors', 'Уникальные посетители')}</span>
              {renderTrendBadge(mockStats.visitorsChange)}
            </div>
          </Card>
        </div>

        {/* AI Insights Section */}
        {insights.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-bold">{t('analytics.aiInsights', 'AI Рекомендации')}</h2>
            </div>
            
            {insights.map((insight) => (
              <Card 
                key={insight.id}
                className={cn(
                  "p-5 border-l-4",
                  insight.impact === 'high' ? "border-l-emerald-500 bg-emerald-500/5" :
                  insight.impact === 'medium' ? "border-l-amber-500 bg-amber-500/5" :
                  "border-l-blue-500 bg-blue-500/5"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    insight.impact === 'high' ? "bg-emerald-500/20" :
                    insight.impact === 'medium' ? "bg-amber-500/20" :
                    "bg-blue-500/20"
                  )}>
                    <Sparkles className={cn(
                      "h-5 w-5",
                      insight.impact === 'high' ? "text-emerald-600" :
                      insight.impact === 'medium' ? "text-amber-600" :
                      "text-blue-600"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <Button 
                      size="sm" 
                      className="h-9 rounded-xl"
                      onClick={insight.action}
                    >
                      {t('analytics.apply', 'Применить')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Top Blocks */}
        <div className="space-y-3">
          <h2 className="font-bold px-1">{t('analytics.topBlocks', 'Популярные блоки')}</h2>
          <Card className="divide-y divide-border/50">
            {mockStats.topBlocks.map((block, index) => (
              <div key={block.id} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-bold text-muted-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{block.title}</div>
                  <div className="text-sm text-muted-foreground">{block.clicks} кликов</div>
                </div>
                <div className="w-20">
                  <Progress value={block.percentage} className="h-2" />
                  <div className="text-xs text-right text-muted-foreground mt-1">{block.percentage}%</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Devices */}
        <div className="space-y-3">
          <h2 className="font-bold px-1">{t('analytics.devices', 'Устройства')}</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <Smartphone className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-black">{mockStats.devices.mobile}%</div>
              <div className="text-xs text-muted-foreground">Телефон</div>
            </Card>
            <Card className="p-4 text-center">
              <Monitor className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
              <div className="text-2xl font-black">{mockStats.devices.desktop}%</div>
              <div className="text-xs text-muted-foreground">Компьютер</div>
            </Card>
            <Card className="p-4 text-center">
              <Globe className="h-6 w-6 mx-auto mb-2 text-violet-500" />
              <div className="text-2xl font-black">{mockStats.devices.tablet}%</div>
              <div className="text-xs text-muted-foreground">Планшет</div>
            </Card>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="space-y-3">
          <h2 className="font-bold px-1">{t('analytics.sources', 'Источники трафика')}</h2>
          <Card className="p-4 space-y-3">
            {mockStats.sources.map((source) => (
              <div key={source.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{source.name}</span>
                  <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                </div>
                <Progress value={source.percentage} className="h-2" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
});
