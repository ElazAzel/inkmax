import { Download, FileText } from 'lucide-react';
import type { DownloadBlock as DownloadBlockType } from '@/types/page';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DownloadBlockProps {
  block: DownloadBlockType;
}

export function DownloadBlock({ block }: DownloadBlockProps) {
  const handleDownload = () => {
    // In production, this would track download analytics
    window.open(block.fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1">{block.title}</h3>
          {block.description && (
            <p className="text-sm text-muted-foreground mb-2">{block.description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>{block.fileName}</span>
            {block.fileSize && (
              <>
                <span>•</span>
                <span>{block.fileSize}</span>
              </>
            )}
          </div>
          <Button onClick={handleDownload} size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Скачать файл
          </Button>
        </div>
      </div>
    </Card>
  );
}
