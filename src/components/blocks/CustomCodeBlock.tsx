import { memo, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import DOMPurify from 'dompurify';
import type { CustomCodeBlock as CustomCodeBlockType } from '@/types/page';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';

interface CustomCodeBlockProps {
  block: CustomCodeBlockType;
}

export const CustomCodeBlock = memo(function CustomCodeBlockComponent({ block }: CustomCodeBlockProps) {
  const { i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const title = getTranslatedString(block.title, i18n.language as SupportedLanguage);

  const sanitizedHtml = useMemo(() => {
    return DOMPurify.sanitize(block.html || '', {
      ALLOWED_TAGS: ['div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                     'ul', 'ol', 'li', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u', 
                     'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 
                     'pre', 'code', 'figure', 'figcaption', 'video', 'audio', 'source',
                     'iframe', 'button', 'input', 'label', 'form', 'select', 'option',
                     'style', 'nav', 'header', 'footer', 'main', 'section', 'article', 'aside',
                     'svg', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse', 'g',
                     'canvas', 'details', 'summary', 'mark', 'small', 'sub', 'sup', 'time', 'abbr',
                     'address', 'cite', 'q', 'dl', 'dt', 'dd', 'caption', 'colgroup', 'col',
                     'picture', 'track', 'wbr'],
      ALLOWED_ATTR: ['class', 'id', 'style', 'href', 'src', 'alt', 'title', 'target', 
                     'rel', 'width', 'height', 'type', 'value', 'placeholder', 'name',
                     'autoplay', 'controls', 'loop', 'muted', 'poster', 'frameborder',
                     'allowfullscreen', 'allow', 'loading', 'srcset', 'sizes', 'media',
                     'viewBox', 'fill', 'stroke', 'stroke-width', 'd', 'cx', 'cy', 'r', 'rx', 'ry',
                     'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform', 'opacity',
                     'aria-label', 'aria-hidden', 'role', 'tabindex', 'data-*',
                     'min', 'max', 'step', 'pattern', 'required', 'disabled', 'readonly',
                     'checked', 'selected', 'multiple', 'for', 'datetime', 'open'],
      ALLOW_DATA_ATTR: true,
      FORBID_TAGS: ['script', 'object', 'embed', 'link', 'meta', 'base', 'noscript'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
                    'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress', 'onchange', 'oninput',
                    'onmousedown', 'onmouseup', 'onmousemove', 'onmouseout', 'ondblclick',
                    'oncontextmenu', 'ondrag', 'ondrop', 'oncopy', 'oncut', 'onpaste',
                    'onscroll', 'onresize', 'ontouchstart', 'ontouchmove', 'ontouchend'],
    });
  }, [block.html]);

  const sanitizedCss = useMemo(() => {
    if (!block.css) return '';
    
    let css = block.css;
    
    // Remove dangerous at-rules but keep safe ones
    css = css.replace(/@import\b/gi, '/* blocked */');
    css = css.replace(/@charset\b/gi, '/* blocked */');
    css = css.replace(/@namespace\b/gi, '/* blocked */');
    
    // Block JavaScript execution vectors
    css = css.replace(/javascript\s*:/gi, 'blocked:');
    css = css.replace(/expression\s*\(/gi, 'blocked(');
    css = css.replace(/behavior\s*:/gi, 'blocked:');
    
    // Block url() with dangerous protocols
    css = css.replace(/url\s*\(\s*["']?\s*(javascript|vbscript):/gi, 'url(blocked:');
    
    // Block browser-specific dangerous properties
    css = css.replace(/-moz-binding\s*:/gi, 'blocked:');
    css = css.replace(/-webkit-binding\s*:/gi, 'blocked:');
    
    // Scope all CSS to the container to prevent global style leaks
    const scopedCss = css.replace(/(^|})([^{]+)\{/g, (match, prefix, selector) => {
      const trimmedSelector = selector.trim();
      if (trimmedSelector.startsWith('@')) return match; // Keep at-rules intact
      if (trimmedSelector.startsWith(':root') || trimmedSelector === '*') {
        return `${prefix}.custom-code-container ${trimmedSelector} {`;
      }
      const scopedSelectors = trimmedSelector
        .split(',')
        .map((s: string) => `.custom-code-container ${s.trim()}`)
        .join(', ');
      return `${prefix}${scopedSelectors} {`;
    });
    
    return scopedCss;
  }, [block.css]);

  useEffect(() => {
    if (!containerRef.current || !sanitizedCss) return;

    const styleId = `custom-style-${block.id}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = sanitizedCss;

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [sanitizedCss, block.id]);

  const showHeader = title && title.trim() !== '';

  return (
    <Card className="overflow-hidden border-primary/20">
      {showHeader && (
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{title}</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              Premium
            </Badge>
          </div>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "p-4" : "p-0"}>
        <div
          ref={containerRef}
          className="custom-code-container"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </CardContent>
    </Card>
  );
});
