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

                {/* Hero Visual - CSS-only Mobile Mockup */}
                <Reveal delay={600} direction="up" distance={40} className="mt-16 md:mt-24 relative z-10">
                    <div className="relative mx-auto w-full max-w-[320px] md:max-w-[360px] aspect-[9/19] bg-background border-8 border-muted rounded-[3rem] shadow-2xl shadow-primary/20 overflow-hidden ring-1 ring-border/50">
                        {/* Dynamic Island / Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-20 flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                            <div className="w-10 h-1.5 rounded-full bg-neutral-800" />
                        </div>

                        {/* Screen Content */}
                        <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 flex flex-col pt-12 px-6 pb-6 relative overflow-hidden">
                            {/* Abstract Header Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/20 to-transparent -z-10" />

                            {/* Profile Header */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary/60 border-4 border-background shadow-lg mb-4 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-primary-foreground">A</span>
                                </div>
                                <div className="h-6 w-3/4 bg-foreground/10 rounded-md mb-2 animate-pulse" />
                                <div className="h-4 w-1/2 bg-foreground/5 rounded-md animate-pulse" />
                            </div>

                            {/* Links Stack */}
                            <div className="space-y-3 w-full flex-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="group relative w-full h-14 bg-background border border-border/60 rounded-xl shadow-sm flex items-center px-4 hover:scale-[1.02] transition-transform cursor-pointer">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                                            <div className="w-4 h-4 bg-primary/40 rounded-sm" />
                                        </div>
                                        <div className="h-3 w-1/2 bg-foreground/10 rounded-sm group-hover:bg-primary/20 transition-colors" />
                                        {/* Click effect */}
                                        <div className="absolute right-4 w-2 h-2 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>

                            {/* Floating Socials */}
                            <div className="flex justify-center gap-4 mt-6 opacity-60">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-foreground/5" />
                                ))}
                            </div>
                        </div>

                        {/* Reflection/Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[2.5rem]" />
                    </div>

                    {/* Floating Elements (Decorations) */}
                    <div className="absolute top-1/3 -left-12 md:-left-24 bg-card border p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms] hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">$$</div>
                            <div>
                                <div className="font-bold text-sm">New Sale!</div>
                                <div className="text-xs text-muted-foreground">+ 12,500₸</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-1/4 -right-12 md:-right-20 bg-card border p-4 rounded-2xl shadow-xl animate-bounce delay-700 duration-[4000ms] hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">📈</div>
                            <div>
                                <div className="font-bold text-sm">Visits +42%</div>
                                <div className="text-xs text-muted-foreground">Last 7 days</div>
                            </div>
                        </div>
                    </div>
                </Reveal>

            </div>
        </section>
    );
}
