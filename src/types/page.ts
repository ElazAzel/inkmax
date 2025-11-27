export type BlockType = 'profile' | 'link' | 'text' | 'product' | 'video' | 'carousel' | 'custom_code';

export interface ProfileBlock {
  id: string;
  type: 'profile';
  avatar?: string;
  name: string;
  bio: string;
  verified?: boolean;
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

export interface ProductBlock {
  id: string;
  type: 'product';
  name: string;
  description: string;
  price: number;
  currency: string;
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

export interface CustomCodeBlock {
  id: string;
  type: 'custom_code';
  title?: string;
  html: string;
  css?: string;
  isPremium: true;
}

export type Block = ProfileBlock | LinkBlock | TextBlock | ProductBlock | VideoBlock | CarouselBlock | CustomCodeBlock;

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
