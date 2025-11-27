import type { Block } from '@/types/page';
import { ProfileBlock } from './blocks/ProfileBlock';
import { LinkBlock } from './blocks/LinkBlock';
import { TextBlock } from './blocks/TextBlock';
import { ProductBlock } from './blocks/ProductBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { CarouselBlock } from './blocks/CarouselBlock';
import { CustomCodeBlock } from './blocks/CustomCodeBlock';

interface BlockRendererProps {
  block: Block;
  isPreview?: boolean;
}

export function BlockRenderer({ block, isPreview }: BlockRendererProps) {
  switch (block.type) {
    case 'profile':
      return <ProfileBlock block={block} isPreview={isPreview} />;
    case 'link':
      return <LinkBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'product':
      return <ProductBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'carousel':
      return <CarouselBlock block={block} />;
    case 'custom_code':
      return <CustomCodeBlock block={block} />;
    default:
      return null;
  }
}
