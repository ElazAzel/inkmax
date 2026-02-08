export type PageNiche =
    | 'fitness'
    | 'real_estate'
    | 'marketing'
    | 'creative'
    | 'ecommerce'
    | 'education'
    | 'health'
    | 'tech'
    | 'beauty'
    | 'coaching'
    | 'other';

export type PageGoal =
    | 'collect_leads'
    | 'sell_product'
    | 'schedule_appointment'
    | 'showcase_portfolio'
    | 'grow_social_media'
    | 'newsletter_signup';

export interface PageGenerationRequest {
    niche: PageNiche;
    goal: PageGoal;
    language?: string; // e.g., 'en', 'ru'
}
