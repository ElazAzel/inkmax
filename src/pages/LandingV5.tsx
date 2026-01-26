/**
 * Landing Page v5.0 - Complete Redesign
 * Human-centric copywriting, conversion optimized, SEO/AIO ready
 * Mobile-first, performance focused
 */
import { Suspense, lazy, useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLandingAnalytics } from '@/hooks/useLandingAnalytics';
import { useMarketingAnalytics } from '@/hooks/useMarketingAnalytics';

// Lazy load sections for performance
const HeroSection = lazy(() => import('@/components/landing-v5/HeroSection'));
const ProblemSolutionSection = lazy(() => import('@/components/landing-v5/ProblemSolutionSection'));
const HowItWorksSection = lazy(() => import('@/components/landing-v5/HowItWorksSection'));
const ResultsSection = lazy(() => import('@/components/landing-v5/ResultsSection'));
const BlocksShowcaseSection = lazy(() => import('@/components/landing-v5/BlocksShowcaseSection'));
const ExamplesGallerySection = lazy(() => import('@/components/landing-v5/ExamplesGallerySection'));
const TrustSection = lazy(() => import('@/components/landing-v5/TrustSection'));
const PricingSection = lazy(() => import('@/components/landing-v5/PricingSection'));
const SEOExplainerSection = lazy(() => import('@/components/landing-v5/SEOExplainerSection'));
const FAQSection = lazy(() => import('@/components/landing-v5/FAQSection'));
const FinalCTASection = lazy(() => import('@/components/landing-v5/FinalCTASection'));
const FooterSection = lazy(() => import('@/components/landing-v5/FooterSection'));
const NavBar = lazy(() => import('@/components/landing-v5/NavBar'));
const SEOHead = lazy(() => import('@/components/landing-v5/SEOHead'));

// Skeleton for lazy sections
function SectionSkeleton() {
  return (
    <div className="py-16 px-5">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="h-8 bg-muted/50 rounded-lg w-2/3 mx-auto animate-pulse" />
        <div className="h-4 bg-muted/30 rounded w-full animate-pulse" />
        <div className="h-4 bg-muted/30 rounded w-4/5 animate-pulse" />
      </div>
    </div>
  );
}

export default function LandingV5() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const { trackCtaClick } = useLandingAnalytics();
  const { trackMarketingEvent } = useMarketingAnalytics();

  // Scroll handler for floating CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handlers
  const handleCreatePage = useCallback((location: string) => {
    trackCtaClick('create', location);
    trackMarketingEvent({ eventType: 'signup_from_landing', metadata: { location } });
    navigate('/auth');
  }, [navigate, trackCtaClick, trackMarketingEvent]);

  const handleViewExamples = useCallback((location: string) => {
    trackCtaClick('gallery', location);
    navigate('/gallery');
  }, [navigate, trackCtaClick]);

  const handleViewPricing = useCallback((location: string) => {
    trackCtaClick('pricing', location);
    navigate('/pricing');
  }, [navigate, trackCtaClick]);

  const isKZ = i18n.language === 'ru' || i18n.language === 'kk';

  return (
    <>
      <Suspense fallback={null}>
        <SEOHead language={i18n.language} />
      </Suspense>
      
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Navigation */}
        <Suspense fallback={null}>
          <NavBar 
            onCreatePage={() => handleCreatePage('nav')}
            onViewExamples={() => handleViewExamples('nav')}
          />
        </Suspense>

        {/* Main content */}
        <main>
          {/* 1. HERO */}
          <Suspense fallback={<SectionSkeleton />}>
            <HeroSection 
              onCreatePage={() => handleCreatePage('hero')}
              onViewExamples={() => handleViewExamples('hero')}
            />
          </Suspense>

          {/* 2. PROBLEM → SOLUTION */}
          <Suspense fallback={<SectionSkeleton />}>
            <ProblemSolutionSection />
          </Suspense>

          {/* 3. HOW IT WORKS (3 steps) */}
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorksSection 
              onCreatePage={() => handleCreatePage('how_it_works')}
            />
          </Suspense>

          {/* 4. RESULTS / USE CASES */}
          <Suspense fallback={<SectionSkeleton />}>
            <ResultsSection 
              onCreatePage={() => handleCreatePage('results')}
            />
          </Suspense>

          {/* 5. BLOCKS SHOWCASE */}
          <Suspense fallback={<SectionSkeleton />}>
            <BlocksShowcaseSection />
          </Suspense>

          {/* 6. EXAMPLES GALLERY */}
          <Suspense fallback={<SectionSkeleton />}>
            <ExamplesGallerySection 
              onViewAll={() => handleViewExamples('gallery')}
            />
          </Suspense>

          {/* 7. TRUST / PROOF */}
          <Suspense fallback={<SectionSkeleton />}>
            <TrustSection />
          </Suspense>

          {/* 8. PRICING */}
          <Suspense fallback={<SectionSkeleton />}>
            <PricingSection 
              isKZ={isKZ}
              onSelectFree={() => handleCreatePage('pricing_free')}
              onSelectPro={() => handleViewPricing('pricing_pro')}
            />
          </Suspense>

          {/* 9. SEO EXPLAINER (AI-friendly) */}
          <Suspense fallback={<SectionSkeleton />}>
            <SEOExplainerSection />
          </Suspense>

          {/* 10. FAQ */}
          <Suspense fallback={<SectionSkeleton />}>
            <FAQSection />
          </Suspense>

          {/* 11. FINAL CTA */}
          <Suspense fallback={<SectionSkeleton />}>
            <FinalCTASection 
              onCreatePage={() => handleCreatePage('final_cta')}
              onViewExamples={() => handleViewExamples('final_cta')}
            />
          </Suspense>
        </main>

        {/* 12. FOOTER */}
        <Suspense fallback={null}>
          <FooterSection />
        </Suspense>

        {/* Floating CTA */}
        {showFloatingCta && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4">
            <Button 
              size="lg"
              onClick={() => handleCreatePage('floating')}
              className="h-12 px-6 rounded-full font-bold shadow-2xl shadow-primary/30"
            >
              {t('landingV5.floatingCta', 'Создать страницу')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
