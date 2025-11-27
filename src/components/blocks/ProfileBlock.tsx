import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import type { ProfileBlock as ProfileBlockType } from '@/types/page';

interface ProfileBlockProps {
  block: ProfileBlockType;
  isPreview?: boolean;
}

export const ProfileBlock = memo(function ProfileBlockComponent({ block, isPreview }: ProfileBlockProps) {
  const initials = block.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getAvatarFrameClass = () => {
    const frameStyle = block.avatarFrame || 'default';
    
    switch (frameStyle) {
      case 'neon':
        return 'ring-4 ring-primary ring-offset-4 ring-offset-background shadow-[0_0_30px_hsl(var(--primary)/0.5)] animate-pulse';
      case 'glitch':
        return 'ring-2 ring-primary ring-offset-2 ring-offset-background relative after:absolute after:inset-0 after:ring-2 after:ring-destructive after:rounded-full after:animate-ping';
      case 'aura':
        return 'ring-4 ring-primary/30 ring-offset-4 ring-offset-background shadow-[0_0_40px_20px_hsl(var(--primary)/0.2)]';
      case 'gradient':
        return 'ring-4 ring-offset-4 ring-offset-background bg-gradient-to-r from-primary via-secondary to-accent p-1 rounded-full';
      case 'pulse':
        return 'ring-4 ring-primary ring-offset-4 ring-offset-background animate-[pulse_2s_ease-in-out_infinite]';
      case 'rainbow':
        return 'ring-4 ring-offset-4 ring-offset-background animate-[spin_3s_linear_infinite] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 p-1 rounded-full';
      case 'double':
        return 'ring-4 ring-primary ring-offset-4 ring-offset-background shadow-[0_0_0_8px_hsl(var(--secondary))]';
      default:
        return 'ring-2 ring-primary ring-offset-2 ring-offset-background';
    }
  };

  const isGradientFrame = block.avatarFrame === 'gradient' || block.avatarFrame === 'rainbow';

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className={isGradientFrame ? getAvatarFrameClass() : ''}>
        <Avatar className={`h-24 w-24 ${!isGradientFrame ? getAvatarFrameClass() : ''}`}>
          <AvatarImage src={block.avatar} alt={block.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">{block.name}</h1>
          {block.verified && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
        
        {block.bio && (
          <p className="text-muted-foreground max-w-md">{block.bio}</p>
        )}
      </div>
    </div>
  );
});
