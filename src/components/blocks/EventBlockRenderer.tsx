import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PremiumTier } from '@/hooks/usePremiumStatus';
import type { EventBlock as EventBlockType } from '@/types/page';
import { EventBlock } from './EventBlock';

interface EventBlockRendererProps {
  block: EventBlockType;
  pageOwnerId?: string;
  pageId?: string;
  isOwnerPremium?: boolean;
  ownerTier?: PremiumTier;
}

const EventBlockSkeleton = () => (
  <div className="w-full">
    <Skeleton className="h-24 w-full rounded-lg" />
  </div>
);

export function EventBlockRenderer({
  block,
  pageOwnerId,
  pageId,
  isOwnerPremium,
}: EventBlockRendererProps) {
  return (
    <Suspense fallback={<EventBlockSkeleton />}>
      <EventBlock
        block={block}
        pageOwnerId={pageOwnerId}
        pageId={pageId}
        isOwnerPremium={isOwnerPremium}
      />
    </Suspense>
  );
}
