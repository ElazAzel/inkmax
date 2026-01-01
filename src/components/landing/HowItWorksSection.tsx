import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Wand2, 
  Bell, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HowItWorksSectionProps {
  isVisible: boolean;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export function HowItWorksSection({ isVisible, sectionRef }: HowItWorksSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      icon: Target,
      number: '01',
      title: t('landing.howItWorks.step1.title', 'Выберите нишу'),
      description: t('landing.howItWorks.step1.description', 'Укажите, кто вы - бьюти-мастер, эксперт или бизнес. AI поймёт, что вам нужно.'),
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Wand2,
      number: '02',
      title: t('landing.howItWorks.step2.title', 'AI создаёт страницу'),
      description: t('landing.howItWorks.step2.description', 'За 30 секунд AI генерирует дизайн, тексты, структуру и все блоки. Вам остаётся только проверить.'),
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: Bell,
      number: '03',
      title: t('landing.howItWorks.step3.title', 'Получайте заявки'),
      description: t('landing.howItWorks.step3.description', 'Клиенты заполняют форму → заявка в Mini-CRM → уведомление в Telegram. Ни один лид не потеряется.'),
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 px-5 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary">{t('landing.howItWorks.badge', '2 минуты до результата')}</span>
          </div>
          <h2 
            className={`text-2xl sm:text-3xl lg:text-[2.75rem] font-extrabold tracking-[-0.02em] leading-tight opacity-0 ${isVisible ? 'animate-blur-in' : ''}`}
            style={{ animationDelay: '100ms' }}
          >
            {t('landing.howItWorks.title', 'Как это работает')}
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-pink-500/30 via-violet-500/30 to-blue-500/30" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative text-center opacity-0 ${isVisible ? 'animate-slide-in-up' : ''}`}
                style={{ animationDelay: `${200 + index * 150}ms` }}
              >
                {/* Icon with number */}
                <div className="relative inline-block mb-6">
                  <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl mx-auto relative z-10`}>
                    <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-bold z-20">
                    {step.number}
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${step.color} blur-xl opacity-30 -z-10`} />
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div 
          className={`text-center mt-12 sm:mt-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
          style={{ animationDelay: '700ms' }}
        >
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="rounded-xl sm:rounded-2xl px-6 sm:px-8 py-5 sm:py-6 font-bold shadow-lg shadow-primary/30"
          >
            {t('landing.howItWorks.cta', 'Попробовать бесплатно')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
