import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTranslation } from 'react-i18next';
import { ChevronDown } from "lucide-react";

export default function FAQSectionV6() {
    const { t } = useTranslation();

    // Get FAQ data using t() calls
    const faqs = (t('landing.v6.faq.items', { returnObjects: true }) as { question: string, answer: string }[]);

    // JSON-LD for FAQPage (Google optimal)
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-24 bg-background relative overflow-hidden" id="faq">
            {/* SEO Schema Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="container px-4 md:px-6 mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {t('landing.v6.faq.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t('landing.v6.faq.subtitle')}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-xl overflow-hidden"
                        >
                            <Collapsible>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left font-medium text-lg hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180">
                                    {faq.question}
                                    <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        </section>
    );
}
