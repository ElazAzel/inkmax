import { escapeHtml, getOgLocale, buildHreflangLinks } from './seo-helpers.ts';

const DEFAULT_OG_IMAGE = 'https://lnkmx.my/og-image.png';

type LanguageKey = 'ru' | 'en' | 'kk';

type LandingContent = {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  cta: string;
  aboutTitle: string;
  aboutBody: string;
  forTitle: string;
  forList: string[];
  whereTitle: string;
  whereList: string[];
  answersTitle: string;
  answers: { q: string; a: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
};

type GalleryContent = {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  highlightsTitle: string;
  highlights: string[];
  locationTitle: string;
  locationBody: string;
  topProfilesTitle: string;
};

const LANDING_CONTENT: Record<LanguageKey, LandingContent> = {
  ru: {
    title: 'lnkmx — Micro-Business OS | Конструктор страниц + CRM',
    description:
      'Операционная система для микро-бизнеса: AI-конструктор страниц, встроенная CRM, формы заявок и Telegram-уведомления. Запуск за 2 минуты без кода.',
    h1: 'Micro-Business OS для микро-бизнеса',
    subtitle: 'Мини-сайт, CRM и заявки в одном месте — без кода и сложной настройки.',
    cta: 'Создать бесплатно',
    aboutTitle: 'Что такое lnkmx',
    aboutBody:
      'lnkmx — это конструктор страниц и CRM, который превращает соцсети в полноценную точку продаж. Создайте страницу, принимайте заявки, управляйте клиентами и получайте аналитику.',
    forTitle: 'Для кого подходит',
    forList: ['Эксперты и консультанты', 'Малый бизнес и салоны', 'Блогеры и создатели курсов', 'Организаторы событий'],
    whereTitle: 'Где используют',
    whereList: ['Казахстан, Россия, Кыргызстан', 'Алматы, Астана, Шымкент', 'Онлайн и офлайн сервисы'],
    answersTitle: 'Короткие ответы',
    answers: [
      { q: 'Как быстро запустить страницу?', a: '2 минуты: ответьте на вопросы — AI соберёт страницу.' },
      { q: 'Есть ли встроенная CRM?', a: 'Да, заявки и клиенты сохраняются в одном месте.' },
      { q: 'Подходит ли для локального бизнеса?', a: 'Да, можно указать город и контакты, подключить карту и запись.' },
    ],
    faqTitle: 'FAQ',
    faq: [
      { q: 'Нужен ли дизайнер?', a: 'Нет, готовые блоки и AI помогут запуститься без дизайнера.' },
      { q: 'Можно ли менять язык?', a: 'Да, поддерживаются RU/EN/KK и переключение языков.' },
      { q: 'Есть ли бесплатный тариф?', a: 'Да, можно стартовать бесплатно и перейти на Pro при росте.' },
    ],
  },
  en: {
    title: 'lnkmx — Micro-Business OS | Page Builder + CRM',
    description:
      'Operating system for micro-business: AI page builder, built-in CRM, lead forms and Telegram notifications. Launch in 2 minutes with no code.',
    h1: 'Micro-Business OS for creators & small business',
    subtitle: 'Landing page, CRM, and lead capture in one place — no code needed.',
    cta: 'Start free',
    aboutTitle: 'What is lnkmx',
    aboutBody:
      'lnkmx is a page builder with CRM that turns social traffic into sales. Build a page, collect leads, manage clients, and track analytics.',
    forTitle: 'Who it is for',
    forList: ['Experts & consultants', 'Small businesses & studios', 'Creators and course makers', 'Event organizers'],
    whereTitle: 'Where it works best',
    whereList: ['Kazakhstan, Russia, Kyrgyzstan', 'Almaty, Astana, Shymkent', 'Online and offline services'],
    answersTitle: 'Quick answers',
    answers: [
      { q: 'How fast can I launch?', a: '2 minutes: answer a few questions and AI builds your page.' },
      { q: 'Is there a CRM included?', a: 'Yes, all leads and customers stay in one dashboard.' },
      { q: 'Is it good for local business?', a: 'Yes, add city, map, and booking to get local leads.' },
    ],
    faqTitle: 'FAQ',
    faq: [
      { q: 'Do I need a designer?', a: 'No, ready-made blocks and AI handle the layout.' },
      { q: 'Can I switch languages?', a: 'Yes, RU/EN/KK are supported with easy switching.' },
      { q: 'Is there a free plan?', a: 'Yes, start free and upgrade when you grow.' },
    ],
  },
  kk: {
    title: 'lnkmx — Micro-Business OS | Бет конструкторы + CRM',
    description:
      'Микро-бизнеске арналған операциялық жүйе: AI бет конструкторы, ішкі CRM, өтінім формалары және Telegram хабарламалары. 2 минутта кодсыз іске қосыңыз.',
    h1: 'Микро-бизнеске арналған Micro-Business OS',
    subtitle: 'Мини-сайт, CRM және өтінімдер — бір жерде, кодсыз.',
    cta: 'Тегін бастау',
    aboutTitle: 'lnkmx деген не',
    aboutBody:
      'lnkmx — парақша құрастырушы және CRM. Әлеуметтік желідегі трафикті сатылымға айналдырып, өтінімдерді жинап, клиенттерді басқаруға көмектеседі.',
    forTitle: 'Кімге арналған',
    forList: ['Сарапшылар мен кеңесшілер', 'Шағын бизнес пен салондар', 'Креаторлар мен курс авторлары', 'Іс-шара ұйымдастырушылар'],
    whereTitle: 'Қай жерде қолданады',
    whereList: ['Қазақстан, Ресей, Қырғызстан', 'Алматы, Астана, Шымкент', 'Онлайн және офлайн қызметтер'],
    answersTitle: 'Қысқа жауаптар',
    answers: [
      { q: 'Қаншалықты тез іске қосамын?', a: '2 минутта: бірнеше сұраққа жауап бересіз — AI парақшаны құрады.' },
      { q: 'CRM бар ма?', a: 'Иә, барлық өтінімдер бір жүйеде сақталады.' },
      { q: 'Жергілікті бизнеске жарай ма?', a: 'Иә, қала, карта және жазылу функцияларын қосуға болады.' },
    ],
    faqTitle: 'Жиі қойылатын сұрақтар',
    faq: [
      { q: 'Дизайнер керек пе?', a: 'Жоқ, дайын блоктар мен AI көмектеседі.' },
      { q: 'Тілді ауыстыруға бола ма?', a: 'Иә, RU/EN/KK тілдері қолжетімді.' },
      { q: 'Тегін тариф бар ма?', a: 'Иә, тегін бастауға болады.' },
    ],
  },
};

const GALLERY_CONTENT: Record<LanguageKey, GalleryContent> = {
  ru: {
    title: 'Галерея lnkmx — примеры link in bio и мини-сайтов',
    description:
      'Подборка лучших страниц lnkmx: ниши, шаблоны, идеи. Посмотрите, как выглядят реальные профили и какие блоки используют.',
    h1: 'Галерея страниц lnkmx',
    subtitle: 'Смотрите реальные профили, вдохновляйтесь нишами и копируйте решения.',
    highlightsTitle: 'Что вы найдёте в галерее',
    highlights: ['Топовые страницы по лайкам и просмотрам', 'Примеры по нишам: beauty, education, consulting и др.', 'Готовые структуры блоков и CTA'],
    locationTitle: 'Локальная релевантность',
    locationBody:
      'В галерее много локальных бизнесов — можно искать примеры по вашему городу или стране и быстро адаптировать их под себя.',
    topProfilesTitle: 'Популярные профили',
  },
  en: {
    title: 'lnkmx Gallery — link in bio examples and templates',
    description:
      'Discover top lnkmx pages: niches, templates, and inspiration. See how real profiles are built and which blocks convert best.',
    h1: 'lnkmx Gallery',
    subtitle: 'Browse real profiles, explore niches, and copy proven layouts.',
    highlightsTitle: 'What you get inside',
    highlights: ['Top pages by likes and views', 'Niche examples: beauty, education, consulting, and more', 'Ready-to-use block structures and CTAs'],
    locationTitle: 'Local relevance',
    locationBody:
      'Many pages are built for local businesses — find examples from your city or country and adapt them fast.',
    topProfilesTitle: 'Top profiles',
  },
  kk: {
    title: 'lnkmx галереясы — link in bio мысалдары мен мини-сайттар',
    description:
      'lnkmx үздік парақшалары: нишалар, шаблондар, идеялар. Нақты профильдер қалай жасалатынын көріңіз.',
    h1: 'lnkmx парақшалар галереясы',
    subtitle: 'Нақты профильдерді қарап, нишалардан шабыт алыңыз.',
    highlightsTitle: 'Галереядан не табасыз',
    highlights: ['Лайк пен қаралымы көп үздік беттер', 'Beauty, education, consulting сияқты нишалар', 'Дайын блок құрылымдары және CTA'],
    locationTitle: 'Жергілікті өзектілік',
    locationBody:
      'Галереяда жергілікті бизнеске арналған көп беттер бар — өз қалаңызға лайық үлгілерді табыңыз.',
    topProfilesTitle: 'Танымал профильдер',
  },
};

type GalleryItem = {
  slug: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  niche: string | null;
};

export function buildLandingHtml(lang: LanguageKey, baseUrl: string): string {
  const content = LANDING_CONTENT[lang] || LANDING_CONTENT.ru;
  const locale = getOgLocale(lang);
  const hreflangLinks = buildHreflangLinks(baseUrl, '/', ['ru', 'en', 'kk']);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'lnkmx',
        url: `${baseUrl}/`,
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'lnkmx',
        url: `${baseUrl}/`,
        logo: `${baseUrl}/favicon.jpg`,
        areaServed: content.whereList,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'lnkmx - Micro-Business OS',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: content.description,
        offers: [
          { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Pro', price: '5', priceCurrency: 'USD' },
        ],
      },
      faqSchema,
    ],
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(content.title)}</title>
  <meta name="description" content="${escapeHtml(content.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${baseUrl}/">
  ${hreflangLinks}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(content.title)}">
  <meta property="og:description" content="${escapeHtml(content.description)}">
  <meta property="og:url" content="${baseUrl}/">
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}">
  <meta property="og:locale" content="${locale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(content.title)}">
  <meta name="twitter:description" content="${escapeHtml(content.description)}">
  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; color: #111; background: #fff; }
    main { max-width: 920px; margin: 0 auto; padding: 32px 20px; }
    h1 { font-size: 2.2rem; margin-bottom: 0.5rem; }
    h2 { margin-top: 2rem; font-size: 1.5rem; }
    ul { padding-left: 1.2rem; }
    .answers dt { font-weight: 600; margin-top: 0.75rem; }
    .answers dd { margin-left: 0; margin-bottom: 0.5rem; color: #444; }
    .cta { margin-top: 1.5rem; }
    .cta a { display: inline-block; padding: 12px 18px; border-radius: 999px; background: #0f62fe; color: #fff; text-decoration: none; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(content.h1)}</h1>
      <p>${escapeHtml(content.subtitle)}</p>
      <div class="cta"><a href="${baseUrl}/auth">${escapeHtml(content.cta)}</a></div>
    </header>

    <section>
      <h2>${escapeHtml(content.aboutTitle)}</h2>
      <p>${escapeHtml(content.aboutBody)}</p>
    </section>

    <section>
      <h2>${escapeHtml(content.forTitle)}</h2>
      <ul>${content.forList.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>${escapeHtml(content.whereTitle)}</h2>
      <ul>${content.whereList.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>${escapeHtml(content.answersTitle)}</h2>
      <dl class="answers">
        ${content.answers.map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`).join('')}
      </dl>
    </section>

    <section>
      <h2>${escapeHtml(content.faqTitle)}</h2>
      <dl class="answers">
        ${content.faq.map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`).join('')}
      </dl>
    </section>
  </main>
</body>
</html>`;
}

export function buildGalleryHtml(lang: LanguageKey, baseUrl: string, items: GalleryItem[], niche?: string | null): string {
  const content = GALLERY_CONTENT[lang] || GALLERY_CONTENT.ru;
  const locale = getOgLocale(lang);
  const querySuffix = niche ? `?niche=${encodeURIComponent(niche)}` : '';
  const canonicalUrl = `${baseUrl}/gallery${querySuffix}`;
  const hreflangLinks = buildHreflangLinks(baseUrl, `/gallery${querySuffix}`, ['ru', 'en', 'kk']);

  const itemList = items.slice(0, 10).map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}/${item.slug}`,
    name: item.title || item.slug,
    image: item.avatar_url || DEFAULT_OG_IMAGE,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: content.title,
        description: content.description,
        url: canonicalUrl,
        inLanguage: lang,
      },
      {
        '@type': 'ItemList',
        itemListElement: itemList,
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(content.title)}</title>
  <meta name="description" content="${escapeHtml(content.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangLinks}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(content.title)}">
  <meta property="og:description" content="${escapeHtml(content.description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}">
  <meta property="og:locale" content="${locale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(content.title)}">
  <meta name="twitter:description" content="${escapeHtml(content.description)}">
  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; color: #111; background: #fff; }
    main { max-width: 920px; margin: 0 auto; padding: 32px 20px; }
    h1 { font-size: 2.2rem; margin-bottom: 0.5rem; }
    h2 { margin-top: 2rem; font-size: 1.4rem; }
    ul { padding-left: 1.2rem; }
    .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    .card { border: 1px solid #eee; border-radius: 12px; padding: 12px; }
    .card a { color: #0f62fe; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(content.h1)}</h1>
      <p>${escapeHtml(content.subtitle)}</p>
    </header>

    <section>
      <h2>${escapeHtml(content.highlightsTitle)}</h2>
      <ul>${content.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>${escapeHtml(content.locationTitle)}</h2>
      <p>${escapeHtml(content.locationBody)}</p>
    </section>

    <section>
      <h2>${escapeHtml(content.topProfilesTitle)}</h2>
      <div class="grid">
        ${items.slice(0, 10).map((item) => `
          <article class="card">
            <a href="${baseUrl}/${item.slug}">${escapeHtml(item.title || item.slug)}</a>
            <p>${escapeHtml(item.description || '')}</p>
            <p><small>${escapeHtml(item.niche || '')}</small></p>
          </article>
        `).join('')}
      </div>
    </section>
  </main>
</body>
</html>`;
}

export type { GalleryItem, LanguageKey };
