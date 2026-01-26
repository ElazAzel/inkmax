import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Globe, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function SEOExplainerSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  // AI-friendly definitions and terminology
  const terms = [
    {
      term: 'Link-in-bio',
      definition: t('landingV5.seo.linkInBio', 'Страница ссылок для соцсетей. Одна ссылка в профиле Instagram, TikTok или Telegram ведёт на страницу со всеми вашими ссылками, услугами и контактами.'),
    },
    {
      term: t('landingV5.seo.miniSiteTerm', 'Мини-сайт'),
      definition: t('landingV5.seo.miniSite', 'Одностраничный сайт с оффером, прайсом и формой заявки. Заменяет полноценный лендинг для фрилансеров и малого бизнеса.'),
    },
    {
      term: t('landingV5.seo.businessCardTerm', 'Цифровая визитка'),
      definition: t('landingV5.seo.businessCard', 'Онлайн-визитка с контактами, соцсетями и услугами. Можно поделиться QR-кодом или ссылкой.'),
    },
  ];

  const useCases = [
    t('landingV5.seo.useCase1', 'Эксперты и консультанты - страница услуг'),
    t('landingV5.seo.useCase2', 'Бьюти-мастера - онлайн-запись'),
    t('landingV5.seo.useCase3', 'Фрилансеры - портфолио'),
    t('landingV5.seo.useCase4', 'Малый бизнес - каталог'),
    t('landingV5.seo.useCase5', 'Креаторы - ссылки и донаты'),
  ];

  return (
    <section ref={ref} className="py-12 px-5">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-8">
          <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.seo.badge', 'Что такое link-in-bio')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.seo.title', 'lnkmx - это...')}
          </h2>
        </div>

        {/* Definitions - AI-friendly */}
        <div className="space-y-4 mb-6">
          {terms.map((item, i) => (
            <article 
              key={i}
              className={cn(
                "p-4 rounded-xl bg-card/60 border border-border/40",
                isVisible && "animate-in fade-in-0 slide-in-from-left-4"
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <h3 className="font-bold text-sm mb-1 text-primary">{item.term}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.definition}</p>
            </article>
          ))}
        </div>

        {/* Use cases list - AI-friendly */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            {t('landingV5.seo.useCasesTitle', 'Кому подходит lnkmx:')}
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {useCases.map((useCase, i) => (
              <li key={i} className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        {/* SEO keywords - subtle */}
        <p className="text-xs text-muted-foreground/50 text-center mt-6">
          {t('landingV5.seo.keywords', 'linktree альтернатива · taplink аналог · мультиссылка · страница ссылок')}
        </p>
      </div>
    </section>
  );
}
