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
  useEffect(() => {
    const isRussian = currentLanguage === 'ru' || currentLanguage === 'kk';
    
    const title = isRussian
      ? 'LinkMAX vs Linktree vs Taplink — Сравнение 2026 | Лучшая альтернатива'
      : 'LinkMAX vs Linktree vs Taplink — 2026 Comparison | Best Alternative';
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

    const description = isRussian
      ? 'Подробное сравнение LinkMAX, Linktree и Taplink. Узнайте, почему LinkMAX — лучшая бесплатная альтернатива с AI-генерацией, CRM и 0% комиссии. Таблица сравнения функций и цен.'
      : 'Detailed comparison of LinkMAX, Linktree and Taplink. Discover why LinkMAX is the best free alternative with AI generation, CRM and 0% commission. Feature and pricing comparison table.';
    setMetaTag('description', description);

    const keywords = isRussian
      ? 'linktree vs taplink, taplink альтернатива, linktree альтернатива бесплатно, лучший link in bio, сравнение linktree taplink, бесплатный аналог taplink, замена linktree, hipolink альтернатива, beacons vs linktree, lnk.bio альтернатива'
      : 'linktree vs taplink, taplink alternative, linktree alternative free, best link in bio, linktree taplink comparison, free taplink alternative, linktree replacement, beacons vs linktree, lnk.bio alternative, shorby alternative';
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
        name: isRussian ? 'Сравнение Link in Bio платформ' : 'Link in Bio Platforms Comparison',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'SoftwareApplication',
              name: 'LinkMAX',
              applicationCategory: 'BusinessApplication',
              description: isRussian ? 'AI-конструктор link-in-bio с CRM и 0% комиссии' : 'AI-powered link-in-bio builder with CRM and 0% commission',
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
      document.title = 'LinkMAX - AI-Powered Link-in-Bio Platform';
      const schemaToRemove = document.querySelector('script.alternatives-schema');
      if (schemaToRemove) schemaToRemove.remove();
    };
  }, [currentLanguage]);

  return null;
}

