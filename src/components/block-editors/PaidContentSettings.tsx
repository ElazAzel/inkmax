import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CurrencySelect } from '@/components/form-fields/CurrencySelect';
import { Lock, Construction } from 'lucide-react';
import type { BlockStyle, Currency } from '@/types/page';

interface PaidContentSettingsProps {
  blockStyle?: BlockStyle;
  onChange: (style: BlockStyle) => void;
}

export function PaidContentSettings({ blockStyle, onChange }: PaidContentSettingsProps) {
  const isPaidContent = blockStyle?.isPaidContent || false;
  const price = blockStyle?.paidContentPrice || 0;
  const currency = blockStyle?.paidContentCurrency || 'KZT';

  const handleToggle = (checked: boolean) => {
    onChange({
      ...blockStyle,
      isPaidContent: checked,
    });
  };

  const handlePriceChange = (value: string) => {
    onChange({
      ...blockStyle,
      paidContentPrice: parseFloat(value) || 0,
    });
  };

  const handleCurrencyChange = (value: Currency) => {
    onChange({
      ...blockStyle,
      paidContentCurrency: value,
    });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <Label className="text-base font-semibold">Платный контент</Label>
          <Badge variant="outline" className="gap-1 text-xs">
            <Construction className="h-3 w-3" />
            В разработке
          </Badge>
        </div>
        <Switch
          checked={isPaidContent}
          onCheckedChange={handleToggle}
          disabled
        />
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Construction className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Скоро вы сможете ограничить доступ к контенту блока и продавать его за деньги. 
          Посетители смогут разблокировать контент после оплаты.
        </AlertDescription>
      </Alert>

      {isPaidContent && (
        <div className="grid grid-cols-2 gap-3 opacity-50 pointer-events-none">
          <div>
            <Label>Цена</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="1000"
              min={0}
            />
          </div>
          <div>
            <Label>Валюта</Label>
            <CurrencySelect
              value={currency}
              onValueChange={handleCurrencyChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
