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
  Users,
  TrendingUp,
  Palette,
  Bot,
  BarChart3
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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

  const benefits = [
    { icon: Bot, text: t('landing.benefits.ai') },
    { icon: Palette, text: t('landing.benefits.design') },
    { icon: BarChart3, text: t('landing.benefits.analytics') },
    { icon: Users, text: t('landing.benefits.crm') }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/pwa-maskable-512x512.png" 
                alt="LinkMAX" 
                className="h-9 w-9 rounded-xl shadow-md" 
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Link<span className="text-primary">MAX</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="hidden sm:inline-flex font-medium"
            >
              {t('landing.nav.signIn')}
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('landing.nav.getStarted')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary">{t('landing.hero.badge')}</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] animate-fade-in-up">
              {t('landing.hero.title1')}
              <br />
              <span className="text-gradient">{t('landing.hero.title2')}</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light">
              {t('landing.hero.subtitle')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up">
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
                className="text-lg px-8 py-6 rounded-2xl font-medium bg-background/50 backdrop-blur-sm hover:bg-accent transition-all duration-300"
                onClick={() => navigate('/dashboard')}
              >
                {t('landing.hero.ctaDemo')}
              </Button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2 animate-fade-in-up">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span>{t('landing.hero.trial')}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 animate-fade-in-up">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary">
                  {stat.value}
                  {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits ribbon */}
      <section className="py-8 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <benefit.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground font-light">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: t('landing.howItWorks.step1.title'), desc: t('landing.howItWorks.step1.desc') },
              { step: '2', title: t('landing.howItWorks.step2.title'), desc: t('landing.howItWorks.step2.desc') },
              { step: '3', title: t('landing.howItWorks.step3.title'), desc: t('landing.howItWorks.step3.desc') }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto shadow-lg shadow-primary/25">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-blue-600 p-12 md:p-16 text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-medium text-white">
                <TrendingUp className="h-4 w-4" />
                <span>{t('landing.cta.badge')}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                {t('landing.cta.title')}
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto">
                {t('landing.cta.subtitle')}
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="text-lg px-10 py-6 rounded-2xl font-semibold bg-white text-primary hover:bg-white/90 shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {t('landing.cta.button')}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/pwa-maskable-512x512.png" alt="LinkMAX" className="h-8 w-8 rounded-xl" />
              <span className="text-xl font-bold">
                Link<span className="text-primary">MAX</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('landing.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
