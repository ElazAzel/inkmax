import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

interface HeroSectionProps {
  onCreatePage: () => void;
  onViewExamples: () => void;
}

export default function HeroSection({ onCreatePage, onViewExamples }: HeroSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="pt-24 pb-12 sm:pb-16 px-5">
      <div className={cn(
        "max-w-xl mx-auto text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Trust badge */}
        <Badge className="mb-5 h-7 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          {t('landingV5.hero.badge', 'Бесплатно. За 2 минуты. Без кода.')}
        </Badge>

        {/* H1 - Clear value prop with specific outcome */}
        <h1 className="text-[1.75rem] sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
          <span className="block">{t('landingV5.hero.title1', 'Одна ссылка -')}</span>
          <span className="text-primary">{t('landingV5.hero.title2', 'понятный путь к заявке')}</span>
        </h1>

        {/* Subtitle - specific, not generic */}
        <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
          {t('landingV5.hero.subtitle', 'AI соберёт мини-сайт с вашим оффером, прайсом и формой заявки. Вы получите лиды в Telegram.')}
        </p>

        {/* Primary CTA - prominent */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto mb-6">
          <Button 
            size="lg"
            onClick={onCreatePage}
            className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {t('landingV5.hero.cta', 'Создать страницу')}
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onViewExamples}
            className="text-muted-foreground hover:text-foreground"
          >
            <Play className="h-4 w-4 mr-2" />
            {t('landingV5.hero.secondary', 'Посмотреть примеры')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Trust indicators - real, specific */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" />
            {t('landingV5.hero.trust1', 'Без карты')}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" />
            {t('landingV5.hero.trust2', 'Редактор на телефоне')}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" />
            {t('landingV5.hero.trust3', '0% комиссии')}
          </span>
        </div>
      </div>

      {/* Mini product preview - lightweight animation */}
      <div className={cn(
        "max-w-sm mx-auto mt-10 transition-all duration-1000 delay-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}>
        <div className="relative rounded-3xl bg-gradient-to-b from-muted/50 to-muted/20 border border-border/40 p-4 shadow-2xl">
          {/* Phone frame */}
          <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
            {/* Status bar */}
            <div className="h-6 bg-muted/50 flex items-center justify-center">
              <div className="w-16 h-1 rounded-full bg-border" />
            </div>
            {/* Content preview */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-foreground/10 rounded w-24" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-32" />
                </div>
              </div>
              <div className="h-10 bg-primary/80 rounded-xl flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-medium">
                  {t('landingV5.hero.previewCta', 'Записаться на консультацию')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 bg-muted/50 rounded-xl" />
                <div className="h-16 bg-muted/50 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
