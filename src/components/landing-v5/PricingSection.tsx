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
    t('landingV5.pricing.free.features.1'),
    t('landingV5.pricing.free.features.2'),
    t('landingV5.pricing.free.features.3'),
    t('landingV5.pricing.free.features.4'),
  ];

  const proFeatures = [
    t('landingV5.pricing.pro.features.1'),
    t('landingV5.pricing.pro.features.2'),
    t('landingV5.pricing.pro.features.3'),
    t('landingV5.pricing.pro.features.4'),
    t('landingV5.pricing.pro.features.5'),
    t('landingV5.pricing.pro.features.6'),
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
            {t('landingV5.pricing.badge')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.pricing.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('landingV5.pricing.subtitle')}
          </p>
        </div>

        <div className="grid gap-4">
          {/* Free Plan */}
          <Card className="p-5 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{t('landingV5.pricing.free.title')}</h3>
                <p className="text-2xl font-black">{t('landingV5.pricing.free.price')}</p>
              </div>
              <Badge variant="secondary">{t('landingV5.pricing.free.period')}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t('landingV5.pricing.free.description')}</p>
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
              {t('landingV5.pricing.free.cta')}
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-5 border-2 border-primary bg-primary/5 relative">
            <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {t('landingV5.pricing.pro.popular')}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {t('landingV5.pricing.pro.title')} <Crown className="h-4 w-4 text-primary" />
                </h3>
                <p className="text-2xl font-black">
                  {isKZ ? '2 610 ₸' : '$5'}
                  <span className="text-sm font-normal text-muted-foreground">{t('landingV5.pricing.pro.period')}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {isKZ ? '31 320 ₸ ' : '$60 '}{t('landingV5.pricing.year')} · {t('landingV5.pricing.bestValue')}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t('landingV5.pricing.pro.description')}</p>
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
              {t('landingV5.pricing.pro.cta')}
            </Button>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Shield className="inline h-3.5 w-3.5 mr-1" />
          {t('landingV5.pricing.guarantee')}
        </p>
      </div>
    </section>
  );
}
