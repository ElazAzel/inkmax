import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar as CalendarIcon, X, Maximize2, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, ChevronDown, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AnimationSettings } from '@/components/editor/AnimationSettings';
import { PaidContentSettings } from './PaidContentSettings';
import { BlockEditorWrapper } from './BlockEditorWrapper';
import type { BlockStyle, BlockSizePreset } from '@/types/page';

export interface BaseBlockEditorProps<T extends Record<string, unknown> = Record<string, unknown>> {
  formData: T;
  onChange: (updates: T) => void;
}

interface BlockEditorOptions<T extends Record<string, unknown>> {
  isPremium?: boolean;
  description?: string;
  hint?: string;
  validate?: (formData: T) => string | null;
}

/**
 * HOC to wrap block editors with common functionality
 */
export function withBlockEditor<P extends BaseBlockEditorProps>(
  Component: React.ComponentType<P>,
  options?: BlockEditorOptions<P['formData']>
) {
  return function WrappedBlockEditor(props: P) {
    const { t } = useTranslation();
    const { formData, onChange } = props;
    const [advancedOpen, setAdvancedOpen] = useState(false);

    // Validation logic
    const validationError = options?.validate?.(formData);

    // Enhanced onChange with validation
    const handleChange = (updates: P['formData']) => {
      onChange(updates);
    };

    const handleScheduleChange = (field: 'startDate' | 'endDate', value: string) => {
      const currentSchedule = (formData as Record<string, unknown>).schedule || {};
      handleChange({
        ...formData,
        schedule: {
          ...(currentSchedule as Record<string, unknown>),
          [field]: value || undefined,
        }
      } as P['formData']);
    };

    const handleRemoveSchedule = () => {
      const { schedule, ...rest } = formData as Record<string, unknown>;
      handleChange(rest as P['formData']);
    };

    const handleBlockSizeChange = (size: BlockSizePreset) => {
      handleChange({
        ...formData,
        blockSize: size
      } as P['formData']);
    };

    const handleContentAlignmentChange = (alignment: BlockStyle['contentAlignment']) => {
      handleChange({
        ...formData,
        blockStyle: {
          ...(((formData as Record<string, unknown>).blockStyle as Record<string, unknown>) || {}),
          contentAlignment: alignment
        }
      } as P['formData']);
    };

    const currentSize = (formData as Record<string, unknown>).blockSize || 'full';
    const currentContentAlignment = ((formData as Record<string, unknown>).blockStyle as BlockStyle | undefined)?.contentAlignment || 'center';

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
        
        {/* Main block content editor */}
        <Component {...props} onChange={handleChange} />
        
        <Separator className="my-4" />
        
        {/* Collapsible Advanced Settings */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <span className="font-semibold">{t('blockEditor.advancedSettings', 'Дополнительные настройки')}</span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                advancedOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Block Size Selector */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-primary" />
                <Label className="text-base font-semibold">{t('blockEditor.blockSize', 'Размер блока')}</Label>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={currentSize === 'full' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleBlockSizeChange('full')}
                  className="flex-1"
                >
                  <span className="w-5 h-3 rounded border bg-primary/30 mr-2" />
                  {t('blockEditor.sizeFull', 'Полная')}
                </Button>
                <Button
                  type="button"
                  variant={currentSize === 'half' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleBlockSizeChange('half')}
                  className="flex-1"
                >
                  <span className="w-3 h-3 rounded border bg-primary/20 mr-2" />
                  {t('blockEditor.sizeHalf', 'Половина')}
                </Button>
              </div>
            </div>

            {/* Content Alignment - simplified to buttons */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2">
                <AlignVerticalJustifyCenter className="h-4 w-4 text-primary" />
                <Label className="text-base font-semibold">{t('blockEditor.alignment', 'Выравнивание')}</Label>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={currentContentAlignment === 'top' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleContentAlignmentChange('top')}
                  className="flex-1 h-10"
                >
                  <AlignVerticalJustifyStart className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={currentContentAlignment === 'center' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleContentAlignmentChange('center')}
                  className="flex-1 h-10"
                >
                  <AlignVerticalJustifyCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={currentContentAlignment === 'bottom' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleContentAlignmentChange('bottom')}
                  className="flex-1 h-10"
                >
                  <AlignVerticalJustifyEnd className="h-4 w-4" />
                </Button>
              </div>
            </div>
        
            {/* Paid Content Settings */}
            <PaidContentSettings
              blockStyle={(formData as Record<string, unknown>).blockStyle as BlockStyle | undefined}
              onChange={(style: BlockStyle) => handleChange({ ...formData, blockStyle: style } as P['formData'])}
            />
        
            {/* Animation Settings */}
            <AnimationSettings
              style={(formData as Record<string, unknown>).blockStyle as BlockStyle | undefined}
              onChange={(style: BlockStyle) => handleChange({ ...formData, blockStyle: style } as P['formData'])}
            />
        
            <Separator className="my-4" />
        
            {/* Schedule Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">{t('blockEditor.schedule', 'Расписание показа')}</Label>
                {(formData as Record<string, unknown>).schedule && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveSchedule}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t('blockEditor.clearSchedule', 'Очистить')}
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">{t('blockEditor.appearDate', 'Появление')}</Label>
                  <DateTimePicker
                    value={((formData as Record<string, unknown>).schedule as { startDate?: string } | undefined)?.startDate}
                    onChange={(value) => handleScheduleChange('startDate', value)}
                    placeholder={t('blockEditor.selectDate', 'Выберите дату')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">{t('blockEditor.disappearDate', 'Исчезновение')}</Label>
                  <DateTimePicker
                    value={((formData as Record<string, unknown>).schedule as { endDate?: string } | undefined)?.endDate}
                    onChange={(value) => handleScheduleChange('endDate', value)}
                    placeholder={t('blockEditor.selectDate', 'Выберите дату')}
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {t('blockEditor.scheduleHint', 'Блок будет виден только в указанный период')}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
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
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      onChange(newDate.toISOString());
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date) {
      const [hours, minutes] = newTime.split(':');
      const updatedDate = new Date(date);
      updatedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
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
              'flex-1 justify-start text-left font-normal h-10',
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
        className="w-24"
      />
    </div>
  );
}
