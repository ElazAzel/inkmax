import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Crown, Info } from 'lucide-react';

interface BlockEditorWrapperProps {
  children: ReactNode;
  isPremium?: boolean;
  description?: string;
  hint?: string;
}

/**
 * Wrapper component for block editors
 * Provides consistent styling, premium badges, and helpful hints
 */
export function BlockEditorWrapper({
  children,
  isPremium = false,
  description,
  hint,
}: BlockEditorWrapperProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {isPremium && (
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
              <span>{description || t('blockEditor.premiumFeature', 'This is a Premium feature.')}</span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hint && !isPremium && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">{hint}</AlertDescription>
        </Alert>
      )}

      {children}
    </div>
  );
}
