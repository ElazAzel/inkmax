/**
 * Validation functions for block editors
 * Returns error message if validation fails, null if valid
 */

import { isMultilingualString, getTranslatedString } from '@/lib/i18n-helpers';

/**
 * Normalize value to string - handles MultilingualString objects
 */
function normalizeToString(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (isMultilingualString(value)) {
    // Get any non-empty translation
    return getTranslatedString(value, 'en') || 
           getTranslatedString(value, 'ru') || 
           getTranslatedString(value, 'kk') || '';
  }
  return String(value);
}

export function validateUrl(url: unknown, fieldName = 'URL'): string | null {
  const urlStr = normalizeToString(url);
  if (!urlStr || urlStr.trim() === '') {
    return `${fieldName} is required`;
  }
  
  try {
    new URL(urlStr);
    return null;
  } catch {
    return `${fieldName} must be a valid URL`;
  }
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  const str = normalizeToString(value);
  if (!str || str.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateNumber(
  value: number | undefined,
  fieldName: string,
  options?: { min?: number; max?: number }
): string | null {
  if (value === undefined || isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  
  if (options?.min !== undefined && value < options.min) {
    return `${fieldName} must be at least ${options.min}`;
  }
  
  if (options?.max !== undefined && value > options.max) {
    return `${fieldName} must be at most ${options.max}`;
  }
  
  return null;
}

export function validateArrayNotEmpty(arr: unknown[] | undefined, fieldName: string): string | null {
  if (!arr || arr.length === 0) {
    return `${fieldName} must have at least one item`;
  }
  return null;
}

// Block-specific validators
type BlockFormData = Record<string, unknown>;

export function validateLinkBlock(formData: BlockFormData): string | null {
  return validateRequired(formData.title, 'Title') || validateUrl(formData.url);
}

export function validateButtonBlock(formData: BlockFormData): string | null {
  return validateRequired(formData.title, 'Title') || validateUrl(formData.url);
}

export function validateProductBlock(formData: BlockFormData): string | null {
  return (
    validateRequired(formData.name, 'Product name') ||
    validateNumber(formData.price as number | undefined, 'Price', { min: 0 })
  );
}

export function validateVideoBlock(formData: BlockFormData): string | null {
  return validateUrl(formData.url, 'Video URL');
}

export function validateImageBlock(formData: BlockFormData): string | null {
  return validateUrl(formData.url, 'Image URL') || validateRequired(formData.alt, 'Alt text');
}

export function validateCarouselBlock(formData: BlockFormData): string | null {
  const images = Array.isArray(formData.images) ? formData.images : undefined;
  const arrayError = validateArrayNotEmpty(images, 'Images');
  if (arrayError) return arrayError;
  
  // Validate each image
  for (let i = 0; i < (images?.length || 0); i++) {
    const image = images?.[i] as Record<string, unknown> | undefined;
    const urlError = validateUrl(image?.url, `Image ${i + 1} URL`);
    if (urlError) return urlError;
  }
  
  return null;
}

export function validateSocialsBlock(formData: BlockFormData): string | null {
  const platforms = Array.isArray(formData.platforms) ? formData.platforms : undefined;
  const arrayError = validateArrayNotEmpty(platforms, 'Platforms');
  if (arrayError) return arrayError;
  
  // Validate each platform
  for (let i = 0; i < (platforms?.length || 0); i++) {
    const platform = platforms?.[i] as Record<string, unknown> | undefined;
    const urlError = validateUrl(platform?.url, `Platform ${i + 1} URL`);
    if (urlError) return urlError;
  }
  
  return null;
}

export function validateCustomCodeBlock(formData: BlockFormData): string | null {
  return validateRequired(formData.html, 'HTML code');
}

export function validateMessengerBlock(formData: BlockFormData): string | null {
  const messengers = Array.isArray(formData.messengers) ? formData.messengers : undefined;
  const arrayError = validateArrayNotEmpty(messengers, 'Messengers');
  if (arrayError) return arrayError;
  
  for (let i = 0; i < (messengers?.length || 0); i++) {
    const messenger = messengers?.[i] as Record<string, unknown> | undefined;
    const usernameError = validateRequired(messenger?.username, `Messenger ${i + 1} username`);
    if (usernameError) return usernameError;
  }
  
  return null;
}

export function validateFormBlock(formData: BlockFormData): string | null {
  const titleError = validateRequired(formData.title, 'Form title');
  if (titleError) return titleError;
  
  const fields = Array.isArray(formData.fields) ? formData.fields : undefined;
  const arrayError = validateArrayNotEmpty(fields, 'Form fields');
  if (arrayError) return arrayError;
  
  for (let i = 0; i < (fields?.length || 0); i++) {
    const field = fields?.[i] as Record<string, unknown> | undefined;
    const nameError = validateRequired(field?.name, `Field ${i + 1} name`);
    if (nameError) return nameError;
  }
  
  return null;
}

export function validateEventBlock(formData: BlockFormData): string | null {
  const titleError = validateRequired(formData.title, 'Event title');
  if (titleError) return titleError;

  const fields = Array.isArray(formData.formFields) ? formData.formFields : [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i] as Record<string, unknown>;
    const nameError = validateRequired(field?.label_i18n, `Field ${i + 1} label`);
    if (nameError) return nameError;
  }

  return null;
}

export function validateDownloadBlock(formData: BlockFormData): string | null {
  return (
    validateRequired(formData.title, 'Title') ||
    validateUrl(formData.fileUrl, 'File URL') ||
    validateRequired(formData.fileName, 'File name')
  );
}

export function validateNewsletterBlock(formData: BlockFormData): string | null {
  return validateRequired(formData.title, 'Title');
}

export function validateTestimonialBlock(formData: BlockFormData): string | null {
  const testimonials = Array.isArray(formData.testimonials) ? formData.testimonials : undefined;
  const arrayError = validateArrayNotEmpty(testimonials, 'Testimonials');
  if (arrayError) return arrayError;
  
  for (let i = 0; i < (testimonials?.length || 0); i++) {
    const testimonial = testimonials?.[i] as Record<string, unknown> | undefined;
    const nameError = validateRequired(testimonial?.name, `Testimonial ${i + 1} name`);
    if (nameError) return nameError;
    const textError = validateRequired(testimonial?.text, `Testimonial ${i + 1} text`);
    if (textError) return textError;
  }
  
  return null;
}

export function validateScratchBlock(formData: BlockFormData): string | null {
  return validateRequired(formData.revealText, 'Reveal text');
}

export function validateMapBlock(formData: BlockFormData): string | null {
  return validateRequired(formData.embedUrl, 'Embed URL');
}

export function validateAvatarBlock(formData: BlockFormData): string | null {
  return (
    validateUrl(formData.imageUrl, 'Image URL') ||
    validateRequired(formData.name, 'Name')
  );
}

export function validateSeparatorBlock(_formData: BlockFormData): string | null {
  // Separator block has no required fields
  return null;
}
