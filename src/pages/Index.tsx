import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Link2, 
  Zap, 
  Shield, 
  Smartphone, 
  Share2, 
  ArrowRight,
  Star,
  TrendingUp,
  Check,
  X,
  Crown,
  Play,
  Users,
  BarChart3,
  Palette,
  Bot,
  Globe,
  Clock,
  DollarSign,
  AlertCircle,
  UserX,
  Frown,
  LineChart,
  Wand2,
  Rocket,
  PenTool,
  MessageSquare,
  Briefcase,
  Scissors,
  Camera,
  Dumbbell,
  GraduationCap,
  Heart,
  Brain,
  Coffee,
  ShoppingBag,
  Building2,
  Stethoscope,
  School,
  Wrench,
  Ticket,
  Gift,
  CreditCard,
  BadgeCheck,
  Layers,
  MousePointerClick
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { openPremiumPurchase } from '@/lib/upgrade-utils';
import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { LandingFeaturedPages } from '@/components/landing/LandingFeaturedPages';
import { LandingGallerySection } from '@/components/landing/LandingGallerySection';
import { FAQSection } from '@/components/landing/FAQSection';
import { UseCasesGallery } from '@/components/landing/UseCasesGallery';
import { TermsLink } from '@/components/legal/TermsOfServiceModal';
import { PrivacyLink } from '@/components/legal/PrivacyPolicyModal';

// Lazy load 3D component for better performance
const Hero3D = lazy(() => import('@/components/landing/Hero3D').then(m => ({ default: m.Hero3D })));

