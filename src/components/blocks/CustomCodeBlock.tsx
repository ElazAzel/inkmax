import { memo, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import DOMPurify from 'dompurify';
import type { CustomCodeBlock as CustomCodeBlockType } from '@/types/page';

interface CustomCodeBlockProps {
  block: CustomCodeBlockType;
}

export const CustomCodeBlock = memo(function CustomCodeBlockComponent({ block }: CustomCodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = useMemo(() => {
    return DOMPurify.sanitize(block.html || '', {
      ALLOWED_TAGS: ['div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                     'ul', 'ol', 'li', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u', 
                     'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 
                     'pre', 'code', 'figure', 'figcaption', 'video', 'audio', 'source',
                     'iframe', 'button', 'input', 'label', 'form', 'select', 'option'],
      ALLOWED_ATTR: ['class', 'id', 'style', 'href', 'src', 'alt', 'title', 'target', 
                     'rel', 'width', 'height', 'type', 'value', 'placeholder', 'name',
                     'autoplay', 'controls', 'loop', 'muted', 'poster', 'frameborder',
                     'allowfullscreen', 'allow', 'loading'],
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'style', 'object', 'embed', 'link', 'meta', 'base'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
                    'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress', 'onchange', 'oninput'],
    });
  }, [block.html]);

  // Sanitize CSS to prevent CSS injection attacks
  const sanitizedCss = useMemo(() => {
    if (!block.css) return '';
    // Remove potentially dangerous CSS patterns
    return block.css
      .replace(/@import/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/url\s*\(\s*["']?\s*javascript:/gi, '')
      .replace(/behavior\s*:/gi, '');
  }, [block.css]);

  useEffect(() => {
    if (!containerRef.current || !sanitizedCss) return;

    // Inject sanitized CSS
    const styleId = `custom-style-${block.id}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = sanitizedCss;

    // Cleanup on unmount
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [sanitizedCss, block.id]);

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
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </CardContent>
    </Card>
  );
});
