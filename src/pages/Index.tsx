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
  Crown
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { openPremiumPurchase } from '@/lib/upgrade-utils';

export default function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: Sparkles,
      title: t('landing.features.aiGeneration.title'),
      description: t('landing.features.aiGeneration.description'),
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: Link2,
      title: t('landing.features.magicLinks.title'),
      description: t('landing.features.magicLinks.description'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: t('landing.features.fast.title'),
      description: t('landing.features.fast.description'),
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: Smartphone,
      title: t('landing.features.mobile.title'),
      description: t('landing.features.mobile.description'),
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Share2,
      title: t('landing.features.sharing.title'),
      description: t('landing.features.sharing.description'),
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: t('landing.features.privacy.title'),
      description: t('landing.features.privacy.description'),
      gradient: 'from-slate-500 to-zinc-600'
    }
  ];

  const stats = [
    { value: '2', label: t('landing.stats.minutes'), suffix: t('landing.stats.minutesSuffix') },
    { value: '15+', label: t('landing.stats.blocks') },
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation - Mobile optimized */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img 
                src="/pwa-maskable-512x512.png" 
                alt="LinkMAX" 
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl shadow-md" 
              />
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-primary rounded-full animate-pulse" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Link<span className="text-primary">MAX</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="hidden sm:inline-flex font-medium text-sm"
              size="sm"
            >
              {t('landing.nav.signIn')}
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="rounded-xl font-medium shadow-lg shadow-primary/25 text-sm px-3 sm:px-4"
              size="sm"
            >
              {t('landing.nav.getStarted')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile first */}
      <section className="relative pt-20 sm:pt-28 pb-12 sm:pb-20 px-4">
        {/* Background decoration - simplified for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px]" />
          <div className="absolute top-20 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-primary/5 rounded-full blur-[60px] sm:blur-[80px]" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text content - Mobile optimized */}
            <div className="text-center lg:text-left space-y-5 sm:space-y-8 order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium animate-fade-in">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-primary">{t('landing.hero.badge')}</span>
              </div>
              
              {/* Main heading - Responsive sizes */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in-up">
                {t('landing.hero.title1')}
                <br />
                <span className="text-gradient">{t('landing.hero.title2')}</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up">
                {t('landing.hero.subtitle')}
              </p>
              
              {/* CTA Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2 animate-fade-in-up">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')} 
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-2xl font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 group w-full sm:w-auto"
                >
                  {t('landing.hero.ctaMain')}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-2xl font-medium bg-background/50 backdrop-blur-sm hover:bg-accent transition-all duration-300 w-full sm:w-auto"
                  onClick={() => navigate('/dashboard')}
                >
                  {t('landing.hero.ctaDemo')}
                </Button>
              </div>

              {/* Trust badge */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-muted-foreground pt-1 animate-fade-in-up">
                <div className="flex -space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="line-clamp-1">{t('landing.hero.trial')}</span>
              </div>
            </div>

            {/* Phone mockup - Hidden on small mobile, shown on tablet+ */}
            <div className="relative hidden sm:flex justify-center lg:justify-end animate-fade-in-up order-2">
              <div className="relative">
                {/* Floating elements - Smaller on tablet */}
                <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-card border border-border/50 shadow-xl animate-float z-10">
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-lg lg:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                    </div>
                    <span className="text-xs lg:text-sm font-medium pr-1">AI Ready</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -left-6 lg:-bottom-4 lg:-left-8 p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-card border border-border/50 shadow-xl animate-float z-10" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-lg lg:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                    </div>
                    <span className="text-xs lg:text-sm font-medium pr-1">+247%</span>
                  </div>
                </div>

                {/* Phone frame - Responsive */}
                <div className="relative w-[220px] sm:w-[260px] lg:w-[300px] h-[440px] sm:h-[520px] lg:h-[600px] bg-foreground rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-2 sm:p-2.5 lg:p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-28 lg:w-32 h-5 sm:h-6 lg:h-7 bg-foreground rounded-b-xl lg:rounded-b-2xl z-10" />
                  
                  <div className="relative h-full w-full bg-background rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.25rem] overflow-hidden">
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                      <div className="pt-6 sm:pt-8 flex flex-col items-center space-y-2 sm:space-y-3">
                        <div className="relative">
                          <div className="h-14 w-14 sm:h-18 sm:w-18 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-primary to-blue-600 p-0.5">
                            <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                              <span className="text-lg sm:text-xl lg:text-2xl">👤</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-sm sm:text-base lg:text-lg">Alex Creator</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">Digital Artist</p>
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
                        <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white text-center font-medium shadow-lg text-xs sm:text-sm">
                          🎨 My Portfolio
                        </div>
                        <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-card border border-border text-center font-medium text-xs sm:text-sm">
                          📸 Instagram
                        </div>
                        <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-card border border-border text-center font-medium text-xs sm:text-sm">
                          🎥 YouTube
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          <div className="aspect-square rounded-lg lg:rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-base sm:text-lg lg:text-xl">📱</div>
                          <div className="aspect-square rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-base sm:text-lg lg:text-xl">💬</div>
                          <div className="aspect-square rounded-lg lg:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-base sm:text-lg lg:text-xl">✉️</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/30 rounded-[3rem] blur-3xl opacity-50" />
              </div>
            </div>
          </div>

          {/* Stats - Mobile optimized */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto mt-10 sm:mt-16 animate-fade-in-up">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  {stat.value}
                  {stat.suffix && <span className="text-sm sm:text-lg">{stat.suffix}</span>}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Mobile optimized */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
              {t('landing.features.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                
                <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed line-clamp-3 lg:line-clamp-none">
                  {feature.description}
                </p>

                <div className={`absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Mobile optimized */}
      <section className="py-12 sm:py-20 lg:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '1', title: t('landing.howItWorks.step1.title'), desc: t('landing.howItWorks.step1.desc') },
              { step: '2', title: t('landing.howItWorks.step2.title'), desc: t('landing.howItWorks.step2.desc') },
              { step: '3', title: t('landing.howItWorks.step3.title'), desc: t('landing.howItWorks.step3.desc') }
            ].map((item, index) => (
              <div key={index} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full bg-primary text-primary-foreground text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25">
                  {item.step}
                </div>
                <div className="flex-1 sm:flex-none sm:space-y-2">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Mobile optimized */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium">
              <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-primary">{t('landing.pricing.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="relative p-5 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-border transition-all duration-300">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{t('landing.pricing.free.title')}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">{t('landing.pricing.free.description')}</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground text-sm sm:text-base">/{t('landing.pricing.month')}</span>
                </div>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full rounded-xl sm:rounded-2xl text-base sm:text-lg py-5 sm:py-6"
                  onClick={() => navigate('/auth')}
                >
                  {t('landing.pricing.free.cta')}
                </Button>

                <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                  {pricingFeatures.free.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3">
                      {feature.included ? (
                        <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={`text-xs sm:text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="relative p-5 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-blue-500/5 border-2 border-primary/30 hover:border-primary/50 transition-all duration-300">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium shadow-lg whitespace-nowrap">
                {t('landing.pricing.popular')}
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    {t('landing.pricing.premium.title')}
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">{t('landing.pricing.premium.description')}</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold">$6.99</span>
                  <span className="text-muted-foreground text-sm sm:text-base">/{t('landing.pricing.month')}</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full rounded-xl sm:rounded-2xl text-base sm:text-lg py-5 sm:py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  onClick={openPremiumPurchase}
                >
                  {t('landing.pricing.premium.cta')}
                  <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                  {pricingFeatures.premium.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3">
                      <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                      </div>
                      <span className="text-xs sm:text-sm text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile optimized */}
      <section className="py-12 sm:py-20 lg:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-blue-600 p-6 sm:p-10 lg:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            <div className="relative z-10 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 text-xs sm:text-sm font-medium text-white">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t('landing.cta.badge')}</span>
              </div>
              
              <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight">
                {t('landing.cta.title')}
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-white/80 max-w-xl mx-auto">
                {t('landing.cta.subtitle')}
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-6 rounded-xl sm:rounded-2xl font-semibold bg-white text-primary hover:bg-white/90 shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
              >
                {t('landing.cta.button')}
                <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile optimized */}
      <footer className="border-t border-border/50 py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/pwa-maskable-512x512.png" alt="LinkMAX" className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl" />
              <span className="text-lg sm:text-xl font-bold">
                Link<span className="text-primary">MAX</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              {t('landing.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
