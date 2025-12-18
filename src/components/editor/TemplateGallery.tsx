import { memo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createBlock as createBaseBlock } from '@/lib/block-factory';
import type { Block } from '@/types/page';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  isPremium?: boolean;
  blocks: Array<{ type: string; overrides?: Record<string, unknown> }>;
}

// Helper to create template block with overrides
const createTemplateBlock = (type: string, overrides: Record<string, unknown> = {}): Block => {
  const baseBlock = createBaseBlock(type);
  return { ...baseBlock, ...overrides } as Block;
};

const TEMPLATES: Template[] = [
  // ===== КРЕАТОРЫ =====
  {
    id: 'influencer',
    name: 'Блогер / Инфлюенсер',
    description: 'Для контент-мейкеров и блогеров',
    category: 'Креаторы',
    preview: '👤',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Алина Lifestyle', en: 'Alina Lifestyle', kk: 'Алина Lifestyle' }, bio: { ru: '✨ Блогер • 500K подписчиков\n🎥 Влоги о путешествиях и моде\n📍 Алматы → Мир', en: '✨ Blogger • 500K followers\n🎥 Travel & fashion vlogs\n📍 Almaty → World', kk: '✨ Блогер • 500K жазылушы\n🎥 Саяхат және сән влогтары\n📍 Алматы → Әлем' } } },
      { type: 'link', overrides: { title: { ru: '🎬 YouTube — новые влоги каждую неделю', en: '🎬 YouTube — new vlogs weekly', kk: '🎬 YouTube — жаңа влогтар апта сайын' }, url: 'https://youtube.com/@example', icon: 'youtube', style: 'rounded' } },
      { type: 'link', overrides: { title: { ru: '📸 Instagram — бэкстейдж и stories', en: '📸 Instagram — backstage & stories', kk: '📸 Instagram — бэкстейдж және stories' }, url: 'https://instagram.com/example', icon: 'instagram', style: 'rounded' } },
      { type: 'link', overrides: { title: { ru: '🎵 TikTok — короткие видео', en: '🎵 TikTok — short videos', kk: '🎵 TikTok — қысқа бейнелер' }, url: 'https://tiktok.com/@example', icon: 'globe', style: 'rounded' } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🔥 Последний влог: Дубай 2024', en: '🔥 Latest vlog: Dubai 2024', kk: '🔥 Соңғы влог: Дубай 2024' } } },
      { type: 'product', overrides: { name: { ru: 'Реклама в сторис', en: 'Story ad placement', kk: 'Stories-те жарнама' }, description: { ru: '24 часа в сторис + отметка', en: '24h story + mention', kk: '24 сағат stories + белгі' }, price: 150000, currency: 'KZT' } },
      { type: 'socials', overrides: { platforms: [{ platform: 'telegram', url: 'https://t.me/example' }, { platform: 'youtube', url: 'https://youtube.com/@example' }, { platform: 'instagram', url: 'https://instagram.com/example' }] } },
    ],
  },
  {
    id: 'musician',
    name: 'Музыкант / Артист',
    description: 'Для музыкантов и исполнителей',
    category: 'Креаторы',
    preview: '🎵',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'ARMAN', en: 'ARMAN', kk: 'ARMAN' }, bio: { ru: '🎤 Хип-хоп артист\n🏆 Лучший альбом 2023\n🎧 5M+ прослушиваний', en: '🎤 Hip-hop artist\n🏆 Best Album 2023\n🎧 5M+ streams', kk: '🎤 Хип-хоп әртіс\n🏆 2023 үздік альбом\n🎧 5M+ тыңдау' } } },
      { type: 'link', overrides: { title: { ru: '🎧 Spotify — слушать новый альбом', en: '🎧 Spotify — listen new album', kk: '🎧 Spotify — жаңа альбомды тыңдау' }, url: 'https://open.spotify.com/artist/example', icon: 'globe', style: 'pill' } },
      { type: 'link', overrides: { title: { ru: '🍎 Apple Music', en: '🍎 Apple Music', kk: '🍎 Apple Music' }, url: 'https://music.apple.com/artist/example', icon: 'globe', style: 'pill' } },
      { type: 'link', overrides: { title: { ru: '🎬 YouTube Music', en: '🎬 YouTube Music', kk: '🎬 YouTube Music' }, url: 'https://music.youtube.com/channel/example', icon: 'youtube', style: 'pill' } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🔥 Премьера клипа "Жизнь"', en: '🔥 Music video premiere "Life"', kk: '🔥 "Өмір" клипінің премьерасы' } } },
      { type: 'text', overrides: { content: { ru: '📅 Ближайшие концерты', en: '📅 Upcoming concerts', kk: '📅 Жақын концерттер' }, style: 'heading', alignment: 'center' } },
      { type: 'link', overrides: { title: { ru: '🎫 Алматы — 15 марта — Купить билеты', en: '🎫 Almaty — March 15 — Get tickets', kk: '🎫 Алматы — 15 наурыз — Билет алу' }, url: 'https://ticketon.kz', icon: 'ticket', style: 'rounded' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'telegram', username: 'arman_music' }] } },
    ],
  },
  {
    id: 'designer',
    name: 'Дизайнер / Иллюстратор',
    description: 'Портфолио для творческих специалистов',
    category: 'Креаторы',
    preview: '🎨',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Дария Ким', en: 'Dariya Kim', kk: 'Дария Ким' }, bio: { ru: '🎨 UI/UX дизайнер • 7 лет опыта\n✨ Брендинг • Веб-дизайн • Иллюстрации\n🏆 Behance Featured', en: '🎨 UI/UX designer • 7 years exp\n✨ Branding • Web design • Illustrations\n🏆 Behance Featured', kk: '🎨 UI/UX дизайнер • 7 жыл тәжірибе\n✨ Брендинг • Веб-дизайн • Иллюстрациялар\n🏆 Behance Featured' } } },
      { type: 'carousel', overrides: { title: { ru: '🖼 Избранные работы', en: '🖼 Featured works', kk: '🖼 Таңдаулы жұмыстар' }, images: [] } },
      { type: 'product', overrides: { name: { ru: 'Логотип под ключ', en: 'Logo design', kk: 'Логотип жасау' }, description: { ru: '3 концепции + правки + исходники AI/SVG', en: '3 concepts + revisions + source files AI/SVG', kk: '3 концепция + түзетулер + AI/SVG файлдары' }, price: 80000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Фирменный стиль', en: 'Brand identity', kk: 'Фирмалық стиль' }, description: { ru: 'Лого + визитки + брендбук', en: 'Logo + business cards + brandbook', kk: 'Лого + визиткалар + брендбук' }, price: 250000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Дизайн лендинга', en: 'Landing page design', kk: 'Лендинг дизайны' }, description: { ru: 'До 5 экранов в Figma', en: 'Up to 5 screens in Figma', kk: 'Figma-да 5 экранға дейін' }, price: 120000, currency: 'KZT' } },
      { type: 'link', overrides: { title: { ru: '🎨 Портфолио на Behance', en: '🎨 Portfolio on Behance', kk: '🎨 Behance портфолиосы' }, url: 'https://behance.net/dariyakim', icon: 'globe', style: 'rounded' } },
      { type: 'link', overrides: { title: { ru: '📱 Работы в Dribbble', en: '📱 Works on Dribbble', kk: '📱 Dribbble жұмыстары' }, url: 'https://dribbble.com/dariyakim', icon: 'globe', style: 'rounded' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'telegram', username: 'dariya_design' }, { platform: 'whatsapp', username: '+77001234567' }] } },
    ],
  },
  {
    id: 'streamer',
    name: 'Стример / Геймер',
    description: 'Для стримеров и киберспортсменов',
    category: 'Креаторы',
    preview: '🎮',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'DarkNight', en: 'DarkNight', kk: 'DarkNight' }, bio: { ru: '🎮 Twitch Partner • 100K followers\n🏆 CS2 • Valorant • GTA RP\n⏰ Стримы: ПН-ПТ 20:00', en: '🎮 Twitch Partner • 100K followers\n🏆 CS2 • Valorant • GTA RP\n⏰ Streams: MON-FRI 8PM', kk: '🎮 Twitch Partner • 100K жазылушы\n🏆 CS2 • Valorant • GTA RP\n⏰ Стримдер: ДС-ЖМ 20:00' } } },
      { type: 'link', overrides: { title: { ru: '🟣 Twitch — смотреть стрим', en: '🟣 Twitch — watch stream', kk: '🟣 Twitch — стримді қарау' }, url: 'https://twitch.tv/darknight', icon: 'globe', style: 'pill' } },
      { type: 'link', overrides: { title: { ru: '🔴 YouTube — нарезки и хайлайты', en: '🔴 YouTube — clips & highlights', kk: '🔴 YouTube — үзінділер мен хайлайттар' }, url: 'https://youtube.com/@darknight', icon: 'youtube', style: 'pill' } },
      { type: 'link', overrides: { title: { ru: '💬 Discord — сообщество', en: '💬 Discord — community', kk: '💬 Discord — қауымдастық' }, url: 'https://discord.gg/darknight', icon: 'globe', style: 'pill' } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🔥 Лучший момент недели', en: '🔥 Best moment of the week', kk: '🔥 Аптаның үздік сәті' } } },
      { type: 'product', overrides: { name: { ru: 'Подписка на Twitch', en: 'Twitch subscription', kk: 'Twitch жазылымы' }, description: { ru: 'Поддержи стрим + эмоуты + без рекламы', en: 'Support stream + emotes + ad-free', kk: 'Стримді қолдау + эмоуттар + жарнамасыз' }, price: 2500, currency: 'KZT' } },
      { type: 'socials', overrides: { platforms: [{ platform: 'telegram', url: 'https://t.me/darknight_chat' }, { platform: 'tiktok', url: 'https://tiktok.com/@darknight' }] } },
    ],
  },

  // ===== БИЗНЕС =====
  {
    id: 'barber',
    name: 'Барбершоп',
    description: 'Для барберов и мужских салонов',
    category: 'Бизнес',
    preview: '💈',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'BLACKBEARD Barbershop', en: 'BLACKBEARD Barbershop', kk: 'BLACKBEARD Barbershop' }, bio: { ru: '✂️ Мужские стрижки в центре Алматы\n🏆 Лучший барбершоп 2023\n⏰ Пн-Вс: 10:00 - 21:00', en: '✂️ Men\'s haircuts in Almaty center\n🏆 Best barbershop 2023\n⏰ Mon-Sun: 10:00 - 21:00', kk: '✂️ Алматы орталығында ерлер шаш қию\n🏆 2023 үздік барбершоп\n⏰ Дс-Жс: 10:00 - 21:00' } } },
      { type: 'carousel', overrides: { title: { ru: '💈 Наши работы', en: '💈 Our works', kk: '💈 Біздің жұмыстар' }, images: [] } },
      { type: 'text', overrides: { content: { ru: '💰 Прайс-лист', en: '💰 Price list', kk: '💰 Бағалар тізімі' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Мужская стрижка', en: 'Men\'s haircut', kk: 'Ерлер шаш қию' }, description: { ru: 'Стрижка + укладка + стайлинг', en: 'Haircut + styling', kk: 'Шаш қию + сәндеу' }, price: 4000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Стрижка + Борода', en: 'Haircut + Beard', kk: 'Шаш қию + Сақал' }, description: { ru: 'Комплекс: стрижка, моделирование бороды', en: 'Complex: haircut, beard shaping', kk: 'Кешен: шаш қию, сақал пішіндеу' }, price: 6500, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Королевское бритье', en: 'Royal shave', kk: 'Патшалық қырыну' }, description: { ru: 'Горячее полотенце + опасная бритва', en: 'Hot towel + straight razor', kk: 'Ыстық сүлгі + қауіпті ұстара' }, price: 5000, currency: 'KZT' } },
      { type: 'link', overrides: { title: { ru: '📅 Записаться онлайн', en: '📅 Book online', kk: '📅 Онлайн жазылу' }, url: 'https://dikidi.net/blackbeard', icon: 'calendar', style: 'pill' } },
      { type: 'map', overrides: { address: 'Алматы, ул. Панфилова 100' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77071234567' }, { platform: 'instagram', username: 'blackbeard.almaty' }] } },
    ],
  },
  {
    id: 'photographer',
    name: 'Фотограф',
    description: 'Портфолио и услуги фотографа',
    category: 'Бизнес',
    preview: '📷',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Анна Фото', en: 'Anna Photo', kk: 'Анна Фото' }, bio: { ru: '📸 Профессиональный фотограф\n💍 Свадьбы • Портреты • Love Story\n🏆 10 лет опыта • 500+ свадеб', en: '📸 Professional photographer\n💍 Weddings • Portraits • Love Story\n🏆 10 years exp • 500+ weddings', kk: '📸 Кәсіби фотограф\n💍 Тойлар • Портреттер • Love Story\n🏆 10 жыл тәжірибе • 500+ той' } } },
      { type: 'carousel', overrides: { title: { ru: '📷 Портфолио', en: '📷 Portfolio', kk: '📷 Портфолио' }, images: [] } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🎬 Свадебный фильм Асель и Арман', en: '🎬 Wedding film Assel & Arman', kk: '🎬 Әсел мен Арманның той фильмі' } } },
      { type: 'text', overrides: { content: { ru: '💎 Пакеты услуг', en: '💎 Service packages', kk: '💎 Қызмет пакеттері' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Портретная съемка', en: 'Portrait session', kk: 'Портрет түсіру' }, description: { ru: '1.5 часа • 15 фото в ретуши • Локация на выбор', en: '1.5 hours • 15 retouched photos • Location of choice', kk: '1.5 сағат • 15 ретушь фото • Таңдаулы локация' }, price: 35000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Love Story', en: 'Love Story', kk: 'Love Story' }, description: { ru: '2 часа • 25 фото • Помощь со стилем', en: '2 hours • 25 photos • Styling help', kk: '2 сағат • 25 фото • Стиль бойынша көмек' }, price: 50000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Свадебная съемка', en: 'Wedding photography', kk: 'Той түсірілімі' }, description: { ru: 'Полный день • 200+ фото • Видео-тизер', en: 'Full day • 200+ photos • Video teaser', kk: 'Толық күн • 200+ фото • Видео-тизер' }, price: 200000, currency: 'KZT' } },
      { type: 'testimonial', overrides: { testimonials: [{ name: { ru: 'Асель и Арман', en: 'Assel & Arman', kk: 'Әсел мен Арман' }, role: { ru: 'Свадьба 2024', en: 'Wedding 2024', kk: 'Той 2024' }, text: { ru: 'Анна — волшебница! Фото получились невероятными, все гости в восторге. Рекомендуем всем!', en: 'Anna is a magician! Photos turned out incredible, all guests were delighted. Highly recommend!', kk: 'Анна — сиқыршы! Фотолар керемет шықты, барлық қонақтар қуанышта. Барлығына ұсынамыз!' }, rating: 5 }] } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77051234567' }, { platform: 'telegram', username: 'anna_photo' }] } },
    ],
  },
  {
    id: 'beauty',
    name: 'Салон красоты',
    description: 'Для салонов и бьюти-мастеров',
    category: 'Бизнес',
    preview: '💅',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'GLOW Beauty Studio', en: 'GLOW Beauty Studio', kk: 'GLOW Beauty Studio' }, bio: { ru: '✨ Салон красоты премиум-класса\n💅 Маникюр • Брови • Ресницы • Макияж\n📍 Алматы, Достык Плаза', en: '✨ Premium beauty salon\n💅 Nails • Brows • Lashes • Makeup\n📍 Almaty, Dostyk Plaza', kk: '✨ Премиум сұлулық салоны\n💅 Маникюр • Қастар • Кірпіктер • Макияж\n📍 Алматы, Достық Плаза' } } },
      { type: 'carousel', overrides: { title: { ru: '✨ Наши работы', en: '✨ Our works', kk: '✨ Біздің жұмыстар' }, images: [] } },
      { type: 'text', overrides: { content: { ru: '💰 Услуги и цены', en: '💰 Services & prices', kk: '💰 Қызметтер мен бағалар' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Маникюр с покрытием', en: 'Manicure with coating', kk: 'Жабынды маникюр' }, description: { ru: 'Комбинированный маникюр + гель-лак', en: 'Combined manicure + gel polish', kk: 'Комбинацияланған маникюр + гель-лак' }, price: 6000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Наращивание ресниц', en: 'Lash extensions', kk: 'Кірпік ұзарту' }, description: { ru: '2D-3D объем • Держатся до 4 недель', en: '2D-3D volume • Lasts up to 4 weeks', kk: '2D-3D көлем • 4 аптаға дейін сақталады' }, price: 8000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Архитектура бровей', en: 'Brow architecture', kk: 'Қас архитектурасы' }, description: { ru: 'Коррекция + окрашивание + укладка', en: 'Correction + coloring + styling', kk: 'Түзету + бояу + сәндеу' }, price: 5000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Комплекс руки + ноги', en: 'Hands + feet combo', kk: 'Қол + аяқ кешені' }, description: { ru: 'Маникюр + педикюр с покрытием', en: 'Manicure + pedicure with coating', kk: 'Маникюр + педикюр жабынды' }, price: 12000, currency: 'KZT' } },
      { type: 'link', overrides: { title: { ru: '📅 Записаться онлайн', en: '📅 Book online', kk: '📅 Онлайн жазылу' }, url: 'https://dikidi.net/glow', icon: 'calendar', style: 'pill' } },
      { type: 'map', overrides: { address: 'Алматы, Достык 240, Достык Плаза' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77001234567' }, { platform: 'instagram', username: 'glow.beauty.almaty' }] } },
    ],
  },
  {
    id: 'fitness',
    name: 'Фитнес-тренер',
    description: 'Для тренеров и инструкторов',
    category: 'Бизнес',
    preview: '💪',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Артём Fitness', en: 'Artem Fitness', kk: 'Артём Fitness' }, bio: { ru: '💪 Сертифицированный тренер\n🏆 Мастер спорта • 8 лет опыта\n📍 World Class Almaty + Онлайн', en: '💪 Certified trainer\n🏆 Master of Sports • 8 years exp\n📍 World Class Almaty + Online', kk: '💪 Сертификатталған жаттықтырушы\n🏆 Спорт шебері • 8 жыл тәжірибе\n📍 World Class Almaty + Онлайн' } } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🔥 Тренировка дня: HIIT на 20 минут', en: '🔥 Workout of the day: 20 min HIIT', kk: '🔥 Күннің жаттығуы: 20 минуттық HIIT' } } },
      { type: 'text', overrides: { content: { ru: '🏋️ Мои услуги', en: '🏋️ My services', kk: '🏋️ Менің қызметтерім' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Персональная тренировка', en: 'Personal training', kk: 'Жеке жаттығу' }, description: { ru: '60 минут • Зал или онлайн • План питания', en: '60 min • Gym or online • Meal plan', kk: '60 минут • Зал немесе онлайн • Тамақтану жоспары' }, price: 10000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Абонемент 8 тренировок', en: '8 sessions package', kk: '8 жаттығу пакеті' }, description: { ru: 'Экономия 20% • Действует 2 месяца', en: 'Save 20% • Valid 2 months', kk: '20% үнемдеу • 2 ай жарамды' }, price: 64000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Онлайн-программа', en: 'Online program', kk: 'Онлайн бағдарлама' }, description: { ru: '4 недели • Видео-тренировки • Чат поддержка', en: '4 weeks • Video workouts • Chat support', kk: '4 апта • Видео жаттығулар • Чат қолдау' }, price: 35000, currency: 'KZT' } },
      { type: 'testimonial', overrides: { testimonials: [{ name: { ru: 'Мадина', en: 'Madina', kk: 'Мадина' }, role: { ru: 'Похудела на 15 кг', en: 'Lost 15 kg', kk: '15 кг арықтадым' }, text: { ru: 'За 3 месяца с Артёмом сбросила 15 кг! Тренировки разнообразные, никогда не скучно. Супер мотиватор!', en: 'Lost 15 kg in 3 months with Artem! Varied workouts, never boring. Super motivator!', kk: 'Артёммен 3 айда 15 кг тастадым! Жаттығулар әртүрлі, ешқашан зерікпейсің. Супер мотиватор!' }, rating: 5 }] } },
      { type: 'link', overrides: { title: { ru: '📱 Бесплатные тренировки на YouTube', en: '📱 Free workouts on YouTube', kk: '📱 YouTube-та тегін жаттығулар' }, url: 'https://youtube.com/@artem_fitness', icon: 'youtube', style: 'rounded' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77011234567' }, { platform: 'telegram', username: 'artem_fit' }] } },
    ],
  },
  {
    id: 'chef',
    name: 'Повар / Кондитер',
    description: 'Для кулинаров и домашней выпечки',
    category: 'Бизнес',
    preview: '👨‍🍳',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Sweet Dreams', en: 'Sweet Dreams', kk: 'Sweet Dreams' }, bio: { ru: '🍰 Торты и десерты на заказ\n✨ Натуральные ингредиенты\n🚗 Доставка по Алматы', en: '🍰 Custom cakes & desserts\n✨ Natural ingredients\n🚗 Delivery in Almaty', kk: '🍰 Тапсырыс бойынша торттар\n✨ Табиғи ингредиенттер\n🚗 Алматы бойынша жеткізу' } } },
      { type: 'carousel', overrides: { title: { ru: '🎂 Наши торты', en: '🎂 Our cakes', kk: '🎂 Біздің торттар' }, images: [] } },
      { type: 'text', overrides: { content: { ru: '🍰 Меню', en: '🍰 Menu', kk: '🍰 Мәзір' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Бенто-торт', en: 'Bento cake', kk: 'Бенто-торт' }, description: { ru: '450 гр • Идеален для двоих • Надпись в подарок', en: '450g • Perfect for two • Free inscription', kk: '450 гр • Екеуге тамаша • Жазу сыйлық' }, price: 6000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Торт на заказ', en: 'Custom cake', kk: 'Тапсырыс торт' }, description: { ru: 'От 2 кг • Любой дизайн • Срок 2-3 дня', en: 'From 2kg • Any design • 2-3 days', kk: '2 кг-нан • Кез-келген дизайн • 2-3 күн' }, price: 9000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Капкейки', en: 'Cupcakes', kk: 'Капкейктер' }, description: { ru: 'Набор 6 шт • Разные вкусы', en: 'Set of 6 • Various flavors', kk: '6 дана жинақ • Түрлі дәмдер' }, price: 4500, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Макаронс', en: 'Macarons', kk: 'Макаронс' }, description: { ru: 'Набор 12 шт в коробке', en: 'Box of 12', kk: 'Қорапта 12 дана' }, price: 5000, currency: 'KZT' } },
      { type: 'faq', overrides: { items: [{ question: { ru: 'За сколько дней делать заказ?', en: 'How many days in advance to order?', kk: 'Қанша күн бұрын тапсырыс беру керек?' }, answer: { ru: 'Бенто-торты — за 1 день, большие торты — за 2-3 дня', en: 'Bento cakes — 1 day, large cakes — 2-3 days', kk: 'Бенто-торттар — 1 күн бұрын, үлкен торттар — 2-3 күн' } }, { question: { ru: 'Есть доставка?', en: 'Do you deliver?', kk: 'Жеткізу бар ма?' }, answer: { ru: 'Да, доставка по Алматы от 1000₸', en: 'Yes, delivery in Almaty from 1000₸', kk: 'Иә, Алматы бойынша жеткізу 1000₸-ден' } }] } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77021234567' }, { platform: 'instagram', username: 'sweetdreams.almaty' }] } },
    ],
  },
  {
    id: 'shop',
    name: 'Онлайн-магазин',
    description: 'Мини-витрина товаров',
    category: 'Бизнес',
    preview: '🛍️',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'TREND Store', en: 'TREND Store', kk: 'TREND Store' }, bio: { ru: '🛍️ Модная одежда из Кореи и Турции\n✈️ Доставка по Казахстану 1-3 дня\n💯 Гарантия качества', en: '🛍️ Fashion from Korea & Turkey\n✈️ Delivery across KZ 1-3 days\n💯 Quality guarantee', kk: '🛍️ Корея мен Түркиядан сәнді киім\n✈️ ҚР бойынша жеткізу 1-3 күн\n💯 Сапа кепілдігі' } } },
      { type: 'carousel', overrides: { title: { ru: '🔥 Новинки', en: '🔥 New arrivals', kk: '🔥 Жаңалықтар' }, images: [] } },
      { type: 'text', overrides: { content: { ru: '🛒 Хиты продаж', en: '🛒 Bestsellers', kk: '🛒 Сатылым хиттері' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Худи Oversize', en: 'Oversize Hoodie', kk: 'Oversize Худи' }, description: { ru: 'Хлопок 100% • Размеры S-XL • 5 цветов', en: '100% cotton • Sizes S-XL • 5 colors', kk: '100% мақта • S-XL өлшемдер • 5 түс' }, price: 12900, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Джинсы Wide Leg', en: 'Wide Leg Jeans', kk: 'Wide Leg Джинсы' }, description: { ru: 'Высокая посадка • Размеры 25-32', en: 'High waist • Sizes 25-32', kk: 'Биік белдік • 25-32 өлшемдер' }, price: 15900, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Кроссовки New Balance 530', en: 'New Balance 530 Sneakers', kk: 'New Balance 530 кроссовкалар' }, description: { ru: 'Оригинал • Размеры 36-44', en: 'Original • Sizes 36-44', kk: 'Оригинал • 36-44 өлшемдер' }, price: 54900, currency: 'KZT' } },
      { type: 'link', overrides: { title: { ru: '📱 Полный каталог в Instagram', en: '📱 Full catalog on Instagram', kk: '📱 Instagram-да толық каталог' }, url: 'https://instagram.com/trend.store.kz', icon: 'instagram', style: 'rounded' } },
      { type: 'faq', overrides: { items: [{ question: { ru: 'Как оплатить?', en: 'How to pay?', kk: 'Қалай төлеуге болады?' }, answer: { ru: 'Kaspi перевод, Kaspi QR, наличные курьеру', en: 'Kaspi transfer, Kaspi QR, cash to courier', kk: 'Kaspi аударым, Kaspi QR, курьерге қолма-қол' } }, { question: { ru: 'Можно примерить?', en: 'Can I try on?', kk: 'Киіп көруге бола ма?' }, answer: { ru: 'Да, примерка при курьере бесплатно', en: 'Yes, free fitting with courier', kk: 'Иә, курьермен тегін киіп көру' } }] } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77771234567' }, { platform: 'telegram', username: 'trend_store_kz' }] } },
    ],
  },

  // ===== ЭКСПЕРТЫ =====
  {
    id: 'psychologist',
    name: 'Психолог',
    description: 'Для психологов и терапевтов',
    category: 'Эксперты',
    preview: '🧠',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Айгерим Нурланова', en: 'Aigerim Nurlanova', kk: 'Айгерім Нұрланова' }, bio: { ru: '🎓 Клинический психолог • КазНУ\n💼 12 лет практики\n🌟 Тревога • Отношения • Самооценка', en: '🎓 Clinical psychologist • KazNU\n💼 12 years practice\n🌟 Anxiety • Relationships • Self-esteem', kk: '🎓 Клиникалық психолог • ҚазҰУ\n💼 12 жыл тәжірибе\n🌟 Үрей • Қарым-қатынас • Өзін-өзі бағалау' } } },
      { type: 'text', overrides: { content: { ru: '💬 "Каждый заслуживает быть услышанным и понятым"', en: '💬 "Everyone deserves to be heard and understood"', kk: '💬 "Әрбір адам естілуге және түсінілуге лайық"' }, style: 'quote', alignment: 'center' } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🎥 Как справиться с тревогой: 5 техник', en: '🎥 How to cope with anxiety: 5 techniques', kk: '🎥 Үреймен қалай күресуге болады: 5 техника' } } },
      { type: 'text', overrides: { content: { ru: '📋 Услуги', en: '📋 Services', kk: '📋 Қызметтер' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Индивидуальная консультация', en: 'Individual consultation', kk: 'Жеке консультация' }, description: { ru: '50 минут • Онлайн или офлайн', en: '50 min • Online or offline', kk: '50 минут • Онлайн немесе офлайн' }, price: 18000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Семейная терапия', en: 'Family therapy', kk: 'Отбасылық терапия' }, description: { ru: '80 минут • Для пар и семей', en: '80 min • For couples and families', kk: '80 минут • Жұптар мен отбасылар үшін' }, price: 25000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Пакет 4 сессии', en: 'Package 4 sessions', kk: '4 сессия пакеті' }, description: { ru: 'Экономия 15% • Глубокая работа', en: 'Save 15% • Deep work', kk: '15% үнемдеу • Терең жұмыс' }, price: 61200, currency: 'KZT' } },
      { type: 'testimonial', overrides: { testimonials: [{ name: { ru: 'Анонимный отзыв', en: 'Anonymous review', kk: 'Анонимді пікір' }, text: { ru: 'После 6 сессий с Айгерим моя жизнь изменилась. Научилась справляться с паническими атаками и выстраивать границы. Спасибо!', en: 'After 6 sessions with Aigerim my life changed. Learned to cope with panic attacks and set boundaries. Thank you!', kk: 'Айгеріммен 6 сессиядан кейін өмірім өзгерді. Дүрбелең шабуылдарымен күресуді және шекараларды орнатуды үйрендім. Рахмет!' }, rating: 5 }] } },
      { type: 'link', overrides: { title: { ru: '📅 Записаться на консультацию', en: '📅 Book a consultation', kk: '📅 Консультацияға жазылу' }, url: 'https://calendly.com/aigerim-psy', icon: 'calendar', style: 'pill' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'telegram', username: 'aigerim_psy' }, { platform: 'whatsapp', username: '+77011234567' }] } },
    ],
  },
  {
    id: 'teacher',
    name: 'Репетитор',
    description: 'Для преподавателей и репетиторов',
    category: 'Эксперты',
    preview: '📚',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'English with Kate', en: 'English with Kate', kk: 'English with Kate' }, bio: { ru: '🇬🇧 Преподаватель английского\n🎓 IELTS 8.5 • CELTA certified\n📚 Подготовка к IELTS, SAT, NIS', en: '🇬🇧 English teacher\n🎓 IELTS 8.5 • CELTA certified\n📚 IELTS, SAT, NIS preparation', kk: '🇬🇧 Ағылшын тілі мұғалімі\n🎓 IELTS 8.5 • CELTA сертификаты\n📚 IELTS, SAT, NIS дайындық' } } },
      { type: 'text', overrides: { content: { ru: '🏆 Результаты учеников', en: '🏆 Student results', kk: '🏆 Оқушылар нәтижелері' }, style: 'heading', alignment: 'center' } },
      { type: 'text', overrides: { content: { ru: '• IELTS 7.0+ — 95% учеников\n• Поступление в топ-вузы UK, US\n• 200+ выпускников за 8 лет', en: '• IELTS 7.0+ — 95% of students\n• Admission to top UK, US universities\n• 200+ graduates in 8 years', kk: '• IELTS 7.0+ — оқушылардың 95%\n• UK, US үздік университеттеріне түсу\n• 8 жылда 200+ түлек' }, style: 'paragraph', alignment: 'left' } },
      { type: 'product', overrides: { name: { ru: 'Индивидуальный урок', en: 'Individual lesson', kk: 'Жеке сабақ' }, description: { ru: '60 минут • Онлайн Zoom', en: '60 min • Online Zoom', kk: '60 минут • Онлайн Zoom' }, price: 8000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Курс IELTS Intensive', en: 'IELTS Intensive Course', kk: 'IELTS Intensive курсы' }, description: { ru: '12 занятий • Все секции + Mock test', en: '12 lessons • All sections + Mock test', kk: '12 сабақ • Барлық бөлімдер + Mock test' }, price: 80000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Разговорный клуб', en: 'Speaking club', kk: 'Сөйлеу клубы' }, description: { ru: 'Группа 4-6 человек • 4 занятия в месяц', en: 'Group of 4-6 • 4 lessons per month', kk: '4-6 адам тобы • Айына 4 сабақ' }, price: 15000, currency: 'KZT' } },
      { type: 'testimonial', overrides: { testimonials: [{ name: { ru: 'Данияр', en: 'Daniyar', kk: 'Данияр' }, role: { ru: 'IELTS 7.5', en: 'IELTS 7.5', kk: 'IELTS 7.5' }, text: { ru: 'Занимался с Катей 3 месяца перед IELTS. Поднял балл с 6.0 до 7.5! Отличная методика и индивидуальный подход.', en: 'Studied with Kate for 3 months before IELTS. Raised score from 6.0 to 7.5! Excellent methodology and individual approach.', kk: 'IELTS алдында Катямен 3 ай оқыдым. Баллды 6.0-ден 7.5-ке көтердім! Керемет әдістеме және жеке көзқарас.' }, rating: 5 }] } },
      { type: 'link', overrides: { title: { ru: '📝 Бесплатный тест уровня', en: '📝 Free level test', kk: '📝 Тегін деңгей тесті' }, url: 'https://forms.google.com/test', icon: 'file-text', style: 'rounded' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'telegram', username: 'english_kate' }, { platform: 'whatsapp', username: '+77051234567' }] } },
    ],
  },
  {
    id: 'marketer',
    name: 'SMM / Маркетолог',
    description: 'Для digital-специалистов',
    category: 'Эксперты',
    preview: '📊',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Тимур Digital', en: 'Timur Digital', kk: 'Тимур Digital' }, bio: { ru: '📈 SMM-маркетолог • Таргетолог\n🏆 100+ проектов • ROI до 400%\n💼 Работал с: Kaspi, Chocofamily, Sulpak', en: '📈 SMM marketer • Targeting specialist\n🏆 100+ projects • ROI up to 400%\n💼 Worked with: Kaspi, Chocofamily, Sulpak', kk: '📈 SMM маркетолог • Таргетолог\n🏆 100+ жоба • ROI 400%-ға дейін\n💼 Жұмыс істеді: Kaspi, Chocofamily, Sulpak' } } },
      { type: 'carousel', overrides: { title: { ru: '📊 Кейсы', en: '📊 Case studies', kk: '📊 Кейстер' }, images: [] } },
      { type: 'text', overrides: { content: { ru: '💼 Услуги', en: '💼 Services', kk: '💼 Қызметтер' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Аудит Instagram', en: 'Instagram audit', kk: 'Instagram аудиті' }, description: { ru: 'Анализ профиля + стратегия роста + чеклист', en: 'Profile analysis + growth strategy + checklist', kk: 'Профиль талдауы + өсу стратегиясы + чеклист' }, price: 25000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Ведение Instagram', en: 'Instagram management', kk: 'Instagram жүргізу' }, description: { ru: '12 постов + 30 сторис + Reels в месяц', en: '12 posts + 30 stories + Reels per month', kk: 'Айына 12 пост + 30 stories + Reels' }, price: 180000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Настройка таргета', en: 'Targeting setup', kk: 'Таргет орнату' }, description: { ru: 'Instagram/Facebook Ads • Бюджет от 100K', en: 'Instagram/Facebook Ads • Budget from 100K', kk: 'Instagram/Facebook Ads • 100K-дан бюджет' }, price: 50000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Консультация 1 час', en: '1 hour consultation', kk: '1 сағат консультация' }, description: { ru: 'Разбор вашего бизнеса + план действий', en: 'Business analysis + action plan', kk: 'Бизнес талдауы + әрекет жоспары' }, price: 30000, currency: 'KZT' } },
      { type: 'testimonial', overrides: { testimonials: [{ name: { ru: 'Алия', en: 'Aliya', kk: 'Әлия' }, role: { ru: 'Салон красоты', en: 'Beauty salon', kk: 'Сұлулық салоны' }, text: { ru: 'Тимур за 2 месяца увеличил наши продажи через Instagram в 3 раза. Таргет работает как часы!', en: 'Timur tripled our Instagram sales in 2 months. Targeting works like clockwork!', kk: 'Тимур 2 айда Instagram арқылы сатылымымызды 3 есе арттырды. Таргет сағат сияқты жұмыс істейді!' }, rating: 5 }] } },
      { type: 'link', overrides: { title: { ru: '📱 Telegram-канал с кейсами', en: '📱 Telegram channel with cases', kk: '📱 Кейстер бар Telegram-канал' }, url: 'https://t.me/timur_digital', icon: 'globe', style: 'rounded' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'telegram', username: 'timur_smm' }, { platform: 'whatsapp', username: '+77011234567' }] } },
    ],
  },
  {
    id: 'lawyer',
    name: 'Юрист / Адвокат',
    description: 'Для юридических услуг',
    category: 'Эксперты',
    preview: '⚖️',
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Адвокат Серик Касымов', en: 'Attorney Serik Kasymov', kk: 'Адвокат Серік Қасымов' }, bio: { ru: '⚖️ Адвокат • 15 лет практики\n🏛 Гражданские и уголовные дела\n📍 Алматы • Онлайн по всему РК', en: '⚖️ Attorney • 15 years practice\n🏛 Civil and criminal cases\n📍 Almaty • Online across KZ', kk: '⚖️ Адвокат • 15 жыл тәжірибе\n🏛 Азаматтық және қылмыстық істер\n📍 Алматы • ҚР бойынша онлайн' } } },
      { type: 'text', overrides: { content: { ru: '📋 Специализация', en: '📋 Specialization', kk: '📋 Мамандану' }, style: 'heading', alignment: 'center' } },
      { type: 'text', overrides: { content: { ru: '• Семейные споры и разводы\n• Жилищные и земельные вопросы\n• Защита бизнеса\n• Уголовные дела', en: '• Family disputes and divorces\n• Housing and land issues\n• Business protection\n• Criminal cases', kk: '• Отбасылық дауларой және ажырасулар\n• Тұрғын үй және жер мәселелері\n• Бизнесті қорғау\n• Қылмыстық істер' }, style: 'paragraph', alignment: 'left' } },
      { type: 'product', overrides: { name: { ru: 'Первичная консультация', en: 'Initial consultation', kk: 'Алғашқы консультация' }, description: { ru: '30 минут • Анализ ситуации + рекомендации', en: '30 min • Situation analysis + recommendations', kk: '30 минут • Жағдайды талдау + ұсыныстар' }, price: 10000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Составление договора', en: 'Contract drafting', kk: 'Келісімшарт жасау' }, description: { ru: 'Любой тип договора + правовая экспертиза', en: 'Any contract type + legal expertise', kk: 'Кез-келген келісімшарт түрі + құқықтық сараптама' }, price: 25000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Представительство в суде', en: 'Court representation', kk: 'Сотта өкілдік ету' }, description: { ru: 'Полное ведение дела в суде', en: 'Full case management in court', kk: 'Сотта істі толық жүргізу' }, price: 150000, currency: 'KZT' } },
      { type: 'faq', overrides: { items: [{ question: { ru: 'Даёте ли гарантии?', en: 'Do you provide guarantees?', kk: 'Кепілдік бересіз бе?' }, answer: { ru: 'Гарантирую профессиональный подход и максимальную защиту ваших интересов. Результат зависит от обстоятельств дела.', en: 'I guarantee professional approach and maximum protection of your interests. Result depends on case circumstances.', kk: 'Кәсіби көзқарас пен мүдделеріңізді барынша қорғауға кепілдік беремін. Нәтиже іс жағдайларына байланысты.' } }, { question: { ru: 'Работаете онлайн?', en: 'Do you work online?', kk: 'Онлайн жұмыс істейсіз бе?' }, answer: { ru: 'Да, провожу консультации по Zoom/WhatsApp для клиентов из любого города РК', en: 'Yes, I conduct consultations via Zoom/WhatsApp for clients from any city in KZ', kk: 'Иә, ҚР кез-келген қаласынан клиенттер үшін Zoom/WhatsApp арқылы консультация өткіземін' } }] } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77011234567' }, { platform: 'telegram', username: 'advokat_serik' }] } },
    ],
  },

  // ===== ПРЕМИУМ =====
  {
    id: 'agency',
    name: 'Digital-агентство',
    description: 'Для агентств и студий',
    category: 'Премиум',
    preview: '🚀',
    isPremium: true,
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'ROCKET Digital Agency', en: 'ROCKET Digital Agency', kk: 'ROCKET Digital Agency' }, bio: { ru: '🚀 Digital-агентство полного цикла\n💻 Разработка • Дизайн • Маркетинг\n🏆 50+ проектов • 5 лет на рынке', en: '🚀 Full-cycle digital agency\n💻 Development • Design • Marketing\n🏆 50+ projects • 5 years in market', kk: '🚀 Толық циклді digital агенттік\n💻 Әзірлеу • Дизайн • Маркетинг\n🏆 50+ жоба • Нарықта 5 жыл' } } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🎬 Showreel 2024', en: '🎬 Showreel 2024', kk: '🎬 Showreel 2024' } } },
      { type: 'carousel', overrides: { title: { ru: '🏆 Избранные кейсы', en: '🏆 Featured cases', kk: '🏆 Таңдаулы кейстер' }, images: [] } },
      { type: 'text', overrides: { content: { ru: '💼 Наши услуги', en: '💼 Our services', kk: '💼 Біздің қызметтер' }, style: 'heading', alignment: 'center' } },
      { type: 'product', overrides: { name: { ru: 'Лендинг под ключ', en: 'Landing page turnkey', kk: 'Лендинг кілтке дейін' }, description: { ru: 'Дизайн + разработка + хостинг на 1 год', en: 'Design + development + 1 year hosting', kk: 'Дизайн + әзірлеу + 1 жылға хостинг' }, price: 350000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'Интернет-магазин', en: 'E-commerce store', kk: 'Интернет-дүкен' }, description: { ru: 'Полная разработка + интеграции + обучение', en: 'Full development + integrations + training', kk: 'Толық әзірлеу + интеграциялар + оқыту' }, price: 900000, currency: 'KZT' } },
      { type: 'product', overrides: { name: { ru: 'SMM + Таргет', en: 'SMM + Targeting', kk: 'SMM + Таргет' }, description: { ru: 'Комплексное продвижение в соцсетях', en: 'Comprehensive social media promotion', kk: 'Әлеуметтік желілерде кешенді жылжыту' }, price: 250000, currency: 'KZT' } },
      { type: 'testimonial', overrides: { testimonials: [{ name: { ru: 'ТОО "Астана Групп"', en: 'Astana Group LLP', kk: '"Астана Групп" ЖШС' }, role: { ru: 'Интернет-магазин', en: 'E-commerce', kk: 'Интернет-дүкен' }, text: { ru: 'ROCKET разработал нам интернет-магазин, который увеличил продажи на 200%. Профессиональная команда!', en: 'ROCKET developed an online store that increased sales by 200%. Professional team!', kk: 'ROCKET сатылымды 200%-ға арттырған интернет-дүкен жасады. Кәсіби команда!' }, rating: 5 }] } },
      { type: 'form', overrides: { title: { ru: '📝 Оставить заявку', en: '📝 Submit request', kk: '📝 Өтініш қалдыру' }, buttonText: { ru: 'Отправить', en: 'Send', kk: 'Жіберу' }, fields: [{ label: { ru: 'Имя', en: 'Name', kk: 'Аты' }, type: 'text', required: true }, { label: { ru: 'Телефон', en: 'Phone', kk: 'Телефон' }, type: 'phone', required: true }, { label: { ru: 'Что нужно сделать?', en: 'What needs to be done?', kk: 'Не істеу керек?' }, type: 'textarea', required: false }] } },
      { type: 'socials', overrides: { platforms: [{ platform: 'instagram', url: 'https://instagram.com/rocket.agency' }, { platform: 'telegram', url: 'https://t.me/rocket_agency' }, { platform: 'linkedin', url: 'https://linkedin.com/company/rocket-agency' }] } },
    ],
  },
  {
    id: 'restaurant',
    name: 'Ресторан / Кафе',
    description: 'Для заведений общепита',
    category: 'Премиум',
    preview: '🍽️',
    isPremium: true,
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Ресторан NOMAD', en: 'NOMAD Restaurant', kk: 'NOMAD мейрамханасы' }, bio: { ru: '🍽️ Современная казахская кухня\n⭐ 4.9 на Google • 2GIS\n📍 Алматы, Достык 200', en: '🍽️ Modern Kazakh cuisine\n⭐ 4.9 on Google • 2GIS\n📍 Almaty, Dostyk 200', kk: '🍽️ Заманауи қазақ асханасы\n⭐ Google • 2GIS-те 4.9\n📍 Алматы, Достық 200' } } },
      { type: 'carousel', overrides: { title: { ru: '📸 Атмосфера', en: '📸 Atmosphere', kk: '📸 Атмосфера' }, images: [] } },
      { type: 'catalog', overrides: { title: { ru: '🍽️ Меню', en: '🍽️ Menu', kk: '🍽️ Мәзір' }, categories: [{ name: { ru: 'Горячие блюда', en: 'Hot dishes', kk: 'Ыстық тағамдар' }, items: [{ name: { ru: 'Бешбармак', en: 'Beshbarmak', kk: 'Бешбармақ' }, description: { ru: 'Традиционное блюдо • Баранина', en: 'Traditional dish • Lamb', kk: 'Дәстүрлі тағам • Қой еті' }, price: 4500 }, { name: { ru: 'Куырдак', en: 'Kuurdak', kk: 'Қуырдақ' }, description: { ru: 'Жареное мясо с картофелем', en: 'Fried meat with potatoes', kk: 'Картоппен қуырылған ет' }, price: 3200 }] }, { name: { ru: 'Напитки', en: 'Drinks', kk: 'Сусындар' }, items: [{ name: { ru: 'Кумыс', en: 'Kumys', kk: 'Қымыз' }, description: { ru: 'Традиционный напиток', en: 'Traditional drink', kk: 'Дәстүрлі сусын' }, price: 800 }] }] } },
      { type: 'text', overrides: { content: { ru: '🎉 Банкеты и мероприятия', en: '🎉 Banquets and events', kk: '🎉 Банкеттер мен іс-шаралар' }, style: 'heading', alignment: 'center' } },
      { type: 'text', overrides: { content: { ru: 'Зал на 50 человек • Караоке • Живая музыка по выходным', en: 'Hall for 50 people • Karaoke • Live music on weekends', kk: '50 адамға зал • Караоке • Демалыс күндері тірі музыка' }, style: 'paragraph', alignment: 'center' } },
      { type: 'link', overrides: { title: { ru: '📅 Забронировать столик', en: '📅 Book a table', kk: '📅 Үстел брондау' }, url: 'https://restobook.kz/nomad', icon: 'calendar', style: 'pill' } },
      { type: 'map', overrides: { address: 'Алматы, Достык 200' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'whatsapp', username: '+77071234567' }, { platform: 'instagram', username: 'nomad.restaurant' }] } },
    ],
  },
  {
    id: 'portfolio-pro',
    name: 'Портфолио PRO',
    description: 'Расширенное профессиональное портфолио',
    category: 'Премиум',
    preview: '💼',
    isPremium: true,
    blocks: [
      { type: 'profile', overrides: { name: { ru: 'Алексей Ким', en: 'Alexey Kim', kk: 'Алексей Ким' }, bio: { ru: '💼 Product Manager • Ex-Kaspi\n🚀 10+ лет в IT • Запустил 20+ продуктов\n📍 Алматы • Open to work', en: '💼 Product Manager • Ex-Kaspi\n🚀 10+ years in IT • Launched 20+ products\n📍 Almaty • Open to work', kk: '💼 Product Manager • Ex-Kaspi\n🚀 IT-да 10+ жыл • 20+ өнім шығарды\n📍 Алматы • Жұмысқа ашық' } } },
      { type: 'video', overrides: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: { ru: '🎬 Видео-визитка', en: '🎬 Video introduction', kk: '🎬 Видео-визитка' } } },
      { type: 'carousel', overrides: { title: { ru: '🏆 Ключевые проекты', en: '🏆 Key projects', kk: '🏆 Негізгі жобалар' }, images: [] } },
      { type: 'text', overrides: { content: { ru: '📊 Достижения', en: '📊 Achievements', kk: '📊 Жетістіктер' }, style: 'heading', alignment: 'center' } },
      { type: 'text', overrides: { content: { ru: '• Kaspi.kz — рост MAU с 5M до 12M\n• Запуск Kaspi Travel — 0 → $10M GMV\n• Chocofamily — редизайн увеличил конверсию на 40%', en: '• Kaspi.kz — MAU growth from 5M to 12M\n• Kaspi Travel launch — 0 → $10M GMV\n• Chocofamily — redesign increased conversion by 40%', kk: '• Kaspi.kz — MAU 5M-нан 12M-ға өсті\n• Kaspi Travel іске қосу — 0 → $10M GMV\n• Chocofamily — редизайн конверсияны 40%-ға арттырды' }, style: 'paragraph', alignment: 'left' } },
      { type: 'testimonial', overrides: { testimonials: [{ name: { ru: 'Михаил Ломтадзе', en: 'Mikhail Lomtadze', kk: 'Михаил Ломтадзе' }, role: { ru: 'CEO Kaspi.kz', en: 'CEO Kaspi.kz', kk: 'Kaspi.kz CEO' }, text: { ru: 'Алексей — один из лучших продакт-менеджеров, с которыми мне доводилось работать. Рекомендую!', en: 'Alexey is one of the best product managers I have ever worked with. Highly recommend!', kk: 'Алексей — мен бірге жұмыс істеген ең жақсы продакт-менеджерлердің бірі. Ұсынамын!' }, rating: 5 }] } },
      { type: 'link', overrides: { title: { ru: '💼 LinkedIn', en: '💼 LinkedIn', kk: '💼 LinkedIn' }, url: 'https://linkedin.com/in/alexeykim', icon: 'linkedin', style: 'rounded' } },
      { type: 'download', overrides: { title: { ru: '📄 Скачать резюме (PDF)', en: '📄 Download CV (PDF)', kk: '📄 Резюмені жүктеу (PDF)' }, fileName: 'alexey_kim_cv.pdf' } },
      { type: 'messenger', overrides: { messengers: [{ platform: 'telegram', username: 'alexey_kim_pm' }, { platform: 'linkedin', username: 'alexeykim' }] } },
    ],
  },

  // ===== ДРУГОЕ =====
  {
    id: 'blank',
    name: 'Пустой шаблон',
    description: 'Начните с чистого листа',
    category: 'Другое',
    preview: '📄',
    blocks: [],
  },
];

