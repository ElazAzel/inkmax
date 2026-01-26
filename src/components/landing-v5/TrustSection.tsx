import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, Zap, MessageSquare, BarChart3, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function TrustSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const trustItems = [
    {
      icon: Smartphone,
      title: t('landingV5.trust.mobile.title', 'Mobile-first'),
      description: t('landingV5.trust.mobile.desc', 'Редактируй и публикуй прямо с телефона'),
    },
    {
      icon: Zap,
      title: t('landingV5.trust.fast.title', 'Быстрая загрузка'),
      description: t('landingV5.trust.fast.desc', 'Страницы грузятся менее чем за 2 секунды'),
    },
    {
      icon: Shield,
      title: t('landingV5.trust.commission.title', '0% комиссии'),
      description: t('landingV5.trust.commission.desc', 'Все деньги от продаж - ваши'),
    },
    {
      icon: MessageSquare,
      title: t('landingV5.trust.telegram.title', 'Telegram-уведомления'),
      description: t('landingV5.trust.telegram.desc', 'Мгновенные уведомления о новых заявках'),
    },
    {
      icon: BarChart3,
      title: t('landingV5.trust.analytics.title', 'Аналитика'),
      description: t('landingV5.trust.analytics.desc', 'Видите, что кликают и откуда приходят'),
    },
    {
      icon: Globe,
      title: t('landingV5.trust.languages.title', '3 языка'),
      description: t('landingV5.trust.languages.desc', 'Русский, English, Қазақша'),
    },
  ];

  return (
    <section ref={ref} className="py-12 px-5">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.trust.title', 'Почему выбирают lnkmx')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className={cn(
                "p-4 rounded-xl bg-card/60 border border-border/40 text-center",
                isVisible && "animate-in fade-in-0 slide-in-from-bottom-4"
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
