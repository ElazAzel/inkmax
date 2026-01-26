import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { useMarketingAnalytics } from '@/hooks/useMarketingAnalytics';

export default function FAQSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { trackMarketingEvent } = useMarketingAnalytics();

  // FAQ items optimized for search queries and AI understanding
  const faqItems = [
    {
      question: t('landingV5.faq.q1.question', 'Что такое lnkmx и для чего он нужен?'),
      answer: t('landingV5.faq.q1.answer', 'lnkmx - это AI-конструктор мини-сайтов и link-in-bio страниц. Позволяет собрать одну понятную страницу с оффером, прайсом, формой заявки и контактами за 2 минуты. Заявки приходят в Telegram и mini-CRM.'),
    },
    {
      question: t('landingV5.faq.q2.question', 'Сколько стоит lnkmx?'),
      answer: t('landingV5.faq.q2.answer', 'Базовый тариф бесплатен навсегда. Pro: 2 610 ₸/мес при оплате за год, 3 500 ₸/мес за полгода, 4 350 ₸/мес за квартал. Возврат средств в течение 14 дней.'),
    },
    {
      question: t('landingV5.faq.q3.question', 'Как работает AI-генерация страницы?'),
      answer: t('landingV5.faq.q3.answer', 'Выберите нишу и опишите, чем занимаетесь. AI соберёт структуру страницы, напишет тексты и расставит блоки. Вы можете отредактировать всё вручную.'),
    },
    {
      question: t('landingV5.faq.q4.question', 'Какие блоки есть в конструкторе?'),
      answer: t('landingV5.faq.q4.answer', '25+ типов блоков: профиль, ссылки, кнопки, изображения, видео, карусели, товары, прайс, формы заявок, карты, мессенджеры, отзывы, FAQ, таймеры, расписание записи.'),
    },
    {
      question: t('landingV5.faq.q5.question', 'Есть ли CRM для заявок?'),
      answer: t('landingV5.faq.q5.answer', 'Да. В Pro-плане есть mini-CRM: все заявки в одном месте, статусы, заметки, история. Плюс мгновенные уведомления в Telegram при новой заявке.'),
    },
    {
      question: t('landingV5.faq.q6.question', 'Можно ли редактировать с телефона?'),
      answer: t('landingV5.faq.q6.answer', 'Да. lnkmx создан mobile-first - полноценный редактор работает прямо на смартфоне. Публикация в один клик.'),
    },
    {
      question: t('landingV5.faq.q7.question', 'Берёт ли lnkmx комиссию с продаж?'),
      answer: t('landingV5.faq.q7.answer', 'Нет. 0% комиссии с ваших продаж товаров или услуг. Вы платите только за подписку Pro.'),
    },
    {
      question: t('landingV5.faq.q8.question', 'Чем lnkmx лучше Linktree или Taplink?'),
      answer: t('landingV5.faq.q8.answer', 'AI-генерация страницы за 2 минуты, встроенная CRM, Telegram-уведомления, 0% комиссии, локализация RU/EN/KK, цены в тенге.'),
    },
    {
      question: t('landingV5.faq.q9.question', 'Подходит ли lnkmx для магазина или услуг?'),
      answer: t('landingV5.faq.q9.answer', 'Да. Есть блоки каталога товаров, прайс-листа услуг, формы заявки, онлайн-записи, FAQ и карты. Клиент быстро находит нужное и оставляет заявку.'),
    },
    {
      question: t('landingV5.faq.q10.question', 'Можно ли подключить свой домен?'),
      answer: t('landingV5.faq.q10.answer', 'Да, в Pro-плане можно использовать собственный домен и убрать watermark lnkmx.'),
    },
    {
      question: t('landingV5.faq.q11.question', 'Как оплатить Pro-подписку?'),
      answer: t('landingV5.faq.q11.answer', 'Картой Visa/Mastercard или через Kaspi. Также можно использовать Linkkon-токены (100 токенов = 1 день Pro).'),
    },
    {
      question: t('landingV5.faq.q12.question', 'Какие условия возврата?'),
      answer: t('landingV5.faq.q12.answer', 'Возврат средств возможен в течение 14 дней с момента оплаты согласно законодательству РК.'),
    },
  ];

  return (
    <section ref={ref} className="py-12 px-5 bg-muted/20">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-8">
          <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.faq.badge', 'FAQ')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.faq.title', 'Частые вопросы')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('landingV5.faq.subtitle', 'Ответы на популярные вопросы о lnkmx')}
          </p>
        </div>

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
      </div>
    </section>
  );
}
