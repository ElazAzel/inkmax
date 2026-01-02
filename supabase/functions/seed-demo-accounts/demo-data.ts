// Demo pages data for seeding
export const DEMO_PAGES = [
  // Beauty - 2 accounts
  {
    slug: 'anna_beauty',
    title: 'Анна Красота',
    description: 'Визажист и бровист в Алматы. Запись онлайн 💄',
    niche: 'beauty',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    avatarStyle: { type: 'gradient', colors: ['#FF6B9D', '#C44569'] },
    themeSettings: {
      backgroundColor: '#FFF5F7',
      textColor: '#2D2D2D',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Анна Красота', kk: 'Анна Сұлулық', en: 'Anna Beauty' }, bio: { ru: 'Сертифицированный визажист. Свадебный макияж, вечерний образ, коррекция бровей. Работаю с 2018 года.', kk: 'Сертификатталған визажист', en: 'Certified makeup artist' } } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на услугу', kk: 'Қызметке жазылу', en: 'Book a service' }, services: [{ name: 'Свадебный макияж', duration: 120, price: 35000 }, { name: 'Вечерний макияж', duration: 90, price: 20000 }, { name: 'Коррекция бровей', duration: 45, price: 8000 }] } },
      { type: 'catalog', content: { title: { ru: '💄 Мои работы', kk: 'Менің жұмыстарым', en: 'My works' }, items: [{ title: 'Свадебный образ', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', price: 35000 }, { title: 'Вечерний макияж', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', price: 20000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Прайс-лист', kk: 'Бағалар', en: 'Price list' }, items: [{ name: 'Свадебный макияж', price: '35 000 ₸' }, { name: 'Вечерний макияж', price: '20 000 ₸' }, { name: 'Дневной макияж', price: '12 000 ₸' }, { name: 'Коррекция бровей', price: '8 000 ₸' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77001234567' }, { type: 'instagram', value: 'anna_beauty_almaty' }, { type: 'telegram', value: 'anna_beauty' }] } },
      { type: 'socials', content: { links: [{ platform: 'instagram', url: 'https://instagram.com/anna_beauty' }, { platform: 'tiktok', url: 'https://tiktok.com/@anna_beauty' }] } }
    ]
  },
  {
    slug: 'salon_elite',
    title: 'Салон Elite',
    description: 'Премиальный салон красоты в центре Астаны ✨',
    niche: 'beauty',
    avatarUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',
    avatarStyle: { type: 'solid', color: '#8B5CF6' },
    themeSettings: {
      backgroundColor: '#F5F3FF',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Салон Elite', kk: 'Elite салоны', en: 'Elite Salon' }, bio: { ru: 'Премиальный салон красоты. Стрижки, окрашивание, маникюр, педикюр. Работаем с 2015 года.', kk: 'Премиум сұлулық салоны', en: 'Premium beauty salon' } } },
      { type: 'catalog', content: { title: { ru: '✨ Наши услуги', kk: 'Біздің қызметтер', en: 'Our services' }, items: [{ title: 'Стрижка женская', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', price: 15000 }, { title: 'Окрашивание', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400', price: 45000 }, { title: 'Маникюр с покрытием', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', price: 12000 }] } },
      { type: 'booking', content: { title: { ru: '📅 Онлайн-запись', kk: 'Онлайн жазылу', en: 'Online booking' }, services: [{ name: 'Стрижка', duration: 60, price: 15000 }, { name: 'Окрашивание', duration: 180, price: 45000 }, { name: 'Маникюр', duration: 90, price: 12000 }] } },
      { type: 'map', content: { title: { ru: '📍 Наш адрес', kk: 'Біздің мекенжай', en: 'Our address' }, address: 'Астана, ул. Кунаева 14', coordinates: { lat: 51.1605, lng: 71.4704 } } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77012345678' }, { type: 'telegram', value: 'salon_elite' }] } }
    ]
  },
  // Fitness - 2 accounts
  {
    slug: 'coach_arman',
    title: 'Тренер Арман',
    description: 'Персональный фитнес-тренер. Трансформация тела 💪',
    niche: 'fitness',
    avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200',
    avatarStyle: { type: 'gradient', colors: ['#10B981', '#059669'] },
    themeSettings: {
      backgroundColor: '#ECFDF5',
      textColor: '#1F2937',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Тренер Арман', kk: 'Жаттықтырушы Арман', en: 'Coach Arman' }, bio: { ru: 'Сертифицированный фитнес-тренер. 8 лет опыта. Более 200 довольных клиентов. Онлайн и офлайн тренировки.', kk: 'Сертификатталған фитнес жаттықтырушы', en: 'Certified fitness trainer' } } },
      { type: 'pricing', content: { title: { ru: '💪 Тарифы', kk: 'Тарифтер', en: 'Pricing' }, items: [{ name: 'Персональная тренировка', price: '15 000 ₸' }, { name: 'Абонемент 8 занятий', price: '100 000 ₸' }, { name: 'Онлайн-программа', price: '50 000 ₸/мес' }, { name: 'Составление питания', price: '25 000 ₸' }] } },
      { type: 'catalog', content: { title: { ru: '🏆 Результаты клиентов', kk: 'Клиенттер нәтижелері', en: 'Client results' }, items: [{ title: 'Алексей: -20 кг за 3 месяца', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' }, { title: 'Дана: трансформация тела', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на тренировку', kk: 'Жаттығуға жазылу', en: 'Book a session' }, services: [{ name: 'Персональная тренировка', duration: 60, price: 15000 }, { name: 'Пробная тренировка', duration: 45, price: 5000 }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77051234567' }, { type: 'telegram', value: 'coach_arman' }] } }
    ]
  },
  {
    slug: 'yoga_studio_zen',
    title: 'Йога-студия Zen',
    description: 'Йога, медитация, здоровый образ жизни 🧘‍♀️',
    niche: 'fitness',
    avatarUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200',
    avatarStyle: { type: 'solid', color: '#7C3AED' },
    themeSettings: {
      backgroundColor: '#FAF5FF',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Йога-студия Zen', kk: 'Zen йога-студиясы', en: 'Yoga Studio Zen' }, bio: { ru: 'Уютная студия йоги в центре города. Хатха, Виньяса, медитации. Группы для начинающих и продвинутых.', kk: 'Қала орталығындағы жайлы йога студиясы', en: 'Cozy yoga studio in the city center' } } },
      { type: 'catalog', content: { title: { ru: '🧘 Направления', kk: 'Бағыттар', en: 'Directions' }, items: [{ title: 'Хатха-йога', image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400', price: 5000 }, { title: 'Виньяса-флоу', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', price: 5000 }, { title: 'Медитация', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400', price: 4000 }] } },
      { type: 'pricing', content: { title: { ru: '💜 Абонементы', kk: 'Абонементтер', en: 'Subscriptions' }, items: [{ name: 'Разовое посещение', price: '5 000 ₸' }, { name: '8 занятий', price: '32 000 ₸' }, { name: 'Безлимит месяц', price: '45 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Расписание занятий', kk: 'Сабақ кестесі', en: 'Class schedule' }, services: [{ name: 'Утренняя йога', duration: 60, price: 5000 }, { name: 'Вечерняя медитация', duration: 45, price: 4000 }] } },
      { type: 'map', content: { title: { ru: '📍 Как нас найти', kk: 'Бізді қалай табуға болады', en: 'How to find us' }, address: 'Алматы, ул. Абая 150, офис 12' } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77071234567' }, { type: 'instagram', value: 'yoga_zen_almaty' }] } }
    ]
  },
  // Food - 2 accounts
  {
    slug: 'chef_marat',
    title: 'Шеф Марат',
    description: 'Авторская кухня. Кейтеринг и мастер-классы 👨‍🍳',
    niche: 'food',
    avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200',
    avatarStyle: { type: 'gradient', colors: ['#F59E0B', '#D97706'] },
    themeSettings: {
      backgroundColor: '#FFFBEB',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Шеф Марат', kk: 'Аспазшы Марат', en: 'Chef Marat' }, bio: { ru: 'Шеф-повар с 15-летним опытом. Авторская казахская и европейская кухня. Организация банкетов и мастер-классы.', kk: '15 жылдық тәжірибесі бар аспазшы', en: 'Chef with 15 years of experience' } } },
      { type: 'catalog', content: { title: { ru: '🍽️ Меню для заказа', kk: 'Тапсырыс менюі', en: 'Order menu' }, items: [{ title: 'Бешбармак', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', price: 8000 }, { title: 'Плов', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', price: 5000 }, { title: 'Манты', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400', price: 3000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Услуги', kk: 'Қызметтер', en: 'Services' }, items: [{ name: 'Банкет на 10 персон', price: 'от 150 000 ₸' }, { name: 'Мастер-класс (группа)', price: '50 000 ₸' }, { name: 'Индивидуальный урок', price: '30 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Заказать банкет', kk: 'Банкет тапсырысы', en: 'Order banquet' }, services: [{ name: 'Консультация', duration: 30, price: 0 }, { name: 'Мастер-класс', duration: 180, price: 50000 }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77021234567' }, { type: 'telegram', value: 'chef_marat' }] } }
    ]
  },
  {
    slug: 'homecakes_asel',
    title: 'HomeCakes Asel',
    description: 'Торты и десерты на заказ в Алматы 🎂',
    niche: 'food',
    avatarUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200',
    avatarStyle: { type: 'gradient', colors: ['#EC4899', '#BE185D'] },
    themeSettings: {
      backgroundColor: '#FDF2F8',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'HomeCakes Asel', kk: 'HomeCakes Asel', en: 'HomeCakes Asel' }, bio: { ru: 'Домашние торты и десерты. Свадебные торты, детские на заказ. Только натуральные ингредиенты!', kk: 'Үйде пісірілген торттар мен десерттер', en: 'Homemade cakes and desserts' } } },
      { type: 'catalog', content: { title: { ru: '🎂 Каталог тортов', kk: 'Торттар каталогы', en: 'Cake catalog' }, items: [{ title: 'Медовик классический', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400', price: 18000 }, { title: 'Чизкейк Нью-Йорк', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400', price: 15000 }, { title: 'Красный бархат', image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400', price: 20000 }] } },
      { type: 'pricing', content: { title: { ru: '💕 Прайс', kk: 'Бағалар', en: 'Prices' }, items: [{ name: 'Торт 1 кг', price: 'от 12 000 ₸' }, { name: 'Капкейки (12 шт)', price: '15 000 ₸' }, { name: 'Макаронс (12 шт)', price: '8 000 ₸' }] } },
      { type: 'form', content: { title: { ru: '📝 Заказать торт', kk: 'Торт тапсырыс беру', en: 'Order a cake' }, fields: [{ name: 'name', label: 'Ваше имя', type: 'text', required: true }, { name: 'phone', label: 'Телефон', type: 'tel', required: true }, { name: 'date', label: 'Дата события', type: 'date', required: true }, { name: 'description', label: 'Опишите торт', type: 'textarea' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77031234567' }, { type: 'instagram', value: 'homecakes_asel' }] } }
    ]
  },
  // Education - 2 accounts
  {
    slug: 'english_pro',
    title: 'English Pro',
    description: 'Курсы английского языка. IELTS, General, Business 📚',
    niche: 'education',
    avatarUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200',
    avatarStyle: { type: 'solid', color: '#3B82F6' },
    themeSettings: {
      backgroundColor: '#EFF6FF',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'English Pro', kk: 'English Pro', en: 'English Pro' }, bio: { ru: 'Языковая школа. IELTS подготовка, General English, Business English. Квалифицированные преподаватели с опытом 10+ лет.', kk: 'Тіл мектебі', en: 'Language school' } } },
      { type: 'pricing', content: { title: { ru: '📚 Курсы и цены', kk: 'Курстар мен бағалар', en: 'Courses and prices' }, items: [{ name: 'IELTS Intensive (2 мес)', price: '180 000 ₸' }, { name: 'General English (3 мес)', price: '120 000 ₸' }, { name: 'Business English', price: '150 000 ₸' }, { name: 'Индивидуальные занятия', price: '10 000 ₸/час' }] } },
      { type: 'catalog', content: { title: { ru: '🎓 Наши программы', kk: 'Біздің бағдарламалар', en: 'Our programs' }, items: [{ title: 'IELTS Preparation', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', description: 'Подготовка к IELTS 7.0+' }, { title: 'Business English', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', description: 'Деловой английский' }] } },
      { type: 'form', content: { title: { ru: '✍️ Записаться на пробный урок', kk: 'Сынақ сабағына жазылу', en: 'Sign up for trial lesson' }, fields: [{ name: 'name', label: 'Имя', type: 'text', required: true }, { name: 'phone', label: 'Телефон', type: 'tel', required: true }, { name: 'level', label: 'Ваш уровень', type: 'select', options: ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate'] }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77041234567' }, { type: 'telegram', value: 'english_pro_kz' }] } }
    ]
  },
  {
    slug: 'math_tutor_dana',
    title: 'Репетитор Дана',
    description: 'Математика для школьников и абитуриентов 📐',
    niche: 'education',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200',
    avatarStyle: { type: 'gradient', colors: ['#6366F1', '#4F46E5'] },
    themeSettings: {
      backgroundColor: '#EEF2FF',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Репетитор Дана', kk: 'Репетитор Дана', en: 'Tutor Dana' }, bio: { ru: 'Преподаватель математики. Подготовка к ЕНТ, олимпиадам. 95% учеников поступают в топ-вузы.', kk: 'Математика мұғалімі', en: 'Math teacher' } } },
      { type: 'pricing', content: { title: { ru: '💰 Стоимость занятий', kk: 'Сабақ бағасы', en: 'Lesson prices' }, items: [{ name: 'Индивидуальное занятие', price: '8 000 ₸/час' }, { name: 'Мини-группа (3-4 чел)', price: '5 000 ₸/час' }, { name: 'Интенсив к ЕНТ (1 мес)', price: '80 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на занятие', kk: 'Сабаққа жазылу', en: 'Book a lesson' }, services: [{ name: 'Пробный урок', duration: 45, price: 0 }, { name: 'Индивидуальное занятие', duration: 60, price: 8000 }] } },
      { type: 'testimonial', content: { title: { ru: '⭐ Отзывы учеников', kk: 'Оқушы пікірлері', en: 'Student reviews' }, items: [{ author: 'Алия М.', text: 'Благодаря Дане набрала 130 баллов по математике на ЕНТ!' }, { author: 'Тимур К.', text: 'Отличный преподаватель, понятно объясняет сложные темы.' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77051234567' }, { type: 'telegram', value: 'math_tutor_dana' }] } }
    ]
  },
  // Art - 2 accounts
  {
    slug: 'artist_aizhan',
    title: 'Художница Айжан',
    description: 'Портреты на заказ, картины, уроки живописи 🎨',
    niche: 'art',
    avatarUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200',
    avatarStyle: { type: 'gradient', colors: ['#F97316', '#EA580C'] },
    themeSettings: {
      backgroundColor: '#FFF7ED',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Художница Айжан', kk: 'Суретші Айжан', en: 'Artist Aizhan' }, bio: { ru: 'Профессиональный художник. Пишу портреты, пейзажи, абстракции. Провожу мастер-классы для детей и взрослых.', kk: 'Кәсіби суретші', en: 'Professional artist' } } },
      { type: 'catalog', content: { title: { ru: '🎨 Мои работы', kk: 'Менің жұмыстарым', en: 'My works' }, items: [{ title: 'Портрет по фото', image: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400', price: 50000 }, { title: 'Пейзаж маслом', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400', price: 80000 }, { title: 'Абстракция', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', price: 60000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Цены на заказ', kk: 'Тапсырыс бағалары', en: 'Commission prices' }, items: [{ name: 'Портрет А4', price: 'от 30 000 ₸' }, { name: 'Портрет А3', price: 'от 50 000 ₸' }, { name: 'Картина 50x70', price: 'от 80 000 ₸' }, { name: 'Мастер-класс', price: '15 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на мастер-класс', kk: 'Шеберлік сабағына жазылу', en: 'Book a workshop' }, services: [{ name: 'МК для детей', duration: 90, price: 10000 }, { name: 'МК для взрослых', duration: 120, price: 15000 }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77061234567' }, { type: 'instagram', value: 'artist_aizhan' }] } }
    ]
  },
  {
    slug: 'photo_studio_light',
    title: 'Фотостудия Light',
    description: 'Профессиональные фотосессии в Астане 📸',
    niche: 'art',
    avatarUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200',
    avatarStyle: { type: 'solid', color: '#0F172A' },
    themeSettings: {
      backgroundColor: '#F8FAFC',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Фотостудия Light', kk: 'Light фотостудиясы', en: 'Photo Studio Light' }, bio: { ru: 'Современная фотостудия с 5 залами. Профессиональное оборудование, опытные фотографы.', kk: 'Заманауи фотостудия', en: 'Modern photo studio' } } },
      { type: 'catalog', content: { title: { ru: '📸 Виды съемок', kk: 'Түсіру түрлері', en: 'Photography types' }, items: [{ title: 'Портретная съемка', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', price: 35000 }, { title: 'Семейная фотосессия', image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400', price: 50000 }, { title: 'Предметная съемка', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', price: 3000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Прайс-лист', kk: 'Бағалар', en: 'Price list' }, items: [{ name: 'Аренда зала (1 час)', price: '15 000 ₸' }, { name: 'Фотосессия с фотографом', price: 'от 35 000 ₸' }, { name: 'Видеосъемка', price: 'от 50 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Забронировать студию', kk: 'Студияны брондау', en: 'Book the studio' }, services: [{ name: 'Аренда зала', duration: 60, price: 15000 }, { name: 'Фотосессия', duration: 120, price: 35000 }] } },
      { type: 'map', content: { title: { ru: '📍 Адрес студии', kk: 'Студия мекенжайы', en: 'Studio address' }, address: 'Астана, ул. Сыганак 60' } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77071234567' }, { type: 'instagram', value: 'photostudio_light' }] } }
    ]
  },
  // Music - 2 accounts
  {
    slug: 'dj_sultan',
    title: 'DJ Sultan',
    description: 'Диджей на свадьбы, корпоративы, частные вечеринки 🎧',
    niche: 'music',
    avatarUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6a8583f?w=200',
    avatarStyle: { type: 'gradient', colors: ['#8B5CF6', '#6D28D9'] },
    themeSettings: {
      backgroundColor: '#1F1F1F',
      textColor: '#FFFFFF',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'DJ Sultan', kk: 'DJ Sultan', en: 'DJ Sultan' }, bio: { ru: 'Профессиональный диджей. 10 лет на сцене. Свадьбы, корпоративы, клубные вечеринки. Своё оборудование.', kk: 'Кәсіби диджей', en: 'Professional DJ' } } },
      { type: 'video', content: { title: { ru: '🎥 Мои выступления', kk: 'Менің өнерлерім', en: 'My performances' }, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
      { type: 'pricing', content: { title: { ru: '💰 Услуги и цены', kk: 'Қызметтер мен бағалар', en: 'Services and prices' }, items: [{ name: 'Свадьба (5 часов)', price: '150 000 ₸' }, { name: 'Корпоратив', price: 'от 100 000 ₸' }, { name: 'Частная вечеринка', price: 'от 80 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Забронировать дату', kk: 'Күнді брондау', en: 'Book a date' }, services: [{ name: 'Консультация', duration: 30, price: 0 }] } },
      { type: 'socials', content: { links: [{ platform: 'instagram', url: 'https://instagram.com/dj_sultan' }, { platform: 'youtube', url: 'https://youtube.com/djsultan' }, { platform: 'spotify', url: 'https://spotify.com/djsultan' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77081234567' }, { type: 'telegram', value: 'dj_sultan_booking' }] } }
    ]
  },
  {
    slug: 'vocal_coach_alina',
    title: 'Вокал с Алиной',
    description: 'Уроки вокала для детей и взрослых 🎤',
    niche: 'music',
    avatarUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
    avatarStyle: { type: 'gradient', colors: ['#EC4899', '#DB2777'] },
    themeSettings: {
      backgroundColor: '#FDF2F8',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Вокал с Алиной', kk: 'Алинамен вокал', en: 'Vocals with Alina' }, bio: { ru: 'Профессиональный преподаватель вокала. Эстрада, джаз, поп. Подготовка к конкурсам. Ученики — призеры "Голос Дети".', kk: 'Кәсіби вокал мұғалімі', en: 'Professional vocal coach' } } },
      { type: 'pricing', content: { title: { ru: '🎤 Стоимость занятий', kk: 'Сабақ бағасы', en: 'Lesson prices' }, items: [{ name: 'Индивидуальный урок (45 мин)', price: '10 000 ₸' }, { name: 'Абонемент 8 уроков', price: '70 000 ₸' }, { name: 'Пробный урок', price: '5 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на урок', kk: 'Сабаққа жазылу', en: 'Book a lesson' }, services: [{ name: 'Пробный урок', duration: 30, price: 5000 }, { name: 'Индивидуальный урок', duration: 45, price: 10000 }] } },
      { type: 'testimonial', content: { title: { ru: '⭐ Отзывы учеников', kk: 'Оқушы пікірлері', en: 'Student reviews' }, items: [{ author: 'Мама Аяны', text: 'Дочка занимается год, прогресс невероятный! Заняла 2 место на городском конкурсе.' }, { author: 'Карина', text: 'Алина — прекрасный педагог, нашла подход даже ко мне, взрослой ученице.' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77091234567' }, { type: 'telegram', value: 'vocal_alina' }] } }
    ]
  },
  // Tech - 2 accounts
  {
    slug: 'webdev_timur',
    title: 'Веб-разработчик Тимур',
    description: 'Создание сайтов и приложений под ключ 💻',
    niche: 'tech',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    avatarStyle: { type: 'solid', color: '#0EA5E9' },
    themeSettings: {
      backgroundColor: '#F0F9FF',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'mono'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Веб-разработчик Тимур', kk: 'Веб-әзірлеуші Тимур', en: 'Web Developer Timur' }, bio: { ru: 'Full-stack разработчик. React, Node.js, TypeScript. Создаю сайты, веб-приложения, интернет-магазины. 5 лет опыта.', kk: 'Full-stack әзірлеуші', en: 'Full-stack developer' } } },
      { type: 'catalog', content: { title: { ru: '💼 Портфолио', kk: 'Портфолио', en: 'Portfolio' }, items: [{ title: 'Интернет-магазин одежды', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', description: 'React + Node.js' }, { title: 'Корпоративный сайт', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400', description: 'Next.js' }] } },
      { type: 'pricing', content: { title: { ru: '💰 Услуги', kk: 'Қызметтер', en: 'Services' }, items: [{ name: 'Лендинг', price: 'от 150 000 ₸' }, { name: 'Корпоративный сайт', price: 'от 350 000 ₸' }, { name: 'Интернет-магазин', price: 'от 500 000 ₸' }, { name: 'Веб-приложение', price: 'от 1 000 000 ₸' }] } },
      { type: 'form', content: { title: { ru: '📝 Обсудить проект', kk: 'Жобаны талқылау', en: 'Discuss project' }, fields: [{ name: 'name', label: 'Имя', type: 'text', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'project', label: 'Опишите проект', type: 'textarea', required: true }] } },
      { type: 'socials', content: { links: [{ platform: 'github', url: 'https://github.com/timurdev' }, { platform: 'linkedin', url: 'https://linkedin.com/in/timurdev' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'telegram', value: 'timur_webdev' }, { type: 'whatsapp', value: '+77011234567' }] } }
    ]
  },
  {
    slug: 'it_courses_astana',
    title: 'IT Курсы Astana',
    description: 'Обучение программированию с нуля 🖥️',
    niche: 'tech',
    avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200',
    avatarStyle: { type: 'gradient', colors: ['#22C55E', '#16A34A'] },
    themeSettings: {
      backgroundColor: '#F0FDF4',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'IT Курсы Astana', kk: 'IT Курстар Astana', en: 'IT Courses Astana' }, bio: { ru: 'Обучаем программированию с нуля. Python, JavaScript, Frontend, Backend. Помощь с трудоустройством.', kk: 'Нөлден бастап бағдарламалауға үйретеміз', en: 'We teach programming from scratch' } } },
      { type: 'catalog', content: { title: { ru: '📚 Наши курсы', kk: 'Біздің курстар', en: 'Our courses' }, items: [{ title: 'Python с нуля', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', price: 200000, description: '3 месяца' }, { title: 'Frontend разработка', image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400', price: 250000, description: '4 месяца' }] } },
      { type: 'pricing', content: { title: { ru: '💰 Стоимость обучения', kk: 'Оқыту құны', en: 'Course prices' }, items: [{ name: 'Python (3 мес)', price: '200 000 ₸' }, { name: 'Frontend (4 мес)', price: '250 000 ₸' }, { name: 'Full-stack (6 мес)', price: '400 000 ₸' }] } },
      { type: 'form', content: { title: { ru: '✍️ Записаться на курс', kk: 'Курсқа жазылу', en: 'Enroll in course' }, fields: [{ name: 'name', label: 'Имя', type: 'text', required: true }, { name: 'phone', label: 'Телефон', type: 'tel', required: true }, { name: 'course', label: 'Выберите курс', type: 'select', options: ['Python', 'Frontend', 'Full-stack'] }] } },
      { type: 'map', content: { title: { ru: '📍 Наш офис', kk: 'Біздің кеңсе', en: 'Our office' }, address: 'Астана, БЦ Нурлы Тау, офис 512' } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77021234567' }, { type: 'telegram', value: 'it_courses_astana' }] } }
    ]
  },
  // Business - 2 accounts
  {
    slug: 'marketing_agency',
    title: 'Digital Agency KZ',
    description: 'Маркетинг и реклама для бизнеса 📊',
    niche: 'business',
    avatarUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
    avatarStyle: { type: 'solid', color: '#1E40AF' },
    themeSettings: {
      backgroundColor: '#EFF6FF',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Digital Agency KZ', kk: 'Digital Agency KZ', en: 'Digital Agency KZ' }, bio: { ru: 'Полный цикл digital-маркетинга. SMM, таргетированная реклама, SEO, контент. Работаем с 2018 года.', kk: 'Digital-маркетингтің толық циклі', en: 'Full-cycle digital marketing' } } },
      { type: 'catalog', content: { title: { ru: '🚀 Наши услуги', kk: 'Біздің қызметтер', en: 'Our services' }, items: [{ title: 'SMM продвижение', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', description: 'Ведение социальных сетей' }, { title: 'Таргетированная реклама', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400', description: 'Facebook, Instagram, Google' }] } },
      { type: 'pricing', content: { title: { ru: '💰 Тарифы', kk: 'Тарифтер', en: 'Pricing' }, items: [{ name: 'SMM базовый', price: 'от 200 000 ₸/мес' }, { name: 'SMM продвинутый', price: 'от 400 000 ₸/мес' }, { name: 'Таргет + SMM', price: 'от 500 000 ₸/мес' }] } },
      { type: 'form', content: { title: { ru: '📝 Бесплатная консультация', kk: 'Тегін кеңес', en: 'Free consultation' }, fields: [{ name: 'name', label: 'Имя', type: 'text', required: true }, { name: 'company', label: 'Компания', type: 'text' }, { name: 'phone', label: 'Телефон', type: 'tel', required: true }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77031234567' }, { type: 'telegram', value: 'digital_agency_kz' }] } }
    ]
  },
  {
    slug: 'accountant_aina',
    title: 'Бухгалтер Айна',
    description: 'Бухгалтерские услуги для ИП и ТОО 📋',
    niche: 'business',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    avatarStyle: { type: 'solid', color: '#059669' },
    themeSettings: {
      backgroundColor: '#ECFDF5',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Бухгалтер Айна', kk: 'Бухгалтер Айна', en: 'Accountant Aina' }, bio: { ru: 'Профессиональный бухгалтер. Ведение учета ИП и ТОО, налоговые отчеты, консультации. 12 лет опыта.', kk: 'Кәсіби бухгалтер', en: 'Professional accountant' } } },
      { type: 'pricing', content: { title: { ru: '💰 Услуги и цены', kk: 'Қызметтер мен бағалар', en: 'Services and prices' }, items: [{ name: 'Ведение ИП (упрощенка)', price: '20 000 ₸/мес' }, { name: 'Ведение ТОО', price: 'от 50 000 ₸/мес' }, { name: 'Разовая консультация', price: '10 000 ₸' }, { name: 'Восстановление учета', price: 'от 100 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на консультацию', kk: 'Кеңеске жазылу', en: 'Book a consultation' }, services: [{ name: 'Бесплатная консультация', duration: 15, price: 0 }, { name: 'Платная консультация', duration: 60, price: 10000 }] } },
      { type: 'testimonial', content: { title: { ru: '⭐ Отзывы клиентов', kk: 'Клиент пікірлері', en: 'Client reviews' }, items: [{ author: 'Марат, ИП', text: 'Айна ведет мой учет уже 3 года. Ни одной проблемы с налоговой!' }, { author: 'ТОО "Строй-Плюс"', text: 'Профессионал своего дела. Рекомендуем!' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77041234567' }, { type: 'telegram', value: 'buh_aina' }] } }
    ]
  },
  // Health - 2 accounts
  {
    slug: 'psychologist_laura',
    title: 'Психолог Лаура',
    description: 'Психологическая помощь и консультации 🧠',
    niche: 'health',
    avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200',
    avatarStyle: { type: 'gradient', colors: ['#A78BFA', '#7C3AED'] },
    themeSettings: {
      backgroundColor: '#FAF5FF',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Психолог Лаура', kk: 'Психолог Лаура', en: 'Psychologist Laura' }, bio: { ru: 'Клинический психолог. Тревога, депрессия, отношения, самооценка. Онлайн и офлайн консультации.', kk: 'Клиникалық психолог', en: 'Clinical psychologist' } } },
      { type: 'pricing', content: { title: { ru: '💜 Стоимость консультаций', kk: 'Кеңес бағасы', en: 'Consultation prices' }, items: [{ name: 'Первичная консультация', price: '15 000 ₸' }, { name: 'Индивидуальная сессия', price: '20 000 ₸' }, { name: 'Парная терапия', price: '30 000 ₸' }, { name: 'Пакет 5 сессий', price: '80 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на консультацию', kk: 'Кеңеске жазылу', en: 'Book a consultation' }, services: [{ name: 'Онлайн-консультация', duration: 60, price: 20000 }, { name: 'Очная консультация', duration: 60, price: 20000 }] } },
      { type: 'faq', content: { title: { ru: '❓ Частые вопросы', kk: 'Жиі қойылатын сұрақтар', en: 'FAQ' }, items: [{ question: 'Как проходит первая консультация?', answer: 'На первой встрече мы знакомимся, вы рассказываете о своей ситуации, и мы определяем цели терапии.' }, { question: 'Сколько сессий нужно?', answer: 'Количество зависит от запроса. В среднем видимые результаты появляются после 5-10 сессий.' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77051234567' }, { type: 'telegram', value: 'psy_laura' }] } }
    ]
  },
  {
    slug: 'massage_studio',
    title: 'Массажный кабинет',
    description: 'Лечебный и расслабляющий массаж 💆',
    niche: 'health',
    avatarUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200',
    avatarStyle: { type: 'gradient', colors: ['#14B8A6', '#0D9488'] },
    themeSettings: {
      backgroundColor: '#F0FDFA',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Массажный кабинет', kk: 'Массаж кабинеті', en: 'Massage Studio' }, bio: { ru: 'Профессиональный лечебный массаж. Классический, спортивный, антицеллюлитный. Медицинская лицензия.', kk: 'Кәсіби емдік массаж', en: 'Professional therapeutic massage' } } },
      { type: 'catalog', content: { title: { ru: '💆 Виды массажа', kk: 'Массаж түрлері', en: 'Massage types' }, items: [{ title: 'Классический массаж', image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400', price: 12000 }, { title: 'Спортивный массаж', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400', price: 15000 }, { title: 'Антицеллюлитный', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400', price: 18000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Прайс-лист', kk: 'Бағалар', en: 'Price list' }, items: [{ name: 'Общий массаж (60 мин)', price: '12 000 ₸' }, { name: 'Массаж спины (30 мин)', price: '6 000 ₸' }, { name: 'Антицеллюлитный (60 мин)', price: '18 000 ₸' }, { name: 'Абонемент 10 сеансов', price: '100 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на массаж', kk: 'Массажға жазылу', en: 'Book a massage' }, services: [{ name: 'Общий массаж', duration: 60, price: 12000 }, { name: 'Массаж спины', duration: 30, price: 6000 }] } },
      { type: 'map', content: { title: { ru: '📍 Адрес кабинета', kk: 'Кабинет мекенжайы', en: 'Cabinet address' }, address: 'Алматы, ул. Жибек Жолы 50, офис 15' } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77061234567' }, { type: 'telegram', value: 'massage_almaty' }] } }
    ]
  },
  // Fashion - 2 accounts
  {
    slug: 'stylist_kamila',
    title: 'Стилист Камила',
    description: 'Персональный стилист и шоппер 👗',
    niche: 'fashion',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200',
    avatarStyle: { type: 'gradient', colors: ['#F43F5E', '#E11D48'] },
    themeSettings: {
      backgroundColor: '#FFF1F2',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Стилист Камила', kk: 'Стилист Камила', en: 'Stylist Kamila' }, bio: { ru: 'Персональный стилист. Разбор гардероба, шоппинг-сопровождение, создание капсульного гардероба.', kk: 'Жеке стилист', en: 'Personal stylist' } } },
      { type: 'catalog', content: { title: { ru: '👗 Услуги', kk: 'Қызметтер', en: 'Services' }, items: [{ title: 'Разбор гардероба', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400', price: 50000 }, { title: 'Шоппинг-сопровождение', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', price: 80000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Стоимость услуг', kk: 'Қызмет бағасы', en: 'Service prices' }, items: [{ name: 'Онлайн-консультация', price: '15 000 ₸' }, { name: 'Разбор гардероба', price: '50 000 ₸' }, { name: 'Шоппинг (3 часа)', price: '80 000 ₸' }, { name: 'Капсульный гардероб', price: '150 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться', kk: 'Жазылу', en: 'Book' }, services: [{ name: 'Онлайн-консультация', duration: 60, price: 15000 }, { name: 'Разбор гардероба', duration: 180, price: 50000 }] } },
      { type: 'socials', content: { links: [{ platform: 'instagram', url: 'https://instagram.com/stylist_kamila' }, { platform: 'pinterest', url: 'https://pinterest.com/stylekamila' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77071234567' }, { type: 'instagram', value: 'stylist_kamila' }] } }
    ]
  },
  {
    slug: 'showroom_almaty',
    title: 'Showroom ALM',
    description: 'Казахстанские дизайнеры в одном месте 🛍️',
    niche: 'fashion',
    avatarUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    avatarStyle: { type: 'solid', color: '#0F172A' },
    themeSettings: {
      backgroundColor: '#FAFAFA',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Showroom ALM', kk: 'Showroom ALM', en: 'Showroom ALM' }, bio: { ru: 'Мультибрендовый шоурум. Одежда и аксессуары от казахстанских дизайнеров. Эксклюзивные коллекции.', kk: 'Мультибрендтік шоурум', en: 'Multi-brand showroom' } } },
      { type: 'catalog', content: { title: { ru: '🛍️ Новая коллекция', kk: 'Жаңа коллекция', en: 'New collection' }, items: [{ title: 'Платье AIDA', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', price: 85000 }, { title: 'Костюм DANA', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', price: 120000 }, { title: 'Сумка ALMA', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', price: 45000 }] } },
      { type: 'map', content: { title: { ru: '📍 Адрес шоурума', kk: 'Шоурум мекенжайы', en: 'Showroom address' }, address: 'Алматы, ул. Панфилова 83' } },
      { type: 'socials', content: { links: [{ platform: 'instagram', url: 'https://instagram.com/showroom_alm' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77081234567' }, { type: 'instagram', value: 'showroom_alm' }] } }
    ]
  },
  // Travel - 2 accounts
  {
    slug: 'travel_with_azat',
    title: 'Путешествия с Азатом',
    description: 'Авторские туры по Казахстану 🏔️',
    niche: 'travel',
    avatarUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=200',
    avatarStyle: { type: 'gradient', colors: ['#0EA5E9', '#0284C7'] },
    themeSettings: {
      backgroundColor: '#F0F9FF',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Путешествия с Азатом', kk: 'Азатпен саяхат', en: 'Travel with Azat' }, bio: { ru: 'Авторские туры по Казахстану. Чарынский каньон, Кольсай, Тургень, Алтын-Эмель. Группы и индивидуальные туры.', kk: 'Қазақстан бойынша авторлық турлар', en: 'Author tours in Kazakhstan' } } },
      { type: 'catalog', content: { title: { ru: '🏔️ Ближайшие туры', kk: 'Жақындағы турлар', en: 'Upcoming tours' }, items: [{ title: 'Чарынский каньон', image: 'https://images.unsplash.com/photo-1682687221248-3116ba6ab483?w=400', price: 25000, description: '1 день' }, { title: 'Озёра Кольсай', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', price: 35000, description: '2 дня' }] } },
      { type: 'pricing', content: { title: { ru: '💰 Стоимость туров', kk: 'Тур бағасы', en: 'Tour prices' }, items: [{ name: 'Чарын (1 день)', price: '25 000 ₸' }, { name: 'Кольсай (2 дня)', price: '35 000 ₸' }, { name: 'Алтын-Эмель (2 дня)', price: '40 000 ₸' }, { name: 'Индивидуальный тур', price: 'по запросу' }] } },
      { type: 'booking', content: { title: { ru: '📅 Забронировать тур', kk: 'Турды брондау', en: 'Book a tour' }, services: [{ name: 'Чарынский каньон', duration: 720, price: 25000 }, { name: 'Кольсай (2 дня)', duration: 1440, price: 35000 }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77091234567' }, { type: 'telegram', value: 'travel_azat' }] } }
    ]
  },
  {
    slug: 'tour_agency_nomad',
    title: 'Nomad Travel',
    description: 'Туристическое агентство. Весь мир! ✈️',
    niche: 'travel',
    avatarUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200',
    avatarStyle: { type: 'solid', color: '#7C3AED' },
    themeSettings: {
      backgroundColor: '#FAF5FF',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Nomad Travel', kk: 'Nomad Travel', en: 'Nomad Travel' }, bio: { ru: 'Туристическое агентство. Пляжный отдых, экскурсионные туры, визы, авиабилеты. Работаем с 2010 года.', kk: 'Туристік агенттік', en: 'Travel agency' } } },
      { type: 'catalog', content: { title: { ru: '✈️ Горящие туры', kk: 'Ыстық турлар', en: 'Hot deals' }, items: [{ title: 'Турция, Анталья', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', price: 350000, description: '7 ночей, всё включено' }, { title: 'ОАЭ, Дубай', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', price: 450000, description: '5 ночей' }, { title: 'Таиланд, Пхукет', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400', price: 500000, description: '10 ночей' }] } },
      { type: 'form', content: { title: { ru: '📝 Подобрать тур', kk: 'Тур таңдау', en: 'Find a tour' }, fields: [{ name: 'name', label: 'Имя', type: 'text', required: true }, { name: 'phone', label: 'Телефон', type: 'tel', required: true }, { name: 'destination', label: 'Куда хотите', type: 'text' }, { name: 'dates', label: 'Желаемые даты', type: 'text' }] } },
      { type: 'map', content: { title: { ru: '📍 Наш офис', kk: 'Біздің кеңсе', en: 'Our office' }, address: 'Алматы, пр. Достык 89, офис 301' } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77011234567' }, { type: 'telegram', value: 'nomad_travel_kz' }] } }
    ]
  },
  // Real Estate - 2 accounts
  {
    slug: 'realtor_bekzat',
    title: 'Риелтор Бекзат',
    description: 'Недвижимость в Алматы и области 🏠',
    niche: 'realestate',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    avatarStyle: { type: 'solid', color: '#1E40AF' },
    themeSettings: {
      backgroundColor: '#EFF6FF',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Риелтор Бекзат', kk: 'Риелтор Бекзат', en: 'Realtor Bekzat' }, bio: { ru: 'Профессиональный риелтор. Покупка, продажа, аренда недвижимости. Юридическое сопровождение сделок.', kk: 'Кәсіби риелтор', en: 'Professional realtor' } } },
      { type: 'catalog', content: { title: { ru: '🏠 Актуальные объекты', kk: 'Өзекті нысандар', en: 'Current listings' }, items: [{ title: '3-комн. квартира, Алмалы', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', price: 45000000 }, { title: '2-комн. квартира, Бостандык', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', price: 35000000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Услуги', kk: 'Қызметтер', en: 'Services' }, items: [{ name: 'Покупка недвижимости', price: '1% от сделки' }, { name: 'Продажа недвижимости', price: '2% от сделки' }, { name: 'Аренда', price: '50% от аренды' }] } },
      { type: 'booking', content: { title: { ru: '📅 Записаться на просмотр', kk: 'Көруге жазылу', en: 'Schedule a viewing' }, services: [{ name: 'Консультация', duration: 30, price: 0 }, { name: 'Показ объекта', duration: 60, price: 0 }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77021234567' }, { type: 'telegram', value: 'realtor_bekzat' }] } }
    ]
  },
  {
    slug: 'realty_astana',
    title: 'Realty Astana',
    description: 'Агентство недвижимости в Астане 🏢',
    niche: 'realestate',
    avatarUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200',
    avatarStyle: { type: 'gradient', colors: ['#0D9488', '#0F766E'] },
    themeSettings: {
      backgroundColor: '#F0FDFA',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Realty Astana', kk: 'Realty Astana', en: 'Realty Astana' }, bio: { ru: 'Агентство недвижимости №1 в Астане. Жилая и коммерческая недвижимость. Новостройки и вторичка.', kk: 'Астанадағы №1 жылжымайтын мүлік агенттігі', en: 'Real estate agency #1 in Astana' } } },
      { type: 'catalog', content: { title: { ru: '🏢 Новостройки', kk: 'Жаңа құрылыстар', en: 'New buildings' }, items: [{ title: 'ЖК "Expo City"', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400', description: 'от 350 000 ₸/м²' }, { title: 'ЖК "Green Park"', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', description: 'от 400 000 ₸/м²' }] } },
      { type: 'form', content: { title: { ru: '📝 Подобрать квартиру', kk: 'Пәтер таңдау', en: 'Find an apartment' }, fields: [{ name: 'name', label: 'Имя', type: 'text', required: true }, { name: 'phone', label: 'Телефон', type: 'tel', required: true }, { name: 'rooms', label: 'Количество комнат', type: 'select', options: ['1', '2', '3', '4+'] }, { name: 'budget', label: 'Бюджет', type: 'text' }] } },
      { type: 'map', content: { title: { ru: '📍 Наш офис', kk: 'Біздің кеңсе', en: 'Our office' }, address: 'Астана, пр. Мангилик Ел 55/22' } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77031234567' }, { type: 'telegram', value: 'realty_astana' }] } }
    ]
  },
  // Events - 2 accounts
  {
    slug: 'event_planner_zhanna',
    title: 'Event Жанна',
    description: 'Организация свадеб и праздников 🎉',
    niche: 'events',
    avatarUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200',
    avatarStyle: { type: 'gradient', colors: ['#F472B6', '#EC4899'] },
    themeSettings: {
      backgroundColor: '#FDF2F8',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'serif'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Event Жанна', kk: 'Event Жанна', en: 'Event Zhanna' }, bio: { ru: 'Event-менеджер. Организация свадеб, юбилеев, корпоративов. 150+ успешных мероприятий. Полный цикл.', kk: 'Іс-шара менеджері', en: 'Event manager' } } },
      { type: 'catalog', content: { title: { ru: '🎉 Наши мероприятия', kk: 'Біздің іс-шаралар', en: 'Our events' }, items: [{ title: 'Свадьба в европейском стиле', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400' }, { title: 'Юбилей на 100 гостей', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' }] } },
      { type: 'pricing', content: { title: { ru: '💰 Пакеты услуг', kk: 'Қызмет пакеттері', en: 'Service packages' }, items: [{ name: 'Координация дня', price: 'от 100 000 ₸' }, { name: 'Частичная организация', price: 'от 300 000 ₸' }, { name: 'Под ключ', price: 'от 500 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Бесплатная консультация', kk: 'Тегін кеңес', en: 'Free consultation' }, services: [{ name: 'Знакомство и обсуждение', duration: 60, price: 0 }] } },
      { type: 'testimonial', content: { title: { ru: '💕 Отзывы', kk: 'Пікірлер', en: 'Reviews' }, items: [{ author: 'Асель и Нурлан', text: 'Жанна организовала нашу свадьбу мечты! Всё было идеально!' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77041234567' }, { type: 'instagram', value: 'event_zhanna' }] } }
    ]
  },
  {
    slug: 'animator_kids',
    title: 'Аниматоры Kids Party',
    description: 'Детские праздники и шоу-программы 🎈',
    niche: 'events',
    avatarUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=200',
    avatarStyle: { type: 'gradient', colors: ['#FBBF24', '#F59E0B'] },
    themeSettings: {
      backgroundColor: '#FFFBEB',
      textColor: '#1F1F1F',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Kids Party', kk: 'Kids Party', en: 'Kids Party' }, bio: { ru: 'Аниматоры на детские праздники. Более 50 персонажей, шоу мыльных пузырей, квесты, аквагрим.', kk: 'Балалар мерекелеріне аниматорлар', en: 'Animators for children\'s parties' } } },
      { type: 'catalog', content: { title: { ru: '🎈 Наши персонажи', kk: 'Біздің кейіпкерлер', en: 'Our characters' }, items: [{ title: 'Человек-паук', image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400', price: 30000 }, { title: 'Принцессы Disney', image: 'https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=400', price: 35000 }] } },
      { type: 'pricing', content: { title: { ru: '💰 Прайс', kk: 'Бағалар', en: 'Prices' }, items: [{ name: 'Аниматор (1 час)', price: '25 000 ₸' }, { name: '2 аниматора (2 часа)', price: '60 000 ₸' }, { name: 'Шоу мыльных пузырей', price: '20 000 ₸' }, { name: 'Аквагрим (за ребёнка)', price: '2 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Забронировать аниматора', kk: 'Аниматорды брондау', en: 'Book an animator' }, services: [{ name: '1 аниматор (1 час)', duration: 60, price: 25000 }, { name: '2 аниматора (2 часа)', duration: 120, price: 60000 }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77051234567' }, { type: 'instagram', value: 'kids_party_kz' }] } }
    ]
  },
  // Services - 2 accounts
  {
    slug: 'cleaning_crystal',
    title: 'Клининг Crystal',
    description: 'Профессиональная уборка квартир и офисов 🧹',
    niche: 'services',
    avatarUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200',
    avatarStyle: { type: 'solid', color: '#0EA5E9' },
    themeSettings: {
      backgroundColor: '#F0F9FF',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Клининг Crystal', kk: 'Crystal клинингі', en: 'Crystal Cleaning' }, bio: { ru: 'Профессиональный клининг. Уборка квартир, офисов, после ремонта. Химчистка мебели и ковров.', kk: 'Кәсіби клининг', en: 'Professional cleaning' } } },
      { type: 'pricing', content: { title: { ru: '🧹 Услуги и цены', kk: 'Қызметтер мен бағалар', en: 'Services and prices' }, items: [{ name: 'Уборка 1-комн. квартиры', price: '15 000 ₸' }, { name: 'Уборка 2-комн. квартиры', price: '20 000 ₸' }, { name: 'Генеральная уборка', price: 'от 30 000 ₸' }, { name: 'После ремонта', price: 'от 50 000 ₸' }, { name: 'Химчистка дивана', price: 'от 15 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Заказать уборку', kk: 'Тазалау тапсырыс беру', en: 'Order cleaning' }, services: [{ name: 'Стандартная уборка', duration: 180, price: 15000 }, { name: 'Генеральная уборка', duration: 300, price: 30000 }] } },
      { type: 'testimonial', content: { title: { ru: '⭐ Отзывы', kk: 'Пікірлер', en: 'Reviews' }, items: [{ author: 'Айгуль К.', text: 'Заказываю уборку каждую неделю. Всегда чисто и аккуратно!' }, { author: 'Марат Д.', text: 'Отмыли квартиру после ремонта — результат превзошёл ожидания.' }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77061234567' }, { type: 'telegram', value: 'cleaning_crystal' }] } }
    ]
  },
  {
    slug: 'handyman_sergey',
    title: 'Мастер Сергей',
    description: 'Муж на час. Ремонт и бытовые услуги 🔧',
    niche: 'services',
    avatarUrl: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=200',
    avatarStyle: { type: 'gradient', colors: ['#F97316', '#EA580C'] },
    themeSettings: {
      backgroundColor: '#FFF7ED',
      textColor: '#0F172A',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    },
    blocks: [
      { type: 'profile', content: { name: { ru: 'Мастер Сергей', kk: 'Шебер Сергей', en: 'Handyman Sergey' }, bio: { ru: 'Мастер на все руки. Сантехника, электрика, сборка мебели, мелкий ремонт. Выезд в день обращения.', kk: 'Барлық қолөнер шебері', en: 'Handyman' } } },
      { type: 'pricing', content: { title: { ru: '🔧 Услуги', kk: 'Қызметтер', en: 'Services' }, items: [{ name: 'Вызов мастера', price: '5 000 ₸' }, { name: 'Установка смесителя', price: '8 000 ₸' }, { name: 'Замена розетки', price: '5 000 ₸' }, { name: 'Сборка мебели', price: 'от 10 000 ₸' }, { name: 'Навеска карниза', price: '5 000 ₸' }] } },
      { type: 'booking', content: { title: { ru: '📅 Вызвать мастера', kk: 'Шебер шақыру', en: 'Call a handyman' }, services: [{ name: 'Вызов мастера', duration: 60, price: 5000 }] } },
      { type: 'messenger', content: { messengers: [{ type: 'whatsapp', value: '+77071234567' }, { type: 'telegram', value: 'handyman_sergey' }] } }
    ]
  }
]
