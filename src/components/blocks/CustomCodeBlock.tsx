import { memo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import type { CustomCodeBlock as CustomCodeBlockType, PageTheme } from '@/types/page';

interface CustomCodeBlockProps {
  block: CustomCodeBlockType;
  theme?: PageTheme;
}

export const CustomCodeBlock = memo(function CustomCodeBlockComponent({ block, theme }: CustomCodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inject custom CSS
    if (block.css) {
      const styleId = `custom-style-${block.id}`;
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = block.css;

      // Cleanup on unmount
      return () => {
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };
    }
  }, [block.css, block.id]);

  return (
    <Card className="overflow-hidden border-primary/20">
      {block.title && (
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{block.title}</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              Premium
            </Badge>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="custom-code-container"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      </CardContent>
    </Card>
  );
});
