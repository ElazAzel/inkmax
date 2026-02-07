import { Reveal } from '@/components/motion';

export default function TrustSectionV6() {
    return (
        <section className="py-24 bg-muted/30 border-t border-border/40">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto text-center">
                <p className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-12">
                    Trusted by 10,000+ creators and businesses
                </p>

                {/* Marquee / Grid placeholder - implementing a clean grid for Swiss style */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholders for logos - in a real app these would be SVGs */}
                    {['Acme Corp', 'Global Inc', 'SaaS Flow', 'NextGen', 'Creativ', 'Studio 42'].map((name, i) => (
                        <Reveal key={i} delay={i * 50} direction="fade" className="flex justify-center">
                            <span className="text-xl font-heading font-black text-foreground/80">{name}</span>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
