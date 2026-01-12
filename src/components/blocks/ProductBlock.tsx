import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import type { ProductBlock as ProductBlockType } from '@/types/page';
import { cn } from '@/lib/utils';

interface ProductBlockProps {
  block: ProductBlockType;
}

export const ProductBlock = memo(function ProductBlockComponent({ block }: ProductBlockProps) {
  const { t, i18n } = useTranslation();
  const name = getTranslatedString(block.name, i18n.language as SupportedLanguage);
  const description = getTranslatedString(block.description, i18n.language as SupportedLanguage);
  
  const handleBuy = () => {
    if (block.buyLink) {
      window.open(block.buyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'KZT': '₸',
      'RUB': '₽',
      'BYN': 'Br',
      'AMD': '֏',
      'AZN': '₼',
      'KGS': 'с',
      'TJS': 'ЅМ',
      'TMT': 'm',
      'UZS': '',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CNY': '¥',
      'JPY': '¥',
      'CHF': '₣',
      'CAD': '$',
      'AUD': '$',
    };
    return symbols[currency] || currency;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  // Compact mobile-optimized layout
  return (
    <div 
      className={cn(
        "w-full rounded-xl overflow-hidden",
        "bg-card border border-border",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "active:scale-[0.99]"
      )}
      style={{
        backgroundColor: block.blockStyle?.backgroundColor,
        backgroundImage: block.blockStyle?.backgroundGradient,
      }}
    >
      <div className="flex gap-3 p-3">
        {/* Compact image */}
        {block.image && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
            <img
              src={block.image}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
              {name}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {description}
              </p>
            )}
          </div>
          
          {/* Price and button row */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-primary font-bold text-base whitespace-nowrap">
              {formatPrice(block.price)} {getCurrencySymbol(block.currency)}
            </span>
            
            {block.buyLink && (
              <Button 
                size="sm" 
                onClick={handleBuy}
                className="h-8 px-3 text-xs gap-1.5 rounded-full"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {t('actions.buy', 'Купить')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
