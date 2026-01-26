/**
 * EmptyState - Consistent empty state component with optional CTA
 */
import { memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon | ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  className?: string;
}

export const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const { t } = useTranslation();

  // Check if icon is a React element or a LucideIcon component
  const renderIcon = () => {
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="h-10 w-10 text-muted-foreground/50" />;
    }
    return icon;
  };

  return (
    <div className={cn("text-center py-16 px-6", className)}>
      <div className="h-20 w-20 rounded-[28px] bg-muted/50 flex items-center justify-center mx-auto mb-5">
        {renderIcon()}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          size="lg"
          className="h-12 px-6 rounded-2xl font-bold"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
});