export default function Alternatives() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRussian = i18n.language === 'ru' || i18n.language === 'kk';

  const comparisonData = [
    {
      feature: isRussian ? 'Бесплатный тариф' : 'Free Plan',
      linkmax: { value: true, note: isRussian ? 'Навсегда, 10 блоков' : 'Forever, 10 blocks' },
      linktree: { value: true, note: isRussian ? 'Ограниченный' : 'Limited' },
      taplink: { value: true, note: isRussian ? 'Очень ограниченный' : 'Very limited' },
    },
    {
      feature: isRussian ? 'AI-генерация страницы' : 'AI Page Generation',
      linkmax: { value: true, note: isRussian ? 'За 2 минуты' : 'In 2 minutes' },
      linktree: { value: false },
      taplink: { value: false },
    },
    {
      feature: isRussian ? 'Количество блоков' : 'Number of Block Types',
      linkmax: { value: '20+', highlight: true },
      linktree: { value: '12' },
      taplink: { value: '15' },
    },
    {
      feature: isRussian ? 'CRM система' : 'CRM System',
      linkmax: { value: true, note: isRussian ? 'Встроенная' : 'Built-in' },
      linktree: { value: false },
      taplink: { value: true, note: isRussian ? 'Только платно' : 'Paid only' },
    },
    {
      feature: isRussian ? 'Аналитика кликов' : 'Click Analytics',
      linkmax: { value: true, note: isRussian ? 'Бесплатно' : 'Free' },
      linktree: { value: true, note: isRussian ? 'Базовая бесплатно' : 'Basic free' },
      taplink: { value: true, note: isRussian ? 'Только платно' : 'Paid only' },
    },
    {
      feature: isRussian ? 'Telegram-уведомления' : 'Telegram Notifications',
      linkmax: { value: true },
      linktree: { value: false },
      taplink: { value: false },
    },
    {
      feature: isRussian ? 'Формы и заявки' : 'Lead Forms',
      linkmax: { value: true },
      linktree: { value: true, note: isRussian ? 'Платно' : 'Paid' },
      taplink: { value: true },
    },
    {
      feature: isRussian ? 'Комиссия с продаж' : 'Sales Commission',
      linkmax: { value: '0%', highlight: true },
      linktree: { value: '0%' },
      taplink: { value: '0%' },
    },
    {
      feature: isRussian ? 'Кастомный домен' : 'Custom Domain',
      linkmax: { value: true, note: 'Business' },
      linktree: { value: true, note: isRussian ? 'Платно' : 'Paid' },
      taplink: { value: true, note: isRussian ? 'Платно' : 'Paid' },
    },
    {
      feature: isRussian ? 'Без водяного знака' : 'No Watermark',
      linkmax: { value: true, note: 'Pro' },
      linktree: { value: true, note: isRussian ? 'Платно' : 'Paid' },
      taplink: { value: true, note: isRussian ? 'Платно' : 'Paid' },
    },
    {
      feature: isRussian ? 'Приём оплат' : 'Payment Processing',
      linkmax: { value: true, note: 'Stripe, Kaspi' },
      linktree: { value: true, note: 'Stripe, PayPal' },
      taplink: { value: true, note: isRussian ? 'Разные' : 'Various' },
    },
    {
      feature: isRussian ? 'Мобильное приложение' : 'Mobile App',
      linkmax: { value: true, note: 'PWA' },
      linktree: { value: true },
      taplink: { value: true },
    },
    {
      feature: isRussian ? 'Поддержка русского' : 'Russian Language',
      linkmax: { value: true },
      linktree: { value: false },
      taplink: { value: true },
    },
    {
      feature: isRussian ? 'Поддержка казахского' : 'Kazakh Language',
      linkmax: { value: true },
      linktree: { value: false },
      taplink: { value: false },
    },
  ];

  const pricingComparison = [
    {
      tier: isRussian ? 'Бесплатно' : 'Free',
      linkmax: '$0',
      linktree: '$0',
      taplink: '$0',
    },
    {
      tier: 'Pro',
      linkmax: '$3.15/мес',
      linktree: '$5/мес',
      taplink: '$6/мес',
      linkmaxHighlight: true,
    },
    {
      tier: 'Business',
      linkmax: '$7.50/мес',
      linktree: '$9/мес',
      taplink: '$12/мес',
      linkmaxHighlight: true,
    },
  ];

  const advantages = [
    {
      icon: Bot,
      title: isRussian ? 'AI-генерация за 2 минуты' : 'AI Generation in 2 Minutes',
      description: isRussian 
        ? 'Опишите свой бизнес — AI создаст профессиональную страницу автоматически. Linktree и Taplink не предлагают такой функции.'
        : 'Describe your business — AI creates a professional page automatically. Linktree and Taplink don\'t offer this feature.',
    },
    {
      icon: Users,
      title: isRussian ? 'Встроенная CRM бесплатно' : 'Built-in CRM for Free',
      description: isRussian 
        ? 'Управляйте лидами и клиентами прямо в LinkMAX. В Taplink CRM только на платных тарифах, в Linktree её нет вообще.'
        : 'Manage leads and clients right in LinkMAX. Taplink CRM is paid only, Linktree doesn\'t have it at all.',
    },
    {
      icon: MessageSquare,
      title: isRussian ? 'Telegram-уведомления' : 'Telegram Notifications',
      description: isRussian 
        ? 'Получайте уведомления о новых лидах в Telegram мгновенно. Уникальная функция LinkMAX.'
        : 'Get notifications about new leads in Telegram instantly. Unique LinkMAX feature.',
    },
    {
      icon: CreditCard,
      title: isRussian ? 'Дешевле на 40-50%' : '40-50% Cheaper',
      description: isRussian 
        ? 'Pro тариф всего $3.15/мес против $5-6 у конкурентов. При большем функционале!'
        : 'Pro plan is just $3.15/month vs $5-6 at competitors. With more features!',
    },
    {
      icon: Globe,
      title: isRussian ? 'Локализация RU/KZ' : 'RU/KZ Localization',
      description: isRussian 
        ? 'Полная поддержка русского и казахского языков. Linktree работает только на английском.'
        : 'Full Russian and Kazakh language support. Linktree only works in English.',
    },
    {
      icon: BarChart3,
      title: isRussian ? 'Расширенная аналитика' : 'Advanced Analytics',
      description: isRussian 
        ? 'Детальная статистика кликов, источников трафика и поведения пользователей.'
        : 'Detailed click statistics, traffic sources and user behavior analytics.',
    },
  ];

  const renderValue = (data: { value: boolean | string; note?: string; highlight?: boolean }) => {
    if (typeof data.value === 'boolean') {
      return (
        <div className="flex items-center justify-center gap-1">
          {data.value ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-400" />
          )}
          {data.note && (
            <span className="text-xs text-muted-foreground">{data.note}</span>
          )}
        </div>
      );
    }
    return (
      <div className={`text-center ${data.highlight ? 'font-bold text-primary' : ''}`}>
        {data.value}
        {data.note && (
          <span className="block text-xs text-muted-foreground">{data.note}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <AlternativesSEOHead currentLanguage={i18n.language} />
      
      <div className="min-h-screen bg-background relative overflow-hidden">
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
                    {isRussian ? 'Начать' : 'Get Started'}
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
              {isRussian ? 'Сравнение 2026' : '2026 Comparison'}
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
              {isRussian ? (
                <>LinkMAX vs Linktree vs Taplink</>
              ) : (
                <>LinkMAX vs Linktree vs Taplink</>
              )}
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {isRussian 
                ? 'Узнайте, почему тысячи пользователей переходят с Linktree и Taplink на LinkMAX. Подробное сравнение функций, цен и возможностей.'
                : 'Discover why thousands of users are switching from Linktree and Taplink to LinkMAX. Detailed comparison of features, pricing and capabilities.'}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="rounded-xl">
                <Sparkles className="h-5 w-5 mr-2" />
                {isRussian ? 'Попробовать бесплатно' : 'Try for Free'}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/pricing')} className="rounded-xl">
                {isRussian ? 'Посмотреть цены' : 'View Pricing'}
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
                      {isRussian ? 'LinkMAX — лучший выбор в 2026' : 'LinkMAX — Best Choice in 2026'}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      {isRussian 
                        ? 'AI-генерация, встроенная CRM, Telegram-уведомления и цена на 40-50% ниже конкурентов. Всё это делает LinkMAX лучшей альтернативой Linktree и Taplink.'
                        : 'AI generation, built-in CRM, Telegram notifications and 40-50% lower price than competitors. All this makes LinkMAX the best Linktree and Taplink alternative.'}
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
              {isRussian ? 'Почему LinkMAX лучше?' : 'Why is LinkMAX Better?'}
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

          {/* Feature Comparison Table */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              {isRussian ? 'Сравнение функций' : 'Feature Comparison'}
            </h2>
            
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">
                        {isRussian ? 'Функция' : 'Feature'}
                      </th>
                      <th className="text-center p-4">
                        <div className="flex flex-col items-center gap-1">
                          <Badge className="bg-primary/20 text-primary border-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            LinkMAX
                          </Badge>
                        </div>
                      </th>
                      <th className="text-center p-4">
                        <span className="text-muted-foreground">Linktree</span>
                      </th>
                      <th className="text-center p-4">
                        <span className="text-muted-foreground">Taplink</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 bg-primary/5">{renderValue(row.linkmax)}</td>
                        <td className="p-4">{renderValue(row.linktree)}</td>
                        <td className="p-4">{renderValue(row.taplink)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>

          {/* Pricing Comparison */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              {isRussian ? 'Сравнение цен' : 'Pricing Comparison'}
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {pricingComparison.map((tier, index) => (
                <Card key={index} className={tier.linkmaxHighlight ? 'border-primary/50' : ''}>
                  <CardHeader className="text-center pb-2">
                    <CardTitle>{tier.tier}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className={`text-center p-3 rounded-xl ${tier.linkmaxHighlight ? 'bg-primary/10' : 'bg-muted/50'}`}>
                      <p className="text-xs text-muted-foreground mb-1">LinkMAX</p>
                      <p className={`text-xl font-bold ${tier.linkmaxHighlight ? 'text-primary' : ''}`}>
                        {tier.linkmax}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Linktree</p>
                      <p className="text-lg">{tier.linktree}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Taplink</p>
                      <p className="text-lg">{tier.taplink}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isRussian 
                ? '* Цены указаны при оплате за год. LinkMAX на 40-50% дешевле!'
                : '* Prices shown for annual billing. LinkMAX is 40-50% cheaper!'}
            </p>
          </section>

          {/* Migration Section */}
          <section className="mb-12 sm:mb-16">
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  {isRussian ? 'Легкий переход с Linktree или Taplink' : 'Easy Migration from Linktree or Taplink'}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                  {isRussian 
                    ? 'AI автоматически создаст страницу на основе вашего описания. Просто опишите свой бизнес — и получите готовую страницу за 2 минуты!'
                    : 'AI automatically creates a page based on your description. Just describe your business — and get a ready page in 2 minutes!'}
                </p>
                <Button size="lg" onClick={() => navigate('/auth')} className="rounded-xl">
                  {isRussian ? 'Перейти на LinkMAX' : 'Switch to LinkMAX'}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {isRussian ? 'Готовы попробовать?' : 'Ready to Try?'}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              {isRussian 
                ? 'Создайте бесплатную страницу прямо сейчас и убедитесь сами, почему LinkMAX — лучший выбор.'
                : 'Create a free page right now and see for yourself why LinkMAX is the best choice.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="rounded-xl">
                <Sparkles className="h-5 w-5 mr-2" />
                {isRussian ? 'Начать бесплатно' : 'Start for Free'}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/gallery')} className="rounded-xl">
                {isRussian ? 'Посмотреть примеры' : 'View Examples'}
                <ExternalLink className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link to="/" className="flex items-center">
                <span className="text-lg font-bold">
                  Link<span className="text-gradient">MAX</span>
                </span>
              </Link>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link to="/pricing" className="hover:text-foreground transition-colors">
                  {isRussian ? 'Тарифы' : 'Pricing'}
                </Link>
                <Link to="/gallery" className="hover:text-foreground transition-colors">
                  {isRussian ? 'Галерея' : 'Gallery'}
                </Link>
                <Link to="/auth" className="hover:text-foreground transition-colors">
                  {isRussian ? 'Войти' : 'Sign In'}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}