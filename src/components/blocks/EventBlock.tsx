import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, MapPin, Mail, Ticket, CheckCircle2, ArrowRight, UserPlus, CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';
import { ru, kk } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/platform/supabase/client';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import { getCurrencySymbol } from '@/components/form-fields/CurrencySelect';
import type { EventBlock as EventBlockType, EventFormField } from '@/types/page';

interface EventBlockProps {
  block: EventBlockType;
  pageOwnerId?: string;
  pageId?: string;
  isOwnerPremium?: boolean;
}

const SYSTEM_EMAIL_FIELD_ID = 'system_email';
const DRAFT_TTL_MS = 2 * 60 * 60 * 1000;
const LINK_GUEST_KEY = 'event_guest_link';

type FormValue = string | string[] | boolean;

export const EventBlock = memo(function EventBlock({
  block,
  pageOwnerId,
  pageId,
  isOwnerPremium,
}: EventBlockProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, FormValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketCode, setTicketCode] = useState<string | null>(null);

  const language = i18n.language as SupportedLanguage;
  const locale = i18n.language === 'ru' ? ru : i18n.language === 'kk' ? kk : undefined;
  const title = getTranslatedString(block.title, language);
  const description = getTranslatedString(block.description, language);

  const registrationClosed = useMemo(() => {
    if (block.status && block.status !== 'published') return true;
    if (!block.registrationClosesAt) return false;
    return new Date(block.registrationClosesAt) <= new Date();
  }, [block.registrationClosesAt, block.status]);

  const eventFields = useMemo(() => {
    const fields = block.formFields || [];
    return fields.filter((field) => field.type !== 'email');
  }, [block.formFields]);

  const emailLabel = t('event.emailLabel', 'Email');
  const emailPlaceholder = t('event.emailPlaceholder', 'your@email.com');
  const emailHelp = t('event.emailHelp', 'Билет и подтверждение придут на эту почту.');
  const utmPayload = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      referrer: document.referrer || null,
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowPrompt(!user);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTicketCode(null);
  };

  const draftKey = `draft_event_${block.eventId}`;

  useEffect(() => {
    if (!isOpen) return;
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { updatedAt: number; data: Record<string, FormValue> };
      if (Date.now() - parsed.updatedAt > DRAFT_TTL_MS) {
        localStorage.removeItem(draftKey);
        return;
      }
      setFormValues(parsed.data || {});
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey, isOpen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('event') === block.eventId) {
      setIsOpen(true);
      setShowPrompt(!user);
    }
  }, [block.eventId, user]);

  const saveDraft = () => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({ updatedAt: Date.now(), data: formValues })
    );
  };

  const handlePromptSignup = () => {
    saveDraft();
    localStorage.setItem(
      LINK_GUEST_KEY,
      JSON.stringify({ eventId: block.eventId, updatedAt: Date.now() })
    );
    const returnTo = `${window.location.pathname}?event=${block.eventId}`;
    window.location.href = `/auth?mode=signup&returnTo=${encodeURIComponent(returnTo)}`;
  };

  const updateValue = (fieldId: string, value: FormValue) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const isFieldRequired = (field: EventFormField) => field.required || field.type === 'email';

  const validateForm = () => {
    const requiredFields = [
      { id: SYSTEM_EMAIL_FIELD_ID, label: emailLabel },
      ...eventFields
        .filter((field) => isFieldRequired(field))
        .map((field) => ({
          id: field.id,
          label: getTranslatedString(field.label_i18n, language) || t('event.field', 'Поле'),
        })),
    ];

    for (const field of requiredFields) {
      const value = formValues[field.id];
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        value === false;

      if (isEmpty) {
        toast.error(
          t('event.fillRequired', 'Заполните обязательные поля') + `: ${field.label}`
        );
        return false;
      }
    }

    const urlFields = eventFields.filter((field) => field.type === 'url');
    for (const field of urlFields) {
      const value = formValues[field.id];
      if (typeof value === 'string' && value.length > 0 && !value.startsWith('https://')) {
        toast.error(t('event.urlInvalid', 'URL должен начинаться с https://'));
        return false;
      }
    }

    return true;
  };

  const resolveAttendeeName = () => {
    const candidate = eventFields.find((field) =>
      ['short_text', 'long_text'].includes(field.type)
    );
    if (candidate) {
      const value = formValues[candidate.id];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    const email = formValues[SYSTEM_EMAIL_FIELD_ID];
    if (typeof email === 'string') return email.split('@')[0] || 'Guest';
    return 'Guest';
  };

  const resolveAttendeePhone = () => {
    const candidate = eventFields.find((field) => field.type === 'phone');
    if (candidate) {
      const value = formValues[candidate.id];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationClosed) {
      toast.error(t('event.registrationClosed', 'Регистрация закрыта'));
      return;
    }
    if (!pageOwnerId || !pageId) return;
    if (!validateForm()) return;

    const email = formValues[SYSTEM_EMAIL_FIELD_ID];
    if (typeof email !== 'string' || !email.trim()) {
      toast.error(t('event.emailRequired', 'Email обязателен'));
      return;
    }

    setIsSubmitting(true);
    try {
      const answers = {
        [SYSTEM_EMAIL_FIELD_ID]: email.trim(),
        ...eventFields.reduce<Record<string, FormValue>>((acc, field) => {
          acc[field.id] = formValues[field.id];
          return acc;
        }, {}),
      };

      const { data, error } = await supabase.functions.invoke('register-event', {
        body: {
          eventId: block.eventId,
          blockId: block.id,
          pageId,
          ownerId: pageOwnerId,
          attendeeEmail: email.trim(),
          attendeeName: resolveAttendeeName(),
          attendeePhone: resolveAttendeePhone(),
          answers,
          utm: isOwnerPremium ? utmPayload : {},
        },
      });

      if (error || !data?.success) {
        const code = data?.code || error?.message;
        if (code === 'duplicate') {
          toast.error(t('event.duplicateRegistration', 'Вы уже зарегистрированы на этот ивент.'));
          return;
        }
        if (data?.error === 'Capacity reached') {
          toast.error(t('event.capacityReached', 'Мест больше нет.'));
          return;
        }
        if (data?.error === 'Payment required') {
          toast.error(t('event.paymentRequired', 'Оплата доступна только в Pro.'));
          return;
        }
        throw error;
      }

      setTicketCode(data?.ticketCode || null);
      toast.success(t('event.registrationSuccess', 'Регистрация подтверждена'));
      localStorage.removeItem(draftKey);
    } catch (error: any) {
      console.error('Event registration error:', error);
      toast.error(t('event.registrationError', 'Не удалось зарегистрироваться'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadICS = () => {
    if (!block.startAt) return;
    const startDate = new Date(block.startAt);
    const endDate = block.endAt ? new Date(block.endAt) : new Date(startDate.getTime() + 60 * 60 * 1000);
    const formatICSDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LinkMAX//Event//EN
BEGIN:VEVENT
UID:${block.eventId}@linkmax
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description || ''}
LOCATION:${block.locationValue || ''}
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'event'}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const renderField = (field: EventFormField) => {
    const label = getTranslatedString(field.label_i18n, language);
    const placeholder = field.placeholder_i18n
      ? getTranslatedString(field.placeholder_i18n, language)
      : undefined;
    const helpText = field.helpText_i18n
      ? getTranslatedString(field.helpText_i18n, language)
      : undefined;
    const value = formValues[field.id];

    if (field.type === 'media') {
      return (
        <div className="rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
          {t('event.mediaSection', 'Медиа-секция доступна в Pro')}
        </div>
      );
    }

    if (field.type === 'file') {
      return (
        <div className="rounded-xl border border-border/60 p-4 text-sm text-muted-foreground">
          {t('event.fileUploadPro', 'Загрузка файлов доступна в Pro')}
        </div>
      );
    }

    switch (field.type) {
      case 'long_text':
        return (
          <Textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={placeholder}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={placeholder}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => updateValue(field.id, e.target.value)}
          />
        );
      case 'dropdown':
        return (
          <Select
            value={typeof value === 'string' ? value : ''}
            onValueChange={(val) => updateValue(field.id, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder || t('event.selectOption', 'Выберите вариант')} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {getTranslatedString(option.label_i18n, language)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'single_choice':
        return (
          <div className="space-y-2">
            {(field.options || []).map((option) => (
              <label key={option.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={field.id}
                  checked={value === option.id}
                  onChange={() => updateValue(field.id, option.id)}
                />
                {getTranslatedString(option.label_i18n, language)}
              </label>
            ))}
          </div>
        );
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {(field.options || []).map((option) => {
              const current = Array.isArray(value) ? value : [];
              const checked = current.includes(option.id);
              return (
                <label key={option.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(next) => {
                      const nextValue = Boolean(next)
                        ? [...current, option.id]
                        : current.filter((item) => item !== option.id);
                      updateValue(field.id, nextValue);
                    }}
                  />
                  {getTranslatedString(option.label_i18n, language)}
                </label>
              );
            })}
          </div>
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => updateValue(field.id, Boolean(checked))}
            />
            {label}
          </label>
        );
      case 'url':
        return (
          <Input
            type="url"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={placeholder || 'https://'}
          />
        );
      case 'phone':
        return (
          <Input
            type="tel"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={placeholder}
          />
        );
      case 'short_text':
      default:
        return (
          <Input
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border border-border/50 shadow-sm">
        {block.coverUrl ? (
          <img src={block.coverUrl} alt={title} className="h-40 w-full object-cover" />
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-primary/15 via-background to-muted" />
        )}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <Badge variant="secondary" className="shrink-0">
              {block.isPaid && isOwnerPremium && block.price
                ? `${block.price} ${getCurrencySymbol(block.currency || 'KZT')}`
                : t('event.free', 'Free')}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            {block.startAt && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {format(new Date(block.startAt), 'dd MMMM yyyy, HH:mm', { locale })}
                </span>
              </div>
            )}
            {block.locationValue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{block.locationValue}</span>
              </div>
            )}
          </div>

          <Button className="w-full rounded-xl" onClick={handleOpen} disabled={registrationClosed}>
            {registrationClosed ? t('event.registrationClosed', 'Регистрация закрыта') : t('event.register', 'Register')}
          </Button>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[70vh] pr-4">
            {ticketCode ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">
                    {t('event.successTitle', 'Регистрация подтверждена')}
                  </span>
                </div>
                <div className="rounded-xl border border-border/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ticket className="h-4 w-4" />
                    <span>{t('event.ticketCode', 'Код билета')}</span>
                  </div>
                  <div className="text-xl font-semibold">{ticketCode}</div>
                </div>
                {!user && (
                  <div className="rounded-xl border border-border/60 p-4 space-y-3">
                    <p className="text-sm">
                      {t(
                        'event.postGuestCta',
                        'Создать аккаунт и добавить билеты в профиль'
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handlePromptSignup}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t('event.createAccount', 'Создать аккаунт')}
                      </Button>
                      <Button variant="outline" onClick={handleClose}>
                        {t('event.later', 'Позже')}
                      </Button>
                    </div>
                  </div>
                )}
                <Button variant="outline" onClick={handleDownloadICS}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  {t('event.addToCalendar', 'Добавить в календарь')}
                </Button>
              </div>
            ) : (
              <div className="space-y-6 py-2">
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}

                {!user && showPrompt && (
                  <div className="rounded-xl border border-border/60 p-4 space-y-3">
                    <h4 className="font-semibold">
                      {t('event.promptTitle', 'Хотите хранить билеты в одном месте?')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'event.promptText',
                        'Зарегистрируйтесь, чтобы видеть все билеты в профиле и создать свой личный сайт за пару кликов.'
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handlePromptSignup}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {t('event.promptSignup', 'Зарегистрироваться')}
                      </Button>
                      <Button variant="outline" onClick={() => setShowPrompt(false)}>
                        {t('event.promptContinue', 'Продолжить без регистрации')}
                      </Button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={SYSTEM_EMAIL_FIELD_ID}>
                      {emailLabel} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={SYSTEM_EMAIL_FIELD_ID}
                      type="email"
                      value={typeof formValues[SYSTEM_EMAIL_FIELD_ID] === 'string' ? formValues[SYSTEM_EMAIL_FIELD_ID] : ''}
                      onChange={(e) => updateValue(SYSTEM_EMAIL_FIELD_ID, e.target.value)}
                      placeholder={emailPlaceholder}
                      required
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      {emailHelp}
                    </p>
                  </div>

                  {eventFields.map((field) => {
                    const label = getTranslatedString(field.label_i18n, language);
                    const isRequired = isFieldRequired(field);
                    const helpText = field.helpText_i18n
                      ? getTranslatedString(field.helpText_i18n, language)
                      : '';

                    return (
                      <div key={field.id} className="space-y-2">
                        {field.type !== 'checkbox' && field.type !== 'media' && field.type !== 'file' && (
                          <Label htmlFor={field.id}>
                            {label} {isRequired && <span className="text-destructive">*</span>}
                          </Label>
                        )}
                        {renderField(field)}
                        {helpText && (
                          <p className="text-xs text-muted-foreground">{helpText}</p>
                        )}
                      </div>
                    );
                  })}

                  {registrationClosed && (
                    <div className="rounded-xl border border-border/60 p-3 text-sm text-muted-foreground">
                      {t('event.registrationClosed', 'Регистрация закрыта')}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    disabled={isSubmitting || registrationClosed}
                  >
                    {isSubmitting ? t('event.submitting', 'Отправка...') : t('event.submit', 'Зарегистрироваться')}
                  </Button>
                </form>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
});
