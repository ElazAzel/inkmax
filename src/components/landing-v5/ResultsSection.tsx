import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, Scissors, Camera, TrendingUp, GraduationCap, Calendar,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

interface ResultsSectionProps {
  onCreatePage: () => void;
}

export default function ResultsSection({ onCreatePage }: ResultsSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const useCases = [
    {
      icon: Briefcase,
      title: t('landingV5.results.expert.title', 'Эксперты и консультанты'),
      pain: t('landingV5.results.expert.pain', 'Клиенты не понимают, чем вы помогаете'),
      result: t('landingV5.results.expert.result', 'Оффер на первом экране + форма заявки'),
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Scissors,
      title: t('landingV5.results.beauty.title', 'Бьюти и услуги'),
      pain: t('landingV5.results.beauty.pain', 'Запись через переписку - долго'),
      result: t('landingV5.results.beauty.result', 'Онлайн-запись + прайс + отзывы'),
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Camera,
      title: t('landingV5.results.creator.title', 'Креаторы и фрилансеры'),
      pain: t('landingV5.results.creator.pain', 'Портфолио разбросано по соцсетям'),
      result: t('landingV5.results.creator.result', 'Лучшие работы + бриф + контакты'),
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: TrendingUp,
      title: t('landingV5.results.business.title', 'Малый бизнес'),
      pain: t('landingV5.results.business.pain', 'Сайт дорого, а соцсети не конвертят'),
      result: t('landingV5.results.business.result', 'Каталог + FAQ + быстрый заказ'),
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: GraduationCap,
      title: t('landingV5.results.education.title', 'Образование'),
      pain: t('landingV5.results.education.pain', 'Сложно объяснить программу'),
      result: t('landingV5.results.education.result', 'Программа + расписание + запись'),
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Calendar,
      title: t('landingV5.results.events.title', 'Мероприятия'),
      pain: t('landingV5.results.events.pain', 'Регистрация через гугл-формы'),
      result: t('landingV5.results.events.result', 'Страница ивента + форма + билеты'),
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <section ref={ref} className="py-12 px-5 bg-muted/20">
      <div className={cn(
        "max-w-3xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-8">
          <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            {t('landingV5.results.badge', 'Для кого')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold">
            {t('landingV5.results.title', 'Кому помогает lnkmx')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {useCases.map((useCase, i) => (
            <div
              key={i}
              className={cn(
                "group relative p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-all cursor-pointer",
                isVisible && "animate-in fade-in-0 slide-in-from-bottom-4"
              )}
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={onCreatePage}
            >
              <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center flex-shrink-0`}>
                  <useCase.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">{useCase.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                    <span className="text-destructive/70">✗</span> {useCase.pain}
                  </p>
                  <p className="text-xs text-primary font-medium line-clamp-1">
                    <span className="text-primary">✓</span> {useCase.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button 
            size="lg"
            onClick={onCreatePage}
            className="h-12 rounded-xl font-semibold"
          >
            {t('landingV5.results.cta', 'Выбрать сценарий')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
