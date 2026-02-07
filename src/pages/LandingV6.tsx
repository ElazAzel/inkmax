import { Suspense, lazy } from 'react';
import SEOHead from '@/components/landing-v5/SEOHead';
import NavBar from '@/components/landing-v5/NavBar';
import HeroSection from '@/components/landing-v6/HeroSection';
import FeaturesBento from '@/components/landing-v6/FeaturesBento';
import PricingSectionV6 from '@/components/landing-v6/PricingSectionV6';
import TrustSectionV6 from '@/components/landing-v6/TrustSectionV6';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Lazy sections
// We will replace these with V6 versions progressively
const FooterSection = lazy(() => import('@/components/landing-v5/FooterSection'));

export default function LandingV6() {
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const handleCreatePage = () => navigate('/auth');
    const handleViewExamples = () => navigate('/gallery');

    return (
        <>
            <SEOHead language={i18n.language} />

            <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
                <NavBar
                    onCreatePage={() => handleCreatePage()}
                    onViewExamples={() => handleViewExamples()}
                />

                <main>
                    <HeroSection
                        onCreatePage={handleCreatePage}
                        onViewExamples={handleViewExamples}
                    />

                    {/* Temporary spacer for scroll testing */}
                    <div className="h-[200vh]" />
                </main>

                <Suspense fallback={null}>
                    <FooterSection />
                </Suspense>
            </div>
        </>
    );
}
