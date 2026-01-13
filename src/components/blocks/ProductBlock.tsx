import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, ExternalLink } from 'lucide-react';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import type { ProductBlock as ProductBlockType } from '@/types/page';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductBlockProps {
  block: ProductBlockType;
}

export const ProductBlock = memo(function ProductBlockComponent({ block }: ProductBlockProps) {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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

  const ProductDetailContent = () => (
    <div className="space-y-4">
      {/* Product Image - Large */}
      {block.image && (
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted">
          <img
            src={block.image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Product Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-foreground leading-tight">{name}</h3>
          <span className="text-xl font-bold text-primary whitespace-nowrap">
            {formatPrice(block.price)} {getCurrencySymbol(block.currency)}
          </span>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        )}
      </div>
      
      {/* Buy Button */}
      {block.buyLink && (
        <Button 
          onClick={handleBuy}
          className="w-full h-14 rounded-2xl text-base font-bold gap-2 shadow-lg shadow-primary/20"
        >
          <ShoppingCart className="h-5 w-5" />
          {t('actions.buy', 'Купить')}
          <ExternalLink className="h-4 w-4 ml-auto opacity-60" />
        </Button>
      )}
    </div>
  );

  // Compact mobile-optimized card layout
  const ProductCard = () => (
    <div 
      className={cn(
        "w-full rounded-xl overflow-hidden cursor-pointer",
        "bg-card border border-border",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "active:scale-[0.98]"
      )}
      style={{
        backgroundColor: block.blockStyle?.backgroundColor,
        backgroundImage: block.blockStyle?.backgroundGradient,
      }}
      onClick={() => setIsDetailOpen(true)}
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
          
          {/* Price and action hint */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-primary font-bold text-base whitespace-nowrap">
              {formatPrice(block.price)} {getCurrencySymbol(block.currency)}
            </span>
            
            <span className="text-xs text-muted-foreground">
              {t('actions.tapToView', 'Подробнее →')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ProductCard />
      
      {/* Product Detail Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="text-left pb-2 flex items-center justify-between">
              <DrawerTitle className="text-lg font-bold">{name}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-safe overflow-y-auto">
              <ProductDetailContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
            </DialogHeader>
            <ProductDetailContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});
