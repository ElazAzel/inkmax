import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion';

interface HeroSectionProps {
    onCreatePage: () => void;
    onViewExamples: () => void;
}

export default function HeroSection({ onCreatePage, onViewExamples }: HeroSectionProps) {
    const { t } = useTranslation();

    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden bg-background">
            {/* Background Grid Pattern (Swiss Style) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-8">

                    {/* Trust Badge / Eyebrow */}
                    <Reveal delay={0} direction="down">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-border/60 bg-background/50 backdrop-blur-sm rounded-full shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 mr-2 text-primary fill-primary/20" />
                            <span className="font-heading tracking-tight">AI-Powered Bio Pages v5.0</span>
                        </Badge>
                    </Reveal>

                    {/* Main Headline - Manrope Font (Swiss typography) */}
                    <Reveal delay={100} direction="up" distance={20}>
                        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
                            Your Bio Page, <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
                                Reimagined.
                            </span>
                        </h1>
                    </Reveal>

                    {/* Subtitle - Inter Font */}
                    <Reveal delay={200} direction="up" distance={20}>
                        <p className="font-sans text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
                            The operating system for creators and micro-businesses.
                            Build a stunning page, capture leads, and manage bookings — all in seconds.
                        </p>
                    </Reveal>

                    {/* CTA Group */}
                    <Reveal delay={300} direction="up" distance={20}>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                            <Button
                                size="lg"
                                onClick={onCreatePage}
                                className="h-14 px-8 rounded-full text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-[200px]"
                            >
                                Start for free
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={onViewExamples}
                                className="h-14 px-8 rounded-full text-base font-medium border-border/50 hover:bg-muted/50 min-w-[200px]"
                            >
                                View Examples
                            </Button>
                        </div>
                    </Reveal>

                    {/* Trust Indicators */}
                    <Reveal delay={400} direction="fade">
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-8 text-sm text-muted-foreground font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>Free forever plan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>Set up in 2 minutes</span>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Hero Visual - Bento Grid Teaser (Placeholder for next step) */}
                <Reveal delay={600} direction="up" distance={40} className="mt-16 md:mt-24">
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-muted/20 border border-border/40 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                            <span className="text-muted-foreground font-medium">Product Interactive Preview Loading...</span>
                        </div>
                        {/* We will implement the actual Bento Grid preview here next */}
                    </div>
                </Reveal>

            </div>
        </section>
    );
}
