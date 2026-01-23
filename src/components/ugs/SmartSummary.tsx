import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SupportedLanguage } from '@/lib/i18n-helpers';
import type { Block, PageData } from '@/types/page';
import { getCtaLabel, getCtaTarget, getPrimaryCtaBlock, getProfileInfoFromBlocks } from '@/lib/ugs-quality';

interface SmartSummaryProps {
  pageData: PageData;
  blocks: Block[];
  isOwnerPremium: boolean;
  ownerTier?: string;
}

export function SmartSummary({ pageData, blocks, isOwnerPremium }: SmartSummaryProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language as SupportedLanguage;
  const profileInfo = useMemo(() => getProfileInfoFromBlocks(blocks, language), [blocks, language]);
  const primaryCtaBlock = useMemo(() => getPrimaryCtaBlock(blocks), [blocks]);

  const fallbackTitle = pageData.seo.title || t('ugs.summary.defaultTitle', 'Моя страница');
  const title = profileInfo.name || fallbackTitle;
  const subtitle = profileInfo.bio || pageData.seo.description;

  const handleCtaClick = () => {
    if (!primaryCtaBlock) return;

    const { href, blockId } = getCtaTarget(primaryCtaBlock);

    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (blockId) {
      const target = document.getElementById(`block-${blockId}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const ctaLabel = primaryCtaBlock ? getCtaLabel(primaryCtaBlock, language) : t('ugs.summary.ctaDefault', 'Смотреть');

  return (
    <Card className="mb-6 p-4 sm:p-6 bg-background/80 backdrop-blur border border-border/60">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {title}
          </h1>
          {isOwnerPremium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <BadgeCheck className="h-3 w-3" />
              {t('ugs.summary.verified', 'Verified')}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleCtaClick} className="gap-2">
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            {t('ugs.summary.helper', 'Основное действие на странице')}
          </p>
        </div>
      </div>
    </Card>
  );
}
