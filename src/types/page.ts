export type BlockType = 'profile' | 'link' | 'button' | 'socials' | 'text' | 'image' | 'product' | 'video' | 'carousel' | 'search' | 'custom_code' | 'messenger' | 'form' | 'download' | 'newsletter' | 'testimonial' | 'scratch' | 'map' | 'avatar' | 'separator';

// Extended style system for all blocks
export interface BlockStyle {
  // Spacing
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Border
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderWidth?: 'none' | 'thin' | 'medium' | 'thick';
  borderColor?: string;
  
  // Shadow
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow';
  
  // Background
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundOpacity?: number;
  
  // Animation
  hoverEffect?: 'none' | 'scale' | 'glow' | 'lift' | 'fade';
  animation?: 'none' | 'fade-in' | 'slide-up' | 'scale-in';
}

export interface BlockSchedule {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

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
  schedule?: BlockSchedule;
}

export interface LinkBlock {
  id: string;
  type: 'link';
  title: string;
  url: string;
  icon?: string;
  style?: 'default' | 'rounded' | 'pill';
  schedule?: BlockSchedule;
}

export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
  style?: 'heading' | 'paragraph' | 'quote';
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
}

export interface VideoBlock {
  id: string;
  type: 'video';
  title: string;
  url: string;
  platform: 'youtube' | 'vimeo';
  aspectRatio?: '16:9' | '4:3' | '1:1';
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
  style?: 'polaroid' | 'vignette' | 'circle' | 'default';
  schedule?: BlockSchedule;
}

export interface SearchBlock {
  id: string;
  type: 'search';
  title?: string;
  placeholder?: string;
  isPremium: true;
  schedule?: BlockSchedule;
}

export interface CustomCodeBlock {
  id: string;
  type: 'custom_code';
  title?: string;
  html: string;
  css?: string;
  isPremium: true;
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
}

export interface NewsletterBlock {
  id: string;
  type: 'newsletter';
  title: string;
  description?: string;
  buttonText: string;
  apiEndpoint?: string;
  isPremium: true;
  schedule?: BlockSchedule;
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
  schedule?: BlockSchedule;
}

export interface ScratchBlock {
  id: string;
  type: 'scratch';
  title?: string;
  revealText: string;
  scratchImage?: string;
  backgroundColor?: string;
  isPremium: true;
  schedule?: BlockSchedule;
  style?: BlockStyle;
}

export interface MapBlock {
  id: string;
  type: 'map';
  title?: string;
  provider: 'google' | 'yandex';
  embedUrl: string;
  address?: string;
  height?: 'small' | 'medium' | 'large';
  schedule?: BlockSchedule;
  style?: BlockStyle;
}

export interface AvatarBlock {
  id: string;
  type: 'avatar';
  imageUrl: string;
  name: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  shape?: 'circle' | 'rounded' | 'square';
  border?: boolean;
  borderColor?: string;
  shadow?: 'none' | 'soft' | 'medium' | 'strong' | 'glow';
  schedule?: BlockSchedule;
  style?: BlockStyle;
}

export interface SeparatorBlock {
  id: string;
  type: 'separator';
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient';
  thickness?: 'thin' | 'medium' | 'thick';
  color?: string;
  width?: 'full' | 'half' | 'third';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  schedule?: BlockSchedule;
  style?: BlockStyle;
}

export type Block = ProfileBlock | LinkBlock | ButtonBlock | SocialsBlock | TextBlock | ImageBlock | ProductBlock | VideoBlock | CarouselBlock | SearchBlock | CustomCodeBlock | MessengerBlock | FormBlock | DownloadBlock | NewsletterBlock | TestimonialBlock | ScratchBlock | MapBlock | AvatarBlock | SeparatorBlock;

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
