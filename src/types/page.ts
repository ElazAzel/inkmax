export type BlockType = 'profile' | 'link' | 'text' | 'product';

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

export type Block = ProfileBlock | LinkBlock | TextBlock | ProductBlock;

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
