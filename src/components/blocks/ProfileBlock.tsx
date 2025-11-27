import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import type { ProfileBlock } from '@/types/page';

interface ProfileBlockProps {
  block: ProfileBlock;
  isPreview?: boolean;
}

export function ProfileBlock({ block, isPreview }: ProfileBlockProps) {
  const initials = block.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
        <AvatarImage src={block.avatar} alt={block.name} />
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      
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
}