// Intersection Observer hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated counter component
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number | string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();
  
  useEffect(() => {
    if (!isVisible || typeof end !== 'number') return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {typeof end === 'number' ? count : end}{suffix}
    </span>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');

  const handleCreatePage = () => {
    if (username.trim()) {
      navigate(`/auth?username=${encodeURIComponent(username.trim())}`);
    } else {
      navigate('/auth');
    }
  };

  // Capabilities - inspired by korner but enhanced
  const capabilities = [
    { 
      icon: Layers, 
      title: t('landing.capabilities.noCode.title', 'Конструктор без кода'), 
      description: t('landing.capabilities.noCode.desc', 'Создавайте страницы легко и быстро'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Wand2, 
      title: t('landing.capabilities.ai.title', 'AI создаёт за вас'), 
      description: t('landing.capabilities.ai.desc', 'Выберите нишу — AI соберёт страницу'),
      gradient: 'from-violet-500 to-purple-600'
    },
    { 
      icon: CreditCard, 
      title: t('landing.capabilities.sell.title', 'Продавайте эффективно'), 
      description: t('landing.capabilities.sell.desc', 'Товары, услуги и цифровые продукты'),
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      icon: Ticket, 
      title: t('landing.capabilities.tickets.title', 'Билеты и донаты'), 
      description: t('landing.capabilities.tickets.desc', 'Привлекайте аудиторию и собирайте средства'),
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      icon: BarChart3, 
      title: t('landing.capabilities.analytics.title', 'Аналитика'), 
      description: t('landing.capabilities.analytics.desc', 'Только полезные данные — без лишних цифр'),
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      icon: Users, 
      title: t('landing.capabilities.partnership.title', 'Партнёрская программа'), 
      description: t('landing.capabilities.partnership.desc', 'Растите вместе с партнёрами'),
      gradient: 'from-indigo-500 to-blue-600'
    },
  ];

  // Audience segments - inspired by korner
  const audienceSegments = [
    {
      id: 'creators',
      icon: Heart,
      title: t('landing.segments.creators.title', 'Креаторы'),
      description: t('landing.segments.creators.desc', 'Создавайте страницы, продавайте билеты, цифровой контент или публикуйте премиум-материалы. Легко и без технических сложностей.'),
      gradient: 'from-pink-500 to-rose-500',
      cta: t('landing.segments.creators.cta', 'Начать создавать')
    },
    {
      id: 'influencers',
      icon: Star,
      title: t('landing.segments.influencers.title', 'Инфлюенсеры'),
      description: t('landing.segments.influencers.desc', 'Делитесь контентом и продвигайте любимые бренды на своей странице. Удобный способ взаимодействовать с аудиторией и партнёрами.'),
      gradient: 'from-violet-500 to-purple-600',
      cta: t('landing.segments.influencers.cta', 'Стать амбассадором')
    },
    {
      id: 'business',
      icon: Building2,
      title: t('landing.segments.business.title', 'Бизнес'),
      description: t('landing.segments.business.desc', 'Объедините блогеров, фанатов и амбассадоров в одном пространстве. Упростите коммуникацию и продвигайте продукт без бюрократии.'),
      gradient: 'from-emerald-500 to-teal-500',
      cta: t('landing.segments.business.cta', 'Связаться с нами')
    },
  ];

  const problems = [
    { icon: Clock, title: t('landing.problems.noTime.title'), description: t('landing.problems.noTime.description'), color: 'from-red-500 to-orange-500' },
    { icon: DollarSign, title: t('landing.problems.expensive.title'), description: t('landing.problems.expensive.description'), color: 'from-amber-500 to-yellow-500' },
    { icon: AlertCircle, title: t('landing.problems.oneLink.title'), description: t('landing.problems.oneLink.description'), color: 'from-blue-500 to-cyan-500' },
    { icon: UserX, title: t('landing.problems.noLeads.title'), description: t('landing.problems.noLeads.description'), color: 'from-purple-500 to-violet-500' },
    { icon: Frown, title: t('landing.problems.oldDesign.title'), description: t('landing.problems.oldDesign.description'), color: 'from-pink-500 to-rose-500' },
    { icon: LineChart, title: t('landing.problems.noAnalytics.title'), description: t('landing.problems.noAnalytics.description'), color: 'from-emerald-500 to-teal-500' }
  ];

  const solutions = [
    { icon: Wand2, title: t('landing.solutions.ai.title'), description: t('landing.solutions.ai.description'), gradient: 'from-violet-500 to-purple-600' },
    { icon: Rocket, title: t('landing.solutions.speed.title'), description: t('landing.solutions.speed.description'), gradient: 'from-blue-500 to-cyan-500' },
    { icon: PenTool, title: t('landing.solutions.design.title'), description: t('landing.solutions.design.description'), gradient: 'from-pink-500 to-rose-500' },
    { icon: MessageSquare, title: t('landing.solutions.crm.title'), description: t('landing.solutions.crm.description'), gradient: 'from-emerald-500 to-teal-500' },
    { icon: BarChart3, title: t('landing.solutions.analytics.title'), description: t('landing.solutions.analytics.description'), gradient: 'from-amber-500 to-orange-500' },
    { icon: Smartphone, title: t('landing.solutions.mobile.title'), description: t('landing.solutions.mobile.description'), gradient: 'from-indigo-500 to-blue-500' }
  ];

  const b2cAudiences = [
    { icon: Scissors, label: t('landing.audiences.b2c.items.barber') },
    { icon: Camera, label: t('landing.audiences.b2c.items.photographer') },
    { icon: Dumbbell, label: t('landing.audiences.b2c.items.coach') },
    { icon: GraduationCap, label: t('landing.audiences.b2c.items.tutor') },
    { icon: Heart, label: t('landing.audiences.b2c.items.beauty') },
    { icon: Brain, label: t('landing.audiences.b2c.items.psychologist') }
  ];

  const b2bAudiences = [
    { icon: Coffee, label: t('landing.audiences.b2b.items.cafe') },
    { icon: ShoppingBag, label: t('landing.audiences.b2b.items.shop') },
    { icon: Building2, label: t('landing.audiences.b2b.items.agency') },
    { icon: Stethoscope, label: t('landing.audiences.b2b.items.clinic') },
    { icon: School, label: t('landing.audiences.b2b.items.school') },
    { icon: Wrench, label: t('landing.audiences.b2b.items.service') }
  ];

  const features = [
    { icon: Sparkles, title: t('landing.features.aiGeneration.title'), description: t('landing.features.aiGeneration.description'), gradient: 'from-violet-500 to-purple-600', delay: '0ms' },
    { icon: Link2, title: t('landing.features.magicLinks.title'), description: t('landing.features.magicLinks.description'), gradient: 'from-blue-500 to-cyan-500', delay: '100ms' },
    { icon: Users, title: 'Команды и коллабы', description: 'Создавайте команды, приглашайте участников по ссылке, управляйте совместными страницами', gradient: 'from-amber-500 to-orange-500', delay: '200ms' },
    { icon: Smartphone, title: t('landing.features.mobile.title'), description: t('landing.features.mobile.description'), gradient: 'from-emerald-500 to-teal-500', delay: '300ms' },
    { icon: Share2, title: t('landing.features.sharing.title'), description: t('landing.features.sharing.description'), gradient: 'from-pink-500 to-rose-500', delay: '400ms' },
    { icon: Shield, title: t('landing.features.privacy.title'), description: t('landing.features.privacy.description'), gradient: 'from-slate-500 to-zinc-600', delay: '500ms' }
  ];

  const stats = [
    { value: 2, label: t('landing.stats.minutes'), suffix: t('landing.stats.minutesSuffix') },
    { value: '20+', label: t('landing.stats.blocks') },
    { value: '∞', label: t('landing.stats.possibilities') }
  ];

  // Pricing features organized by plan
  const freeFeatures = [
    t('landing.pricing.features.free.presetThemes'),
    t('landing.pricing.features.free.basicCustomization'),
    t('landing.pricing.features.free.unlimitedLinks'),
    t('landing.pricing.features.free.textBlocks'),
    t('landing.pricing.features.free.basicBlocks'),
    t('landing.pricing.features.free.messengers'),
    t('landing.pricing.features.free.maps'),
    t('landing.pricing.features.free.basicStats'),
    t('landing.pricing.features.free.qrCode'),
    t('landing.pricing.features.free.ai3'),
  ];

  const proFeatures = [
    t('landing.pricing.features.pro.allFree'),
    t('landing.pricing.features.pro.proThemes'),
    t('landing.pricing.features.pro.media'),
    t('landing.pricing.features.pro.pricing'),
    t('landing.pricing.features.pro.customCode'),
    t('landing.pricing.features.pro.pixels'),
    t('landing.pricing.features.pro.scheduler'),
    t('landing.pricing.features.pro.clickAnalytics'),
    t('landing.pricing.features.pro.noWatermark'),
    t('landing.pricing.features.pro.miniCrm'),
    t('landing.pricing.features.pro.telegramLeads'),
    t('landing.pricing.features.pro.unlimitedAi'),
  ];

  const businessFeatures = [
    t('landing.pricing.features.business.allPro'),
    t('landing.pricing.features.business.innerPages'),
    t('landing.pricing.features.business.digitalProducts'),
    t('landing.pricing.features.business.applicationForms'),
    t('landing.pricing.features.business.payments'),
    t('landing.pricing.features.business.whiteLabel'),
    t('landing.pricing.features.business.fullCrm'),
    t('landing.pricing.features.business.autoNotifications'),
    t('landing.pricing.features.business.realtimeNotifications'),
    t('landing.pricing.features.business.timers'),
    t('landing.pricing.features.business.customDomain'),
    t('landing.pricing.features.business.ssl'),
    t('landing.pricing.features.business.marketingAddons'),
  ];

  const showcaseFeatures = [
    { icon: Bot, label: t('landing.benefits.ai') },
    { icon: Palette, label: t('landing.benefits.design') },
    { icon: BarChart3, label: t('landing.benefits.analytics') },
    { icon: BadgeCheck, label: t('landing.benefits.verified', 'Верификация') },
    { icon: Users, label: 'Команды' }
  ];

  // Why LinkMAX is better than competitors
  const advantages = [
    { 
      icon: Wand2, 
      title: t('landing.advantages.ai.title', 'AI создаёт всё за вас'),
      description: t('landing.advantages.ai.desc', 'В отличие от конкурентов, LinkMAX использует AI для генерации контента, текстов и структуры'),
      highlight: true
    },
    { 
      icon: DollarSign, 
      title: t('landing.advantages.price.title', 'В 10 раз дешевле'),
      description: t('landing.advantages.price.desc', 'Всего от $2.50/мес вместо $10-15 у конкурентов'),
      highlight: true
    },
    { 
      icon: BadgeCheck, 
      title: t('landing.advantages.verified.title', 'Галочка верификации'),
      description: t('landing.advantages.verified.desc', 'Premium-пользователи получают значок доверия на своей странице')
    },
    { 
      icon: MousePointerClick, 
      title: t('landing.advantages.demo.title', 'Попробуй сейчас'),
      description: t('landing.advantages.demo.desc', 'Интерактивное демо прямо на сайте — не нужна регистрация')
    },
  ];

  // Billing period state: '3' | '6' | '12' months
  const [billingPeriod, setBillingPeriod] = useState<'3' | '6' | '12'>('12');

  // Pricing data with different periods
  const pricingPlans = {
    pro: {
      '3': { monthly: 5.00, total: 15 },
      '6': { monthly: 3.50, total: 21 },
      '12': { monthly: 2.50, total: 30 },
    },
    business: {
      '3': { monthly: 9.50, total: 28.50 },
      '6': { monthly: 7.00, total: 42 },
      '12': { monthly: 5.00, total: 60 },
    }
  };

  const getSavingsPercent = (plan: 'pro' | 'business') => {
    const baseMonthly = pricingPlans[plan]['3'].monthly;
    const currentMonthly = pricingPlans[plan][billingPeriod].monthly;
    return Math.round((1 - currentMonthly / baseMonthly) * 100);
  };

  const heroSection = useScrollAnimation();
  const capabilitiesSection = useScrollAnimation();
  const segmentsSection = useScrollAnimation();
  const problemsSection = useScrollAnimation();
  const solutionsSection = useScrollAnimation();
  const audiencesSection = useScrollAnimation();
  const featuresSection = useScrollAnimation();
  const howItWorksSection = useScrollAnimation();
  const advantagesSection = useScrollAnimation();
  const pricingSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Enhanced Liquid Glass Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[1000px] h-[1000px] bg-gradient-to-br from-primary/25 via-violet-500/15 to-transparent rounded-full blur-[180px] animate-morph" />
        <div className="absolute top-1/4 -right-40 w-[800px] h-[800px] bg-gradient-to-bl from-blue-500/20 via-cyan-500/15 to-transparent rounded-full blur-[150px] animate-morph" style={{ animationDelay: '-5s' }} />
        <div className="absolute -bottom-40 left-1/4 w-[900px] h-[900px] bg-gradient-to-tr from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-[160px] animate-morph" style={{ animationDelay: '-10s' }} />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute top-[60%] left-[10%] w-[400px] h-[400px] bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] bg-gradient-to-l from-rose-500/10 via-pink-500/5 to-transparent rounded-full blur-[80px] animate-float" style={{ animationDelay: '-7s' }} />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute top-[15%] left-[10%] w-5 h-5 bg-primary/40 rounded-full blur-sm animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] right-[15%] w-4 h-4 bg-blue-400/40 rounded-full blur-sm animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-[20%] left-[25%] w-6 h-6 bg-purple-400/35 rounded-full blur-sm animate-float" style={{ animationDelay: '-4s' }} />
        <div className="absolute top-[45%] left-[5%] w-3 h-3 bg-emerald-400/30 rounded-full blur-sm animate-float" style={{ animationDelay: '-1s' }} />
        <div className="absolute bottom-[35%] right-[10%] w-4 h-4 bg-pink-400/35 rounded-full blur-sm animate-float" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Liquid Glass Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
        <div className="mx-3 sm:mx-6 mt-3 sm:mt-4">
          <div className="backdrop-blur-2xl bg-card/70 border border-border/40 rounded-2xl shadow-glass-lg">
            <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg group-hover:blur-xl group-hover:bg-primary/40 transition-all duration-500" />
                  <img 
                    src="/pwa-maskable-512x512.png" 
                    alt="LinkMAX" 
                    className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-primary rounded-full animate-glow-pulse shadow-lg shadow-primary/50" />
                </div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Link<span className="text-gradient">MAX</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-3">
                <LanguageSwitcher />
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/gallery')}
                  className="inline-flex font-medium hover:bg-foreground/5 backdrop-blur-sm rounded-xl"
                  size="sm"
                >
                  <Users className="h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">{t('landing.nav.gallery', 'Gallery')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="hidden sm:inline-flex font-medium hover:bg-foreground/5 backdrop-blur-sm rounded-xl"
                  size="sm"
                >
                  {t('landing.nav.signIn')}
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 bg-primary/90 backdrop-blur-sm text-sm sm:text-base px-3 sm:px-4"
                  size="sm"
                >
                  {t('landing.nav.getStarted')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced with username input like korner */}
      <section ref={heroSection.ref} className="relative pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24 px-4">
        <div className="hidden lg:block">
          <Suspense fallback={null}>
            <Hero3D />
          </Suspense>
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
            {/* Main heading */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] opacity-0 ${heroSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.hero.title1', 'Ваша цифровая визитка.')}
              <br />
              <span className="text-gradient bg-[length:200%_auto] animate-gradient-x inline-block mt-1">
                {t('landing.hero.title2', 'Всё в одном месте.')}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`text-lg sm:text-xl lg:text-2xl text-muted-foreground/90 max-w-2xl leading-relaxed font-medium opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '150ms' }}
            >
              {t('landing.hero.subtitle2', 'Одна ссылка для всех соцсетей, портфолио и бизнеса')}
            </p>
            
            {/* Username Input - Inspired by korner */}
            <div 
              className={`w-full max-w-lg opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '300ms' }}
            >
              <div className="relative flex items-center gap-2 p-2 rounded-2xl bg-card/80 backdrop-blur-2xl border border-border/50 shadow-glass-lg">
                <div className="flex-shrink-0 pl-4 text-muted-foreground font-medium">
                  linkmax.app/
                </div>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder={t('landing.hero.usernamePlaceholder', 'yourname')}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-lg font-medium placeholder:text-muted-foreground/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
                />
                <Button 
                  onClick={handleCreatePage}
                  className="rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 px-6 py-5 text-base"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('landing.hero.create', 'Создать')}
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div 
              className={`flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '450ms' }}
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{t('landing.hero.free', 'Бесплатно навсегда')}</span>
              </div>
              <div className="h-4 w-px bg-border/50" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>{t('landing.hero.noCode', 'Без программирования')}</span>
              </div>
              <div className="h-4 w-px bg-border/50" />
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span>{t('landing.hero.aiPowered', 'AI помогает')}</span>
              </div>
            </div>

            {/* Phone mockup with enhanced animations */}
            <div 
              className={`relative flex justify-center mt-8 opacity-0 ${heroSection.isVisible ? 'animate-slide-in-up' : ''}`}
              style={{ animationDelay: '600ms' }}
            >
              <div className="relative">
                {/* Floating elements */}
                <div className="absolute -top-8 -left-10 p-3.5 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-glass-lg animate-float z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-bold">AI Ready</span>
                      <div className="text-xs text-muted-foreground">Auto-generate</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-12 p-3.5 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-glass-lg animate-float z-10" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-emerald-500">+247%</span>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/3 -right-8 p-3.5 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-glass-lg animate-float z-10" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <BadgeCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-bold">Verified</span>
                      <div className="text-xs text-muted-foreground">Premium</div>
                    </div>
                  </div>
                </div>

                {/* Phone frame */}
                <div className="relative w-[280px] sm:w-[340px] h-[560px] sm:h-[680px] bg-foreground/95 backdrop-blur-xl rounded-[3rem] p-2.5 sm:p-3 shadow-2xl border border-foreground/10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 sm:h-7 bg-foreground rounded-b-2xl z-10 flex items-center justify-center">
                    <div className="w-16 h-1.5 bg-foreground/50 rounded-full" />
                  </div>
                  
                  <div className="relative h-full w-full bg-background rounded-[2.5rem] overflow-hidden border border-border/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-[shimmer_3s_infinite] opacity-60" />
                    
                    <div className="p-5 space-y-4">
                      <div className="pt-10 flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-blue-500 to-primary p-0.5 animate-pulse-glow shadow-xl shadow-primary/30">
                            <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                              <span className="text-3xl">👤</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/50 border-2 border-background">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                        </div>
                        <div className="text-center space-y-1">
                          <h3 className="font-bold text-xl">Alex Creator</h3>
                          <p className="text-sm text-muted-foreground font-medium">Digital Artist & Designer</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-3">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary via-blue-500 to-primary text-white text-center font-semibold shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform cursor-pointer">
                          🎨 My Portfolio
                        </div>
                        <div className="p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 text-center font-medium hover:border-primary/40 hover:scale-[1.02] transition-all cursor-pointer">
                          📸 Instagram
                        </div>
                        <div className="p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 text-center font-medium hover:border-primary/40 hover:scale-[1.02] transition-all cursor-pointer">
                          🎥 YouTube
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform cursor-pointer shadow-md shadow-pink-500/20">📱</div>
                          <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform cursor-pointer shadow-md shadow-blue-500/20">💬</div>
                          <div className="aspect-square rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform cursor-pointer shadow-md shadow-violet-500/20">✉️</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/40 via-blue-500/30 to-purple-500/40 rounded-[3rem] blur-[60px] opacity-60 animate-pulse-glow" />
              </div>
            </div>

            {/* Showcase features bar */}
            <div 
              className={`flex flex-wrap justify-center gap-2.5 sm:gap-4 mt-8 opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '750ms' }}
            >
              {showcaseFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/60 backdrop-blur-2xl border border-border/40 hover:border-primary/50 hover:bg-card/80 hover:shadow-glass transition-all duration-300 cursor-default group"
                >
                  <div className="relative">
                    <feature.icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-semibold">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works - 4 steps like korner */}
      <section ref={howItWorksSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${howItWorksSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.howItWorks.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: t('landing.howItWorks.step1.title', 'Регистрация'), desc: t('landing.howItWorks.step1.desc', 'Быстро — меньше минуты'), delay: '0ms' },
              { step: '2', title: t('landing.howItWorks.step2.title', 'Настройка дизайна'), desc: t('landing.howItWorks.step2.desc', 'Вручную или через AI'), delay: '150ms' },
              { step: '3', title: t('landing.howItWorks.step3.title', 'Наполните контентом'), desc: t('landing.howItWorks.step3.desc', 'Ссылки, товары, проекты'), delay: '300ms' },
              { step: '4', title: t('landing.howItWorks.step4.title', 'Делитесь ссылкой'), desc: t('landing.howItWorks.step4.desc', 'В био, соцсетях, везде'), delay: '450ms' }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`group flex flex-col items-center text-center gap-4 opacity-0 ${howItWorksSection.isVisible ? 'animate-scale-in' : ''}`}
                style={{ animationDelay: item.delay }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xl sm:text-2xl font-bold flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform border border-primary/50">
                    {item.step}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section - Inspired by korner */}
      <section ref={capabilitiesSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${capabilitiesSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.capabilities.title', 'Возможности')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {capabilities.map((cap, index) => (
              <div 
                key={index}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/40 hover:border-primary/50 transition-all duration-500 hover:shadow-glass-xl hover:-translate-y-2 opacity-0 overflow-hidden ${capabilitiesSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${cap.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className={`relative h-12 w-12 rounded-2xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <cap.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="relative text-lg font-bold mb-2">{cap.title}</h3>
                <p className="relative text-muted-foreground text-sm">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Segments - Like korner's "Choose your path" */}
      <section ref={segmentsSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <p className={`text-primary font-semibold opacity-0 ${segmentsSection.isVisible ? 'animate-fade-in' : ''}`}>
              {t('landing.segments.badge', '// Выберите свой путь')}
            </p>
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${segmentsSection.isVisible ? 'animate-blur-in' : ''}`}
              style={{ animationDelay: '100ms' }}
            >
              {t('landing.segments.title', 'Кто вы — мы найдём нужную кнопку')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {audienceSegments.map((segment, index) => (
              <div 
                key={segment.id}
                className={`group relative p-8 rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/40 hover:border-primary/50 transition-all duration-500 hover:shadow-glass-xl hover:-translate-y-2 opacity-0 overflow-hidden ${segmentsSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${segment.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${segment.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <segment.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{segment.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{segment.description}</p>
                
                <Button 
                  onClick={() => navigate('/auth')}
                  className={`w-full rounded-xl font-semibold bg-gradient-to-r ${segment.gradient} text-white shadow-lg hover:shadow-xl transition-all`}
                >
                  {segment.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Premium Pages */}
      <LandingFeaturedPages />

      {/* Community Gallery Section */}
      <LandingGallerySection />

      {/* Why LinkMAX is better - Advantages */}
      <section ref={advantagesSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <div 
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 via-violet-500/10 to-primary/15 border border-primary/25 text-sm font-semibold opacity-0 ${advantagesSection.isVisible ? 'animate-fade-in' : ''}`}
            >
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-primary">{t('landing.advantages.badge', 'Почему LinkMAX')}</span>
            </div>
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${advantagesSection.isVisible ? 'animate-blur-in' : ''}`}
              style={{ animationDelay: '100ms' }}
            >
              {t('landing.advantages.title', 'Лучше чем конкуренты')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advantages.map((adv, index) => (
              <div 
                key={index}
                className={`group relative p-6 rounded-2xl ${adv.highlight ? 'bg-primary/5 border-primary/30' : 'bg-card/50 border-border/30'} backdrop-blur-xl border hover:border-primary/50 transition-all duration-500 opacity-0 ${advantagesSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl ${adv.highlight ? 'bg-primary' : 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
                    <adv.icon className={`h-6 w-6 ${adv.highlight ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{adv.title}</h3>
                    <p className="text-muted-foreground text-sm">{adv.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section ref={problemsSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30 pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${problemsSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.problems.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 ${problemsSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '200ms' }}
            >
              {t('landing.problems.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className={`group relative p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-destructive/20 hover:border-destructive/40 hover:bg-card/70 hover:shadow-glass transition-all duration-500 opacity-0 ${problemsSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <problem.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="relative text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="relative text-muted-foreground text-sm">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section ref={solutionsSection.ref} className="py-20 sm:py-32 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 sm:mb-20 space-y-5">
            <div 
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 via-violet-500/10 to-primary/15 border border-primary/25 text-sm font-semibold opacity-0 ${solutionsSection.isVisible ? 'animate-fade-in' : ''}`}
            >
              <Sparkles className="h-4 w-4 text-primary animate-wiggle" />
              <span className="text-primary">LinkMAX</span>
            </div>
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight opacity-0 ${solutionsSection.isVisible ? 'animate-blur-in' : ''}`}
              style={{ animationDelay: '150ms' }}
            >
              {t('landing.solutions.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-medium opacity-0 ${solutionsSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '300ms' }}
            >
              {t('landing.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/40 hover:border-primary/50 transition-all duration-500 hover:shadow-glass-xl hover:-translate-y-3 opacity-0 overflow-hidden ${solutionsSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <solution.icon className="relative h-7 w-7 text-white" />
                </div>
                <h3 className="relative text-lg sm:text-xl font-bold mb-2">{solution.title}</h3>
                <p className="relative text-muted-foreground leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${featuresSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.features.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground opacity-0 ${featuresSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '200ms' }}
            >
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-glass-lg hover:-translate-y-2 opacity-0 overflow-hidden ${featuresSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none`} />
                
                <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <feature.icon className="relative h-7 w-7 text-white" />
                </div>
                
                <h3 className="relative text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="relative text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <InteractiveDemo />

      {/* Pricing Section */}
      <section ref={pricingSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 via-transparent to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-500/10 via-transparent to-transparent rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium opacity-0 ${pricingSection.isVisible ? 'animate-fade-in' : ''}`}
            >
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-primary">{t('landing.pricing.badge')}</span>
            </div>
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${pricingSection.isVisible ? 'animate-blur-in' : ''}`}
              style={{ animationDelay: '150ms' }}
            >
              {t('landing.pricing.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 ${pricingSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '300ms' }}
            >
              {t('landing.pricing.subtitle')}
            </p>

            {/* Billing Period Selector */}
            <div 
              className={`flex items-center justify-center gap-2 pt-4 opacity-0 ${pricingSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '350ms' }}
            >
              <div className="inline-flex p-1 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/30">
                {(['3', '6', '12'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setBillingPeriod(period)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      billingPeriod === period 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t(`landing.pricing.months${period}`)}
                    {period === '12' && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                        -50%
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {billingPeriod !== '3' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20">
                  <Zap className="h-3 w-3" />
                  {billingPeriod === '12' ? t('landing.pricing.maxSavings') : t('landing.pricing.savePercent', { percent: 30 })}
                </span>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div 
              className={`relative p-5 sm:p-6 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/30 hover:border-border/50 transition-all duration-500 hover:shadow-glass-lg opacity-0 ${pricingSection.isVisible ? 'animate-slide-in-left' : ''}`}
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold">{t('landing.pricing.free.title')}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{t('landing.pricing.free.description')}</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground text-sm">/{t('landing.pricing.month')}</span>
                </div>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full rounded-2xl py-5 hover:bg-accent"
                  onClick={() => navigate('/auth')}
                >
                  {t('landing.pricing.free.cta')}
                </Button>

                <div className="space-y-2 pt-3 max-h-[280px] overflow-y-auto scrollbar-thin">
                  {freeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="text-xs text-foreground leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground leading-relaxed">{t('landing.pricing.features.free.watermark')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div 
              className={`relative p-5 sm:p-6 rounded-3xl bg-card/50 backdrop-blur-2xl border-2 border-primary/30 hover:border-primary/50 transition-all duration-500 hover:shadow-glass-lg opacity-0 overflow-hidden ${pricingSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '450ms' }}
            >
              <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20 rounded-3xl opacity-50" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium shadow-lg shadow-primary/30 animate-glow-pulse border border-primary/50">
                {billingPeriod === '12' ? t('landing.pricing.bestValue') : t('landing.pricing.popular')}
              </div>

              <div className="relative space-y-5">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {t('landing.pricing.pro.title')}
                    <Crown className="h-4 w-4 text-primary" />
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{t('landing.pricing.pro.description')}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${pricingPlans.pro[billingPeriod].monthly.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm">/{t('landing.pricing.month')}</span>
                    {billingPeriod !== '3' && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${pricingPlans.pro['3'].monthly.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('landing.pricing.total')}: ${pricingPlans.pro[billingPeriod].total} • {t('landing.pricing.billedOnce')}
                  </p>
                  {billingPeriod !== '3' && (
                    <p className="text-xs text-emerald-600 font-medium">
                      {t('landing.pricing.savePercent', { percent: getSavingsPercent('pro') })}
                    </p>
                  )}
                </div>

                <Button 
                  size="lg" 
                  className="w-full rounded-2xl py-5 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                  onClick={openPremiumPurchase}
                >
                  {t('landing.pricing.pro.cta')}
                  <Sparkles className="ml-2 h-4 w-4 group-hover:animate-wiggle" />
                </Button>

                <div className="space-y-2 pt-3 max-h-[280px] overflow-y-auto scrollbar-thin">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className={`text-xs leading-relaxed ${index === 0 ? 'font-medium text-primary' : 'text-foreground'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Plan */}
            <div 
              className={`relative p-5 sm:p-6 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/30 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-glass-lg opacity-0 overflow-hidden ${pricingSection.isVisible ? 'animate-slide-in-right' : ''}`}
              style={{ animationDelay: '500ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

              <div className="relative space-y-5">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {t('landing.pricing.business.title')}
                    <Briefcase className="h-4 w-4 text-emerald-500" />
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{t('landing.pricing.business.description')}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${pricingPlans.business[billingPeriod].monthly.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm">/{t('landing.pricing.month')}</span>
                    {billingPeriod !== '3' && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${pricingPlans.business['3'].monthly.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('landing.pricing.total')}: ${pricingPlans.business[billingPeriod].total} • {t('landing.pricing.billedOnce')}
                  </p>
                  {billingPeriod !== '3' && (
                    <p className="text-xs text-emerald-600 font-medium">
                      {t('landing.pricing.savePercent', { percent: getSavingsPercent('business') })}
                    </p>
                  )}
                </div>

                <Button 
                  variant="outline"
                  size="lg" 
                  className="w-full rounded-2xl py-5 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group"
                  onClick={openPremiumPurchase}
                >
                  {t('landing.pricing.business.cta')}
                  <Briefcase className="ml-2 h-4 w-4 text-emerald-500" />
                </Button>

                <div className="space-y-2 pt-3 max-h-[280px] overflow-y-auto scrollbar-thin">
                  {businessFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-emerald-500" />
                      </div>
                      <span className={`text-xs leading-relaxed ${index === 0 ? 'font-medium text-emerald-600' : 'text-foreground'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Commission note - like korner */}
          <div className={`text-center mt-8 opacity-0 ${pricingSection.isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '600ms' }}>
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold text-foreground">{t('landing.pricing.commission', 'Только 0% комиссии')}</span>
              {' '}{t('landing.pricing.commissionDesc', 'за все транзакции на платформе')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaSection.ref} className="py-20 sm:py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div 
            className={`relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-primary via-blue-500 to-violet-600 p-8 sm:p-12 lg:p-20 text-center opacity-0 ${ctaSection.isVisible ? 'animate-scale-in' : ''}`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 70%, white 1.5px, transparent 1.5px)',
                backgroundSize: '50px 50px'
              }} />
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] animate-morph" />
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-morph" style={{ animationDelay: '-4s' }} />
            </div>
            
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/15 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-10 right-10 w-52 h-52 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '-4s' }} />
            
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold text-white border border-white/20">
                <Rocket className="h-4 w-4" />
                <span>{t('landing.cta.badge2', 'Хочешь — но молчишь?')}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {t('landing.cta.title2', 'Хватит хотеть. Пора делать.')}
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/85 max-w-2xl mx-auto font-medium">
                {t('landing.cta.subtitle2', 'LinkMAX ждёт вас')}
              </p>
              
              {/* CTA Username input */}
              <div className="max-w-md mx-auto">
                <div className="relative flex items-center gap-2 p-2 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30">
                  <div className="flex-shrink-0 pl-4 text-white/80 font-medium text-sm">
                    linkmax.app/
                  </div>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="yourname"
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-white/50 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
                  />
                  <Button 
                    onClick={handleCreatePage}
                    className="rounded-xl font-bold bg-white text-primary hover:bg-white/95 shadow-lg px-6 py-5"
                  >
                    {t('landing.hero.create', 'Создать')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 sm:py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg group-hover:blur-xl group-hover:bg-primary/40 transition-all duration-500" />
                <img 
                  src="/pwa-maskable-512x512.png" 
                  alt="LinkMAX" 
                  className="relative h-9 w-9 rounded-xl group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <span className="text-xl font-bold">
                Link<span className="text-gradient">MAX</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TermsLink className="hover:text-foreground transition-colors cursor-pointer">
                  {t('legal.termsOfService')}
                </TermsLink>
                <span>•</span>
                <PrivacyLink className="hover:text-foreground transition-colors cursor-pointer">
                  {t('legal.privacyPolicy')}
                </PrivacyLink>
              </div>
              <p className="text-sm text-muted-foreground text-center sm:text-right font-medium">
                {t('landing.footer.copyright')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
