import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Check, 
  X,
  Crown,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Shield,
  Bot,
  Users,
  BarChart3,
  MessageSquare,
  CreditCard,
  Globe,
  Smartphone
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// SEO Component for Alternatives page
function AlternativesSEOHead({ currentLanguage }: { currentLanguage: string }) {
  const { t } = useTranslation();

  useEffect(() => {
    const title = t('alternatives.seo.title', 'LinkMAX vs Linktree vs Taplink — 2026 Comparison | Best Alternative');
    document.title = title;

    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const description = t(
      'alternatives.seo.description',
      'Detailed comparison of LinkMAX, Linktree and Taplink. Discover why LinkMAX is the best free alternative with AI generation, CRM and 0% commission. Feature and pricing comparison table.'
    );
    setMetaTag('description', description);

    const keywords = t(
      'alternatives.seo.keywords',
      'linktree vs taplink, taplink alternative, linktree alternative free, best link in bio, linktree taplink comparison, free taplink alternative, linktree replacement, beacons vs linktree, lnk.bio alternative, shorby alternative'
    );
    setMetaTag('keywords', keywords);

    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', 'https://lnkmx.my/alternatives', true);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);

    // Canonical for alternatives page
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = 'https://lnkmx.my/alternatives';
    }

    // Schema for comparison page
    const existingSchema = document.querySelector('script.alternatives-schema');
    if (existingSchema) existingSchema.remove();

    const comparisonSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: description,
      url: 'https://lnkmx.my/alternatives',
      mainEntity: {
        '@type': 'ItemList',
        name: t('alternatives.seo.schemaName', 'Link in Bio Platforms Comparison'),
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'SoftwareApplication',
              name: 'LinkMAX',
              applicationCategory: 'BusinessApplication',
              description: t('alternatives.seo.schemaDescription', 'AI-powered link-in-bio builder with CRM and 0% commission'),
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
            }
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'SoftwareApplication',
              name: 'Linktree',
              applicationCategory: 'BusinessApplication'
            }
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'SoftwareApplication',
              name: 'Taplink',
              applicationCategory: 'BusinessApplication'
            }
          }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.className = 'alternatives-schema';
    script.textContent = JSON.stringify(comparisonSchema);
    document.head.appendChild(script);

    return () => {
      document.title = t('alternatives.seo.defaultTitle', 'LinkMAX - AI-Powered Link-in-Bio Platform');
      const schemaToRemove = document.querySelector('script.alternatives-schema');
      if (schemaToRemove) schemaToRemove.remove();
    };
  }, [currentLanguage, t]);

  return null;
}

