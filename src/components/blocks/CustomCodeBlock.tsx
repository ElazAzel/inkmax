import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Maximize2, Minimize2 } from 'lucide-react';
import type { CustomCodeBlock as CustomCodeBlockType } from '@/types/page';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import { Button } from '@/components/ui/button';

interface CustomCodeBlockProps {
  block: CustomCodeBlockType;
}

const HEIGHT_MAP = {
  auto: 'auto',
  small: '200px',
  medium: '400px',
  large: '600px',
  full: '100vh',
};

export const CustomCodeBlock = memo(function CustomCodeBlockComponent({ block }: CustomCodeBlockProps) {
  const { i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<string>(HEIGHT_MAP[block.height || 'medium']);
  
  const title = getTranslatedString(block.title, i18n.language as SupportedLanguage);

  // Build complete HTML document for iframe
  const iframeContent = useMemo(() => {
    const html = block.html || '';
    const css = block.css || '';
    const js = block.javascript || '';
    const blockId = JSON.stringify(block.id);
    
    // Extract content from full HTML document if provided
    let bodyContent = html;
    let headContent = '';
    
    // Check if it's a full HTML document
    const hasDoctype = html.toLowerCase().includes('<!doctype');
    const hasHtmlTag = html.toLowerCase().includes('<html');
    
    if (hasDoctype || hasHtmlTag) {
      // Extract head content (styles, meta tags)
      const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        headContent = headMatch[1];
      }
      
      // Extract body content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        bodyContent = bodyMatch[1];
      }
      
      // Extract inline scripts from the original HTML
      const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
      if (scriptMatches) {
        const inlineScripts = scriptMatches
          .map(script => {
            const srcMatch = script.match(/src=["']([^"']+)["']/);
            if (srcMatch) {
              // External script - keep as is
              return script;
            }
            // Inline script - extract content
            const contentMatch = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            return contentMatch ? contentMatch[1] : '';
          })
          .filter(Boolean);
        
        // Add extracted scripts to js
        if (inlineScripts.length > 0 && !js) {
          bodyContent += `<script>${inlineScripts.join('\n')}</script>`;
        }
      }
    }
    
    // Build the complete document
    const resizeScript = `
  <script>
    (function () {
      const blockId = ${blockId};
      const sendHeight = () => {
        const height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        window.parent?.postMessage({ type: 'custom-code-height', blockId, height }, '*');
      };
      window.addEventListener('load', sendHeight);
      window.addEventListener('resize', sendHeight);
      const observer = new MutationObserver(sendHeight);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      setTimeout(sendHeight, 0);
    })();
  </script>`;

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-x: hidden;
    }
    ${css}
  </style>
  ${headContent}
</head>
<body>
  ${bodyContent}
  ${js ? `<script>${js}</script>` : ''}
  ${resizeScript}
</body>
</html>`;
  }, [block.html, block.css, block.javascript, block.id]);

  // Create blob URL for iframe
  const iframeSrc = useMemo(() => {
    const blob = new Blob([iframeContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [iframeContent]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(iframeSrc);
    };
  }, [iframeSrc]);

  // Auto-height calculation for 'auto' mode
  useEffect(() => {
    if (block.height !== 'auto') {
      setIframeHeight(HEIGHT_MAP[block.height || 'medium']);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; blockId?: string; height?: number };
      if (data?.type !== 'custom-code-height' || data.blockId !== block.id) return;
      if (typeof data.height !== 'number') return;
      const clampedHeight = Math.min(Math.max(data.height, 100), 800);
      setIframeHeight(`${clampedHeight}px`);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [block.height, block.id]);

  const showHeader = title && title.trim() !== '';
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerClass = isFullscreen 
    ? 'fixed inset-0 z-50 bg-background p-4 overflow-auto'
    : '';

  return (
    <div className={containerClass}>
      <Card className="overflow-hidden border-primary/20">
        {showHeader && (
          <CardHeader className="bg-primary/5 py-2 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className="p-0">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title={title || 'Custom Content'}
            className="w-full border-0"
            style={{ 
              height: isFullscreen ? 'calc(100vh - 120px)' : iframeHeight,
              minHeight: '100px'
            }}
            sandbox={
              block.enableInteraction !== false
                ? 'allow-scripts allow-forms allow-popups allow-modals'
                : 'allow-same-origin'
            }
            loading="lazy"
          />
        </CardContent>
      </Card>
      
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="gap-2"
          >
            <Minimize2 className="h-4 w-4" />
            Свернуть
          </Button>
        </div>
      )}
    </div>
  );
});
