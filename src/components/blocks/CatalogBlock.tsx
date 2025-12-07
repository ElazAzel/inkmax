import React from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogBlock as CatalogBlockType } from '@/types/page';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslatedString } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';

interface CatalogBlockProps {
  block: CatalogBlockType;
}

const currencySymbols: Record<string, string> = {
  KZT: '₸',
  RUB: '₽',
  USD: '$',
  EUR: '€',
  GBP: '£',
  BYN: 'Br',
  AMD: '֏',
  AZN: '₼',
  KGS: 'с',
  TJS: 'SM',
  TMT: 'm',
  UZS: 'сўм',
  CNY: '¥',
  JPY: '¥',
  CHF: 'CHF',
  CAD: 'C$',
  AUD: 'A$',
};

export const CatalogBlock = React.memo(function CatalogBlock({ block }: CatalogBlockProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'ru' | 'en' | 'kk';

  const title = block.title ? getTranslatedString(block.title, currentLang) : '';
  const isGrid = block.layout === 'grid';

  const formatPrice = (price: number, currency: string = 'KZT') => {
    const symbol = currencySymbols[currency] || currency;
    return `${price.toLocaleString()} ${symbol}`;
  };

  if (!block.items || block.items.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Каталог пуст
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {title && (
        <h3 className="text-xl font-semibold text-center">{title}</h3>
      )}
      
      <div className={cn(
        isGrid 
          ? 'grid grid-cols-2 gap-3' 
          : 'flex flex-col gap-3'
      )}>
        {block.items.map((item) => {
          const itemName = getTranslatedString(item.name, currentLang);
          const itemDescription = item.description 
            ? getTranslatedString(item.description, currentLang) 
            : '';

          return (
            <Card key={item.id} className="overflow-hidden">
              {item.image && (
                <div className={cn(
                  'overflow-hidden',
                  isGrid ? 'aspect-square' : 'aspect-video'
                )}>
                  <img
                    src={item.image}
                    alt={itemName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <CardContent className={cn('p-3', isGrid && 'p-2')}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      'font-medium truncate',
                      isGrid ? 'text-sm' : 'text-base'
                    )}>
                      {itemName}
                    </h4>
                    {itemDescription && (
                      <p className={cn(
                        'text-muted-foreground mt-1',
                        isGrid ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
                      )}>
                        {itemDescription}
                      </p>
                    )}
                  </div>
                  {block.showPrices !== false && item.price !== undefined && item.price > 0 && (
                    <span className={cn(
                      'font-semibold text-primary whitespace-nowrap',
                      isGrid ? 'text-sm' : 'text-base'
                    )}>
                      {formatPrice(item.price, item.currency || block.currency || 'KZT')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
});
