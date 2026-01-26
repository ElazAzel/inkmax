import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

interface FinalCTASectionProps {
  onCreatePage: () => void;
  onViewExamples: () => void;
}

export default function FinalCTASection({ onCreatePage, onViewExamples }: FinalCTASectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-16 px-5 bg-gradient-to-b from-muted/30 to-primary/5">
      <div className={cn(
        "max-w-xl mx-auto text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <Badge className="mb-4 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
          {t('landingV5.finalCta.badge')}
        </Badge>
        
        <h2 className="text-xl sm:text-2xl font-bold mb-3">
          {t('landingV5.finalCta.title')}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm sm:text-base">
          {t('landingV5.finalCta.subtitle')}
        </p>
        
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Button 
            size="lg"
            onClick={onCreatePage}
            className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/25"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {t('landingV5.finalCta.cta')}
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onViewExamples}
            className="text-muted-foreground"
          >
            <Play className="h-4 w-4 mr-2" />
            {t('landingV5.finalCta.secondary')}
          </Button>
        </div>
      </div>
    </section>
  );
}
