import { lazy, Suspense } from 'react';
import type { Block } from '@/types/page';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load all block components for optimal code splitting
const ProfileBlock = lazy(() => import('./blocks/ProfileBlock').then(m => ({ default: m.ProfileBlock })));
const LinkBlock = lazy(() => import('./blocks/LinkBlock').then(m => ({ default: m.LinkBlock })));
const ButtonBlock = lazy(() => import('./blocks/ButtonBlock').then(m => ({ default: m.ButtonBlock })));
const SocialsBlock = lazy(() => import('./blocks/SocialsBlock').then(m => ({ default: m.SocialsBlock })));
const TextBlock = lazy(() => import('./blocks/TextBlock').then(m => ({ default: m.TextBlock })));
const ImageBlock = lazy(() => import('./blocks/ImageBlock').then(m => ({ default: m.ImageBlock })));
const ProductBlock = lazy(() => import('./blocks/ProductBlock').then(m => ({ default: m.ProductBlock })));
const VideoBlock = lazy(() => import('./blocks/VideoBlock').then(m => ({ default: m.VideoBlock })));
const CarouselBlock = lazy(() => import('./blocks/CarouselBlock').then(m => ({ default: m.CarouselBlock })));
const SearchBlock = lazy(() => import('./blocks/SearchBlock').then(m => ({ default: m.SearchBlock })));
const CustomCodeBlock = lazy(() => import('./blocks/CustomCodeBlock').then(m => ({ default: m.CustomCodeBlock })));
const MessengerBlock = lazy(() => import('./blocks/MessengerBlock').then(m => ({ default: m.MessengerBlock })));
const FormBlock = lazy(() => import('./blocks/FormBlock').then(m => ({ default: m.FormBlock })));
const DownloadBlock = lazy(() => import('./blocks/DownloadBlock').then(m => ({ default: m.DownloadBlock })));
const NewsletterBlock = lazy(() => import('./blocks/NewsletterBlock').then(m => ({ default: m.NewsletterBlock })));
const TestimonialBlock = lazy(() => import('./blocks/TestimonialBlock').then(m => ({ default: m.TestimonialBlock })));
const ScratchBlock = lazy(() => import('./blocks/ScratchBlock').then(m => ({ default: m.ScratchBlock })));

interface BlockRendererProps {
  block: Block;
  isPreview?: boolean;
}

// Loading skeleton for blocks
const BlockSkeleton = () => (
  <div className="w-full">
    <Skeleton className="h-24 w-full rounded-lg" />
  </div>
);

export function BlockRenderer({ block, isPreview }: BlockRendererProps) {
  switch (block.type) {
    case 'profile':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <ProfileBlock block={block} isPreview={isPreview} />
        </Suspense>
      );
    case 'link':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <LinkBlock block={block} />
        </Suspense>
      );
    case 'button':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <ButtonBlock block={block} />
        </Suspense>
      );
    case 'socials':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <SocialsBlock block={block} />
        </Suspense>
      );
    case 'text':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <TextBlock block={block} />
        </Suspense>
      );
    case 'image':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <ImageBlock block={block} />
        </Suspense>
      );
    case 'product':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <ProductBlock block={block} />
        </Suspense>
      );
    case 'video':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <VideoBlock block={block} />
        </Suspense>
      );
    case 'carousel':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <CarouselBlock block={block} />
        </Suspense>
      );
    case 'search':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <SearchBlock block={block} />
        </Suspense>
      );
    case 'custom_code':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <CustomCodeBlock block={block} />
        </Suspense>
      );
    case 'messenger':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <MessengerBlock block={block} />
        </Suspense>
      );
    case 'form':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <FormBlock block={block} />
        </Suspense>
      );
    case 'download':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <DownloadBlock block={block} />
        </Suspense>
      );
    case 'newsletter':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <NewsletterBlock block={block} />
        </Suspense>
      );
    case 'testimonial':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <TestimonialBlock block={block} />
        </Suspense>
      );
    case 'scratch':
      return (
        <Suspense fallback={<BlockSkeleton />}>
          <ScratchBlock block={block} />
        </Suspense>
      );
    default:
      return null;
  }
}
