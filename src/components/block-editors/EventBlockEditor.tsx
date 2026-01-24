import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrayFieldList } from '@/components/form-fields/ArrayFieldList';
import { ArrayFieldItem } from '@/components/form-fields/ArrayFieldItem';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { CurrencySelect } from '@/components/form-fields/CurrencySelect';
import { createMultilingualString } from '@/lib/i18n-helpers';
import { validateEventBlock } from '@/lib/block-validators';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorHOC';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import type { EventFieldType, EventFormField } from '@/types/page';

const toLocalInputValue = (value?: string) => {
  if (!value) return '';
  try {
    return new Date(value).toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

const fromLocalInputValue = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toISOString();
};

const createField = (): EventFormField => ({
  id: crypto.randomUUID ? crypto.randomUUID() : `field-${Date.now()}`,
  type: 'short_text',
  label_i18n: createMultilingualString(''),
  placeholder_i18n: createMultilingualString(''),
  helpText_i18n: createMultilingualString(''),
  required: false,
  options: [],
});

function EventBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const { t } = useTranslation();
  const { isPremium } = usePremiumStatus();
  const fields = formData.formFields || [];

  const typeOptions = useMemo(
    () => [
      { value: 'short_text', label: t('eventFields.shortText', 'Короткий текст') },
      { value: 'long_text', label: t('eventFields.longText', 'Длинный текст') },
      { value: 'email', label: t('eventFields.email', 'Email') },
      { value: 'phone', label: t('eventFields.phone', 'Телефон') },
      { value: 'number', label: t('eventFields.number', 'Число') },
      { value: 'dropdown', label: t('eventFields.dropdown', 'Выпадающий список') },
      { value: 'single_choice', label: t('eventFields.singleChoice', 'Один вариант') },
      { value: 'multiple_choice', label: t('eventFields.multipleChoice', 'Несколько вариантов') },
      { value: 'date', label: t('eventFields.date', 'Дата') },
      { value: 'checkbox', label: t('eventFields.checkbox', 'Чекбокс согласия') },
      { value: 'url', label: t('eventFields.url', 'Ссылка (URL)') },
      { value: 'media', label: t('eventFields.media', 'Медиа-секция (Pro)'), proOnly: true },
      { value: 'file', label: t('eventFields.file', 'Файл (Pro)'), proOnly: true },
    ],
    [t]
  );

  const addField = () => {
    onChange({
      ...formData,
      formFields: [...fields, createField()],
    });
  };

  const updateField = (index: number, updates: Partial<EventFormField>) => {
    const updated = [...fields];
    const next = { ...updated[index], ...updates };
    if (next.type === 'email') {
      next.required = true;
    }
    updated[index] = next;
    onChange({ ...formData, formFields: updated });
  };

  const removeField = (index: number) => {
    onChange({
      ...formData,
      formFields: fields.filter((_: EventFormField, i: number) => i !== index),
    });
  };

  const addOption = (index: number) => {
    const updated = [...fields];
    const options = updated[index].options || [];
    options.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `option-${Date.now()}`,
      label_i18n: createMultilingualString(''),
    });
    updated[index] = { ...updated[index], options };
    onChange({ ...formData, formFields: updated });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: EventFormField['options'][0]) => {
    const updated = [...fields];
    const options = [...(updated[fieldIndex].options || [])];
    options[optionIndex] = value;
    updated[fieldIndex] = { ...updated[fieldIndex], options };
    onChange({ ...formData, formFields: updated });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updated = [...fields];
    const options = [...(updated[fieldIndex].options || [])];
    updated[fieldIndex] = {
      ...updated[fieldIndex],
      options: options.filter((_, i) => i !== optionIndex),
    };
    onChange({ ...formData, formFields: updated });
  };

  return (
    <div className="space-y-5">
      <Alert>
        <AlertDescription>
          {t('eventBuilder.emailRequired', 'Email поле всегда добавляется автоматически и является обязательным.')}
        </AlertDescription>
      </Alert>

      <MultilingualInput
        label={t('eventBuilder.title', 'Название события')}
        value={formData.title || createMultilingualString('')}
        onChange={(value) => onChange({ ...formData, title: value })}
        placeholder={t('eventBuilder.titlePlaceholder', 'Введите название')}
      />

      <MultilingualInput
        label={t('eventBuilder.description', 'Описание')}
        value={formData.description || createMultilingualString('')}
        onChange={(value) => onChange({ ...formData, description: value })}
        placeholder={t('eventBuilder.descriptionPlaceholder', 'Кратко опишите ивент')}
      />

      <div>
        <Label>{t('eventBuilder.coverUrl', 'Обложка (URL)')}</Label>
        <Input
          value={formData.coverUrl || ''}
          onChange={(e) => onChange({ ...formData, coverUrl: e.target.value })}
          placeholder="https://"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t('eventBuilder.startAt', 'Начало')}</Label>
          <Input
            type="datetime-local"
            value={toLocalInputValue(formData.startAt)}
            onChange={(e) => onChange({ ...formData, startAt: fromLocalInputValue(e.target.value) })}
          />
        </div>
        <div>
          <Label>{t('eventBuilder.endAt', 'Окончание')}</Label>
          <Input
            type="datetime-local"
            value={toLocalInputValue(formData.endAt)}
            onChange={(e) => onChange({ ...formData, endAt: fromLocalInputValue(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label>{t('eventBuilder.registrationClosesAt', 'Закрытие регистрации')}</Label>
        <Input
          type="datetime-local"
          value={toLocalInputValue(formData.registrationClosesAt)}
          onChange={(e) => onChange({ ...formData, registrationClosesAt: fromLocalInputValue(e.target.value) })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t('eventBuilder.locationType', 'Тип локации')}</Label>
          <Select
            value={formData.locationType || 'online'}
            onValueChange={(value) => onChange({ ...formData, locationType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">{t('eventBuilder.locationOnline', 'Онлайн')}</SelectItem>
              <SelectItem value="offline">{t('eventBuilder.locationOffline', 'Офлайн')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t('eventBuilder.locationValue', 'Адрес или ссылка')}</Label>
          <Input
            value={formData.locationValue || ''}
            onChange={(e) => onChange({ ...formData, locationValue: e.target.value })}
            placeholder="https://"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t('eventBuilder.capacity', 'Вместимость')}</Label>
          <Input
            type="number"
            min={1}
            value={formData.capacity ?? ''}
            onChange={(e) => onChange({ ...formData, capacity: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>{t('eventBuilder.status', 'Статус')}</Label>
          <Select
            value={formData.status || 'draft'}
            onValueChange={(value) => onChange({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t('eventBuilder.statusDraft', 'Черновик')}</SelectItem>
              <SelectItem value="published">{t('eventBuilder.statusPublished', 'Опубликован')}</SelectItem>
              <SelectItem value="closed">{t('eventBuilder.statusClosed', 'Закрыт')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border/60 p-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={Boolean(formData.isPaid)}
            onCheckedChange={(checked) => {
              if (!isPremium) return;
              onChange({ ...formData, isPaid: Boolean(checked) });
            }}
            disabled={!isPremium}
          />
          <Label className="text-sm">
            {t('eventBuilder.paidEvent', 'Платный ивент (Pro)')}
          </Label>
        </div>
        {!isPremium && (
          <p className="text-xs text-muted-foreground">
            {t('eventBuilder.paidEventProOnly', 'Оплаты доступны только в Pro.')}
          </p>
        )}
        {Boolean(formData.isPaid) && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('eventBuilder.price', 'Цена')}</Label>
              <Input
                type="number"
                min={0}
                value={formData.price ?? ''}
                onChange={(e) => onChange({ ...formData, price: Number(e.target.value) })}
                disabled={!isPremium}
              />
            </div>
            <div>
              <Label>{t('eventBuilder.currency', 'Валюта')}</Label>
              {isPremium ? (
                <CurrencySelect
                  value={formData.currency || 'KZT'}
                  onValueChange={(value) => onChange({ ...formData, currency: value })}
                />
              ) : (
                <Input value={formData.currency || 'KZT'} disabled />
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>{t('eventBuilder.shortNote', 'Короткая заметка')}</Label>
        <Textarea
          value={formData.settings?.note || ''}
          onChange={(e) =>
            onChange({
              ...formData,
              settings: { ...(formData.settings || {}), note: e.target.value },
            })
          }
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={Boolean(formData.settings?.requireApproval)}
            onCheckedChange={(checked) =>
              onChange({
                ...formData,
                settings: { ...(formData.settings || {}), requireApproval: Boolean(checked) },
              })
            }
          />
          {t('eventBuilder.requireApproval', 'Требовать подтверждение')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={Boolean(formData.settings?.allowDuplicateEmail)}
            onCheckedChange={(checked) =>
              onChange({
                ...formData,
                settings: { ...(formData.settings || {}), allowDuplicateEmail: Boolean(checked) },
              })
            }
          />
          {t('eventBuilder.allowDuplicateEmail', 'Разрешить повторные email')}
        </label>
      </div>

      <ArrayFieldList label={t('eventBuilder.formFields', 'Поля формы')} items={fields} onAdd={addField}>
        {fields.map((field: EventFormField, index: number) => {
          const fieldTypeConfig = typeOptions.find((option) => option.value === field.type);
          const isProField = Boolean(fieldTypeConfig?.proOnly);
          const showOptions = ['dropdown', 'single_choice', 'multiple_choice'].includes(field.type);

          return (
            <ArrayFieldItem
              key={field.id}
              index={index}
              label={t('eventBuilder.field', 'Поле')}
              onRemove={() => removeField(index)}
            >
              <MultilingualInput
                label={t('eventBuilder.fieldLabel', 'Название поля')}
                value={field.label_i18n || createMultilingualString('')}
                onChange={(value) => updateField(index, { label_i18n: value })}
                placeholder={t('eventBuilder.fieldLabelPlaceholder', 'Введите название')}
              />

              <MultilingualInput
                label={`${t('eventBuilder.fieldPlaceholder', 'Placeholder')} (${t('fields.optional', 'optional')})`}
                value={field.placeholder_i18n || createMultilingualString('')}
                onChange={(value) => updateField(index, { placeholder_i18n: value })}
                placeholder={t('eventBuilder.fieldPlaceholderPlaceholder', 'Пример: Ваш ответ')}
              />

              <MultilingualInput
                label={`${t('eventBuilder.fieldHelp', 'Подсказка')} (${t('fields.optional', 'optional')})`}
                value={field.helpText_i18n || createMultilingualString('')}
                onChange={(value) => updateField(index, { helpText_i18n: value })}
                placeholder={t('eventBuilder.fieldHelpPlaceholder', 'Дополнительная информация')}
              />

              <div>
                <Label className="text-xs">{t('eventBuilder.fieldType', 'Тип поля')}</Label>
                <Select
                  value={field.type}
                  onValueChange={(value: EventFieldType) => {
                    if (!isPremium && typeOptions.find((option) => option.value === value)?.proOnly) {
                      return;
                    }
                    updateField(index, { type: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={Boolean(option.proOnly) && !isPremium}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isProField && !isPremium && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('eventBuilder.proOnlyField', 'Это поле доступно только в Pro.')}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`required-${field.id}`}
                  checked={field.required || field.type === 'email'}
                  onCheckedChange={(checked) =>
                    updateField(index, { required: Boolean(checked) || field.type === 'email' })
                  }
                  disabled={field.type === 'email'}
                />
                <Label htmlFor={`required-${field.id}`} className="cursor-pointer text-xs">
                  {t('eventBuilder.requiredField', 'Обязательное поле')}
                </Label>
              </div>

              {showOptions && (
                <ArrayFieldList
                  label={t('eventBuilder.options', 'Варианты')}
                  items={field.options || []}
                  onAdd={() => addOption(index)}
                >
                  {(field.options || []).map((option, optionIndex) => (
                    <ArrayFieldItem
                      key={option.id}
                      index={optionIndex}
                      label={t('eventBuilder.option', 'Вариант')}
                      onRemove={() => removeOption(index, optionIndex)}
                    >
                      <MultilingualInput
                        label={t('eventBuilder.optionLabel', 'Текст варианта')}
                        value={option.label_i18n || createMultilingualString('')}
                        onChange={(value) =>
                          updateOption(index, optionIndex, { ...option, label_i18n: value })
                        }
                        placeholder={t('eventBuilder.optionLabelPlaceholder', 'Введите текст')}
                      />
                    </ArrayFieldItem>
                  ))}
                </ArrayFieldList>
              )}
            </ArrayFieldItem>
          );
        })}
      </ArrayFieldList>
    </div>
  );
}

export const EventBlockEditor = withBlockEditor(EventBlockEditorComponent, {
  hint: 'Создайте событие с формой регистрации и параметрами.',
  validate: validateEventBlock,
});
