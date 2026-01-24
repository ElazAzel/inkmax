import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import type {
  Block,
  PageData,
  ProfileBlock,
  AvatarBlock,
  LinkBlock,
  ButtonBlock,
  ProductBlock,
  EventBlock,
  FormBlock,
  BookingBlock,
  DownloadBlock,
} from '@/types/page';

const SPAM_TERMS = [
  'casino',
  'bet',
  'porn',
  'viagra',
  'loan',
  'crypto giveaway',
  'free money',
  'казино',
  'ставки',
  'эротик',
  'виагра',
  'кредит',
  'крипто раздача',
  'легкие деньги',
  'ұтыс',
  'қарыз',
  'казино',
];

const CTA_BLOCK_TYPES: Block['type'][] = [
  'link',
  'button',
  'product',
  'catalog',
  'pricing',
  'booking',
  'event',
  'form',
  'download',
  'community',
];

const MAX_TOTAL_LINKS = 15;
const MAX_LINK_RATIO = 0.8;

export interface UgsQualityResult {
  indexable: boolean;
  nofollow: boolean;
  reasons: string[];
}

interface ProfileInfo {
  name?: string;
  bio?: string;
  avatar?: string;
}

export function getProfileInfoFromBlocks(blocks: Block[], language: SupportedLanguage): ProfileInfo {
  const profileBlock = blocks.find((block) => block.type === 'profile') as ProfileBlock | undefined;
  if (profileBlock) {
    return {
      name: typeof profileBlock.name === 'string' ? profileBlock.name : getTranslatedString(profileBlock.name, language),
      bio: typeof profileBlock.bio === 'string' ? profileBlock.bio : getTranslatedString(profileBlock.bio, language),
      avatar: profileBlock.avatar,
    };
  }

  const avatarBlock = blocks.find((block) => block.type === 'avatar') as AvatarBlock | undefined;
  if (avatarBlock) {
    return {
      name: typeof avatarBlock.name === 'string' ? avatarBlock.name : getTranslatedString(avatarBlock.name, language),
      bio: avatarBlock.subtitle
        ? typeof avatarBlock.subtitle === 'string'
          ? avatarBlock.subtitle
          : getTranslatedString(avatarBlock.subtitle, language)
        : undefined,
      avatar: avatarBlock.imageUrl,
    };
  }

  return {};
}

function normalizeText(value?: string): string {
  return (value || '').toLowerCase();
}

function containsSpam(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return SPAM_TERMS.some((term) => normalized.includes(term));
}

function getBlockText(block: Block, language: SupportedLanguage): string[] {
  switch (block.type) {
    case 'profile':
      return [
        typeof block.name === 'string' ? block.name : getTranslatedString(block.name, language),
        typeof block.bio === 'string' ? block.bio : getTranslatedString(block.bio, language),
      ].filter(Boolean);
    case 'text':
      return [typeof block.content === 'string' ? block.content : getTranslatedString(block.content, language)];
    case 'faq':
      return block.items.flatMap((item) => [
        typeof item.question === 'string' ? item.question : getTranslatedString(item.question, language),
        typeof item.answer === 'string' ? item.answer : getTranslatedString(item.answer, language),
      ]);
    case 'product':
      return [
        typeof block.name === 'string' ? block.name : getTranslatedString(block.name, language),
        typeof block.description === 'string' ? block.description : getTranslatedString(block.description, language),
      ].filter(Boolean);
    case 'event':
      return [
        getTranslatedString(block.title, language),
        block.description ? getTranslatedString(block.description, language) : '',
      ].filter(Boolean);
    case 'community':
      return [
        block.title ? getTranslatedString(block.title, language) : '',
        block.description ? getTranslatedString(block.description, language) : '',
      ].filter(Boolean);
    default:
      return [];
  }
}

function getLinkCount(blocks: Block[]): number {
  return blocks.reduce((count, block) => {
    if (block.type === 'link') return count + 1;
    if (block.type === 'button') return count + 1;
    if (block.type === 'product' && block.buyLink) return count + 1;
    if (block.type === 'booking') return count + 1;
    if (block.type === 'event') return count + 1;
    if (block.type === 'form') return count + 1;
    if (block.type === 'download') return count + 1;
    return count;
  }, 0);
}

export function getPrimaryCtaBlock(blocks: Block[]): Block | undefined {
  return blocks.find((block) => CTA_BLOCK_TYPES.includes(block.type));
}

export function evaluateUgsQuality(pageData: PageData, language: SupportedLanguage): UgsQualityResult {
  const reasons: string[] = [];

  if (!pageData.isPublished) {
    reasons.push('not_published');
  }

  if (pageData.seo?.allowIndexing === false) {
    reasons.push('indexing_disabled');
  }

  const profileInfo = getProfileInfoFromBlocks(pageData.blocks, language);
  const hasProfile = Boolean(profileInfo.name || profileInfo.bio || profileInfo.avatar);
  if (!hasProfile) {
    reasons.push('missing_profile');
  }

  const nonProfileBlocks = pageData.blocks.filter((block) => block.type !== 'profile');
  if (nonProfileBlocks.length < 2) {
    reasons.push('insufficient_blocks');
  }

  const hasCta = pageData.blocks.some((block) => CTA_BLOCK_TYPES.includes(block.type));
  if (!hasCta) {
    reasons.push('missing_cta');
  }

  const linkCount = getLinkCount(pageData.blocks);
  if (linkCount > MAX_TOTAL_LINKS || linkCount / Math.max(pageData.blocks.length, 1) > MAX_LINK_RATIO) {
    reasons.push('link_spam');
  }

  const spamTextHit = pageData.blocks.some((block) =>
    getBlockText(block, language).some((text) => containsSpam(text))
  );

  if (spamTextHit) {
    reasons.push('spam_terms');
  }

  const isSpam = reasons.includes('link_spam') || reasons.includes('spam_terms');

  return {
    indexable: reasons.length === 0,
    nofollow: isSpam,
    reasons,
  };
}

export function getCtaLabel(block: Block, language: SupportedLanguage): string {
  switch (block.type) {
    case 'link':
      return typeof block.title === 'string' ? block.title : getTranslatedString(block.title, language);
    case 'button':
      return typeof block.title === 'string' ? block.title : getTranslatedString(block.title, language);
    case 'product':
      return typeof block.name === 'string' ? block.name : getTranslatedString(block.name, language);
    case 'event':
      return getTranslatedString(block.title, language);
    case 'community':
      return block.title ? getTranslatedString(block.title, language) : 'Community';
    case 'download':
      return typeof block.title === 'string' ? block.title : getTranslatedString(block.title, language);
    case 'form':
      return typeof block.title === 'string' ? block.title : getTranslatedString(block.title, language);
    case 'booking':
      return typeof block.title === 'string' ? block.title : getTranslatedString(block.title, language);
    default:
      return 'Open';
  }
}

export function getCtaTarget(block: Block): { href?: string; blockId?: string } {
  if (block.type === 'link') {
    return { href: (block as LinkBlock).url };
  }
  if (block.type === 'button') {
    return { href: (block as ButtonBlock).url };
  }
  if (block.type === 'product' && (block as ProductBlock).buyLink) {
    return { href: (block as ProductBlock).buyLink };
  }
  if (block.type === 'event') {
    return { blockId: block.id };
  }
  if (block.type === 'booking') {
    return { blockId: block.id };
  }
  if (block.type === 'form') {
    return { blockId: block.id };
  }
  if (block.type === 'download') {
    return { blockId: block.id };
  }
  return { blockId: block.id };
}
