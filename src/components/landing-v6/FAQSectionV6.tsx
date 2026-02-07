
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export default function FAQSectionV6() {
    const { t } = useTranslation();

    // Enhanced FAQ data for AEO (Answer Engine Optimization)
    // Structure focuses on direct questions users ask voice assistants or AI search
    const faqs = [
        {
            question: "Что такое lnkmx и кому он подходит?",
            answer: "lnkmx — это операционная система для микробизнеса. Она идеально подходит для экспертов, фрилансеров и малого бизнеса, которым нужен быстрый сайт, встроенная CRM для заявок и простая аналитика без сложных настроек."
        },
        {
            question: "Нужно ли знать программирование?",
            answer: "Нет, lnkmx — это no-code платформа. Вы собираете сайт из готовых блоков, как конструктор Lego. А встроенный AI-помощник может написать тексты за вас."
        },
        {
            question: "Можно ли принимать оплаты в тенге?",
            answer: "Да, платформа полностью адаптирована для рынка Казахстана. Вы можете указывать цены в KZT, а интеграции с локальными платежными системами находятся в активной разработке."
        },
        {
            question: "Помогает ли сайт на lnkmx продвижению в Google (SEO)?",
            answer: "Абсолютно. Все страницы на lnkmx автоматически оптимизированы для поисковиков: быстрая загрузка, адаптивность под мобильные устройства и правильная семантическая разметка (Schema.org), что критически важно для SEO в 2025 году."
        },
        {
            question: "Есть ли бесплатный тариф?",
            answer: "Да, у нас есть вечный бесплатный тариф с базовыми функциями. Вы можете создать страницу и начать принимать заявки без вложений."
        }
    ];

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
                        Частые вопросы
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Всё, что нужно знать о платформе
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border rounded-lg px-4 bg-muted/30 data-[state=open]:bg-muted/50 transition-colors"
                        >
                            <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        </section>
    );
}
