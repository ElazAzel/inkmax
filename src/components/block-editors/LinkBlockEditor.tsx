/**
 * LinkBlockEditor - Enhanced with EditorSection structure
 * Organized into logical sections: Content, Appearance, Icon Settings
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { migrateToMultilingual } from '@/lib/i18n-helpers';
import { AIButton } from '@/components/form-fields/AIButton';
import { MediaUpload } from '@/components/form-fields/MediaUpload';
import { generateMagicTitle } from '@/lib/ai-helpers';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { EditorSection, EditorField, EditorDivider } from './EditorSection';
import { validateLinkBlock } from '@/lib/block-validators';
import { getBestFaviconUrl } from '@/lib/favicon-utils';
import {
  Link2,
  RefreshCw,
  Type,
  Palette,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Alignment button component
function AlignmentButton({
  value,
  current,
  icon,
  label,
  onClick
}: {
  value: string;
  current: string;
  icon: React.ReactNode;
  label: string;
  onClick: (value: string) => void;
}) {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all",
        "hover:bg-muted/50 active:scale-95",
        isActive && "bg-primary/10 ring-2 ring-primary/20"
      )}
    >
      <div className={cn(
        "transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs font-medium transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </button>
  );
}

function LinkBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const { t } = useTranslation();
  const [aiLoading, setAiLoading] = useState(false);
  const [faviconLoading, setFaviconLoading] = useState(false);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const iconMode = formData.iconMode || 'auto';

  // Count filled fields for progress indicator
  const contentFilled = [
    formData.url,
    formData.title?.ru || formData.title?.en,
  ].filter(Boolean).length;

  // Auto-fetch favicon when URL changes and in auto mode
  const fetchFavicon = useCallback(async (url: string) => {
    if (!url) {
      setFaviconPreview(null);
      return;
    }

    setFaviconLoading(true);
    try {
      const faviconUrl = await getBestFaviconUrl(url);
      setFaviconPreview(faviconUrl);

      if (faviconUrl && iconMode === 'auto') {
        onChange({ ...formData, faviconUrl });
      }
    } catch {
      setFaviconPreview(null);
    } finally {
      setFaviconLoading(false);
    }
  }, [iconMode, formData, onChange]);

  // Fetch favicon when URL changes (only in auto mode)
  useEffect(() => {
    if (iconMode === 'auto' && formData.url) {
      if (formData.faviconUrl) {
        setFaviconPreview(formData.faviconUrl);
      } else {
        fetchFavicon(formData.url);
      }
    } else if (iconMode === 'manual') {
      setFaviconPreview(formData.customIconUrl || null);
    }
  }, [formData.url, iconMode, formData.faviconUrl, formData.customIconUrl, fetchFavicon]);

  const handleRefreshFavicon = async () => {
    if (formData.url) {
      onChange({ ...formData, faviconUrl: undefined });
      await fetchFavicon(formData.url);
    }
  };

  const handleGenerateTitle = async () => {
    if (!formData.url) return;

    setAiLoading(true);
    try {
      const title = await generateMagicTitle(formData.url);
      onChange({ ...formData, title: { ru: title, en: '', kk: '' } });
    } finally {
      setAiLoading(false);
    }
  };

  const handleIconModeChange = (mode: string) => {
    onChange({
      ...formData,
      iconMode: mode as 'auto' | 'manual',
      ...(mode === 'auto' ? { customIconUrl: undefined } : { faviconUrl: undefined })
    });
  };

  return (
    <div className="space-y-4">
      {/* Content Section */}
      <EditorSection
        title={t('editor.sections.content', 'Контент')}
        icon={<Type className="h-5 w-5 text-primary" />}
        collapsible={false}
        filledCount={contentFilled}
        totalCount={2}
      >
        <EditorField label={t('fields.url', 'URL')} required>
          <Input
            type="url"
            value={formData.url || ''}
            onChange={(e) => onChange({ ...formData, url: e.target.value })}
            placeholder="https://example.com"
            className="h-12 rounded-xl"
          />
        </EditorField>

        <EditorField
          label={t('fields.title', 'Заголовок')}
          required
          hint={t('fields.titleHint', 'Текст, который будет отображаться на кнопке')}
        >
          <div className="space-y-2">
            <div className="flex justify-end">
              <AIButton
                onClick={handleGenerateTitle}
                loading={aiLoading}
                disabled={!formData.url}
                title={t('ai.generateWithAI', 'Сгенерировать с AI')}
                variant="icon"
              />
            </div>
            <MultilingualInput
              label=""
              value={migrateToMultilingual(formData.title)}
              onChange={(value) => onChange({ ...formData, title: value })}
              required
            />
          </div>
        </EditorField>
      </EditorSection>

      {/* Icon Settings Section */}
      <EditorSection
        title={t('editor.sections.icon', 'Иконка')}
        icon={<ImageIcon className="h-5 w-5 text-primary" />}
        description={t('editor.sections.iconDesc', 'Настройте иконку ссылки')}
        defaultOpen={false}
      >
        {/* Icon Preview */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
          {faviconLoading ? (
            <div className="h-10 w-10 rounded-xl border border-border bg-muted animate-pulse" />
          ) : faviconPreview ? (
            <img
              src={faviconPreview}
              alt="Favicon"
              className="h-10 w-10 rounded-xl border border-border object-contain bg-white"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl border border-border bg-muted flex items-center justify-center">
              <Link2 className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{t('fields.iconPreview', 'Превью иконки')}</p>
            <p className="text-xs text-muted-foreground truncate">
              {formData.url ? new URL(formData.url).hostname : t('fields.noUrl', 'Введите URL')}
            </p>
          </div>
        </div>

        <EditorField label={t('fields.iconMode', 'Источник иконки')}>
          <Select value={iconMode} onValueChange={handleIconModeChange}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{t('fields.iconAuto', '🌐 Авто (favicon сайта)')}</SelectItem>
              <SelectItem value="manual">{t('fields.iconManual', '🖼️ Загрузить свою')}</SelectItem>
            </SelectContent>
          </Select>
        </EditorField>

        {iconMode === 'auto' && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefreshFavicon}
            disabled={!formData.url || faviconLoading}
            className="w-full h-10 rounded-xl"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", faviconLoading && "animate-spin")} />
            {t('fields.refreshIcon', 'Обновить иконку')}
          </Button>
        )}

        {iconMode === 'manual' && (
          <MediaUpload
            label={t('fields.customIcon', 'Своя иконка')}
            value={formData.customIconUrl || ''}
            onChange={(value) => onChange({ ...formData, customIconUrl: value })}
            accept="image/*"
          />
        )}
      </EditorSection>

      {/* Appearance Section */}
      <EditorSection
        title={t('editor.sections.appearance', 'Внешний вид')}
        icon={<Palette className="h-5 w-5 text-primary" />}
        defaultOpen={false}
      >
        <EditorField label={t('fields.alignment', 'Выравнивание')}>
          <div className="flex gap-2 p-1 bg-muted/30 rounded-xl">
            <AlignmentButton
              value="left"
              current={formData.alignment || 'center'}
              icon={<AlignLeft className="h-5 w-5" />}
              label={t('fields.left', 'Лево')}
              onClick={(v) => onChange({ ...formData, alignment: v })}
            />
            <AlignmentButton
              value="center"
              current={formData.alignment || 'center'}
              icon={<AlignCenter className="h-5 w-5" />}
              label={t('fields.center', 'Центр')}
              onClick={(v) => onChange({ ...formData, alignment: v })}
            />
            <AlignmentButton
              value="right"
              current={formData.alignment || 'center'}
              icon={<AlignRight className="h-5 w-5" />}
              label={t('fields.right', 'Право')}
              onClick={(v) => onChange({ ...formData, alignment: v })}
            />
          </div>
        </EditorField>

        <EditorField label={t('fields.style', 'Стиль кнопки')}>
          <Select
            value={formData.style || 'default'}
            onValueChange={(value) => onChange({ ...formData, style: value })}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t('styles.default', 'Стандартный')}</SelectItem>
              <SelectItem value="rounded">{t('styles.rounded', 'Скруглённый')}</SelectItem>
              <SelectItem value="pill">{t('styles.pill', 'Капсула')}</SelectItem>
            </SelectContent>
          </Select>
        </EditorField>

        <EditorDivider />

        <EditorField label={t('fields.backgroundType', 'Тип фона')}>
          <Select
            value={formData.background?.type || 'solid'}
            onValueChange={(value) =>
              onChange({
                ...formData,
                background: { ...formData.background, type: value },
              })
            }
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">{t('fields.solidColor', '🎨 Сплошной цвет')}</SelectItem>
              <SelectItem value="gradient">{t('fields.gradient', '🌈 Градиент')}</SelectItem>
              <SelectItem value="image">{t('fields.image', '🖼️ Изображение')}</SelectItem>
            </SelectContent>
          </Select>
        </EditorField>

        {formData.background?.type === 'solid' && (
          <EditorField label={t('fields.backgroundColor', 'Цвет фона')}>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={formData.background?.value || '#000000'}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    background: { ...formData.background, value: e.target.value },
                  })
                }
                className="h-12 w-16 rounded-xl p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.background?.value || '#000000'}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    background: { ...formData.background, value: e.target.value },
                  })
                }
                placeholder="#000000"
                className="flex-1 h-12 rounded-xl font-mono"
              />
            </div>
          </EditorField>
        )}

        {formData.background?.type === 'gradient' && (
          <>
            <EditorField
              label={t('fields.gradientColors', 'Цвета градиента')}
              hint={t('fields.enterCommaSeparatedColors', 'Введите цвета через запятую')}
            >
              <Input
                value={formData.background?.value || ''}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    background: { ...formData.background, value: e.target.value },
                  })
                }
                placeholder="#ff0000, #0000ff"
                className="h-12 rounded-xl"
              />
            </EditorField>
            <EditorField label={t('fields.gradientAngle', 'Угол градиента')}>
              <div className="flex gap-2 items-center">
                <Input
                  type="range"
                  min="0"
                  max="360"
                  value={formData.background?.gradientAngle || 135}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      background: {
                        ...formData.background,
                        gradientAngle: parseInt(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center text-sm font-mono">
                  {formData.background?.gradientAngle || 135}°
                </span>
              </div>
            </EditorField>
          </>
        )}

        {formData.background?.type === 'image' && (
          <MediaUpload
            label={t('fields.backgroundImage', 'Фоновое изображение')}
            value={formData.background?.value || ''}
            onChange={(value) =>
              onChange({
                ...formData,
                background: { ...formData.background, value },
              })
            }
            accept="image/*"
          />
        )}
      </EditorSection>
    </div>
  );
}

export const LinkBlockEditor = withBlockEditor(LinkBlockEditorComponent, {
  hint: 'Add clickable links to any external page or resource',
  validate: validateLinkBlock,
});
