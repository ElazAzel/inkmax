import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function BlocksShowcaseSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const blocks = [
    { name: t('landingV5.blocks.profile', 'Профиль'), emoji: '👤', pro: false },
    { name: t('landingV5.blocks.links', 'Ссылки'), emoji: '🔗', pro: false },
    { name: t('landingV5.blocks.pricing', 'Прайс'), emoji: '💰', pro: false },
    { name: t('landingV5.blocks.form', 'Форма'), emoji: '📝', pro: false },
    { name: t('landingV5.blocks.booking', 'Запись'), emoji: '📅', pro: true },
    { name: t('landingV5.blocks.faq', 'FAQ'), emoji: '❓', pro: false },
    { name: t('landingV5.blocks.testimonials', 'Отзывы'), emoji: '⭐', pro: true },
    { name: t('landingV5.blocks.map', 'Карта'), emoji: '📍', pro: true },
    { name: t('landingV5.blocks.products', 'Товары'), emoji: '🛍️', pro: true },
    { name: t('landingV5.blocks.video', 'Видео'), emoji: '🎬', pro: false },
    { name: t('landingV5.blocks.gallery', 'Галерея'), emoji: '🖼️', pro: false },
    { name: t('landingV5.blocks.socials', 'Соцсети'), emoji: '📱', pro: false },
    { name: t('landingV5.blocks.messenger', 'Мессенджеры'), emoji: '💬', pro: false },
    { name: t('landingV5.blocks.countdown', 'Таймер'), emoji: '⏰', pro: true },
  ];

  return (
    <section ref={ref} className="py-12 px-5">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-6">
          <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            <Layers className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.blocks.badge', '25+ блоков')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.blocks.title', 'Готовые блоки')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('landingV5.blocks.subtitle', 'Drag & drop. Работает на любом устройстве.')}
          </p>
        </div>

        {/* Horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {blocks.map((block, i) => (
            <div 
              key={i}
              className={cn(
                "relative flex-shrink-0 flex items-center gap-2 py-2 px-3 rounded-xl bg-card border border-border/50 text-sm font-medium transition-all hover:border-primary/30",
                isVisible && "animate-in fade-in-0"
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span>{block.emoji}</span>
              {block.name}
              {block.pro && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  Pro
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
