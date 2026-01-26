import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { TermsLink } from '@/components/legal/TermsOfServiceModal';
import { PrivacyLink } from '@/components/legal/PrivacyPolicyModal';

export default function FooterSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/30 py-8 px-5 bg-muted/20">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-lg font-black">
            lnk<span className="text-primary">mx</span>
          </span>
        </div>
        
        {/* Navigation links */}
        <nav className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-4">
          <button 
            onClick={() => navigate('/pricing')} 
            className="hover:text-foreground transition-colors"
          >
            {t('landingV5.footer.pricing', 'Тарифы')}
          </button>
          <span>·</span>
          <button 
            onClick={() => navigate('/gallery')} 
            className="hover:text-foreground transition-colors"
          >
            {t('landingV5.footer.examples', 'Примеры')}
          </button>
          <span>·</span>
          <button 
            onClick={() => navigate('/alternatives')} 
            className="hover:text-foreground transition-colors"
          >
            {t('landingV5.footer.alternatives', 'Сравнение')}
          </button>
          <span>·</span>
          <TermsLink className="hover:text-foreground transition-colors">
            {t('landingV5.footer.terms', 'Условия')}
          </TermsLink>
          <span>·</span>
          <PrivacyLink className="hover:text-foreground transition-colors">
            {t('landingV5.footer.privacy', 'Политика')}
          </PrivacyLink>
        </nav>

        {/* Language switcher */}
        <div className="flex justify-center mb-4">
          <LanguageSwitcher />
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} lnkmx
        </p>
      </div>
    </footer>
  );
}
