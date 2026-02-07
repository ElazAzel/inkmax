import { LucideIcon, Smartphone, BarChart3, Globe2, Zap, Layout, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/motion';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    className?: string;
    delay?: number;
}

function FeatureCard({ title, description, icon: Icon, className, delay = 0 }: FeatureCardProps) {
    return (
        <Reveal delay={delay} direction="up" className={cn(
            "group relative flex flex-col justify-between p-6 md:p-8 bg-card border border-border/60 hover:border-foreground/20 transition-colors duration-300 overflow-hidden",
            className
        )}>
            <div className="space-y-4 z-10">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h3>
                <p className="text-muted-foreground/80 leading-relaxed font-sans">{description}</p>
            </div>

            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Reveal>
    );
}

export default function FeaturesBento() {
    const { t } = useTranslation();

    const features = [
        {
            title: "Mobile-First Builder",
            description: "Designed for the phone generation. Edit, preview, and publish directly from your mobile device.",
            icon: Smartphone,
            className: "md:col-span-2 md:row-span-2",
            delay: 0
        },
        {
            title: "Real-time Analytics",
            description: "Track clicks, views, and conversion events with privacy-focused built-in analytics.",
            icon: BarChart3,
            className: "md:col-span-1 md:row-span-1",
            delay: 100
        },
        {
            title: "Custom Domain",
            description: "Connect your own .com or .kz domain for professional branding.",
            icon: Globe2,
            className: "md:col-span-1 md:row-span-1",
            delay: 200
        },
        {
            title: "Instant SEO",
            description: "AI-generated meta tags and schema markup ensuring perfect search indexing.",
            icon: Zap,
            className: "md:col-span-1 md:row-span-1",
            delay: 300
        },
        {
            title: "28+ Smart Blocks",
            description: "From simple links to complex forms and booking systems.",
            icon: Layout,
            className: "md:col-span-1 md:row-span-1",
            delay: 400
        },
        {
            title: "Global Payments",
            description: "Accept payments from anywhere via Stripe, Kaspi, or Crypto.",
            icon: CreditCard,
            className: "md:col-span-1 md:row-span-1",
            delay: 500
        }
    ];

    return (
        <section className="py-24 bg-background border-t border-border/40">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Everything you need. <br />
                        <span className="text-muted-foreground">Nothing you don't.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground/80 font-sans">
                        A complete toolkit for micro-businesses, packaged in a beautiful Swiss-style interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(250px,auto)]">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
