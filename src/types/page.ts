export type BlockType = 'profile' | 'link' | 'button' | 'socials' | 'text' | 'image' | 'product' | 'video' | 'carousel' | 'search' | 'custom_code' | 'messenger' | 'form' | 'download' | 'newsletter' | 'testimonial' | 'scratch';

export interface ProfileBlock {
  id: string;
  type: 'profile';
  avatar?: string;
  name: string;
  bio: string;
  verified?: boolean;
  avatarFrame?: 'default' | 'neon' | 'glitch' | 'aura' | 'gradient' | 'pulse' | 'rainbow' | 'double' | 'spinning' | 'dash' | 'wave';
  coverImage?: string;
  coverGradient?: 'none' | 'dark' | 'light' | 'primary' | 'sunset' | 'ocean' | 'purple';
  coverHeight?: 'small' | 'medium' | 'large';
  avatarSize?: 'small' | 'medium' | 'large' | 'xlarge';
  avatarPosition?: 'left' | 'center' | 'right';
  shadowStyle?: 'none' | 'soft' | 'medium' | 'strong' | 'glow';
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

export interface MessengerBlock {
  id: string;
  type: 'messenger';
  title?: string;
  messengers: Array<{
    platform: 'whatsapp' | 'telegram' | 'viber' | 'wechat';
    username: string;
    message?: string;
  }>;
}

export interface FormBlock {
  id: string;
  type: 'form';
  title: string;
  fields: Array<{
    name: string;
    type: 'text' | 'email' | 'phone' | 'textarea';
    required: boolean;
  }>;
  submitEmail: string;
  buttonText: string;
  isPremium: true;
}

export interface DownloadBlock {
  id: string;
  type: 'download';
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  icon?: string;
}

export interface NewsletterBlock {
  id: string;
  type: 'newsletter';
  title: string;
  description?: string;
  buttonText: string;
  apiEndpoint?: string;
  isPremium: true;
}

export interface TestimonialBlock {
  id: string;
  type: 'testimonial';
  title?: string;
  testimonials: Array<{
    name: string;
    text: string;
    rating?: number;
    avatar?: string;
    role?: string;
  }>;
  isPremium: true;
}

export interface ScratchBlock {
  id: string;
  type: 'scratch';
  title?: string;
  revealText: string;
  scratchImage?: string;
  backgroundColor?: string;
  isPremium: true;
}

export type Block = ProfileBlock | LinkBlock | ButtonBlock | SocialsBlock | TextBlock | ImageBlock | ProductBlock | VideoBlock | CarouselBlock | SearchBlock | CustomCodeBlock | MessengerBlock | FormBlock | DownloadBlock | NewsletterBlock | TestimonialBlock | ScratchBlock;

export interface PageTheme {
  backgroundColor: string;
  backgroundGradient?: string;
  textColor: string;
  buttonStyle: 'default' | 'rounded' | 'pill' | 'gradient';
  fontFamily: 'sans' | 'serif' | 'mono';
  darkMode?: boolean;
}

export interface PageMetrics {
  googleAnalytics?: string;
  facebookPixel?: string;
  yandexMetrika?: string;
  tiktokPixel?: string;
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
  metrics?: PageMetrics;
}
