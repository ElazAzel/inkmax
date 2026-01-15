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
      answer: t('landing.faq.q1.answer', 'LinkMAX — это AI-конструктор страниц link-in-bio, который позволяет создать мини-сайт за 2 минуты. Идеально подходит для экспертов, фрилансеров и бизнеса, чтобы объединить все ссылки, соцсети и контактные данные в одном месте.')
    },
    {
      question: t('landing.faq.q2.question', 'Сколько стоит использование LinkMAX?'),
      answer: t('landing.faq.q2.answer_v2', 'Базовый тариф бесплатен навсегда. Premium: 3 мес - 4 350₸/мес (~$8.50), 6 мес - 3 500₸/мес (~$6.80), 12 мес - 2 610₸/мес (~$5.10). Оплата через RoboKassa. Возврат в течение 14 дней.')
    },
    {
      question: t('landing.faq.q3.question', 'Как работает AI-генерация страницы?'),
      answer: t('landing.faq.q3.answer_v2', 'Выберите нишу (барбер, фотограф, тренер), и AI создаст готовую страницу с профилем и блоками за 30 секунд. Бесплатно - 1 генерация/мес, Premium - 5 генераций/мес.')
    },
    {
      question: t('landing.faq.q4.question', 'Какие блоки доступны для страницы?'),
      answer: t('landing.faq.q4.answer_v2', '20+ типов блоков: профиль, ссылки, кнопки, изображения, видео, карусели, товары, прайс-листы, формы, карты, мессенджеры, отзывы, FAQ, таймеры обратного отсчёта и другие.')
    },
    {
      question: t('landing.faq.q5.question', 'Есть ли CRM и аналитика?'),
      answer: t('landing.faq.q5.answer_v2', 'Да! В Premium тарифе доступна полноценная CRM для управления лидами и Telegram-уведомления о новых заявках. Аналитика показывает клики, источники трафика и поведение посетителей.')
    },
    {
      question: t('landing.faq.q6.question', 'Поддерживается ли мобильный редактор?'),
      answer: t('landing.faq.q6.answer', 'Да! LinkMAX создан с упором на мобильные устройства. Вы можете полноценно редактировать страницу прямо со смартфона.')
    },
    {
      question: t('landing.faq.q7.question', 'Какие интеграции поддерживает LinkMAX?'),
      answer: t('landing.faq.q7.answer_v2', 'Telegram для уведомлений о лидах и Google Календарь для управления записями. Все социальные сети и мессенджеры поддерживаются как блоки.')
    },
    {
      question: t('landing.faq.q8.question', 'Берёт ли LinkMAX комиссию с продаж?'),
      answer: t('landing.faq.q8.answer_v2', 'Нет! 0% комиссии с ваших транзакций. Вы платите только за подписку, все деньги от продаж остаются вам.')
    },
    {
      question: t('landing.faq.q9.question', 'Как оплатить Premium подписку?'),
      answer: t('landing.faq.q9.answer_v2', 'Оплата через RoboKassa: банковские карты, электронные кошельки и другие способы. Также можно использовать Linkkon токены (100 токенов = 1 день Premium).')
    },
    {
      question: t('landing.faq.q10.question', 'Какие условия возврата средств?'),
      answer: t('landing.faq.q10.answer_v2', 'Возврат возможен в течение 14 дней с момента оплаты согласно законодательству РК. Подробнее в Пользовательском соглашении.')
    },
    {
      question: t('landing.faq.q11.question', 'Можно ли посмотреть примеры страниц?'),
      answer: t('landing.faq.q11.answer_v2', 'Да! В галерее представлены реальные страницы из разных ниш: барберы, фотографы, тренеры, психологи, магазины и другие.')
    },
    {
      question: t('landing.faq.q12.question', 'Чем LinkMAX лучше Linktree и Taplink?'),
      answer: t('landing.faq.q12.answer_v2', 'AI-генерация за 2 минуты, 0% комиссии, встроенная CRM, Telegram-уведомления, современный дизайн, поддержка RU/KZ языков. Цены от 2 610₸/мес (~$5.10).')
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
