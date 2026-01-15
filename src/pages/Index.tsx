/**
 * Index v1.2 - Mobile-first landing page
 * iOS-style design with liquid glass effects
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
  ChevronRight,
  Zap,
  Crown,
  BarChart3,
  MessageCircle,
  Star,
  ArrowRight,
  Check,
  Smartphone,
  Palette,
  Bot,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useEffect, useState, Suspense } from 'react';
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
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SEOLandingHead currentLanguage={i18n.language} />
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Background gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent rounded-full blur-[100px]" />
          <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-gradient-to-bl from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent rounded-full blur-[120px]" />
        </div>

        {/* Navigation - Floating glass pill */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-card/80 backdrop-blur-2xl border border-border/30 rounded-2xl shadow-xl shadow-black/5">
              <div className="px-4 h-14 flex items-center justify-between">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center"
                >
                  <span className="text-lg font-bold">
                    Link<span className="text-primary">MAX</span>
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/gallery')}
                    className="hidden sm:flex rounded-xl"
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    {t('landing.nav.gallery', 'Галерея')}
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="rounded-xl font-bold shadow-lg shadow-primary/20"
                    size="sm"
                  >
                    {t('landing.nav.getStarted', 'Начать')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section - Mobile app style */}
        <section className="pt-24 pb-12 px-5">
          <div className="max-w-lg mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 h-8 px-4 text-sm font-bold bg-primary/10 text-primary border-primary/20 rounded-full">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('landing.hero.badge', 'AI-first платформа')}
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.1]">
              {t('landing.hero.title', 'Сайт за')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-blue-500">
                {t('landing.hero.highlight', '2 минуты')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
              {t('landing.hero.subtitle', 'AI создаёт вашу страницу. Вы просто описываете себя.')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/30"
              >
                <Zap className="h-5 w-5 mr-2" />
                {t('landing.hero.cta', 'Создать бесплатно')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/gallery')}
                className="h-14 rounded-2xl text-base font-bold"
              >
                <Users className="h-5 w-5 mr-2" />
                {t('landing.hero.secondary', 'Смотреть примеры')}
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                4.9/5
              </span>
              <span>•</span>
              <span>5,000+ пользователей</span>
            </div>
          </div>
        </section>

        {/* Features Grid - iOS card style */}
        <section className="py-12 px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.features.title', 'Всё что нужно')}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <FeatureCard
                icon={<Bot className="h-6 w-6" />}
                iconBg="bg-violet-500"
                title={t('landing.features.ai', 'AI Генерация')}
                description={t('landing.features.aiDesc', 'Страница за секунды')}
              />
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                iconBg="bg-emerald-500"
                title={t('landing.features.analytics', 'Аналитика')}
                description={t('landing.features.analyticsDesc', 'Клики и просмотры')}
              />
              <FeatureCard
                icon={<MessageCircle className="h-6 w-6" />}
                iconBg="bg-blue-500"
                title={t('landing.features.crm', 'CRM')}
                description={t('landing.features.crmDesc', 'Управление заявками')}
              />
              <FeatureCard
                icon={<Palette className="h-6 w-6" />}
                iconBg="bg-pink-500"
                title={t('landing.features.themes', '20+ Тем')}
                description={t('landing.features.themesDesc', 'Красивые дизайны')}
              />
            </div>
          </div>
        </section>

        {/* How it works - Steps */}
        <section className="py-12 px-5 bg-muted/30">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-8">
              {t('landing.howItWorks.title', 'Как это работает')}
            </h2>

            <div className="space-y-4">
              <StepCard
                number="1"
                title={t('landing.howItWorks.step1', 'Выберите нишу')}
                description={t('landing.howItWorks.step1Desc', 'Блогер, мастер, бизнес - мы подберём шаблон')}
              />
              <StepCard
                number="2"
                title={t('landing.howItWorks.step2', 'Опишите себя')}
                description={t('landing.howItWorks.step2Desc', 'Пара предложений - и AI создаст страницу')}
              />
              <StepCard
                number="3"
                title={t('landing.howItWorks.step3', 'Публикуйте!')}
                description={t('landing.howItWorks.step3Desc', 'Получите ссылку и делитесь везде')}
              />
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-primary/30"
              >
                {t('landing.howItWorks.cta', 'Попробовать сейчас')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-12 px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-center mb-3">
              {t('landing.pricing.title', 'Простые тарифы')}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {t('landing.pricing.subtitle', 'Начните бесплатно, растите с нами')}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Free tier */}
              <Card className="p-5 border-2 border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Free</h3>
                    <p className="text-2xl font-black">0 ₸</p>
                  </div>
                  <Badge variant="secondary" className="text-sm font-bold">
                    {t('landing.pricing.forever', 'Навсегда')}
                  </Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    6 базовых блоков
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    1 AI генерация/месяц
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Базовая аналитика
                  </li>
                </ul>
              </Card>

              {/* Pro tier */}
              <Card className="p-5 border-2 border-primary bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl">
                  {t('landing.pricing.popular', 'Популярный')}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      Pro
                      <Crown className="h-4 w-4 text-amber-500" />
                    </h3>
                    <p className="text-2xl font-black">
                      от 1,990 ₸<span className="text-base font-normal text-muted-foreground">/мес</span>
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Все 20+ блоков
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    5 AI генераций/месяц
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    CRM + Telegram уведомления
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Расширенная аналитика
                  </li>
                </ul>
                <Button 
                  className="w-full h-12 rounded-xl font-bold"
                  onClick={() => navigate('/pricing')}
                >
                  {t('landing.pricing.viewPlans', 'Смотреть тарифы')}
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <Suspense fallback={null}>
          <LandingGallerySection />
        </Suspense>

        {/* FAQ */}
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8 px-5 bg-muted/20">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-6">
              <span className="text-lg font-bold">
                Link<span className="text-primary">MAX</span>
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
              <p>ИП BEEGIN • БИН: 971207300019</p>
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
              <p className="pt-2">{t('landing.footer.copyright', '© 2025 LinkMAX')}</p>
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
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full h-14 rounded-2xl font-bold text-base shadow-2xl shadow-primary/40 bg-gradient-to-r from-primary via-blue-500 to-violet-600"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {t('landing.floatingCta', 'Создать бесплатно')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

// Feature Card Component
function FeatureCard({ 
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
    <Card className="p-4 bg-card/50 backdrop-blur border-border/30 hover:bg-card/80 transition-colors">
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

// Step Card Component  
function StepCard({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string; 
}) {
  return (
    <Card className="p-4 flex items-start gap-4 bg-card/50 backdrop-blur border-border/30">
      <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-lg shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}