export default function Alternatives() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isKztPrimary = i18n.language === 'ru' || i18n.language === 'kk';

  const comparisonData = [
    {
      feature: t('alternatives.comparison.rows.freePlan.label', 'Free Plan'),
      linkmax: {
        free: true,
        premium: true,
        freeNote: t('alternatives.comparison.rows.freePlan.freeNote', '10 blocks'),
        premiumNote: t('alternatives.comparison.rows.freePlan.premiumNote', '25+ blocks'),
      },
    },
    {
      feature: t('alternatives.comparison.rows.aiGeneration.label', 'AI Page Generation'),
      linkmax: {
        free: true,
        premium: true,
        freeNote: t('alternatives.comparison.rows.aiGeneration.freeNote', '1/month'),
        premiumNote: t('alternatives.comparison.rows.aiGeneration.premiumNote', '5/month'),
      },
    },
    {
      feature: t('alternatives.comparison.rows.blockTypes.label', 'Number of Block Types'),
      linkmax: {
        free: t('alternatives.comparison.rows.blockTypes.freeValue', '10+'),
        premium: t('alternatives.comparison.rows.blockTypes.premiumValue', '25+'),
      },
    },
    {
      feature: t('alternatives.comparison.rows.miniCrm.label', 'Mini-CRM System'),
      linkmax: { free: false, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.clickAnalytics.label', 'Click Analytics'),
      linkmax: {
        free: t('alternatives.comparison.rows.clickAnalytics.freeValue', 'Basic'),
        premium: t('alternatives.comparison.rows.clickAnalytics.premiumValue', 'Advanced'),
      },
    },
    {
      feature: t('alternatives.comparison.rows.telegramNotifications.label', 'Telegram Notifications'),
      linkmax: { free: false, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.leadForms.label', 'Lead Capture Forms'),
      linkmax: { free: true, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.blockScheduler.label', 'Block Scheduler'),
      linkmax: { free: false, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.mobileEditor.label', 'Mobile Editor (PWA)'),
      linkmax: { free: true, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.premiumThemes.label', 'Premium Themes & Animations'),
      linkmax: { free: false, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.priceLists.label', 'Price Lists & Catalogs'),
      linkmax: { free: false, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.localization.label', 'RU/EN/KZ Support'),
      linkmax: { free: true, premium: true },
    },
    {
      feature: t('alternatives.comparison.rows.gamification.label', 'Tokens & Gamification'),
      linkmax: { free: true, premium: true },
    },
  ];

  const pricingComparison = [
    {
      period: t('alternatives.pricing.periods.three', '3 months'),
      priceKZT: '4 350 ₸',
      priceUSD: '~$8.50',
    },
    {
      period: t('alternatives.pricing.periods.six', '6 months'),
      priceKZT: '3 500 ₸',
      priceUSD: '~$6.80',
      popular: true,
    },
    {
      period: t('alternatives.pricing.periods.twelve', '12 months'),
      priceKZT: '2 610 ₸',
      priceUSD: '~$5.10',
      best: true,
    },
  ];

  const advantages = [
    {
      icon: Bot,
      title: t('alternatives.advantages.aiGeneration.title', 'AI Generation in 2 Minutes'),
      description: t(
        'alternatives.advantages.aiGeneration.description',
        'Choose your niche — AI creates a page with the right blocks in 30 seconds. Free: 1/mo, Premium: 5/mo.'
      ),
    },
    {
      icon: Users,
      title: t('alternatives.advantages.miniCrm.title', 'Built-in Mini-CRM'),
      description: t(
        'alternatives.advantages.miniCrm.description',
        'Manage leads right in LinkMAX. Statuses, history, Telegram notifications — all in one place.'
      ),
    },
    {
      icon: MessageSquare,
      title: t('alternatives.advantages.telegram.title', 'Telegram Notifications'),
      description: t(
        'alternatives.advantages.telegram.description',
        'Instant notifications about new leads in Telegram. Never miss a client.'
      ),
    },
    {
      icon: CreditCard,
      title: t('alternatives.advantages.pricing.title', 'Affordable Pricing'),
      description: t(
        'alternatives.advantages.pricing.description',
        'From $5.10/month with annual subscription. Payment via RoboKassa. 14-day refund policy.'
      ),
    },
    {
      icon: Globe,
      title: t('alternatives.advantages.localization.title', 'RU/EN/KZ Localization'),
      description: t(
        'alternatives.advantages.localization.description',
        'Full Russian, English and Kazakh language support.'
      ),
    },
    {
      icon: BarChart3,
      title: t('alternatives.advantages.analytics.title', 'Analytics & Gamification'),
      description: t(
        'alternatives.advantages.analytics.description',
        'Click stats, Linkkon tokens, achievements, streaks. Grow your page like a game.'
      ),
    },
  ];

  const renderCellValue = (value: boolean | string, note?: string) => {
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-center gap-1">
          {value ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-400" />
          )}
          {note && (
            <span className="text-xs text-muted-foreground">{note}</span>
          )}
        </div>
      );
    }
    return (
      <div className="text-center">
        {value}
        {note && (
          <span className="block text-xs text-muted-foreground">{note}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <AlternativesSEOHead currentLanguage={i18n.language} />
      
      <div className="min-h-screen bg-background relative overflow-x-hidden pb-safe">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-primary/20 via-violet-500/10 to-transparent rounded-full blur-[150px] animate-morph" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-[120px] animate-morph" style={{ animationDelay: '-7s' }} />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50">
          <div className="mx-4 mt-3">
            <div className="backdrop-blur-2xl bg-card/50 border border-border/30 rounded-2xl shadow-glass-lg">
              <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Link to="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      Link<span className="text-gradient">MAX</span>
                    </span>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <Button onClick={() => navigate('/auth')} size="sm">
                    {t('alternatives.header.cta', 'Get Started')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <section className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {t('alternatives.hero.badge', '2026 Comparison')}
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
              {t('alternatives.hero.title', 'LinkMAX vs Linktree vs Taplink')}
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t(
                'alternatives.hero.description',
                'Discover why thousands of users are switching from Linktree and Taplink to LinkMAX. Detailed comparison of features, pricing and capabilities.'
              )}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="rounded-xl">
                <Sparkles className="h-5 w-5 mr-2" />
                {t('alternatives.hero.ctaPrimary', 'Try for Free')}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/pricing')} className="rounded-xl">
                {t('alternatives.hero.ctaSecondary', 'View Pricing')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </section>

          {/* Quick Winner Section */}
          <section className="mb-12 sm:mb-16">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-violet-500/5">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                      <Crown className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                      {t('alternatives.winner.title', 'LinkMAX — Best Choice in 2026')}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      {t(
                        'alternatives.winner.description',
                        'AI generation, built-in CRM, Telegram notifications and 40-50% lower price than competitors. All this makes LinkMAX the best Linktree and Taplink alternative.'
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-6 w-6 fill-current" />)}
                    </div>
                    <p className="text-sm text-muted-foreground text-center mt-1">4.9/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Advantages Grid */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              {t('alternatives.advantages.title', 'Why is LinkMAX Better?')}
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {advantages.map((advantage, index) => (
                <Card key={index} className="group hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <advantage.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
                    <p className="text-muted-foreground text-sm">{advantage.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Feature Comparison Table - Free vs Premium */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              {t('alternatives.comparison.title', 'Free vs Premium')}
            </h2>
            
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">
                        {t('alternatives.comparison.featureLabel', 'Feature')}
                      </th>
                      <th className="text-center p-4">
                        <span className="text-muted-foreground">{t('alternatives.comparison.freeLabel', 'Free')}</span>
                      </th>
                      <th className="text-center p-4">
                        <Badge className="bg-primary/20 text-primary border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          {t('alternatives.comparison.premiumLabel', 'Premium')}
                        </Badge>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4">{renderCellValue(row.linkmax.free, row.linkmax.freeNote)}</td>
                        <td className="p-4 bg-primary/5">{renderCellValue(row.linkmax.premium, row.linkmax.premiumNote)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>

          {/* Premium Pricing */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              {t('alternatives.pricing.title', 'Premium Pricing')}
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {pricingComparison.map((plan, index) => (
                <Card key={index} className={plan.best ? 'border-primary/50 ring-2 ring-primary/20' : plan.popular ? 'border-green-500/50' : ''}>
                  <CardHeader className="text-center pb-2">
                    <div className="flex items-center justify-center gap-2">
                      <CardTitle>{plan.period}</CardTitle>
                      {plan.best && <Badge className="bg-primary/20 text-primary border-0">{t('alternatives.pricing.badges.best', 'Best')}</Badge>}
                      {plan.popular && <Badge className="bg-green-500/20 text-green-600 border-0">{t('alternatives.pricing.badges.popular', 'Popular')}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={`text-3xl font-bold ${plan.best ? 'text-primary' : ''}`}>
                      {isKztPrimary ? plan.priceKZT : plan.priceUSD}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isKztPrimary ? `${plan.priceUSD} USD` : `${plan.priceKZT} KZT`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('alternatives.pricing.perMonth', '/month')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              {t(
                'alternatives.pricing.note',
                '* Payment via RoboKassa. Monthly price when paying for the specified period.'
              )}
            </p>
          </section>

          {/* Migration Section */}
          <section className="mb-12 sm:mb-16">
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  {t('alternatives.migration.title', 'Easy Migration from Linktree or Taplink')}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                  {t(
                    'alternatives.migration.description',
                    'AI automatically creates a page based on your description. Just describe your business — and get a ready page in 2 minutes!'
                  )}
                </p>
                <Button size="lg" onClick={() => navigate('/auth')} className="rounded-xl">
                  {t('alternatives.migration.cta', 'Switch to LinkMAX')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('alternatives.finalCta.title', 'Ready to Try?')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              {t(
                'alternatives.finalCta.description',
                'Create a free page right now and see for yourself why LinkMAX is the best choice.'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="rounded-xl">
                <Sparkles className="h-5 w-5 mr-2" />
                {t('alternatives.finalCta.primary', 'Start for Free')}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/gallery')} className="rounded-xl">
                {t('alternatives.finalCta.secondary', 'View Examples')}
                <ExternalLink className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link to="/" className="flex items-center">
                  <span className="text-lg font-bold">
                    Link<span className="text-gradient">MAX</span>
                  </span>
                </Link>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Link to="/pricing" className="hover:text-foreground transition-colors">
                    {t('alternatives.footer.pricing', 'Pricing')}
                  </Link>
                  <Link to="/gallery" className="hover:text-foreground transition-colors">
                    {t('alternatives.footer.gallery', 'Gallery')}
                  </Link>
                  <Link to="/auth" className="hover:text-foreground transition-colors">
                    {t('alternatives.footer.signIn', 'Sign In')}
                  </Link>
                </div>
              </div>
              
              {/* Company Details for RoboKassa compliance */}
              <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/30">
                <p className="mb-1">{t('alternatives.footer.company', 'IP BEEGIN • BIN: 971207300019')}</p>
                <p className="mb-2">{t('alternatives.footer.address', 'Almaty, Sholokhov St., 20/7')}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a href="mailto:admin@lnkmx.my" className="hover:text-foreground transition-colors">
                    admin@lnkmx.my
                  </a>
                  <span>•</span>
                  <a href="tel:+77051097664" className="hover:text-foreground transition-colors">
                    +7 705 109 7664
                  </a>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                © 2025 LinkMAX
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
