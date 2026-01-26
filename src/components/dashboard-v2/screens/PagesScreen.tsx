/**
 * PagesScreen - Manage all user pages
 * Mobile-first with search, filters, and quick actions
 */
import { memo, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, MoreVertical, Eye, Share2, Copy, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '../layout/DashboardHeader';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { cn } from '@/lib/utils';
import type { Page } from '@/domain/entities/Page';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  updatedAt: string;
  viewCount?: number;
  coverUrl?: string;
}

interface PagesScreenProps {
  pages: PageItem[];
  loading?: boolean;
  onCreatePage?: () => void;
  onEditPage?: (pageId: string) => void;
  onPreviewPage?: (pageId: string) => void;
  onSharePage?: (pageId: string) => void;
  onDuplicatePage?: (pageId: string) => void;
  onPageSettings?: (pageId: string) => void;
}

export const PagesScreen = memo(function PagesScreen({
  pages,
  loading,
  onCreatePage,
  onEditPage,
  onPreviewPage,
  onSharePage,
  onDuplicatePage,
  onPageSettings,
}: PagesScreenProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredPages = useMemo(() => {
    let result = pages;

    // Filter by status
    if (filter === 'published') {
      result = result.filter(p => p.isPublished);
    } else if (filter === 'draft') {
      result = result.filter(p => !p.isPublished);
    }

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
      );
    }

    return result;
  }, [pages, filter, search]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <LoadingSkeleton variant="cards" count={3} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title={t('dashboard.pages.title', 'Pages')}
        subtitle={t('dashboard.pages.subtitle', 'Manage your pages')}
        actions={
          <Button 
            onClick={onCreatePage}
            size="sm"
            className="rounded-xl"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('dashboard.pages.create', 'New')}
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('dashboard.pages.searchPlaceholder', 'Search pages...')}
              className="pl-9 rounded-xl"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="rounded-xl">
              <TabsTrigger value="all" className="rounded-lg">
                {t('dashboard.pages.all', 'All')}
              </TabsTrigger>
              <TabsTrigger value="published" className="rounded-lg">
                {t('dashboard.pages.published', 'Published')}
              </TabsTrigger>
              <TabsTrigger value="draft" className="rounded-lg">
                {t('dashboard.pages.draft', 'Draft')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pages List */}
        {filteredPages.length === 0 ? (
          <EmptyState
            icon={<Plus className="w-8 h-8" />}
            title={pages.length === 0 
              ? t('dashboard.pages.emptyTitle', 'No pages yet')
              : t('dashboard.pages.noResults', 'No pages found')
            }
            description={pages.length === 0
              ? t('dashboard.pages.emptyDescription', 'Create your first page to get started')
              : t('dashboard.pages.noResultsDescription', 'Try adjusting your search or filters')
            }
            action={pages.length === 0 ? {
              label: t('dashboard.pages.createFirst', 'Create Page'),
              onClick: onCreatePage,
            } : undefined}
          />
        ) : (
          <div className="grid gap-3">
            {filteredPages.map((page) => (
              <Card 
                key={page.id}
                className="rounded-2xl border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => onEditPage?.(page.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Cover Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                      {page.coverUrl ? (
                        <img 
                          src={page.coverUrl} 
                          alt={page.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                          {page.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">
                            {page.title || t('dashboard.pages.untitled', 'Untitled')}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            lnkmx.my/{page.slug}
                          </p>
                        </div>
                        <StatusBadge 
                          status={page.isPublished ? 'published' : 'draft'} 
                        />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {page.viewCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {page.viewCount}
                            </span>
                          )}
                          <span>{formatDate(page.updatedAt)}</span>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => onPreviewPage?.(page.id)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => onSharePage?.(page.id)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem onClick={() => onDuplicatePage?.(page.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                {t('dashboard.pages.duplicate', 'Duplicate')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onPageSettings?.(page.id)}>
                                <Settings className="w-4 h-4 mr-2" />
                                {t('dashboard.pages.settings', 'Settings')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-28 right-4 sm:hidden">
        <Button
          onClick={onCreatePage}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
});
