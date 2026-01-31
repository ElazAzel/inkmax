import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion';

export default function AEOSection() {
  const { t } = useTranslation();

  const audienceItems = t('landingV5.aeo.for.list', { returnObjects: true }) as string[];
  const locationItems = t('landingV5.aeo.where.list', { returnObjects: true }) as string[];
  const quickAnswers = t('landingV5.aeo.answers.items', { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <section className="py-12 px-5 bg-background">
      <div className="max-w-xl mx-auto space-y-8">
        <Reveal direction="up">
          <div className="text-center">
            <Badge className="mb-3 h-6 px-3 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {t('landingV5.aeo.badge')}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {t('landingV5.aeo.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('landingV5.aeo.subtitle')}
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={100}>
          <div className="rounded-2xl border border-border/40 bg-card/50 p-5 space-y-2">
            <h3 className="text-base font-semibold">{t('landingV5.aeo.what.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('landingV5.aeo.what.body')}</p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={150}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
              <h3 className="text-base font-semibold mb-2">{t('landingV5.aeo.for.title')}</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                {audienceItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
              <h3 className="text-base font-semibold mb-2">{t('landingV5.aeo.where.title')}</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                {locationItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
            <h3 className="text-base font-semibold mb-3">{t('landingV5.aeo.answers.title')}</h3>
            <dl className="space-y-3 text-sm text-muted-foreground">
              {quickAnswers.map((item) => (
                <div key={item.q} className="space-y-1">
                  <dt className="font-medium text-foreground">{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
