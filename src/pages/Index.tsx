/**
 * Landing Page v2.0 - Based on PDF structure
 * Mobile-first, conversion-focused with micro-animations
 */
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Users, 
  Mail, 
  Phone, 
  Zap,
  Crown,
  BarChart3,
  MessageCircle,
  Star,
  ArrowRight,
  Check,
  Bot,
  Smartphone,
  Send,
  Clock,
  Target,
  TrendingUp,
  Palette,
  AlertCircle,
  Briefcase,
  Scissors,
  Camera,
  ShoppingBag,
  X,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useEffect, useState, Suspense, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LandingGallerySection } from '@/components/landing/LandingGallerySection';
import { FAQSection } from '@/components/landing/FAQSection';
import { TermsLink } from '@/components/legal/TermsOfServiceModal';
import { PrivacyLink } from '@/components/legal/PrivacyPolicyModal';
import { SEOLandingHead } from '@/components/landing/SEOLandingHead';
import { cn } from '@/lib/utils';

export default function Index() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isKZ = i18n.language === 'ru' || i18n.language === 'kk';
  const currency = isKZ ? '₸' : '$';
  const prices = isKZ 
    ? { monthly: '2 610', period: '31 320' }
    : { monthly: '5', period: '60' };

  return (
    <>
      <SEOLandingHead currentLanguage={i18n.language} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Background gradients with animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-gradient-to-bl from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        </div>

        {/* Announcement Bar */}
        {announcementVisible && (
          <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium animate-in slide-in-from-top duration-300">
            <span>{t('landing.announcement', 'Сделайте страницу за 2 минуты и получайте заявки прямо в Telegram')}</span>
            <button 
              onClick={() => setAnnouncementVisible(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/20 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation - Floating glass pill */}
        <nav className={cn(
          "fixed left-0 right-0 z-50 px-4 transition-all duration-300",
          announcementVisible ? "top-10 pt-2" : "top-0 pt-4"
        )}>
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
                    onClick={() => navigate('/gallery')}
                    className="hidden sm:flex rounded-xl hover:scale-105 transition-transform"
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    {t('landing.nav.examples', 'Примеры')}
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
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

        {/* HERO SECTION */}
        <section className={cn(
          "pb-12 px-5",
          announcementVisible ? "pt-32" : "pt-24"
        )}>
          <div className="max-w-lg mx-auto text-center">
            {/* Badge with micro-animation */}
            <Badge className="mb-6 h-8 px-4 text-sm font-bold bg-primary/10 text-primary border-primary/20 rounded-full animate-in fade-in zoom-in duration-500">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              {t('landing.hero.badge', 'AI-first платформа')}
            </Badge>

            {/* Main Headline - from PDF */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
              {t('landing.hero.mainTitle', 'Сайт-визитка за 2 минуты,')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-blue-500 animate-gradient">
                {t('landing.hero.mainHighlight', 'который продаёт')}
              </span>
            </h1>

            {/* Value Proposition - from PDF */}
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:200ms]">
              {t('landing.hero.valueProposition', 'AI собирает структуру и тексты. Заявки попадают в мини-CRM и Telegram. Аналитика подсказывает, что улучшить.')}
            </p>

            {/* CTA Buttons - Primary + Secondary */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:400ms]">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t('landing.hero.primaryCta', 'Создать страницу')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/gallery')}
                className="h-14 rounded-2xl text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Users className="h-5 w-5 mr-2" />
                {t('landing.hero.secondaryCta', 'Смотреть примеры')}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                {t('landing.hero.microNote', 'Займёт ~2 минуты. Можно с телефона.')}
              </p>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground animate-in fade-in duration-1000 [animation-delay:600ms]">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                4.9/5
              </span>
              <span>•</span>
              <span>5,000+ {t('landing.hero.users', 'пользователей')}</span>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF SECTION */}
        <section className="py-8 px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-center mb-6 text-muted-foreground">
              {t('landing.socialProof.title', 'Примеры страниц, которые реально продают')}
            </h2>
            {/* Gallery preview will be here */}
            <Suspense fallback={null}>
              <LandingGallerySection />
            </Suspense>
          </div>
        </section>

        {/* PROBLEM SECTION - Why leads are lost */}
        <section className="py-12 px-5 bg-muted/30">
          <div className="max-w-lg mx-auto">
            <Badge variant="outline" className="mb-4 mx-auto flex w-fit">
              <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
              {t('landing.problem.badge', 'Проблема')}
            </Badge>
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.problem.title', 'Почему заявки теряются')}
            </h2>

            <div className="space-y-4">
              <ProblemCard 
                text={t('landing.problem.item1', 'В bio хаос: прайс, запись и кейсы разбросаны по постам и ссылкам')}
              />
              <ProblemCard 
                text={t('landing.problem.item2', 'Люди задают одни вопросы, а вы отвечаете вручную и забываете про встречи')}
              />
              <ProblemCard 
                text={t('landing.problem.item3', 'Taplink превращается в «меню ссылок», а не путь к записи')}
              />
              <ProblemCard 
                text={t('landing.problem.item4', 'Нет понимания: что реально кликают и где теряется внимание')}
              />
            </div>

            {/* Solution teaser */}
            <Card className="mt-8 p-5 bg-primary/5 border-primary/20">
              <p className="text-sm leading-relaxed">
                {t('landing.problem.solution', 'lnkmx делает одну понятную страницу, где посетитель быстро понимает, кто вы, чем полезны, сколько стоит, и куда нажать для заявки. А вы видите лиды и аналитику в одном месте.')}
              </p>
            </Card>
          </div>
        </section>

        {/* HOW IT WORKS - 3 Steps */}
        <section className="py-12 px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.howItWorks.title', 'Как это работает')}
            </h2>

            <div className="space-y-4">
              <StepCard
                number="1"
                title={t('landing.howItWorks.step1.title', 'Выберите нишу')}
                description={t('landing.howItWorks.step1.description', 'Выберите нишу/шаблон и напишите 1-2 предложения о себе')}
                delay={0}
              />
              <StepCard
                number="2"
                title={t('landing.howItWorks.step2.title', 'AI соберёт страницу')}
                description={t('landing.howItWorks.step2.description', 'AI собирает структуру, тексты, CTA и базовый прайс')}
                delay={100}
              />
              <StepCard
                number="3"
                title={t('landing.howItWorks.step3.title', 'Получайте заявки')}
                description={t('landing.howItWorks.step3.description', 'Публикуете и получаете заявки в мини-CRM + Telegram')}
                delay={200}
              />
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
              >
                {t('landing.howItWorks.cta', 'Попробовать сейчас')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* FOR WHOM - Target audiences */}
        <section className="py-12 px-5 bg-muted/30">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.forWhom.title', 'Кому lnkmx даёт максимум пользы')}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <AudienceCard
                icon={<Briefcase className="h-6 w-6" />}
                iconBg="bg-violet-500"
                title={t('landing.forWhom.expert.title', 'Эксперты')}
                description={t('landing.forWhom.expert.desc', 'Запись, кейсы, прайс')}
              />
              <AudienceCard
                icon={<Target className="h-6 w-6" />}
                iconBg="bg-blue-500"
                title={t('landing.forWhom.freelancer.title', 'Фрилансеры')}
                description={t('landing.forWhom.freelancer.desc', 'Портфолио, заявки')}
              />
              <AudienceCard
                icon={<Scissors className="h-6 w-6" />}
                iconBg="bg-pink-500"
                title={t('landing.forWhom.beauty.title', 'Бьюти')}
                description={t('landing.forWhom.beauty.desc', 'Запись, отзывы, гео')}
              />
              <AudienceCard
                icon={<Camera className="h-6 w-6" />}
                iconBg="bg-amber-500"
                title={t('landing.forWhom.creator.title', 'Creators')}
                description={t('landing.forWhom.creator.desc', 'Хаб ссылок, продажи')}
              />
            </div>
          </div>
        </section>

        {/* FEATURES - What's inside */}
        <section className="py-12 px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.features.title', 'Что внутри')}
            </h2>

            <div className="space-y-4">
              <FeatureSection
                icon={<Bot className="h-6 w-6" />}
                iconBg="bg-violet-500"
                title={t('landing.features.ai.title', 'AI-сборка страницы')}
                items={[
                  t('landing.features.ai.item1', 'AI делает первую версию из готовых блоков'),
                  t('landing.features.ai.item2', 'Тексты можно переписать/усилить в один тап'),
                  t('landing.features.ai.item3', 'Перевод контента RU/EN/KZ'),
                ]}
                note={t('landing.features.ai.note', 'Это не пустой шаблон. Это готовая структура.')}
              />

              <FeatureSection
                icon={<Smartphone className="h-6 w-6" />}
                iconBg="bg-emerald-500"
                title={t('landing.features.editor.title', 'Редактор с телефона')}
                items={[
                  t('landing.features.editor.item1', 'Блоки редактируются через удобные модалки'),
                  t('landing.features.editor.item2', 'Drag&drop + режим «вверх/вниз»'),
                  t('landing.features.editor.item3', 'Undo/Redo история действий'),
                ]}
              />

              <FeatureSection
                icon={<Send className="h-6 w-6" />}
                iconBg="bg-blue-500"
                title={t('landing.features.crm.title', 'CRM + Telegram')}
                items={[
                  t('landing.features.crm.item1', 'Мини-CRM: лиды, статусы, заметки'),
                  t('landing.features.crm.item2', 'Уведомления о заявках в Telegram'),
                  t('landing.features.crm.item3', 'Шаблоны быстрых ответов'),
                ]}
              />

              <FeatureSection
                icon={<BarChart3 className="h-6 w-6" />}
                iconBg="bg-amber-500"
                title={t('landing.features.analytics.title', 'Аналитика с подсказками')}
                items={[
                  t('landing.features.analytics.item1', 'Просмотры и клики по блокам'),
                  t('landing.features.analytics.item2', 'Источники трафика, устройства'),
                  t('landing.features.analytics.item3', 'Подсказки «что улучшить»'),
                ]}
              />
            </div>
          </div>
        </section>

        {/* PRICING - Actual prices from PDF */}
        <section className="py-12 px-5 bg-muted/30">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-3">
              {t('landing.pricing.title', 'Тарифы')}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {t('landing.pricing.subtitle', 'Начните бесплатно, растите с нами')}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Free tier */}
              <Card className="p-5 border-2 border-border/50 hover:border-border transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Free</h3>
                    <p className="text-2xl font-black">0 {currency}</p>
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
              </Card>

              {/* Pro tier */}
              <Card className="p-5 border-2 border-primary bg-primary/5 relative overflow-hidden hover:bg-primary/10 transition-colors">
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl">
                  {t('landing.pricing.popular', 'Выгодно')}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      Pro
                      <Crown className="h-4 w-4 text-amber-500" />
                    </h3>
                    <p className="text-2xl font-black">
                      {isKZ ? '2 610 ₸' : '$5'}<span className="text-base font-normal text-muted-foreground">/мес</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isKZ ? '31 320 ₸ за 12 месяцев' : '$60/year'}
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
                  onClick={() => navigate('/pricing')}
                >
                  {t('landing.pricing.viewPlans', 'Оформить Pro')}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  {t('landing.pricing.note', 'Оплата в тенге. Можно отменить в любой момент.')}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* COMPARISON - vs Taplink/Linktree */}
        <section className="py-12 px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.comparison.title', 'Сравнение с Taplink/Linktree')}
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
                    feature={t('landing.comparison.ai', 'AI-сборка')} 
                    lnkmx={true} 
                    others={false} 
                  />
                  <ComparisonRow 
                    feature={t('landing.comparison.crm', 'Мини-CRM')} 
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

        {/* FAQ */}
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>

        {/* FINAL CTA */}
        <section className="py-16 px-5 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">
              {t('landing.finalCta.title', 'Соберите страницу, которая продаёт, за 2 минуты')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {t('landing.finalCta.description', 'Не теряйте клиентов в личке. Дайте им понятный путь: кто вы → чем помогаете → сколько стоит → записаться.')}
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t('landing.finalCta.primaryCta', 'Создать страницу')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/gallery')}
                className="h-14 rounded-2xl text-base font-bold"
              >
                {t('landing.finalCta.secondaryCta', 'Смотреть примеры')}
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
              <span>•</span>
              <button onClick={() => navigate('/pricing')} className="hover:text-foreground transition-colors">
                {t('pricing.title', 'Тарифы')}
              </button>
              <span>•</span>
              <TermsLink className="hover:text-foreground transition-colors">
                {t('legal.termsOfService', 'Условия')}
              </TermsLink>
              <span>•</span>
              <PrivacyLink className="hover:text-foreground transition-colors">
                {t('legal.privacyPolicy', 'Политика')}
              </PrivacyLink>
            </div>

            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>ИП BEEGIN - БИН: 971207300019</p>
              <p>г. Алматы, ул. Шолохова, д. 20/7</p>
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
                onClick={() => navigate('/auth')}
                className="flex-1 h-14 rounded-2xl font-bold text-base shadow-2xl shadow-primary/40 bg-gradient-to-r from-primary via-blue-500 to-violet-600 hover:scale-[1.02] transition-transform"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {t('landing.floatingCta.create', 'Создать')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/gallery')}
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

// Problem Card Component
function ProblemCard({ text }: { text: string }) {
  return (
    <Card className="p-4 flex items-start gap-3 bg-destructive/5 border-destructive/20 animate-in fade-in slide-in-from-left-2 duration-300">
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
      className="p-4 flex items-start gap-4 bg-card/50 backdrop-blur border-border/30 hover:bg-card/80 transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-2 duration-500"
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
  description 
}: { 
  icon: React.ReactNode; 
  iconBg: string; 
  title: string; 
  description: string; 
}) {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur border-border/30 hover:bg-card/80 hover:scale-[1.02] transition-all">
      <div className={cn(
        "h-12 w-12 rounded-xl flex items-center justify-center text-white mb-3",
        iconBg
      )}>
        {icon}
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}

// Feature Section Component
function FeatureSection({ 
  icon, 
  iconBg, 
  title, 
  items,
  note,
}: { 
  icon: React.ReactNode; 
  iconBg: string; 
  title: string; 
  items: string[];
  note?: string;
}) {
  return (
    <Card className="p-5 bg-card/50 backdrop-blur border-border/30 hover:bg-card/80 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center text-white flex-shrink-0",
          iconBg
        )}>
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {note && (
        <p className="mt-4 text-xs text-muted-foreground italic border-t pt-3 border-border/30">
          {note}
        </p>
      )}
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
