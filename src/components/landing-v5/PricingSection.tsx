import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, Crown, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

interface PricingSectionProps {
  isKZ: boolean;
  onSelectFree: () => void;
  onSelectPro: () => void;
}

export default function PricingSection({ isKZ, onSelectFree, onSelectPro }: PricingSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const freeFeatures = [
    t('landingV5.pricing.free.f1', 'Базовые блоки'),
    t('landingV5.pricing.free.f2', '1 AI-генерация/месяц'),
    t('landingV5.pricing.free.f3', 'Базовая статистика'),
    t('landingV5.pricing.free.f4', '1 страница'),
  ];

  const proFeatures = [
    t('landingV5.pricing.pro.f1', 'Все 25+ блоков'),
    t('landingV5.pricing.pro.f2', 'Mini-CRM + Telegram'),
    t('landingV5.pricing.pro.f3', '5 AI-генераций/месяц'),
    t('landingV5.pricing.pro.f4', 'Расширенная аналитика'),
    t('landingV5.pricing.pro.f5', '6 страниц'),
    t('landingV5.pricing.pro.f6', 'Без watermark'),
  ];

  return (
    <section ref={ref} className="py-12 px-5 bg-muted/20">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-8">
          <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.pricing.badge', 'Простые тарифы')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.pricing.title', 'Выберите план')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('landingV5.pricing.subtitle', 'Начните бесплатно. Подключите Pro, когда нужно больше.')}
          </p>
        </div>

        <div className="grid gap-4">
          {/* Free Plan */}
          <Card className="p-5 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Free</h3>
                <p className="text-2xl font-black">{isKZ ? '0 ₸' : '$0'}</p>
              </div>
              <Badge variant="secondary">{t('landingV5.pricing.forever', 'Навсегда')}</Badge>
            </div>
            <ul className="space-y-2 text-sm mb-4">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              className="w-full h-11 rounded-xl font-semibold"
              onClick={onSelectFree}
            >
              {t('landingV5.pricing.freeCta', 'Начать бесплатно')}
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-5 border-2 border-primary bg-primary/5 relative">
            <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {t('landingV5.pricing.recommended', 'Рекомендуем')}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Pro <Crown className="h-4 w-4 text-primary" />
                </h3>
                <p className="text-2xl font-black">
                  {isKZ ? '2 610 ₸' : '$5'}
                  <span className="text-sm font-normal text-muted-foreground">/{t('landingV5.pricing.month', 'мес')}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {isKZ ? '31 320 ₸ за год' : '$60/year'} · {t('landingV5.pricing.save', 'экономия 40%')}
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm mb-4">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className={i < 2 ? 'font-medium' : ''}>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
              onClick={onSelectPro}
            >
              <Crown className="h-4 w-4 mr-2" />
              {t('landingV5.pricing.proCta', 'Выбрать Pro')}
            </Button>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Shield className="inline h-3.5 w-3.5 mr-1" />
          {t('landingV5.pricing.guarantee', '0% комиссии с продаж. Возврат 14 дней.')}
        </p>
      </div>
    </section>
  );
}
