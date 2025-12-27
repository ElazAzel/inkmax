/**
 * Color contrast utilities for automatic text color selection
 */

/**
 * Parse a hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color (WCAG formula)
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine if white or black text has better contrast on a given background
 * Returns true if white text is recommended
 */
export function shouldUseWhiteText(backgroundColor: string): boolean {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return false; // Default to dark text if parsing fails
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  // Use white text on dark backgrounds (luminance < 0.5)
  return luminance < 0.5;
}

/**
 * Get the recommended text color for a given background
 */
export function getContrastTextColor(backgroundColor: string): string {
  return shouldUseWhiteText(backgroundColor) ? '#FFFFFF' : '#000000';
}

/**
 * Get the average color from gradient colors
 */
export function getAverageGradientColor(gradientValue: string): string | null {
  const colors = gradientValue.split(',').map(c => c.trim());
  if (colors.length === 0) return null;
  
  let totalR = 0, totalG = 0, totalB = 0;
  let validCount = 0;
  
  for (const color of colors) {
    const rgb = hexToRgb(color);
    if (rgb) {
      totalR += rgb.r;
      totalG += rgb.g;
      totalB += rgb.b;
      validCount++;
    }
  }
  
  if (validCount === 0) return null;
  
  const avgR = Math.round(totalR / validCount);
  const avgG = Math.round(totalG / validCount);
  const avgB = Math.round(totalB / validCount);
  
  return `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
}

/**
 * Get contrast text color based on page background settings
 */
export function getContrastTextColorForBackground(
  backgroundType: 'solid' | 'gradient' | 'image',
  backgroundValue: string
): string | null {
  if (backgroundType === 'solid') {
    return getContrastTextColor(backgroundValue);
  }
  
  if (backgroundType === 'gradient') {
    const avgColor = getAverageGradientColor(backgroundValue);
    return avgColor ? getContrastTextColor(avgColor) : null;
  }
  
  // For images, we can't determine contrast automatically
  // Return null to let user choose
  return null;
}
