import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Sparkles, Send, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

interface HowItWorksSectionProps {
  onCreatePage: () => void;
}

export default function HowItWorksSection({ onCreatePage }: HowItWorksSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const steps = [
    {
      number: '1',
      icon: Target,
      title: t('landingV5.howItWorks.step1.title'),
      description: t('landingV5.howItWorks.step1.description'),
    },
    {
      number: '2',
      icon: Sparkles,
      title: t('landingV5.howItWorks.step2.title'),
      description: t('landingV5.howItWorks.step2.description'),
    },
    {
      number: '3',
      icon: Send,
      title: t('landingV5.howItWorks.step3.title'),
      description: t('landingV5.howItWorks.step3.description'),
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
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.howItWorks.badge')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.howItWorks.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('landingV5.howItWorks.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div 
              key={i}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 transition-all duration-300",
                isVisible && "animate-in fade-in-0 slide-in-from-left-4"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">{step.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button 
            size="lg"
            onClick={onCreatePage}
            className="h-12 px-6 rounded-xl font-semibold shadow-lg shadow-primary/20"
          >
            {t('landingV5.howItWorks.cta')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {t('landingV5.howItWorks.note')}
          </p>
        </div>
      </div>
    </section>
  );
}
