import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, MapPin, Mail, Ticket, CheckCircle2, ArrowRight, UserPlus, Users, AlertCircle, CalendarPlus, Download } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/platform/supabase/client';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import { getCurrencySymbol } from '@/components/form-fields/CurrencySelect';
import { getEventRegistrationCount, isEmailRegistered } from '@/services/events';
import { downloadICS, getGoogleCalendarUrl, type CalendarEvent } from '@/lib/calendar-utils';
import type { EventBlock as EventBlockType, EventFormField } from '@/types/page';

interface EventBlockProps {
  block: EventBlockType;
  pageOwnerId?: string;
  pageId?: string;
  isOwnerPremium?: boolean;
}

const SYSTEM_EMAIL_FIELD_ID = 'system_email';
const DRAFT_TTL_MS = 2 * 60 * 60 * 1000;

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
  const [registrationCount, setRegistrationCount] = useState<number>(0);
  const [eventError, setEventError] = useState<string | null>(null);

  const language = i18n.language as SupportedLanguage;
  const locale = i18n.language === 'ru' ? ru : i18n.language === 'kk' ? kk : undefined;
  const title = getTranslatedString(block.title, language);
  const description = getTranslatedString(block.description, language);

  // Check capacity
  const isFull = useMemo(() => {
    if (!block.capacity) return false;
    return registrationCount >= block.capacity;
  }, [block.capacity, registrationCount]);

  const registrationClosed = useMemo(() => {
    if (block.status && block.status !== 'published') return true;
    if (isFull) return true;
    if (!block.registrationClosesAt) return false;
    return new Date(block.registrationClosesAt) <= new Date();
  }, [block.registrationClosesAt, block.status, isFull]);

  const eventFields = useMemo(() => {
    const fields = block.formFields || [];
    return fields.filter((field) => field.type !== 'email');
  }, [block.formFields]);

  const emailLabel = t('event.emailLabel', 'Email');
  const emailPlaceholder = t('event.emailPlaceholder', 'your@email.com');
  const emailHelp = t('event.emailHelp', 'Билет и подтверждение придут на эту почту.');

  // Load registration count
  useEffect(() => {
    if (block.eventId) {
      getEventRegistrationCount(block.eventId).then(setRegistrationCount);
    }
  }, [block.eventId]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowPrompt(!user);
    setEventError(null);
  }, [user]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTicketCode(null);
    setEventError(null);
  }, []);

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

  const saveDraft = useCallback(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({ updatedAt: Date.now(), data: formValues })
    );
  }, [draftKey, formValues]);

  const handlePromptSignup = () => {
    saveDraft();
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
    setEventError(null);
    
    if (registrationClosed) {
      toast.error(t('event.registrationClosed', 'Регистрация закрыта'));
      return;
    }
    if (!pageOwnerId || !pageId) {
      setEventError(t('event.configError', 'Ошибка конфигурации события'));
      return;
    }
    if (!block.eventId) {
      setEventError(t('event.eventNotFound', 'Событие не найдено'));
      return;
    }
    if (!validateForm()) return;

    const email = formValues[SYSTEM_EMAIL_FIELD_ID];
    if (typeof email !== 'string' || !email.trim()) {
      toast.error(t('event.emailRequired', 'Email обязателен'));
      return;
    }

    // Check for duplicate email if not allowed
    if (!block.settings?.allowDuplicateEmail) {
      const isDuplicate = await isEmailRegistered(block.eventId, email.trim());
      if (isDuplicate) {
        setEventError(t('event.duplicateRegistration', 'Вы уже зарегистрированы на этот ивент.'));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();

      const answers = {
        [SYSTEM_EMAIL_FIELD_ID]: email.trim(),
        ...eventFields.reduce<Record<string, FormValue>>((acc, field) => {
          acc[field.id] = formValues[field.id];
          return acc;
        }, {}),
      };

      const { data: registration, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: block.eventId,
          block_id: block.id,
          page_id: pageId,
          owner_id: pageOwnerId,
          user_id: session?.session?.user?.id || null,
          attendee_name: resolveAttendeeName(),
          attendee_email: email.trim(),
          attendee_phone: resolveAttendeePhone(),
          answers_json: answers,
          status: block.settings?.requireApproval ? 'pending' : 'confirmed',
          payment_status: 'none',
        })
        .select('id')
        .single();

      if (error) {
        console.error('Registration error:', error);
        if (error.code === '23505') {
          setEventError(t('event.duplicateRegistration', 'Вы уже зарегистрированы на этот ивент.'));
        } else if (error.code === '23503') {
          setEventError(t('event.eventNotFound', 'Событие не найдено. Попробуйте обновить страницу.'));
        } else {
          setEventError(t('event.registrationError', 'Не удалось зарегистрироваться') + `: ${error.message}`);
        }
        return;
      }

      // Wait a moment for the trigger to create the ticket
      await new Promise(r => setTimeout(r, 500));

      const { data: ticket } = await supabase
        .from('event_tickets')
        .select('ticket_code')
        .eq('registration_id', registration.id)
        .maybeSingle();

      setTicketCode(ticket?.ticket_code || null);
      setRegistrationCount(prev => prev + 1);
      toast.success(
        block.settings?.requireApproval
          ? t('event.registrationPending', 'Заявка отправлена на рассмотрение')
          : t('event.registrationSuccess', 'Регистрация подтверждена')
      );
      localStorage.removeItem(draftKey);
    } catch (error: unknown) {
      console.error('Event registration error:', error);
      setEventError(t('event.registrationError', 'Не удалось зарегистрироваться'));
    } finally {
      setIsSubmitting(false);
    }
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
            {block.capacity && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {registrationCount} / {block.capacity} {t('event.spots', 'мест')}
                  {isFull && <span className="ml-1 text-destructive">({t('event.full', 'мест нет')})</span>}
                </span>
              </div>
            )}
          </div>

          <Button 
            className="w-full rounded-xl" 
            onClick={handleOpen}
            disabled={registrationClosed}
            variant={registrationClosed ? 'secondary' : 'default'}
          >
            {isFull 
              ? t('event.noSpots', 'Мест нет')
              : registrationClosed 
                ? t('event.registrationClosed', 'Регистрация закрыта')
                : t('event.register', 'Зарегистрироваться')
            }
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
                <div className="flex items-center gap-2 text-primary">
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
                
                {/* Add to Calendar */}
                {block.startAt && (
                  <div className="rounded-xl border border-border/60 p-4 space-y-3">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CalendarPlus className="h-4 w-4" />
                      {t('event.addToCalendar', 'Добавить в календарь')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            {t('event.calendar', 'Календарь')}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem 
                            onClick={() => {
                              const calendarEvent: CalendarEvent = {
                                title,
                                description: description || undefined,
                                location: block.locationValue || undefined,
                                startAt: block.startAt!,
                                endAt: block.endAt || undefined,
                                timezone: block.timezone || undefined,
                              };
                              window.open(getGoogleCalendarUrl(calendarEvent), '_blank');
                            }}
                          >
                            Google Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              const calendarEvent: CalendarEvent = {
                                title,
                                description: description || undefined,
                                location: block.locationValue || undefined,
                                startAt: block.startAt!,
                                endAt: block.endAt || undefined,
                                timezone: block.timezone || undefined,
                              };
                              downloadICS(calendarEvent, `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t('event.downloadICS', 'Скачать .ics')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}

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

                  {eventError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{eventError}</AlertDescription>
                    </Alert>
                  )}

                  {registrationClosed && !eventError && (
                    <Alert>
                      <AlertDescription>
                        {isFull 
                          ? t('event.noSpotsMessage', 'К сожалению, все места заняты.')
                          : t('event.registrationClosedMessage', 'Регистрация на это событие закрыта.')
                        }
                      </AlertDescription>
                    </Alert>
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
