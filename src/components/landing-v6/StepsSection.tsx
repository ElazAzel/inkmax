import { Reveal } from '@/components/motion';
import { UserPlus, Settings2, Rocket } from 'lucide-react';

export default function StepsSection() {
    const steps = [
        {
            icon: UserPlus,
            title: "1. Create Account",
            desc: "Sign up in seconds using your email or Google account. No credit card required."
        },
        {
            icon: Settings2,
            title: "2. Customize",
            desc: "Choose a template, add your links, and style it to match your brand."
        },
        {
            icon: Rocket,
            title: "3. Launch",
            desc: "Publish your page and share the link in your bio. Start tracking visits immediately."
        }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24">
                    <Reveal delay={0} direction="up">
                        <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6">
                            From Idea to Live in Minutes
                        </h2>
                    </Reveal>
                    <Reveal delay={100} direction="up">
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
                            We removed all the complexity. You focus on your content, we handle the rest.
                        </p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

                    {steps.map((step, i) => (
                        <Reveal key={i} delay={i * 200} direction="up" className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-3xl bg-background border border-border shadow-lg flex items-center justify-center mb-8 relative group hover:border-primary/50 transition-colors duration-300">
                                <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-6 scale-90 -z-10 group-hover:rotate-12 transition-transform duration-300" />
                                <step.icon className="w-10 h-10 text-primary" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-heading text-sm shadow-md">
                                    {i + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">
                                {step.desc}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