const CATEGORIES = ['Все', 'Креаторы', 'Бизнес', 'Эксперты', 'Премиум', 'Другое'];

interface TemplateGalleryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (blocks: Block[]) => void;
}

export const TemplateGallery = memo(function TemplateGallery({
  open,
  onClose,
  onSelect,
}: TemplateGalleryProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSelect = (template: Template) => {
    // Generate blocks with full structure from block-factory + overrides
    const fullBlocks = template.blocks.map((blockDef) => 
      createTemplateBlock(blockDef.type, blockDef.overrides || {})
    );
    onSelect(fullBlocks);
    setCopiedId(template.id);
    setTimeout(() => {
      setCopiedId(null);
      onClose();
    }, 500);
  };

  const filteredTemplates = selectedCategory === 'Все' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('templates.title', 'Галерея шаблонов')}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {t('templates.description', 'Выберите готовый шаблон и скопируйте в 1 клик')}
          </DialogDescription>
        </DialogHeader>

        {/* Category Filter */}
        <div className="px-4 sm:px-6 py-3 border-b">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[60vh] sm:h-[55vh]">
          <div className="p-4 sm:p-6 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`relative p-3 sm:p-4 hover:border-primary cursor-pointer transition-all hover:shadow-lg group ${
                    copiedId === template.id ? 'border-green-500 bg-green-500/10' : ''
                  }`}
                  onClick={() => handleSelect(template)}
                >
                  {template.isPremium && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px]">
                      PRO
                    </Badge>
                  )}
                  
                  <div className="text-3xl sm:text-4xl mb-2 text-center group-hover:scale-110 transition-transform">
                    {copiedId === template.id ? (
                      <Check className="h-8 w-8 mx-auto text-green-500" />
                    ) : (
                      template.preview
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-xs sm:text-sm text-center mb-1 truncate">
                    {template.name}
                  </h4>
                  
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center line-clamp-2 min-h-[2.5em]">
                    {template.description}
                  </p>
                  
                  <div className="mt-2 sm:mt-3 text-center">
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">
                      {template.blocks.length} {t('templates.blocks', 'блоков')}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 p-4 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            {t('common.cancel', 'Отмена')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});