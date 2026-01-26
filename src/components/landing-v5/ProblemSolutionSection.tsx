import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function ProblemSolutionSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-12 px-5 bg-muted/20">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Problem */}
        <div className="mb-6">
          <Badge className="mb-4 h-6 px-3 text-xs font-medium bg-destructive/10 text-destructive border-destructive/20 rounded-full">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.problem.badge')}
          </Badge>
          
          <h2 className="text-lg sm:text-xl font-bold mb-2">
            {t('landingV5.problem.title')}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('landingV5.problem.description')}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
              <span className="text-destructive mt-0.5">✗</span>
              <div>
                <p className="text-sm font-medium">{t('landingV5.problem.item1')}</p>
                <p className="text-xs text-muted-foreground">{t('landingV5.problem.item1desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
              <span className="text-destructive mt-0.5">✗</span>
              <div>
                <p className="text-sm font-medium">{t('landingV5.problem.item2')}</p>
                <p className="text-xs text-muted-foreground">{t('landingV5.problem.item2desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
              <span className="text-destructive mt-0.5">✗</span>
              <div>
                <p className="text-sm font-medium">{t('landingV5.problem.item3')}</p>
                <p className="text-xs text-muted-foreground">{t('landingV5.problem.item3desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-4">
          <ArrowDown className="h-6 w-6 text-primary" />
        </div>

        {/* Solution */}
        <div>
          <Badge className="mb-4 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            <Check className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.solution.badge')}
          </Badge>
          
          <h2 className="text-lg sm:text-xl font-bold mb-2">
            {t('landingV5.solution.title')}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('landingV5.solution.description')}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Check className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t('landingV5.solution.item1')}</p>
                <p className="text-xs text-muted-foreground">{t('landingV5.solution.item1desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Check className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t('landingV5.solution.item2')}</p>
                <p className="text-xs text-muted-foreground">{t('landingV5.solution.item2desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Check className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t('landingV5.solution.item3')}</p>
                <p className="text-xs text-muted-foreground">{t('landingV5.solution.item3desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
