import type { Block } from '@/types/page';
import { ProfileBlock } from './blocks/ProfileBlock';
import { LinkBlock } from './blocks/LinkBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { SocialsBlock } from './blocks/SocialsBlock';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ProductBlock } from './blocks/ProductBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { CarouselBlock } from './blocks/CarouselBlock';
import { SearchBlock } from './blocks/SearchBlock';
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
    case 'button':
      return <ButtonBlock block={block} />;
    case 'socials':
      return <SocialsBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'product':
      return <ProductBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'carousel':
      return <CarouselBlock block={block} />;
    case 'search':
      return <SearchBlock block={block} />;
    case 'custom_code':
      return <CustomCodeBlock block={block} />;
    default:
      return null;
  }
}
