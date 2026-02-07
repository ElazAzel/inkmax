import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/motion';

export default function PricingSectionV6() {
    const { t } = useTranslation();

    const features = [
        "Unlimited links",
        "Basic analytics",
        "Custom themes",
        "QR code generator",
        "Social icons"
    ];

    const proFeatures = [
        "Everything in Free",
        "Advanced analytics",
        "Remove branding",
        "Custom domain",
        "Priority support",
        "AI content generation"
    ];

    return (
        <section className="py-24 bg-background border-t border-border/40">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Simple, Transparent Pricing.
                    </h2>
                    <p className="text-lg text-muted-foreground/80 font-sans">
                        Start for free, upgrade when you grow. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <Reveal delay={0} direction="up" className="flex flex-col p-8 border border-border bg-card rounded-2xl hover:border-foreground/20 transition-colors">
                        <div className="mb-8">
                            <h3 className="font-heading text-xl font-bold mb-2">Free</h3>
                            <p className="text-muted-foreground text-sm">Perfect for getting started</p>
                        </div>
                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-extrabold font-heading">0₸</span>
                            <span className="text-muted-foreground ml-2">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-center text-sm font-sans">
                                    <Check className="w-4 h-4 mr-3 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium border-primary/20 hover:bg-primary/5 hover:text-primary">
                            Get Started
                        </Button>
                    </Reveal>

                    {/* Pro Plan */}
                    <Reveal delay={100} direction="up" className="flex flex-col p-8 border border-primary/50 bg-background relative rounded-2xl shadow-2xl shadow-primary/5">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                        </div>
                        <div className="mb-8">
                            <h3 className="font-heading text-xl font-bold mb-2">Pro</h3>
                            <p className="text-muted-foreground text-sm">For serious creators</p>
                        </div>
                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-extrabold font-heading">2,990₸</span>
                            <span className="text-muted-foreground ml-2">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center text-sm font-sans font-medium">
                                    <Check className="w-4 h-4 mr-3 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20">
                            Upgrade to Pro
                        </Button>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
