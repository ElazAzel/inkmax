import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/motion';
import { useMarketingAnalytics } from '@/hooks/useMarketingAnalytics';

export default function FAQSection() {
  const { t } = useTranslation();
  const { trackMarketingEvent } = useMarketingAnalytics();

  // FAQ items optimized for search queries and AI understanding
  const faqItems = [
    { question: t('landingV5.faq.q1.question'), answer: t('landingV5.faq.q1.answer') },
    { question: t('landingV5.faq.q2.question'), answer: t('landingV5.faq.q2.answer') },
    { question: t('landingV5.faq.q3.question'), answer: t('landingV5.faq.q3.answer') },
    { question: t('landingV5.faq.q4.question'), answer: t('landingV5.faq.q4.answer') },
    { question: t('landingV5.faq.q5.question'), answer: t('landingV5.faq.q5.answer') },
    { question: t('landingV5.faq.q6.question'), answer: t('landingV5.faq.q6.answer') },
    { question: t('landingV5.faq.q7.question'), answer: t('landingV5.faq.q7.answer') },
    { question: t('landingV5.faq.q8.question'), answer: t('landingV5.faq.q8.answer') },
    { question: t('landingV5.faq.q9.question'), answer: t('landingV5.faq.q9.answer') },
    { question: t('landingV5.faq.q10.question'), answer: t('landingV5.faq.q10.answer') },
    { question: t('landingV5.faq.q11.question'), answer: t('landingV5.faq.q11.answer') },
    { question: t('landingV5.faq.q12.question'), answer: t('landingV5.faq.q12.answer') },
  ];

  return (
    <section className="py-12 px-5 bg-muted/20">
      <div className="max-w-xl mx-auto">
        <Reveal direction="up">
          <div className="text-center mb-8">
            <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
              <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
              {t('landingV5.faq.badge')}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {t('landingV5.faq.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('landingV5.faq.subtitle')}
            </p>
          </div>
        </Reveal>

        <Reveal delay={200} direction="up">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2"
            onValueChange={(value) => {
              if (value) {
                trackMarketingEvent({
                  eventType: 'faq_expand',
                  metadata: { item: value },
                });
              }
            }}
          >
            {faqItems.map((item, i) => (
              <AccordionItem 
                key={i}
                value={`faq-${i}`}
                className="rounded-xl bg-card/50 border border-border/40 px-4 overflow-hidden hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left py-4 hover:no-underline group">
                  <span className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors pr-2">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
