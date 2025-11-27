/**
 * Validation functions for block editors
 * Returns error message if validation fails, null if valid
 */

export function validateUrl(url: string | undefined, fieldName = 'URL'): string | null {
  if (!url || url.trim() === '') {
    return `${fieldName} is required`;
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return `${fieldName} must be a valid URL`;
  }
}

export function validateRequired(value: string | undefined, fieldName: string): string | null {
  if (!value || value.trim() === '') {
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

export function validateArrayNotEmpty(arr: any[] | undefined, fieldName: string): string | null {
  if (!arr || arr.length === 0) {
    return `${fieldName} must have at least one item`;
  }
  return null;
}

// Block-specific validators
export function validateLinkBlock(formData: any): string | null {
  return validateRequired(formData.title, 'Title') || validateUrl(formData.url);
}

export function validateButtonBlock(formData: any): string | null {
  return validateRequired(formData.title, 'Title') || validateUrl(formData.url);
}

export function validateProductBlock(formData: any): string | null {
  return (
    validateRequired(formData.name, 'Product name') ||
    validateNumber(formData.price, 'Price', { min: 0 })
  );
}

export function validateVideoBlock(formData: any): string | null {
  return validateUrl(formData.url, 'Video URL');
}

export function validateImageBlock(formData: any): string | null {
  return validateUrl(formData.url, 'Image URL') || validateRequired(formData.alt, 'Alt text');
}

export function validateCarouselBlock(formData: any): string | null {
  const arrayError = validateArrayNotEmpty(formData.images, 'Images');
  if (arrayError) return arrayError;
  
  // Validate each image
  for (let i = 0; i < formData.images.length; i++) {
    const image = formData.images[i];
    const urlError = validateUrl(image.url, `Image ${i + 1} URL`);
    if (urlError) return urlError;
  }
  
  return null;
}

export function validateSocialsBlock(formData: any): string | null {
  const arrayError = validateArrayNotEmpty(formData.platforms, 'Platforms');
  if (arrayError) return arrayError;
  
  // Validate each platform
  for (let i = 0; i < formData.platforms.length; i++) {
    const platform = formData.platforms[i];
    const urlError = validateUrl(platform.url, `Platform ${i + 1} URL`);
    if (urlError) return urlError;
  }
  
  return null;
}

export function validateCustomCodeBlock(formData: any): string | null {
  return validateRequired(formData.html, 'HTML code');
}
