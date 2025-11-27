import { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { getButtonClass } from '@/lib/block-utils';
import type { ProductBlock as ProductBlockType } from '@/types/page';

interface ProductBlockProps {
  block: ProductBlockType;
  buttonStyle?: 'default' | 'rounded' | 'pill' | 'gradient';
}

export const ProductBlock = memo(function ProductBlockComponent({ block, buttonStyle }: ProductBlockProps) {
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {block.image && (
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={block.image}
            alt={block.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{block.name}</span>
          <span className="text-primary font-bold">
            {getCurrencySymbol(block.currency)}{block.price.toLocaleString()} {block.currency}
          </span>
        </CardTitle>
      </CardHeader>
      
      {block.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{block.description}</p>
        </CardContent>
      )}
      
      <CardFooter>
        <Button 
          className={`w-full gap-2 ${buttonStyle ? getButtonClass(buttonStyle) : ''}`}
          onClick={handleBuy}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
});
