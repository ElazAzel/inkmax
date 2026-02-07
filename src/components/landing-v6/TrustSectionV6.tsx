import { Reveal } from '@/components/motion/Reveal';

export default function TrustSectionV6() {
    return (
        <section className="py-12 border-y border-border/40 bg-muted/20 relative overflow-hidden">
            <div className="flex overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 mx-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-xl font-bold font-heading">Acme Corp</span>
                            <span className="text-xl font-bold font-heading">GlobalTech</span>
                            <span className="text-xl font-bold font-heading">IndieMaker</span>
                            <span className="text-xl font-bold font-heading">CreatorLabs</span>
                            <span className="text-xl font-bold font-heading">StudioFlow</span>
                            <span className="text-xl font-bold font-heading">NextGen</span>
                            <span className="text-xl font-bold font-heading">BrightSide</span>
                            <span className="text-xl font-bold font-heading">Velocity</span>
                        </div>
                    ))}
                </div>
                <div className="flex absolute top-0 py-12 animate-marquee2 whitespace-nowrap">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 mx-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-xl font-bold font-heading">Acme Corp</span>
                            <span className="text-xl font-bold font-heading">GlobalTech</span>
                            <span className="text-xl font-bold font-heading">IndieMaker</span>
                            <span className="text-xl font-bold font-heading">CreatorLabs</span>
                            <span className="text-xl font-bold font-heading">StudioFlow</span>
                            <span className="text-xl font-bold font-heading">NextGen</span>
                            <span className="text-xl font-bold font-heading">BrightSide</span>
                            <span className="text-xl font-bold font-heading">Velocity</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
