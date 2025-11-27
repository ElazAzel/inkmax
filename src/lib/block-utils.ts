/**
 * Shared utilities for block components
 * Centralizes common styling and interaction patterns
 */

export type ButtonStyle = 'default' | 'rounded' | 'pill' | 'gradient';
export type HoverEffect = 'default' | 'none' | 'glow' | 'scale' | 'shadow';
export type ShadowIntensity = 'none' | 'soft' | 'medium' | 'strong' | 'glow';

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image';
  value: string;
  gradientAngle?: number;
}

/**
 * Get button border radius class based on style
 */
export function getButtonClass(style?: ButtonStyle): string {
  switch (style) {
    case 'pill':
      return 'rounded-full';
    case 'rounded':
      return 'rounded-lg';
    case 'gradient':
      return 'rounded-lg bg-gradient-to-r from-primary to-primary/70';
    default:
      return 'rounded-md';
  }
}

/**
 * Get hover effect classes
 */
export function getHoverClass(effect?: HoverEffect): string {
  switch (effect) {
    case 'glow':
      return 'hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] transition-shadow duration-300';
    case 'scale':
      return 'hover:scale-105 transition-transform duration-300';
    case 'shadow':
      return 'hover:shadow-2xl transition-shadow duration-300';
    default:
      return 'hover:opacity-90 transition-opacity duration-300';
  }
}

/**
 * Get background style object for custom backgrounds
 */
export function getBackgroundStyle(background?: BackgroundConfig): React.CSSProperties {
  if (!background) return {};
  
  switch (background.type) {
    case 'gradient':
      return {
        background: `linear-gradient(${background.gradientAngle || 135}deg, ${background.value})`,
      };
    case 'image':
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    case 'solid':
    default:
      return {
        backgroundColor: background.value,
      };
  }
}

/**
 * Safely open URL in new tab with security attributes
 */
export function openUrlSafely(url: string, trackingCallback?: () => void): void {
  if (trackingCallback) {
    trackingCallback();
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Common block click handler factory
 */
export function createBlockClickHandler(
  url?: string,
  onClick?: () => void
): () => void {
  return () => {
    if (onClick) {
      onClick();
    }
    if (url) {
      openUrlSafely(url);
    }
  };
}

/**
 * Get shadow class based on theme shadow intensity
 */
export function getShadowClass(intensity?: ShadowIntensity): string {
  switch (intensity) {
    case 'none':
      return '';
    case 'soft':
      return 'shadow-sm';
    case 'medium':
      return 'shadow-md';
    case 'strong':
      return 'shadow-xl';
    case 'glow':
      return 'shadow-lg shadow-primary/50';
    default:
      return 'shadow-md';
  }
}

/**
 * Get accent color style for theme customization
 */
export function getAccentStyle(accentColor?: string): React.CSSProperties {
  if (!accentColor) return {};
  return {
    '--accent-color': accentColor,
  } as React.CSSProperties;
}
