import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check, Loader2, MessageCircle, ExternalLink, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TelegramVerificationProps {
  onVerified: (chatId: string) => void;
  onBack: () => void;
}

// Bot username - LinkMAX official bot
const LINKMAX_BOT_USERNAME = 'linkmaxmy_bot';

export function TelegramVerification({ onVerified, onBack }: TelegramVerificationProps) {
  const { t } = useTranslation();
  const [chatId, setChatId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    const cleanChatId = chatId.trim().replace(/[^0-9-]/g, '');
    
    if (!cleanChatId) {
      toast.error(t('telegram.enterChatId', 'Введите ваш Chat ID'));
      return;
    }

    setIsVerifying(true);
    setError(null);
    
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('validate-telegram', {
        body: { chatId: cleanChatId },
      });

      if (invokeError) throw invokeError;

      if (data?.valid) {
        setIsVerified(true);
        toast.success(t('telegram.verified', 'Telegram подтвержден!'));
        setTimeout(() => {
          onVerified(cleanChatId);
        }, 500);
      } else {
        // Handle specific errors
        if (data?.error === 'invalid_chat_id' || data?.description?.includes('chat not found')) {
          setError(t('telegram.chatNotFound', 'Чат не найден. Убедитесь, что вы начали диалог с ботом @linkmaxbot и отправили /start'));
        } else if (data?.error === 'cannot_send_message') {
          setError(t('telegram.cannotSendMessage', 'Не удалось отправить сообщение. Начните диалог с ботом @linkmaxbot'));
        } else {
          setError(data?.description || t('telegram.invalidChatId', 'Неверный Chat ID'));
        }
        toast.error(t('telegram.verificationFailed', 'Ошибка проверки'));
      }
    } catch (err: any) {
      console.error('Telegram verification error:', err);
      setError(t('telegram.verificationError', 'Ошибка проверки. Попробуйте снова.'));
      toast.error(t('telegram.verificationError', 'Ошибка проверки'));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="font-semibold text-lg">{t('telegram.connectTitle', 'Подключите Telegram')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('telegram.connectDescription', 'Для уведомлений о новых лидах')}
          </p>
        </div>
      </div>

      {/* Get Chat ID Button */}
      <Button
        variant="outline"
        className="w-full h-12 rounded-xl gap-2"
        onClick={() => window.open(`https://t.me/${LINKMAX_BOT_USERNAME}?start=getchatid`, '_blank')}
      >
        <MessageCircle className="h-5 w-5" />
        {t('telegram.getChatIdButton', 'Получить Chat ID в Telegram')}
      </Button>

      {/* Instructions */}
      <Card className="p-4 bg-muted/30 space-y-3">
        <p className="text-sm font-medium mb-2">{t('telegram.instructions', 'Инструкция:')}</p>
        
        <div className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">
            1
          </div>
          <p className="text-sm">
            {t('telegram.step1New', 'Нажмите кнопку выше — откроется бот в Telegram')}
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">
            2
          </div>
          <p className="text-sm">
            {t('telegram.step2New', 'Нажмите START или отправьте /start')}
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">
            3
          </div>
          <p className="text-sm">
            {t('telegram.step3New', 'Бот отправит вам ваш Chat ID - скопируйте его сюда')}
          </p>
        </div>
      </Card>

      {/* Alternative method */}
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">
          {t('telegram.alternativeMethod', 'Альтернативный способ получить Chat ID')}
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-border">
          <p>{t('telegram.altStep1', '1. Откройте @userinfobot в Telegram')}</p>
          <p>{t('telegram.altStep2', '2. Отправьте /start')}</p>
          <p>{t('telegram.altStep3', '3. Скопируйте числовой ID')}</p>
          <p className="mt-1 text-yellow-600">{t('telegram.altWarning', '⚠️ После этого обязательно напишите /start боту @linkmaxbot')}</p>
        </div>
      </details>

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat ID Input */}
      <div className="space-y-2">
        <Label htmlFor="telegram-chat-id" className="text-sm text-muted-foreground">
          {t('telegram.yourChatId', 'Ваш Telegram Chat ID')}
        </Label>
        <div className="flex gap-2">
          <Input
            id="telegram-chat-id"
            value={chatId}
            onChange={(e) => {
              setChatId(e.target.value.replace(/[^0-9-]/g, ''));
              setError(null);
            }}
            placeholder="123456789"
            className="h-12 rounded-xl bg-card/40 backdrop-blur-xl border-border/30 focus:border-primary/50 font-mono"
            disabled={isVerifying || isVerified}
          />
          <Button
            onClick={handleVerify}
            disabled={!chatId.trim() || isVerifying || isVerified}
            className="h-12 px-6 rounded-xl"
          >
            {isVerifying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isVerified ? (
              <Check className="h-4 w-4" />
            ) : (
              t('telegram.verify', 'Проверить')
            )}
          </Button>
        </div>
      </div>

      {isVerified && (
        <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-xl">
          <Check className="h-4 w-4" />
          {t('telegram.verifiedSuccess', 'Telegram успешно подключен!')}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        <MessageCircle className="h-3 w-3 inline mr-1" />
        {t('telegram.whyRequired', 'Telegram нужен для получения уведомлений о новых заявках с вашей страницы')}
      </p>
    </div>
  );
}
