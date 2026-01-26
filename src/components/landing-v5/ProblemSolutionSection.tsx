import { useTranslation } from 'react-i18next';
import { X, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function ProblemSolutionSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const problems = [
    t('landingV5.problem.p1', 'Ссылка на WhatsApp, и клиенты повторяют одни вопросы'),
    t('landingV5.problem.p2', 'Нет прайса - теряете тех, кто не хочет писать'),
    t('landingV5.problem.p3', 'Непонятно, что реально приводит заявки'),
  ];

  const solutions = [
    t('landingV5.solution.s1', 'Один экран с оффером, прайсом и кнопкой записи'),
    t('landingV5.solution.s2', 'Заявки падают в mini-CRM и Telegram'),
    t('landingV5.solution.s3', 'Видите, какие блоки кликают'),
  ];

  return (
    <section ref={ref} className="py-12 px-5 bg-muted/20">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Problems */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            {t('landingV5.problem.label', 'Знакомо?')}
          </p>
          <div className="space-y-2">
            {problems.map((problem, i) => (
              <div 
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10"
              >
                <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm">{problem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow transition */}
        <div className="flex justify-center my-4">
          <ArrowRight className="h-6 w-6 text-primary rotate-90" />
        </div>

        {/* Solutions */}
        <div>
          <p className="text-sm font-medium text-primary mb-3">
            {t('landingV5.solution.label', 'С lnkmx:')}
          </p>
          <div className="space-y-2">
            {solutions.map((solution, i) => (
              <div 
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20"
              >
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">{solution}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
