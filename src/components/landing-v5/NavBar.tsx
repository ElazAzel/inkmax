import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface NavBarProps {
  onCreatePage: () => void;
  onViewExamples: () => void;
}

export default function NavBar({ onCreatePage, onViewExamples }: NavBarProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed left-0 right-0 z-50 px-4 top-0 pt-3">
      <div className="max-w-xl mx-auto">
        <div className={cn(
          "bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl transition-all duration-300",
          scrolled ? "shadow-lg border-border/60" : "shadow-md"
        )}>
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
                onClick={onViewExamples}
                className="hidden sm:flex rounded-xl"
              >
                {t('landingV5.nav.examples')}
              </Button>
              <Button 
                onClick={onCreatePage}
                className={cn(
                  "rounded-xl font-semibold shadow-md shadow-primary/20",
                  "hover:scale-[1.02] active:scale-[0.98] transition-all"
                )}
                size="sm"
              >
                {t('landingV5.nav.create')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
