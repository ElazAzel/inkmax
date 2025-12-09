import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
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
  Wrench
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { openPremiumPurchase } from '@/lib/upgrade-utils';
import { useEffect, useRef, useState } from 'react';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';

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
    { icon: Zap, title: t('landing.features.fast.title'), description: t('landing.features.fast.description'), gradient: 'from-amber-500 to-orange-500', delay: '200ms' },
    { icon: Smartphone, title: t('landing.features.mobile.title'), description: t('landing.features.mobile.description'), gradient: 'from-emerald-500 to-teal-500', delay: '300ms' },
    { icon: Share2, title: t('landing.features.sharing.title'), description: t('landing.features.sharing.description'), gradient: 'from-pink-500 to-rose-500', delay: '400ms' },
    { icon: Shield, title: t('landing.features.privacy.title'), description: t('landing.features.privacy.description'), gradient: 'from-slate-500 to-zinc-600', delay: '500ms' }
  ];

  const stats = [
    { value: 2, label: t('landing.stats.minutes'), suffix: t('landing.stats.minutesSuffix') },
    { value: '20+', label: t('landing.stats.blocks') },
    { value: '∞', label: t('landing.stats.possibilities') }
  ];

  const pricingFeatures = {
    free: [
      { text: t('landing.pricing.features.blocks5'), included: true },
      { text: t('landing.pricing.features.basicBlocks'), included: true },
      { text: t('landing.pricing.features.ai3'), included: true },
      { text: t('landing.pricing.features.themes'), included: true },
      { text: t('landing.pricing.features.unlimitedBlocks'), included: false },
      { text: t('landing.pricing.features.analytics'), included: false },
      { text: t('landing.pricing.features.crm'), included: false },
      { text: t('landing.pricing.features.noWatermark'), included: false }
    ],
    premium: [
      { text: t('landing.pricing.features.unlimitedBlocks'), included: true },
      { text: t('landing.pricing.features.allBlocks'), included: true },
      { text: t('landing.pricing.features.unlimitedAI'), included: true },
      { text: t('landing.pricing.features.analytics'), included: true },
      { text: t('landing.pricing.features.crm'), included: true },
      { text: t('landing.pricing.features.noWatermark'), included: true },
      { text: t('landing.pricing.features.priority'), included: true }
    ]
  };

  const showcaseFeatures = [
    { icon: Bot, label: t('landing.benefits.ai') },
    { icon: Palette, label: t('landing.benefits.design') },
    { icon: BarChart3, label: t('landing.benefits.analytics') },
    { icon: Globe, label: 'Multi-lang' },
    { icon: Users, label: t('landing.benefits.crm') }
  ];

  const heroSection = useScrollAnimation();
  const problemsSection = useScrollAnimation();
  const solutionsSection = useScrollAnimation();
  const audiencesSection = useScrollAnimation();
  const featuresSection = useScrollAnimation();
  const howItWorksSection = useScrollAnimation();
  const pricingSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Liquid Glass Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary mesh gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent rounded-full blur-[150px] animate-morph" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-[120px] animate-morph" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-[130px] animate-morph" style={{ animationDelay: '-10s' }} />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-l from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-[100px] animate-float-slow" />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Floating glass orbs */}
        <div className="absolute top-20 left-[15%] w-4 h-4 bg-primary/30 rounded-full blur-sm animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-[20%] w-3 h-3 bg-blue-400/30 rounded-full blur-sm animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-32 left-[30%] w-5 h-5 bg-purple-400/25 rounded-full blur-sm animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Liquid Glass Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
        <div className="mx-4 sm:mx-6 mt-4">
          <div className="backdrop-blur-2xl bg-card/60 border border-border/30 rounded-2xl shadow-glass-lg">
            <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <img 
                    src="/pwa-maskable-512x512.png" 
                    alt="LinkMAX" 
                    className="relative h-9 w-9 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-glow-pulse shadow-lg shadow-primary/50" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  Link<span className="text-gradient">MAX</span>
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSwitcher />
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="hidden sm:inline-flex font-medium hover:bg-foreground/5 backdrop-blur-sm"
                  size="sm"
                >
                  {t('landing.nav.signIn')}
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 bg-primary/90 backdrop-blur-sm"
                  size="sm"
                >
                  {t('landing.nav.getStarted')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroSection.ref} className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              {/* Badge */}
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium opacity-0 ${heroSection.isVisible ? 'animate-fade-in' : ''}`}
              >
                <Sparkles className="h-4 w-4 text-primary animate-wiggle" />
                <span className="text-primary">{t('landing.hero.badge')}</span>
              </div>
              
              {/* Main heading */}
              <h1 
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] opacity-0 ${heroSection.isVisible ? 'animate-blur-in' : ''}`}
                style={{ animationDelay: '150ms' }}
              >
                {t('landing.hero.title1')}
                <br />
                <span className="text-gradient bg-[length:200%_auto] animate-gradient-x">{t('landing.hero.title2')}</span>
              </h1>
              
              {/* Subtitle */}
              <p 
                className={`text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '300ms' }}
              >
                {t('landing.hero.subtitle')}
              </p>
              
              {/* CTA Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2 opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '450ms' }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')} 
                  className="text-lg px-8 py-6 rounded-2xl font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 group"
                >
                  {t('landing.hero.ctaMain')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 rounded-2xl font-medium bg-background/50 backdrop-blur-sm hover:bg-accent transition-all duration-300 group"
                  onClick={() => navigate('/dashboard')}
                >
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  {t('landing.hero.ctaDemo')}
                </Button>
              </div>

              {/* Trust badge */}
              <div 
                className={`flex items-center justify-center lg:justify-start gap-3 text-sm text-muted-foreground pt-2 opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '600ms' }}
              >
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 text-amber-400 fill-amber-400" 
                      style={{ animationDelay: `${700 + i * 100}ms` }}
                    />
                  ))}
                </div>
                <span>{t('landing.hero.trial')}</span>
              </div>
            </div>

            {/* Phone mockup with enhanced animations */}
            <div 
              className={`relative flex justify-center lg:justify-end opacity-0 ${heroSection.isVisible ? 'animate-slide-in-right' : ''}`}
              style={{ animationDelay: '300ms' }}
            >
              <div className="relative">
                {/* Floating elements */}
                <div className="absolute -top-6 -left-8 p-3 rounded-2xl bg-card border border-border/50 shadow-xl animate-float z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold">AI Ready</span>
                      <div className="text-xs text-muted-foreground">Auto-generate</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-10 p-3 rounded-2xl bg-card border border-border/50 shadow-xl animate-float z-10" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-emerald-500">+247%</span>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/3 -right-6 p-3 rounded-2xl bg-card border border-border/50 shadow-xl animate-float z-10" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold">1.2k</span>
                      <div className="text-xs text-muted-foreground">Visitors</div>
                    </div>
                  </div>
                </div>

                {/* Phone frame with glass effect */}
                <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] bg-foreground/90 backdrop-blur-xl rounded-[3rem] p-3 shadow-2xl border border-foreground/20">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground/90 rounded-b-2xl z-10" />
                  
                  <div className="relative h-full w-full bg-background/80 backdrop-blur-xl rounded-[2.25rem] overflow-hidden border border-border/20">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_2s_infinite] opacity-50" />
                    
                    <div className="p-4 space-y-4">
                      <div className="pt-10 flex flex-col items-center space-y-3">
                        <div className="relative">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-600 p-0.5 animate-pulse-glow">
                            <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                              <span className="text-2xl">👤</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-lg">Alex Creator</h3>
                          <p className="text-sm text-muted-foreground">Digital Artist</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white text-center font-medium shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
                          🎨 My Portfolio
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border text-center font-medium hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer">
                          📸 Instagram
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border text-center font-medium hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer">
                          🎥 YouTube
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl hover:scale-105 transition-transform cursor-pointer">📱</div>
                          <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl hover:scale-105 transition-transform cursor-pointer">💬</div>
                          <div className="aspect-square rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl hover:scale-105 transition-transform cursor-pointer">✉️</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/30 rounded-[3rem] blur-3xl opacity-50 animate-pulse-glow" />
              </div>
            </div>
          </div>

          {/* Showcase features bar */}
          <div 
            className={`flex flex-wrap justify-center gap-3 sm:gap-6 mt-16 sm:mt-20 opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '750ms' }}
          >
            {showcaseFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/40 backdrop-blur-xl border border-border/30 hover:border-primary/40 hover:bg-card/60 hover:shadow-glass transition-all duration-300 cursor-default group"
              >
                <feature.icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-3 gap-4 max-w-lg mx-auto mt-12 sm:mt-16 opacity-0 ${heroSection.isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '900ms' }}
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 sm:p-6 rounded-2xl bg-card/40 backdrop-blur-2xl border border-border/30 hover:border-primary/40 hover:shadow-glass-lg transition-all duration-500 group"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary group-hover:scale-110 transition-transform">
                  {typeof stat.value === 'number' ? (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  ) : (
                    <>{stat.value}</>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section ref={problemsSection.ref} className="py-20 sm:py-28 px-4 relative">
        {/* Section mesh gradient */}
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
      <section ref={solutionsSection.ref} className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium opacity-0 ${solutionsSection.isVisible ? 'animate-fade-in' : ''}`}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary">LinkMAX</span>
            </div>
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${solutionsSection.isVisible ? 'animate-blur-in' : ''}`}
              style={{ animationDelay: '150ms' }}
            >
              {t('landing.solutions.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 ${solutionsSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '300ms' }}
            >
              {t('landing.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-glass-lg hover:-translate-y-2 opacity-0 ${solutionsSection.isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glass highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                
                <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <solution.icon className="relative h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{solution.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences Section - B2B & B2C */}
      <section ref={audiencesSection.ref} className="py-20 sm:py-28 px-4 relative">
        {/* Section mesh gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${audiencesSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.audiences.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 ${audiencesSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '200ms' }}
            >
              {t('landing.audiences.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {/* B2C Card */}
            <div 
              className={`relative p-6 sm:p-8 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/30 hover:border-blue-500/40 transition-all duration-500 hover:shadow-glass-lg opacity-0 ${audiencesSection.isVisible ? 'animate-slide-in-left' : ''}`}
              style={{ animationDelay: '300ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-sm text-blue-600 text-sm font-medium mb-4 border border-blue-500/20">
                <Users className="h-4 w-4" />
                {t('landing.audiences.b2c.badge')}
              </div>
              <h3 className="text-2xl font-bold mb-6">{t('landing.audiences.b2c.title')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {b2cAudiences.map((item, index) => (
                  <div key={index} className="group flex items-center gap-3 p-3 rounded-xl bg-muted/30 backdrop-blur-sm hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-300">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* B2B Card */}
            <div 
              className={`relative p-6 sm:p-8 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/30 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-glass-lg opacity-0 ${audiencesSection.isVisible ? 'animate-slide-in-right' : ''}`}
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-sm text-emerald-600 text-sm font-medium mb-4 border border-emerald-500/20">
                <Briefcase className="h-4 w-4" />
                {t('landing.audiences.b2b.badge')}
              </div>
              <h3 className="text-2xl font-bold mb-6">{t('landing.audiences.b2b.title')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {b2bAudiences.map((item, index) => (
                  <div key={index} className="group flex items-center gap-3 p-3 rounded-xl bg-muted/30 backdrop-blur-sm hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all duration-300">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresSection.ref} className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${featuresSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.features.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 ${featuresSection.isVisible ? 'animate-fade-in-up' : ''}`}
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
                {/* Glass highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                
                {/* Hover glow effect */}
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

      {/* How it works */}
      <section ref={howItWorksSection.ref} className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight opacity-0 ${howItWorksSection.isVisible ? 'animate-blur-in' : ''}`}
            >
              {t('landing.howItWorks.title')}
            </h2>
            <p 
              className={`text-lg sm:text-xl text-muted-foreground opacity-0 ${howItWorksSection.isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: '200ms' }}
            >
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { step: '1', title: t('landing.howItWorks.step1.title'), desc: t('landing.howItWorks.step1.desc'), delay: '0ms' },
              { step: '2', title: t('landing.howItWorks.step2.title'), desc: t('landing.howItWorks.step2.desc'), delay: '200ms' },
              { step: '3', title: t('landing.howItWorks.step3.title'), desc: t('landing.howItWorks.step3.desc'), delay: '400ms' }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`group flex flex-col items-center text-center gap-4 opacity-0 ${howItWorksSection.isVisible ? 'animate-scale-in' : ''}`}
                style={{ animationDelay: item.delay }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-2xl sm:text-3xl font-bold flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform border border-primary/50">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden sm:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingSection.ref} className="py-20 sm:py-28 px-4 relative">
        {/* Section mesh gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 via-transparent to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-500/10 via-transparent to-transparent rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
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
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div 
              className={`relative p-6 sm:p-8 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/30 hover:border-border/50 transition-all duration-500 hover:shadow-glass-lg opacity-0 ${pricingSection.isVisible ? 'animate-slide-in-left' : ''}`}
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{t('landing.pricing.free.title')}</h3>
                  <p className="text-muted-foreground mt-1">{t('landing.pricing.free.description')}</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/{t('landing.pricing.month')}</span>
                </div>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full rounded-2xl text-lg py-6 hover:bg-accent"
                  onClick={() => navigate('/auth')}
                >
                  {t('landing.pricing.free.cta')}
                </Button>

                <div className="space-y-3 pt-4">
                  {pricingFeatures.free.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <X className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div 
              className={`relative p-6 sm:p-8 rounded-3xl bg-card/50 backdrop-blur-2xl border-2 border-primary/30 hover:border-primary/50 transition-all duration-500 hover:shadow-glass-lg opacity-0 overflow-hidden ${pricingSection.isVisible ? 'animate-slide-in-right' : ''}`}
              style={{ animationDelay: '500ms' }}
            >
              {/* Premium glow effects */}
              <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20 rounded-3xl opacity-50" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-sm font-medium shadow-lg shadow-primary/30 animate-glow-pulse border border-primary/50">
                {t('landing.pricing.popular')}
              </div>

              <div className="relative space-y-6">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {t('landing.pricing.premium.title')}
                    <Crown className="h-5 w-5 text-primary" />
                  </h3>
                  <p className="text-muted-foreground mt-1">{t('landing.pricing.premium.description')}</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">$6.99</span>
                  <span className="text-muted-foreground">/{t('landing.pricing.month')}</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full rounded-2xl text-lg py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                  onClick={openPremiumPurchase}
                >
                  {t('landing.pricing.premium.cta')}
                  <Sparkles className="ml-2 h-5 w-5 group-hover:animate-wiggle" />
                </Button>

                <div className="space-y-3 pt-4">
                  {pricingFeatures.premium.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaSection.ref} className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div 
            className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-blue-600 p-8 sm:p-12 lg:p-16 text-center opacity-0 ${ctaSection.isVisible ? 'animate-scale-in' : ''}`}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 50%, white 2px, transparent 2px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            {/* Floating orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '-2s' }} />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-medium text-white">
                <TrendingUp className="h-4 w-4" />
                <span>{t('landing.cta.badge')}</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {t('landing.cta.title')}
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto">
                {t('landing.cta.subtitle')}
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="text-lg px-10 py-6 rounded-2xl font-semibold bg-white text-primary hover:bg-white/90 shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {t('landing.cta.button')}
                <Sparkles className="ml-2 h-5 w-5 group-hover:animate-wiggle" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-transparent pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <img 
                  src="/pwa-maskable-512x512.png" 
                  alt="LinkMAX" 
                  className="relative h-8 w-8 rounded-xl group-hover:scale-110 transition-transform" 
                />
              </div>
              <span className="text-xl font-bold">
                Link<span className="text-primary">MAX</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              {t('landing.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
