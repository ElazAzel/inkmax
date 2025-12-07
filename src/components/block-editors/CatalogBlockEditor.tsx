import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ImageIcon } from 'lucide-react';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { CurrencySelect } from '@/components/form-fields/CurrencySelect';
import { MediaUpload } from '@/components/form-fields/MediaUpload';
import type { CatalogBlock, CatalogItem, Currency } from '@/types/page';
import { createMultilingualString, isMultilingualString } from '@/lib/i18n-helpers';
import { cn } from '@/lib/utils';

interface CatalogBlockEditorProps {
  formData: Partial<CatalogBlock>;
  onChange: (data: Partial<CatalogBlock>) => void;
}

export function CatalogBlockEditor({ formData, onChange }: CatalogBlockEditorProps) {
  const { t, i18n } = useTranslation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const items = formData.items || [];

  const addItem = () => {
    const newItem: CatalogItem = {
      id: `item-${Date.now()}`,
      name: createMultilingualString(''),
      description: createMultilingualString(''),
      price: 0,
      currency: formData.currency || 'KZT',
      image: '',
    };
    onChange({ items: [...items, newItem] });
    setExpandedItem(newItem.id);
  };

  const updateItem = (itemId: string, updates: Partial<CatalogItem>) => {
    onChange({
      items: items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  const removeItem = (itemId: string) => {
    onChange({ items: items.filter(item => item.id !== itemId) });
    if (expandedItem === itemId) {
      setExpandedItem(null);
    }
  };

  const getItemName = (item: CatalogItem): string => {
    if (isMultilingualString(item.name)) {
      const lang = i18n.language as 'ru' | 'en' | 'kk';
      return item.name[lang] || item.name.ru || item.name.en || 'Без названия';
    }
    return item.name || 'Без названия';
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <MultilingualInput
        label={t('blocks.catalog.title', 'Заголовок каталога')}
        value={typeof formData.title === 'string' ? createMultilingualString(formData.title) : (formData.title || createMultilingualString(''))}
        onChange={(value) => onChange({ title: value })}
        placeholder={t('blocks.catalog.titlePlaceholder', 'Наше меню')}
      />

      {/* Layout */}
      <div className="space-y-2">
        <Label>{t('blocks.catalog.layout', 'Отображение')}</Label>
        <Select
          value={formData.layout || 'list'}
          onValueChange={(value: 'list' | 'grid') => onChange({ layout: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">{t('blocks.catalog.layoutList', 'Список')}</SelectItem>
            <SelectItem value="grid">{t('blocks.catalog.layoutGrid', 'Сетка')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show Prices */}
      <div className="flex items-center justify-between">
        <Label>{t('blocks.catalog.showPrices', 'Показывать цены')}</Label>
        <Switch
          checked={formData.showPrices !== false}
          onCheckedChange={(checked) => onChange({ showPrices: checked })}
        />
      </div>

      {/* Default Currency */}
      {formData.showPrices !== false && (
        <div className="space-y-2">
          <Label>{t('blocks.catalog.defaultCurrency', 'Валюта по умолчанию')}</Label>
          <CurrencySelect
            value={formData.currency || 'KZT'}
            onValueChange={(value) => onChange({ currency: value as Currency })}
          />
        </div>
      )}

      {/* Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t('blocks.catalog.items', 'Позиции каталога')}</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            {t('blocks.catalog.addItem', 'Добавить')}
          </Button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {items.map((item, index) => (
            <Card 
              key={item.id} 
              className={cn(
                'transition-all',
                expandedItem === item.id && 'ring-2 ring-primary'
              )}
            >
              <CardContent className="p-3">
                {/* Collapsed view */}
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt="" 
                      className="h-10 w-10 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {getItemName(item) || `Позиция ${index + 1}`}
                    </p>
                    {item.price !== undefined && item.price > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {item.price.toLocaleString()} {item.currency || formData.currency || 'KZT'}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                {/* Expanded view */}
                {expandedItem === item.id && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    {/* Image */}
                    <div className="space-y-2">
                      <Label>{t('blocks.catalog.itemImage', 'Фото')}</Label>
                      <MediaUpload
                        value={item.image || ''}
                        onChange={(url) => updateItem(item.id, { image: url })}
                        accept="image/*"
                      />
                    </div>

                    {/* Name */}
                    <MultilingualInput
                      label={t('blocks.catalog.itemName', 'Название')}
                      value={typeof item.name === 'string' ? createMultilingualString(item.name) : item.name}
                      onChange={(value) => updateItem(item.id, { name: value })}
                      placeholder={t('blocks.catalog.itemNamePlaceholder', 'Название позиции')}
                    />

                    {/* Description */}
                    <MultilingualInput
                      label={t('blocks.catalog.itemDescription', 'Описание')}
                      value={typeof item.description === 'string' ? createMultilingualString(item.description) : (item.description || createMultilingualString(''))}
                      onChange={(value) => updateItem(item.id, { description: value })}
                      placeholder={t('blocks.catalog.itemDescriptionPlaceholder', 'Описание позиции')}
                      type="textarea"
                    />

                    {/* Price */}
                    {formData.showPrices !== false && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>{t('blocks.catalog.itemPrice', 'Цена')}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={item.price || ''}
                            onChange={(e) => updateItem(item.id, { 
                              price: e.target.value ? parseFloat(e.target.value) : undefined 
                            })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('blocks.catalog.itemCurrency', 'Валюта')}</Label>
                          <CurrencySelect
                            value={item.currency || formData.currency || 'KZT'}
                            onValueChange={(value) => updateItem(item.id, { currency: value as Currency })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="text-sm">{t('blocks.catalog.emptyHint', 'Нажмите "Добавить" чтобы создать первую позицию')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
