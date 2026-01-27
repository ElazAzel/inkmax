import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { TermsLink } from '@/components/legal/TermsOfServiceModal';
import { PrivacyLink } from '@/components/legal/PrivacyPolicyModal';
import { Reveal } from '@/components/motion';

export default function FooterSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/30 py-8 px-5 bg-muted/20">
      <div className="max-w-xl mx-auto">
        <Reveal direction="up">
          {/* Logo and description */}
          <div className="text-center mb-6">
            <span className="text-lg font-black">
              lnk<span className="text-primary">mx</span>
            </span>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              {t('landingV5.footer.description')}
            </p>
          </div>
          
          {/* Navigation links */}
          <nav className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-4">
            <button 
              onClick={() => navigate('/gallery')} 
              className="hover:text-foreground transition-colors"
            >
              {t('landingV5.footer.examples')}
            </button>
            <span>·</span>
            <button 
              onClick={() => navigate('/pricing')} 
              className="hover:text-foreground transition-colors"
            >
              {t('landingV5.footer.pricing')}
            </button>
            <span>·</span>
            <TermsLink className="hover:text-foreground transition-colors">
              {t('landingV5.footer.terms')}
            </TermsLink>
            <span>·</span>
            <PrivacyLink className="hover:text-foreground transition-colors">
              {t('landingV5.footer.privacy')}
            </PrivacyLink>
          </nav>

          {/* Language switcher */}
          <div className="flex justify-center mb-4">
            <LanguageSwitcher />
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground">
            {t('landingV5.footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
