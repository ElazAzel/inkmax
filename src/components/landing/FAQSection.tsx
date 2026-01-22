import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export function FAQSection() {
  const { t } = useTranslation();
  const sectionAnimation = useScrollAnimation();

  const faqItems = [
    {
      question: t('landing.faq.q1.question', 'Что такое LinkMAX и для чего он нужен?'),
      answer: t('landing.faq.q1.answer', 'lnkmx — это AI-конструктор link in bio и мини-сайтов, который помогает собрать одну понятную страницу для ссылок, услуг, записи и заявок.')
    },
    {
      question: t('landing.faq.q2.question', 'Сколько стоит использование LinkMAX?'),
      answer: t('landing.faq.q2.answer', 'Базовый тариф бесплатен навсегда. Pro: 3 мес — 4 350₸/мес, 6 мес — 3 500₸/мес, 12 мес — 2 610₸/мес. Оплата онлайн, возврат в течение 14 дней.')
    },
    {
      question: t('landing.faq.q3.question', 'Как работает AI-генерация страницы?'),
      answer: t('landing.faq.q3.answer', 'Выберите нишу и напишите несколько фактов о себе — AI соберёт структуру, тексты и CTA за пару минут. В бесплатном плане 1 генерация/мес, в Pro — 5 генераций/мес.')
    },
    {
      question: t('landing.faq.q4.question', 'Какие блоки доступны для страницы?'),
      answer: t('landing.faq.q4.answer', '20+ типов блоков: профиль, ссылки, кнопки, изображения, видео, карусели, товары, прайс-листы, формы, карты, мессенджеры, отзывы, FAQ, таймеры и другое.')
    },
    {
      question: t('landing.faq.q5.question', 'Есть ли CRM и аналитика?'),
      answer: t('landing.faq.q5.answer', 'Да. В Pro есть CRM для лидов и Telegram-уведомления. Аналитика показывает клики, источники трафика и поведение посетителей.')
    },
    {
      question: t('landing.faq.q6.question', 'Поддерживается ли мобильный редактор?'),
      answer: t('landing.faq.q6.answer', 'Да! LinkMAX создан с упором на мобильные устройства. Вы можете полноценно редактировать страницу прямо со смартфона.')
    },
    {
      question: t('landing.faq.q7.question', 'Какие интеграции поддерживает LinkMAX?'),
      answer: t('landing.faq.q7.answer', 'Telegram для уведомлений о лидах и Google Календарь для расписания. Соцсети и мессенджеры доступны как блоки.')
    },
    {
      question: t('landing.faq.q8.question', 'Берёт ли LinkMAX комиссию с продаж?'),
      answer: t('landing.faq.q8.answer', 'Нет. 0% комиссии с ваших продаж — вы платите только за подписку.')
    },
    {
      question: t('landing.faq.q9.question', 'Как оплатить Premium подписку?'),
      answer: t('landing.faq.q9.answer', 'Оплата картой и через доступные платёжные методы. Также можно использовать токены (100 токенов = 1 день Pro).')
    },
    {
      question: t('landing.faq.q10.question', 'Какие условия возврата средств?'),
      answer: t('landing.faq.q10.answer', 'Возврат возможен в течение 14 дней с момента оплаты согласно законодательству РК. Подробнее в пользовательском соглашении.')
    },
    {
      question: t('landing.faq.q11.question', 'Можно ли посмотреть примеры страниц?'),
      answer: t('landing.faq.q11.answer', 'Да. В галерее — реальные страницы из разных ниш: специалисты, магазины, сервисы и креаторы.')
    },
    {
      question: t('landing.faq.q12.question', 'Чем LinkMAX лучше Linktree и Taplink?'),
      answer: t('landing.faq.q12.answer', 'В lnkmx есть AI-сборка страницы, CRM и уведомления без переплаты. Плюс гибкие блоки, понятные тарифы и локальные языки.')
    },
    {
      question: t('landing.faq.q13.question', 'Подходит ли lnkmx для магазина или сервиса?'),
      answer: t('landing.faq.q13.answer', 'Да. Можно добавить каталог, прайс, формы заявок и кнопки связи, чтобы клиент быстро оформил заказ или запись.')
    },
    {
      question: t('landing.faq.q14.question', 'Можно ли подключить свой домен?'),
      answer: t('landing.faq.q14.answer', 'Да, в Pro доступны собственные домены и брендирование страницы.')
    }
  ];

  return (
    <section ref={sectionAnimation.ref} className="py-16 sm:py-24 lg:py-32 px-5 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-10 sm:mb-14 lg:mb-20 space-y-4 sm:space-y-5">
          <div 
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium opacity-0 ${sectionAnimation.isVisible ? 'animate-fade-in' : ''}`}
          >
            <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="text-primary">{t('landing.faq.badge', 'Вопросы и ответы')}</span>
          </div>
          <h2 
            className={`text-2xl sm:text-4xl lg:text-[3.5rem] font-extrabold tracking-[-0.02em] leading-tight opacity-0 ${sectionAnimation.isVisible ? 'animate-blur-in' : ''}`}
            style={{ animationDelay: '150ms' }}
          >
            {t('landing.faq.title', 'Часто задаваемые вопросы.')}
          </h2>
          <p 
            className={`text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto opacity-0 font-normal ${sectionAnimation.isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '300ms' }}
          >
            {t('landing.faq.subtitle', 'Ответы на популярные вопросы о LinkMAX')}
          </p>
        </div>

        <div 
          className={`opacity-0 ${sectionAnimation.isVisible ? 'animate-fade-in-up' : ''}`}
          style={{ animationDelay: '400ms' }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="rounded-2xl bg-card/50 backdrop-blur-xl border border-border/40 px-5 sm:px-6 overflow-hidden hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left py-5 sm:py-6 hover:no-underline group">
                  <span className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors pr-2">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 sm:pb-6 leading-relaxed text-sm sm:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
