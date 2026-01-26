import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export default function SEOExplainerSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const items = [
    t('landingV5.seo.items.1'),
    t('landingV5.seo.items.2'),
    t('landingV5.seo.items.3'),
    t('landingV5.seo.items.4'),
    t('landingV5.seo.items.5'),
  ];

  return (
    <section ref={ref} className="py-12 px-5">
      <div className={cn(
        "max-w-xl mx-auto transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-8">
          <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            {t('landingV5.seo.badge')}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {t('landingV5.seo.title')}
          </h2>
        </div>

        {/* AI-friendly bullet list */}
        <div className="p-5 rounded-2xl bg-card/60 border border-border/40">
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li 
                key={i} 
                className={cn(
                  "flex items-start gap-3 text-sm",
                  isVisible && "animate-in fade-in-0 slide-in-from-left-4"
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
