import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert HSL color string to RGB values
 */
function hslToRgb(hsl: string): { r: number; g: number; b: number } | null {
  const match = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return null;

  let h = parseInt(match[1]) / 360;
  let s = parseInt(match[2]) / 100;
  let l = parseInt(match[3]) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Automatically determine optimal text color based on background brightness
 * Returns either dark or light text color in HSL format
 */
export function getContrastTextColor(backgroundColor: string): string {
  // Handle gradients - extract first color
  if (backgroundColor.includes('linear-gradient')) {
    const firstColorMatch = backgroundColor.match(/hsl\([^)]+\)/);
    if (firstColorMatch) {
      backgroundColor = firstColorMatch[0];
    }
  }

  // Convert HSL to RGB
  const rgb = hslToRgb(backgroundColor);
  if (!rgb) {
    // Fallback to dark text if parsing fails
    return 'hsl(0 0% 13%)';
  }

  // Calculate luminance
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);

  // Return light text for dark backgrounds, dark text for light backgrounds
  // Threshold at 0.5 luminance
  return luminance > 0.5 
    ? 'hsl(0 0% 13%)'  // Dark text for light backgrounds
    : 'hsl(0 0% 98%)'; // Light text for dark backgrounds
}
