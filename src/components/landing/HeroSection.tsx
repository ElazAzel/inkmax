import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Bot, 
  Zap,
  MessageSquare,
  Bell,
  Users
} from 'lucide-react';

interface HeroSectionProps {
  isVisible: boolean;
  sectionRef: React.RefObject<HTMLElement>;
}

export function HeroSection({ isVisible, sectionRef }: HeroSectionProps) {
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

  return (
    <section ref={sectionRef} className="relative pt-28 sm:pt-36 lg:pt-44 pb-12 sm:pb-20 lg:pb-28 px-5 sm:px-6">
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-primary">{t('landing.hero.badge', 'AI-страница для бизнеса')}</span>
          </div>

          {/* Main headline */}
          <div className={`space-y-4 opacity-0 ${isVisible ? 'animate-blur-in' : ''}`} style={{ animationDelay: '100ms' }}>
            <h1 className="text-[2.25rem] sm:text-[3rem] lg:text-[4rem] font-extrabold tracking-[-0.02em] leading-[1.1]">
              {t('landing.hero.title', 'AI-страница за 2 минуты,')}
              <br />
              <span className="text-gradient bg-[length:200%_auto] animate-gradient-x">
                {t('landing.hero.titleHighlight', 'которая собирает заявки')}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p 
            className={`text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '200ms' }}
          >
            {t('landing.hero.description', 'Для бьюти-мастеров, экспертов и малого бизнеса. AI-дизайнер + AI-копирайтер + Mini-CRM + Telegram-уведомления о новых клиентах.')}
          </p>

          {/* Key benefits row */}
          <div 
            className={`flex flex-wrap justify-center gap-3 sm:gap-4 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Bot className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{t('landing.hero.benefit1', 'AI создаёт всё сам')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('landing.hero.benefit2', 'Mini-CRM внутри')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <Bell className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{t('landing.hero.benefit3', 'Telegram-уведомления')}</span>
            </div>
          </div>

          {/* Username Input */}
          <div 
            className={`max-w-lg mx-auto opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '400ms' }}
          >
            <div className="relative flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-card/80 backdrop-blur-2xl border border-border/50 shadow-glass-lg">
              <div className="flex-shrink-0 pl-2 sm:pl-4 text-muted-foreground font-medium text-xs sm:text-sm">
                lnkmx.my/
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
                className="rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-4 sm:py-5"
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-primary" />
                {t('landing.hero.free', 'Бесплатно')}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-primary" />
                {t('landing.hero.noCode', 'Без кода')}
              </span>
              <span className="flex items-center gap-1">
                <Bot className="h-3.5 w-3.5 text-primary" />
                {t('landing.hero.aiHelps', 'AI помогает')}
              </span>
            </p>
          </div>

          {/* Secondary CTA */}
          <div 
            className={`opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '500ms' }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/gallery')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Users className="h-4 w-4 mr-2" />
              {t('landing.hero.viewExamples', 'Посмотреть примеры страниц')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
