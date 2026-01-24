/**
 * Landing Page v3.0 - New Positioning
 * "Мини-сайт за 2 минуты" - not a link-in-bio, but a mini-site builder
 */
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  Crown,
  BarChart3,
  ArrowRight,
  Check,
  Bot,
  Send,
  Target,
  TrendingUp,
  Briefcase,
  Scissors,
  Camera,
  X,
  Users,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LandingGallerySection } from '@/components/landing/LandingGallerySection';
import { FAQSection } from '@/components/landing/FAQSection';
import { TermsLink } from '@/components/legal/TermsOfServiceModal';
import { PrivacyLink } from '@/components/legal/PrivacyPolicyModal';
import { SEOLandingHead } from '@/components/landing/SEOLandingHead';
import { cn } from '@/lib/utils';
import { useLandingAnalytics, useSectionObserver } from '@/hooks/useLandingAnalytics';
import { useMarketingAnalytics } from '@/hooks/useMarketingAnalytics';

// Dynamic grid background with subtle animation
function AnimatedGridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridPulse 8s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

// Scroll animation hook
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function Index() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const isMobile = useIsMobile();
  const { trackSectionView, trackCtaClick } = useLandingAnalytics();
  const { trackMarketingEvent, trackOnce } = useMarketingAnalytics();

  // Scroll animations for sections
  const heroAnim = useScrollAnimation(0.1);
  const problemAnim = useScrollAnimation(0.1);
  const howItWorksAnim = useScrollAnimation(0.1);
  const forWhomAnim = useScrollAnimation(0.1);
  const featuresAnim = useScrollAnimation(0.1);
  const useCasesAnim = useScrollAnimation(0.1);
  const comparisonAnim = useScrollAnimation(0.1);
  const pricingAnim = useScrollAnimation(0.1);
  const finalCtaAnim = useScrollAnimation(0.1);

  const trackMarketingSection = useCallback(
    (sectionId: string) => {
      trackSectionView(sectionId);
      if (sectionId === 'how_it_works') {
        trackOnce({ eventType: 'how_it_works_view' });
      }
      if (sectionId === 'pricing') {
        trackOnce({ eventType: 'pricing_view' });
      }
    },
    [trackOnce, trackSectionView]
  );

  const howItWorksSectionRef = useSectionObserver('how_it_works', trackMarketingSection);
  const pricingSectionRef = useSectionObserver('pricing', trackMarketingSection);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isKZ = i18n.language === 'ru' || i18n.language === 'kk';

  const handleCreatePage = useCallback(
    (location: string, eventType?: 'hero_primary_cta_click' | 'signup_from_landing') => {
      trackCtaClick('create', location);
      trackMarketingEvent({ eventType: 'signup_from_landing', metadata: { location } });
      if (eventType) {
        trackMarketingEvent({ eventType, metadata: { location } });
      }
      navigate('/auth');
    },
    [navigate, trackCtaClick, trackMarketingEvent]
  );

  const handleViewExamples = useCallback(
    (location: string, eventType?: 'hero_secondary_cta_click') => {
      trackCtaClick('gallery', location);
      if (eventType) {
        trackMarketingEvent({ eventType, metadata: { location } });
      }
      navigate('/gallery');
    },
    [navigate, trackCtaClick, trackMarketingEvent]
  );

  const handleViewPricing = useCallback(
    (location: string) => {
      trackCtaClick('pricing', location);
      navigate('/pricing');
    },
    [navigate, trackCtaClick]
  );

  return (
    <>
      <SEOLandingHead currentLanguage={i18n.language} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <AnimatedGridBackground />

        {/* Navigation - Clean and minimal */}
        <nav className="fixed left-0 right-0 z-50 px-4 top-0 pt-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-card/80 backdrop-blur-2xl border border-border/30 rounded-2xl shadow-xl shadow-black/5">
              <div className="px-4 h-14 flex items-center justify-between">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center group"
                >
                  <span className="text-lg font-black transition-transform group-hover:scale-105">
                    lnk<span className="text-primary">mx</span>
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewExamples('nav')}
                    data-testid="landing-nav-examples"
                    className="hidden sm:flex rounded-xl hover:scale-105 transition-transform"
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    {t('landing.nav.examples', 'Примеры')}
                  </Button>
                  <Button 
                    onClick={() => handleCreatePage('nav')}
                    data-testid="landing-nav-create"
                    className="rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    size="sm"
                  >
                    {t('landing.nav.getStarted', 'Создать')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* HERO SECTION - New positioning */}
        <section 
          ref={heroAnim.ref}
          className="pt-24 pb-12 px-5"
        >
          <div className={cn(
            "max-w-lg mx-auto text-center transition-all duration-700",
            heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {/* Badge */}
            <Badge
              data-testid="landing-hero-badge"
              className="mb-6 h-8 px-4 text-sm font-bold bg-primary/10 text-primary border-primary/20 rounded-full"
            >
              <Bot className="h-4 w-4 mr-2" />
              {t('landing.hero.badge', 'AI-конструктор мини-сайтов')}
            </Badge>

            {/* Main Headline - Clear and result-focused */}
            <h1
              data-testid="landing-hero-title"
              className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-[1.15]"
            >
              {t('landing.hero.mainTitle', 'Мини-сайт, который приводит заявки, за 2 минуты')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-violet-500">
                {t('landing.hero.mainHighlight', 'Одна ссылка - понятный путь к записи')}
              </span>
            </h1>

            {/* Subhead - What it is and for whom */}
            <p
              data-testid="landing-hero-description"
              className="text-base text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed"
            >
              {t(
                'landing.hero.valueProposition',
                'AI-конструктор для экспертов, фрилансеров и малого бизнеса. Соберите страницу, прайс, формы и контакты без дизайнера и кода.'
              )}
            </p>

            {/* 3 Key Benefits */}
            <div className="flex flex-col gap-2 mb-8 max-w-sm mx-auto">
              <BenefitItem 
                icon={<Bot className="h-4 w-4" />}
                text={t('landing.hero.benefit1', 'AI собирает структуру и тексты первого экрана')}
                delay={100}
              />
              <BenefitItem 
                icon={<Send className="h-4 w-4" />}
                text={t('landing.hero.benefit2', 'Заявки приходят в mini-CRM и Telegram')}
                delay={200}
              />
              <BenefitItem 
                icon={<BarChart3 className="h-4 w-4" />}
                text={t('landing.hero.benefit3', 'Аналитика показывает, какие блоки дают лиды')}
                delay={300}
              />
            </div>

            {/* CTA Buttons - Two buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button 
                size="lg"
                onClick={() => handleCreatePage('hero', 'hero_primary_cta_click')}
                data-testid="landing-hero-primary-cta"
                className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t('landing.hero.primaryCta', 'Создать страницу бесплатно')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleViewExamples('hero', 'hero_secondary_cta_click')}
                data-testid="landing-hero-secondary-cta"
                className="h-14 rounded-2xl text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Users className="h-5 w-5 mr-2" />
                {t('landing.hero.secondaryCta', 'Посмотреть примеры')}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                {t('landing.hero.microNote', 'Бесплатный старт. Редактор на телефоне. Публикация в один клик.')}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewPricing('hero')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t('landing.hero.pricingCta', 'Сравнить тарифы')}
              </Button>
            </div>
          </div>
        </section>

        {/* FOR WHOM - Target audiences */}
        <section 
          ref={forWhomAnim.ref}
          className="py-12 px-5 bg-muted/30"
        >
          <div className={cn(
            "max-w-lg mx-auto transition-all duration-700",
            forWhomAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.forWhom.title', 'Кому подходит lnkmx')}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <AudienceCard
                icon={<Briefcase className="h-5 w-5" />}
                iconBg="bg-violet-500"
                title={t('landing.forWhom.expert.title', 'Эксперты')}
                description={t('landing.forWhom.expert.desc', 'Запись, кейсы, понятный оффер')}
                delay={0}
              />
              <AudienceCard
                icon={<Target className="h-5 w-5" />}
                iconBg="bg-blue-500"
                title={t('landing.forWhom.freelancer.title', 'Фрилансеры')}
                description={t('landing.forWhom.freelancer.desc', 'Портфолио, бриф, заявки')}
                delay={100}
              />
              <AudienceCard
                icon={<Scissors className="h-5 w-5" />}
                iconBg="bg-pink-500"
                title={t('landing.forWhom.beauty.title', 'Бьюти')}
                description={t('landing.forWhom.beauty.desc', 'Запись, отзывы, карта')}
                delay={200}
              />
              <AudienceCard
                icon={<Camera className="h-5 w-5" />}
                iconBg="bg-amber-500"
                title={t('landing.forWhom.business.title', 'Бизнес')}
                description={t('landing.forWhom.business.desc', 'Каталог, лиды, аналитика')}
                delay={300}
              />
            </div>
          </div>
        </section>

        {/* PROBLEM - Why leads are lost */}
        <section 
          ref={problemAnim.ref}
          className="py-12 px-5"
        >
          <div className={cn(
            "max-w-lg mx-auto transition-all duration-700",
            problemAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.problem.title', 'Почему заявки теряются сегодня')}
            </h2>

            <div className="space-y-3">
              <ProblemCard 
                text={t('landing.problem.item1', 'В bio хаос: прайс, запись и кейсы разбросаны по постам и ссылкам')}
                delay={0}
              />
              <ProblemCard 
                text={t('landing.problem.item2', 'Люди задают одни вопросы, а вы отвечаете вручную и теряете время')}
                delay={100}
              />
              <ProblemCard 
                text={t('landing.problem.item3', 'Страница превращается в меню ссылок, а не путь к записи')}
                delay={200}
              />
              <ProblemCard 
                text={t('landing.problem.item4', 'Нет понимания: что реально кликают и где теряется внимание')}
                delay={300}
              />
            </div>

            {/* Solution teaser */}
            <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
              <p className="text-sm leading-relaxed">
                {t('landing.problem.solution', 'lnkmx делает одну понятную страницу, где посетитель быстро понимает, кто вы, чем полезны, сколько стоит, и куда нажать для заявки. А вы видите лиды и аналитику в одном месте.')}
              </p>
            </Card>
          </div>
        </section>

        {/* HOW IT WORKS - 3 Steps */}
        <section 
          ref={mergeRefs(howItWorksAnim.ref, howItWorksSectionRef)}
          className="py-12 px-5 bg-muted/30"
        >
          <div className={cn(
            "max-w-lg mx-auto transition-all duration-700",
            howItWorksAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.howItWorks.title', 'Как это работает')}
            </h2>

            <div className="space-y-4">
              <StepCard
                number="1"
                title={t('landing.howItWorks.step1.title', 'Выберите нишу')}
                description={t('landing.howItWorks.step1.description', 'Укажите кто вы и что продаете')}
                delay={0}
              />
              <StepCard
                number="2"
                title={t('landing.howItWorks.step2.title', 'AI соберет страницу')}
                description={t('landing.howItWorks.step2.description', 'AI собирает структуру, тексты, CTA и базовый прайс')}
                delay={100}
              />
              <StepCard
                number="3"
                title={t('landing.howItWorks.step3.title', 'Получайте заявки')}
                description={t('landing.howItWorks.step3.description', 'Публикуете и получаете заявки в мини-CRM и Telegram')}
                delay={200}
              />
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg"
                onClick={() => handleCreatePage('how_it_works')}
                className="h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
              >
                {t('landing.howItWorks.cta', 'Попробовать сейчас')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES - What's inside */}
        <section 
          ref={featuresAnim.ref}
          className="py-12 px-5"
        >
          <div className={cn(
            "max-w-lg mx-auto transition-all duration-700",
            featuresAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.features.title', 'Что вы получите в первой версии')}
            </h2>

            <div className="space-y-4">
              <FeatureSection
                icon={<Bot className="h-5 w-5" />}
                iconBg="bg-violet-500"
                title={t('landing.features.ai.title', 'Страница с понятным оффером')}
                items={[
                  t('landing.features.ai.item1', 'Первый экран с обещанием результата и CTA'),
                  t('landing.features.ai.item2', 'Прайс или пакеты услуг без ручной верстки'),
                  t('landing.features.ai.item3', 'Форма заявки и контакты на одной странице'),
                ]}
                delay={0}
              />

              <FeatureSection
                icon={<Send className="h-5 w-5" />}
                iconBg="bg-blue-500"
                title={t('landing.features.crm.title', 'Лиды и порядок')}
                items={[
                  t('landing.features.crm.item1', 'Мини-CRM: лиды, статусы, заметки'),
                  t('landing.features.crm.item2', 'Уведомления о заявках в Telegram'),
                  t('landing.features.crm.item3', 'Быстрые ответы и история общения'),
                ]}
                delay={100}
              />

              <FeatureSection
                icon={<BarChart3 className="h-5 w-5" />}
                iconBg="bg-amber-500"
                title={t('landing.features.analytics.title', 'Понимание, что работает')}
                items={[
                  t('landing.features.analytics.item1', 'Просмотры и клики по блокам'),
                  t('landing.features.analytics.item2', 'Источники трафика, устройства'),
                  t('landing.features.analytics.item3', 'Подсказки, что улучшить дальше'),
                ]}
                delay={200}
              />
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section
          ref={useCasesAnim.ref}
          className="py-12 px-5 bg-muted/30"
        >
          <div className={cn(
            "max-w-lg mx-auto transition-all duration-700",
            useCasesAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl font-black text-center mb-3">
              {t('landing.useCases.title', 'Готовые сценарии под ваши задачи')}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {t('landing.useCases.subtitle', 'Выберите сценарий, поправьте пару блоков и публикуйте.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UseCaseCard
                icon={<Briefcase className="h-5 w-5" />}
                title={t('landing.useCases.expert.title', 'Эксперт или консультации')}
                bullets={[
                  t('landing.useCases.expert.bullet1', 'Оффер и результат на первом экране'),
                  t('landing.useCases.expert.bullet2', 'Прайс и пакеты услуг'),
                  t('landing.useCases.expert.bullet3', 'Форма заявки и мессенджеры'),
                ]}
              />
              <UseCaseCard
                icon={<Scissors className="h-5 w-5" />}
                title={t('landing.useCases.service.title', 'Услуги и сервис')}
                bullets={[
                  t('landing.useCases.service.bullet1', 'Запись и расписание'),
                  t('landing.useCases.service.bullet2', 'Адрес, карта и отзывы'),
                  t('landing.useCases.service.bullet3', 'Контакты и быстрые ответы'),
                ]}
              />
              <UseCaseCard
                icon={<Camera className="h-5 w-5" />}
                title={t('landing.useCases.creator.title', 'Креатор и портфолио')}
                bullets={[
                  t('landing.useCases.creator.bullet1', 'Лучшие проекты и кейсы'),
                  t('landing.useCases.creator.bullet2', 'Соцсети и подписки'),
                  t('landing.useCases.creator.bullet3', 'Прием заявок и бриф'),
                ]}
              />
              <UseCaseCard
                icon={<TrendingUp className="h-5 w-5" />}
                title={t('landing.useCases.shop.title', 'Магазин или каталог')}
                bullets={[
                  t('landing.useCases.shop.bullet1', 'Товары и цены'),
                  t('landing.useCases.shop.bullet2', 'FAQ и условия доставки'),
                  t('landing.useCases.shop.bullet3', 'Быстрый контакт для заказа'),
                ]}
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => handleCreatePage('use_cases')}
                className="h-12 rounded-2xl font-bold"
              >
                {t('landing.useCases.primaryCta', 'Создать страницу')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleViewExamples('use_cases')}
                className="h-12 rounded-2xl font-bold"
              >
                {t('landing.useCases.secondaryCta', 'Посмотреть примеры')}
              </Button>
            </div>
          </div>
        </section>

        {/* COMPARISON - Why LinkMAX vs link-in-bio */}
        <section 
          ref={comparisonAnim.ref}
          className="py-12 px-5 bg-muted/30"
        >
          <div className={cn(
            "max-w-lg mx-auto transition-all duration-700",
            comparisonAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.comparison.title', 'Почему мини-сайт лучше меню ссылок')}
            </h2>

            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-bold">{t('landing.comparison.feature', 'Функция')}</th>
                    <th className="p-3 font-bold text-primary">lnkmx</th>
                    <th className="p-3 font-bold text-muted-foreground">{t('landing.comparison.others', 'Другие')}</th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow 
                    feature={t('landing.comparison.ai', 'AI-сборка страницы')} 
                    lnkmx={true} 
                    others={false} 
                  />
                  <ComparisonRow 
                    feature={t('landing.comparison.crm', 'Мини-CRM для заявок')} 
                    lnkmx={true} 
                    others={false} 
                  />
                  <ComparisonRow 
                    feature={t('landing.comparison.telegram', 'Telegram-уведомления')} 
                    lnkmx={true} 
                    others={false} 
                  />
                  <ComparisonRow 
                    feature={t('landing.comparison.mobile', 'Mobile-редактор')} 
                    lnkmx={true} 
                    others="partial" 
                  />
                  <ComparisonRow 
                    feature={t('landing.comparison.blockAnalytics', 'Аналитика по блокам')} 
                    lnkmx={true} 
                    others="partial" 
                  />
                </tbody>
              </table>
            </Card>
          </div>
        </section>

        {/* SOCIAL PROOF - Gallery */}
        <section className="py-12 px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-center mb-6 text-muted-foreground">
              {t('landing.socialProof.title', 'Примеры страниц')}
            </h2>
            <Suspense fallback={null}>
              <LandingGallerySection />
            </Suspense>
          </div>
        </section>

        {/* PRICING */}
        <section 
          ref={mergeRefs(pricingAnim.ref, pricingSectionRef)}
          className="py-12 px-5 bg-muted/30"
        >
          <div className={cn(
            "max-w-lg mx-auto transition-all duration-700",
            pricingAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl font-black text-center mb-3">
              {t('landing.pricing.title', 'Тарифы')}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {t('landing.pricing.subtitle', 'Начните бесплатно и подключите Pro, когда понадобится больше')}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Free tier */}
              <Card className="p-5 border-2 border-border/50 hover:border-border transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Free</h3>
                    <p className="text-2xl font-black">0 {isKZ ? '₸' : '$'}</p>
                  </div>
                  <Badge variant="secondary" className="text-sm font-bold">
                    {t('landing.pricing.forever', 'Навсегда')}
                  </Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <PriceFeature text={t('landing.pricing.free.item1', '6 базовых блоков')} />
                  <PriceFeature text={t('landing.pricing.free.item2', '1 AI генерация/месяц')} />
                  <PriceFeature text={t('landing.pricing.free.item3', 'Базовая аналитика')} />
                </ul>
                <Button 
                  variant="outline"
                  className="w-full h-12 rounded-xl font-bold mt-4 hover:scale-[1.02] transition-transform"
                  onClick={() => handleCreatePage('pricing_free')}
                >
                  {t('landing.pricing.freeAction', 'Начать бесплатно')}
                </Button>
              </Card>

              {/* Pro tier - 12 months best value */}
              <Card className="p-5 border-2 border-primary bg-primary/5 relative overflow-hidden hover:bg-primary/10 transition-colors">
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl">
                  {t('landing.pricing.bestValue', 'Лучшая цена')}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      Pro
                      <Crown className="h-4 w-4 text-amber-500" />
                    </h3>
                    <p className="text-2xl font-black">
                      {isKZ ? '2 610 ₸' : '$5'}<span className="text-base font-normal text-muted-foreground">/{t('pricing.month', 'мес')}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isKZ
                        ? t('landing.pricing.annualPriceKzt', '31 320 ₸ за 12 месяцев')
                        : t('landing.pricing.annualPriceUsd', '$60/year')}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <PriceFeature text={t('landing.pricing.pro.item1', 'Безлимит блоков и шаблонов')} isPro />
                  <PriceFeature text={t('landing.pricing.pro.item2', '5 AI генераций/месяц')} isPro />
                  <PriceFeature text={t('landing.pricing.pro.item3', 'CRM + Telegram уведомления')} isPro />
                  <PriceFeature text={t('landing.pricing.pro.item4', 'Расширенная аналитика')} isPro />
                  <PriceFeature text={t('landing.pricing.pro.item5', 'Без watermark')} isPro />
                </ul>
                <Button 
                  className="w-full h-12 rounded-xl font-bold hover:scale-[1.02] transition-transform"
                  onClick={() => handleViewPricing('pricing_pro')}
                >
                  {t('landing.pricing.viewPlans', 'Выбрать Pro')}
                </Button>
                
                {/* Other Pro pricing options */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground text-center mb-2">
                    {t('landing.pricing.otherPlans', 'Другие варианты:')}
                  </p>
                  <div className="flex justify-center gap-4 text-xs">
                    <span className="text-muted-foreground">{t('landing.pricing.otherPlansSix', '6 мес: 3 500 ₸/мес')}</span>
                    <span className="text-muted-foreground">{t('landing.pricing.otherPlansThree', '3 мес: 4 350 ₸/мес')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>

        {/* FINAL CTA */}
        <section 
          ref={finalCtaAnim.ref}
          className="py-16 px-5 bg-gradient-to-b from-background to-primary/5"
        >
          <div className={cn(
            "max-w-lg mx-auto text-center transition-all duration-700",
            finalCtaAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-2xl sm:text-3xl font-black mb-4">
              {t('landing.finalCta.title', 'Соберите страницу, которая ведет к заявке, за 2 минуты')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {t('landing.finalCta.description', 'Не теряйте клиентов в переписке. Дайте им понятный путь: кто вы - чем помогаете - сколько стоит - записаться.')}
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button 
                size="lg"
                onClick={() => handleCreatePage('final_cta')}
                className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t('landing.finalCta.primaryCta', 'Создать страницу бесплатно')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleViewExamples('final_cta')}
                className="h-14 rounded-2xl text-base font-bold"
              >
                {t('landing.finalCta.secondaryCta', 'Посмотреть примеры')}
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8 px-5 bg-muted/20">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-6">
              <span className="text-lg font-black">
                lnk<span className="text-primary">mx</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-6">
              <button onClick={() => navigate('/alternatives')} className="hover:text-foreground transition-colors">
                {t('landing.footer.alternatives', 'Сравнение')}
              </button>
              <span>·</span>
              <button onClick={() => navigate('/pricing')} className="hover:text-foreground transition-colors">
                {t('pricing.title', 'Тарифы')}
              </button>
              <span>·</span>
              <TermsLink className="hover:text-foreground transition-colors">
                {t('legal.termsOfService', 'Условия')}
              </TermsLink>
              <span>·</span>
              <PrivacyLink className="hover:text-foreground transition-colors">
                {t('legal.privacyPolicy', 'Политика')}
              </PrivacyLink>
            </div>

            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>{t('pricing.companyDetails.nameLine', 'ИП BEEGIN • БИН: 971207300019')}</p>
              <p>{t('pricing.companyDetails.addressLine', 'г. Алматы, ул. Шолохова, д. 20/7')}</p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <a href="mailto:admin@lnkmx.my" className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Mail className="h-3 w-3" />
                  admin@lnkmx.my
                </a>
                <a href="tel:+77051097664" className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Phone className="h-3 w-3" />
                  +7 705 109 7664
                </a>
              </div>
              <p className="pt-2">{t('landing.footer.copyright', '© 2025 lnkmx')}</p>
            </div>
          </div>
        </footer>

        {/* Floating CTA */}
        {isMobile && (
          <div 
            className={cn(
              "fixed bottom-6 left-4 right-4 z-50 transition-all duration-300",
              showFloatingCta 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-10 pointer-events-none"
            )}
          >
            <div className="flex gap-2">
              <Button 
                onClick={() => handleCreatePage('floating_cta')}
                className="flex-1 h-14 rounded-2xl font-bold text-base shadow-2xl shadow-primary/40 hover:scale-[1.02] transition-transform"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {t('landing.floatingCta.create', 'Создать')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleViewExamples('floating_cta')}
                className="h-14 px-4 rounded-2xl font-bold bg-background/95 backdrop-blur"
              >
                <Users className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

// Benefit Item Component
function BenefitItem({ 
  icon, 
  text,
  delay = 0,
}: { 
  icon: React.ReactNode; 
  text: string;
  delay?: number;
}) {
  return (
    <div 
      className="flex items-center gap-3 p-2.5 rounded-xl bg-card/50 border border-border/30 animate-in fade-in slide-in-from-bottom-2 duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm text-left">{text}</span>
    </div>
  );
}

// Problem Card Component
function ProblemCard({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <Card 
      className="p-4 flex items-start gap-3 bg-destructive/5 border-destructive/20 animate-in fade-in slide-in-from-left-2 duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <p className="text-sm">{text}</p>
    </Card>
  );
}

// Step Card Component
function StepCard({ 
  number, 
  title, 
  description,
  delay = 0,
}: { 
  number: string; 
  title: string; 
  description: string;
  delay?: number;
}) {
  return (
    <Card 
      className="p-4 flex items-start gap-4 bg-card/50 backdrop-blur border-border/30 hover:bg-card/80 transition-all hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-2 duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black text-lg flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

// Audience Card Component
function AudienceCard({ 
  icon, 
  iconBg, 
  title, 
  description,
  delay = 0,
}: { 
  icon: React.ReactNode; 
  iconBg: string; 
  title: string; 
  description: string; 
  delay?: number;
}) {
  return (
    <Card 
      className="p-4 bg-card/50 backdrop-blur border-border/30 hover:bg-card/80 hover:scale-[1.02] transition-all animate-in fade-in zoom-in-95 duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center text-white mb-3",
        iconBg
      )}>
        {icon}
      </div>
      <h3 className="font-bold mb-1 text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Card>
  );
}

// Feature Section Component
function FeatureSection({ 
  icon, 
  iconBg, 
  title, 
  items,
  delay = 0,
}: { 
  icon: React.ReactNode; 
  iconBg: string; 
  title: string; 
  items: string[];
  delay?: number;
}) {
  return (
    <Card 
      className="p-5 bg-card/50 backdrop-blur border-border/30 hover:bg-card/80 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0",
          iconBg
        )}>
          {icon}
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Use Case Card Component
function UseCaseCard({
  icon,
  title,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  bullets: string[];
}) {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur border-border/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Price Feature Component
function PriceFeature({ text, isPro = false }: { text: string; isPro?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <Check className={cn("h-4 w-4", isPro ? "text-primary" : "text-emerald-500")} />
      {text}
    </li>
  );
}

// Comparison Row Component
function ComparisonRow({ 
  feature, 
  lnkmx, 
  others 
}: { 
  feature: string; 
  lnkmx: boolean; 
  others: boolean | 'partial'; 
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="p-3">{feature}</td>
      <td className="p-3 text-center">
        {lnkmx && <Check className="h-5 w-5 text-primary mx-auto" />}
      </td>
      <td className="p-3 text-center">
        {others === true && <Check className="h-5 w-5 text-muted-foreground mx-auto" />}
        {others === 'partial' && <span className="text-xs text-muted-foreground">~</span>}
        {others === false && <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />}
      </td>
    </tr>
  );
}
