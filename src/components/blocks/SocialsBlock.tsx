import { Instagram, Send, Youtube, Music, Twitter, Github, Linkedin, Facebook, Globe } from 'lucide-react';
import type { SocialsBlock } from '@/types/page';

interface SocialsBlockProps {
  block: SocialsBlock;
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

export function SocialsBlock({ block }: SocialsBlockProps) {
  const handleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {block.title && (
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
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
              className="group relative w-14 h-14 rounded-2xl bg-background/50 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center justify-center"
              aria-label={platform.name}
            >
              <Icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-300" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
