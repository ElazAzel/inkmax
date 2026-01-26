import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Zap, Smartphone, Send, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function TrustSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const trustItems = [
    {
      icon: Zap,
      title: t('landingV5.trust.speed.title'),
      description: t('landingV5.trust.speed.description'),
    },
    {
      icon: Smartphone,
      title: t('landingV5.trust.mobile.title'),
      description: t('landingV5.trust.mobile.description'),
    },
    {
      icon: Send,
      title: t('landingV5.trust.telegram.title'),
      description: t('landingV5.trust.telegram.description'),
    },
    {
      icon: Percent,
      title: t('landingV5.trust.noCommission.title'),
      description: t('landingV5.trust.noCommission.description'),
    },
  ];

  return (
    <section ref={ref} className="py-12 px-5">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-8">
          <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            {t('landingV5.trust.badge')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.trust.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('landingV5.trust.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
