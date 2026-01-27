import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion';

interface HeroSectionProps {
  onCreatePage: () => void;
  onViewExamples: () => void;
}

export default function HeroSection({ onCreatePage, onViewExamples }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="pt-24 pb-12 sm:pb-16 px-5">
      <div className="max-w-xl mx-auto text-center">
        {/* Trust badge */}
        <Reveal delay={0} direction="fade">
          <Badge className="mb-5 h-7 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.hero.badge')}
          </Badge>
        </Reveal>

        {/* H1 - Clear value prop with specific outcome */}
        <Reveal delay={100} direction="up" distance={20}>
          <h1 className="text-[1.75rem] sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            <span className="block">{t('landingV5.hero.title1')}</span>
            <span className="text-primary">{t('landingV5.hero.title2')}</span>
          </h1>
        </Reveal>

        {/* Subtitle - specific, not generic */}
        <Reveal delay={200} direction="up">
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
            {t('landingV5.hero.subtitle')}
          </p>
        </Reveal>

        {/* Primary CTA - prominent */}
        <Reveal delay={300} direction="up">
          <div className="flex flex-col gap-3 max-w-xs mx-auto mb-6">
            <Button 
              size="lg"
              onClick={onCreatePage}
              className={cn(
                "h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/25",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              )}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {t('landingV5.hero.cta')}
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={onViewExamples}
              className="text-muted-foreground hover:text-foreground group"
            >
              <Play className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              {t('landingV5.hero.secondary')}
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>

        {/* Trust indicators - real, specific */}
        <Reveal delay={400} direction="fade">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {t('landingV5.hero.trust1')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {t('landingV5.hero.trust2')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {t('landingV5.hero.trust3')}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Mini product preview - lightweight animation */}
      <Reveal delay={500} direction="up" distance={24} duration={800}>
        <div className="max-w-sm mx-auto mt-10">
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
                    {t('landingV5.hero.previewCta')}
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
      </Reveal>
    </section>
  );
}
