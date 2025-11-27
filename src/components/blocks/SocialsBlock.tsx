import { memo } from 'react';
import { Instagram, Send, Youtube, Music, Twitter, Github, Linkedin, Facebook, Globe } from 'lucide-react';
import type { SocialsBlock as SocialsBlockType, PageTheme } from '@/types/page';
import { getShadowClass } from '@/lib/block-utils';

interface SocialsBlockProps {
  block: SocialsBlockType;
  theme?: PageTheme;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  telegram: Send,
  youtube: Youtube,
  tiktok: Music,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  threads: Instagram,
  globe: Globe,
};

export const SocialsBlock = memo(function SocialsBlockComponent({ block, theme }: SocialsBlockProps) {
  const handleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {block.title && (
        <h3 className="text-center text-sm font-medium mb-4 opacity-70" style={{ color: theme?.textColor }}>
          {block.title}
        </h3>
      )}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {block.platforms.map((platform, index) => {
          const Icon = iconMap[platform.icon.toLowerCase()] || Globe;
          return (
            <button
              key={index}
              onClick={() => handleClick(platform.url)}
              className={`group relative w-14 h-14 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 ${getShadowClass(theme?.shadowIntensity)} flex items-center justify-center`}
              style={{
                backgroundColor: theme?.textColor ? `${theme.textColor}11` : 'rgba(255, 255, 255, 0.05)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme?.textColor ? `${theme.textColor}33` : 'rgba(255, 255, 255, 0.1)'
              }}
              aria-label={platform.name}
            >
              <Icon 
                className="w-6 h-6 transition-colors duration-300" 
                style={{ 
                  color: theme?.textColor,
                  opacity: 0.8
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
});
