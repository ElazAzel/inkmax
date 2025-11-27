export type BlockType = 'profile' | 'link' | 'button' | 'socials' | 'text' | 'image' | 'product' | 'video' | 'carousel' | 'search' | 'custom_code';

export interface ProfileBlock {
  id: string;
  type: 'profile';
  avatar?: string;
  name: string;
  bio: string;
  verified?: boolean;
  avatarFrame?: 'default' | 'neon' | 'glitch' | 'aura' | 'gradient' | 'pulse' | 'rainbow' | 'double';
}

export interface LinkBlock {
  id: string;
  type: 'link';
  title: string;
  url: string;
  icon?: string;
  style?: 'default' | 'rounded' | 'pill';
}

export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
  style?: 'heading' | 'paragraph' | 'quote';
}

export type Currency = 'KZT' | 'RUB' | 'BYN' | 'AMD' | 'AZN' | 'KGS' | 'TJS' | 'TMT' | 'UZS' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'JPY' | 'CHF' | 'CAD' | 'AUD';

export interface ProductBlock {
  id: string;
  type: 'product';
  name: string;
  description: string;
  price: number;
  currency: Currency;
  image?: string;
  buyLink?: string;
}

export interface VideoBlock {
  id: string;
  type: 'video';
  title: string;
  url: string;
  platform: 'youtube' | 'vimeo';
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export interface CarouselBlock {
  id: string;
  type: 'carousel';
  title?: string;
  images: Array<{
    url: string;
    alt: string;
    link?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
}

export interface ButtonBlock {
  id: string;
  type: 'button';
  title: string;
  url: string;
  background?: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
    gradientAngle?: number;
  };
  hoverEffect?: 'glow' | 'scale' | 'shadow' | 'none';
}

export interface SocialsBlock {
  id: string;
  type: 'socials';
  title?: string;
  platforms: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
  style?: 'polaroid' | 'vignette' | 'circle' | 'default';
}

export interface SearchBlock {
  id: string;
  type: 'search';
  title?: string;
  placeholder?: string;
  isPremium: true;
}

export interface CustomCodeBlock {
  id: string;
  type: 'custom_code';
  title?: string;
  html: string;
  css?: string;
  isPremium: true;
}

export type Block = ProfileBlock | LinkBlock | ButtonBlock | SocialsBlock | TextBlock | ImageBlock | ProductBlock | VideoBlock | CarouselBlock | SearchBlock | CustomCodeBlock;

export interface PageTheme {
  backgroundColor: string;
  backgroundGradient?: string;
  textColor: string;
  buttonStyle: 'default' | 'rounded' | 'pill' | 'gradient';
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface PageData {
  id: string;
  blocks: Block[];
  theme: PageTheme;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  isPremium?: boolean;
}
