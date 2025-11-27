import { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Crown, Info } from 'lucide-react';

export interface BaseBlockEditorProps {
  formData: any;
  onChange: (updates: any) => void;
}

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
              <span>{description || 'This is a Premium feature.'}</span>
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

/**
 * HOC to wrap block editors with common functionality
 */
export function withBlockEditor<P extends BaseBlockEditorProps>(
  Component: React.ComponentType<P>,
  options?: {
    isPremium?: boolean;
    description?: string;
    hint?: string;
    validate?: (formData: any) => string | null;
  }
) {
  return function WrappedBlockEditor(props: P) {
    const { formData, onChange } = props;
    
    // Validation logic
    const validationError = options?.validate?.(formData);
    
    // Enhanced onChange with validation
    const handleChange = (updates: any) => {
      onChange(updates);
    };

    return (
      <BlockEditorWrapper
        isPremium={options?.isPremium}
        description={options?.description}
        hint={options?.hint}
      >
        {validationError && (
          <Alert variant="destructive">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        <Component {...props} onChange={handleChange} />
      </BlockEditorWrapper>
    );
  };
}
