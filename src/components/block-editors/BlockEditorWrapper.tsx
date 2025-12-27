import { ReactNode, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Info, Calendar as CalendarIcon, X, Maximize2, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, Palette } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AnimationSettings } from '@/components/editor/AnimationSettings';
import type { BlockStyle, BlockSizePreset } from '@/types/page';
import { BLOCK_SIZE_DIMENSIONS } from '@/types/page';

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

    const handleScheduleChange = (field: 'startDate' | 'endDate', value: string) => {
      const currentSchedule = formData.schedule || {};
      handleChange({
        ...formData,
        schedule: {
          ...currentSchedule,
          [field]: value || undefined,
        }
      });
    };

    const handleRemoveSchedule = () => {
      const { schedule, ...rest } = formData;
      handleChange(rest);
    };

    const handleBlockSizeChange = (size: BlockSizePreset) => {
      handleChange({
        ...formData,
        blockSize: size
      });
    };

    const handleContentAlignmentChange = (alignment: BlockStyle['contentAlignment']) => {
      handleChange({
        ...formData,
        blockStyle: {
          ...(formData.blockStyle || {}),
          contentAlignment: alignment
        }
      });
    };

    const handleTextColorChange = (color: string) => {
      handleChange({
        ...formData,
        blockStyle: {
          ...(formData.blockStyle || {}),
          textColor: color || undefined
        }
      });
    };

    const currentSize = formData.blockSize || 'full-medium';
    const sizeInfo = BLOCK_SIZE_DIMENSIONS[currentSize as BlockSizePreset];
    const currentContentAlignment = formData.blockStyle?.contentAlignment || 'center';
    const currentTextColor = formData.blockStyle?.textColor || '';

    const textColorPresets = [
      { color: '#FFFFFF', label: 'Белый' },
      { color: '#000000', label: 'Чёрный' },
      { color: '#F5F5F5', label: 'Светлый' },
      { color: '#1A1A1A', label: 'Тёмный' },
    ];

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
        
        {/* Block Size Selector */}
        <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-primary" />
            <Label className="text-base font-semibold">Размер блока</Label>
          </div>
          
          <Select value={currentSize} onValueChange={(v) => handleBlockSizeChange(v as BlockSizePreset)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BLOCK_SIZE_DIMENSIONS).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-4 h-3 rounded border",
                      info.gridCols === 1 ? "bg-primary/30" : "bg-primary/20"
                    )} />
                    {info.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {sizeInfo && (
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                {sizeInfo.gridCols === 1 
                  ? 'Блок занимает всю ширину строки' 
                  : 'Блок занимает половину ширины (2 блока в строке)'}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Content Alignment */}
        <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <AlignVerticalJustifyCenter className="h-4 w-4 text-primary" />
            <Label className="text-base font-semibold">Выравнивание контента</Label>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant={currentContentAlignment === 'top' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleContentAlignmentChange('top')}
              className="flex-1"
            >
              <AlignVerticalJustifyStart className="h-4 w-4 mr-1" />
              Верх
            </Button>
            <Button
              type="button"
              variant={currentContentAlignment === 'center' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleContentAlignmentChange('center')}
              className="flex-1"
            >
              <AlignVerticalJustifyCenter className="h-4 w-4 mr-1" />
              Центр
            </Button>
            <Button
              type="button"
              variant={currentContentAlignment === 'bottom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleContentAlignmentChange('bottom')}
              className="flex-1"
            >
              <AlignVerticalJustifyEnd className="h-4 w-4 mr-1" />
              Низ
            </Button>
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <Label className="text-base font-semibold">Цвет текста и элементов</Label>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {textColorPresets.map((preset) => (
              <button
                key={preset.color}
                type="button"
                onClick={() => handleTextColorChange(preset.color)}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 transition-all",
                  currentTextColor === preset.color 
                    ? "border-primary ring-2 ring-primary/30" 
                    : "border-border hover:border-primary/50"
                )}
                style={{ backgroundColor: preset.color }}
                title={preset.label}
              />
            ))}
            <div className="flex items-center gap-2 flex-1 min-w-[120px]">
              <Input
                type="color"
                value={currentTextColor || '#000000'}
                onChange={(e) => handleTextColorChange(e.target.value)}
                className="w-10 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={currentTextColor}
                onChange={(e) => handleTextColorChange(e.target.value)}
                placeholder="Любой цвет"
                className="flex-1"
              />
            </div>
          </div>

          {currentTextColor && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleTextColorChange('')}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Сбросить цвет
            </Button>
          )}

          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Цвет применяется ко всему тексту и элементам блока для видимости на любом фоне
            </AlertDescription>
          </Alert>
        </div>
        
        <Separator className="my-4" />
        
        <Component {...props} onChange={handleChange} />
        
        <Separator className="my-6" />
        
        <AnimationSettings
          style={formData.blockStyle}
          onChange={(style: BlockStyle) => handleChange({ ...formData, blockStyle: style })}
        />
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Расписание показа блока</Label>
            {formData.schedule && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveSchedule}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Очистить
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Дата и время появления</Label>
              <DateTimePicker
                value={formData.schedule?.startDate}
                onChange={(value) => handleScheduleChange('startDate', value)}
                placeholder="Выберите дату и время"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Дата и время исчезновения</Label>
              <DateTimePicker
                value={formData.schedule?.endDate}
                onChange={(value) => handleScheduleChange('endDate', value)}
                placeholder="Выберите дату и время"
              />
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Блок будет виден только в указанный период времени. Если даты не заданы, блок будет виден всегда.
            </AlertDescription>
          </Alert>
        </div>
      </BlockEditorWrapper>
    );
  };
}

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function DateTimePicker({ value, onChange, placeholder }: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
  const [time, setTime] = useState<string>(
    value ? format(new Date(value), 'HH:mm') : '00:00'
  );

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const [hours, minutes] = time.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onChange(newDate.toISOString());
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date) {
      const [hours, minutes] = newTime.split(':');
      const updatedDate = new Date(date);
      updatedDate.setHours(parseInt(hours), parseInt(minutes));
      onChange(updatedDate.toISOString());
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'flex-1 justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'dd.MM.yyyy') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={time}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="w-32"
      />
    </div>
  );
}
