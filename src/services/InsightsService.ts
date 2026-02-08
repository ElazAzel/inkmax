import { Block } from '@/types/page';
import { AnalyticsSummary } from '@/hooks/usePageAnalytics';

export interface InsightAction {
    type: 'add' | 'optimize' | 'duplicate' | 'info';
    blockId?: string;
    data?: Record<string, unknown>;
}

export interface InsightSuggestion {
    id: string;
    type: 'warning' | 'add' | 'optimize' | 'info';
    title: string;
    description: string;
    action: InsightAction | null;
    impact: 'high' | 'medium' | 'low';
}

export class InsightsService {
    static generateSuggestions(
        blocks: Block[],
        stats: AnalyticsSummary,
        translations: (key: string, variables?: Record<string, any>) => string
    ): InsightSuggestion[] {
        const suggestions: InsightSuggestion[] = [];

        const hasPricing = blocks.some((b) => b.type === 'pricing');
        const hasTestimonials = blocks.some((b) => b.type === 'testimonial');
        const hasContactForm = blocks.some((b) => b.type === 'form');

        const ctr = stats.totalViews > 0 ? (stats.totalClicks / stats.totalViews) * 100 : 0;
        const bounceRate = stats.bounceRate;

        // 1. CTR-based insights
        if (ctr < 5 && stats.totalViews > 10) {
            suggestions.push({
                id: 'low-ctr',
                type: 'warning',
                title: translations('dashboard.insights.lowCtr'),
                description: translations('dashboard.insights.lowCtrDesc', { ctr: ctr.toFixed(1) }),
                action: { type: 'add', data: { blockType: 'button' } },
                impact: 'high',
            });
        }

        // 2. Bounce rate insights
        if (bounceRate > 70 && stats.totalViews > 10) {
            suggestions.push({
                id: 'high-bounce',
                type: 'warning',
                title: translations('dashboard.insights.highBounce'),
                description: translations('dashboard.insights.highBounceDesc', { bounceRate: bounceRate.toFixed(0) }),
                action: { type: 'optimize', data: { action: 'improve_engagement' } },
                impact: 'high',
            });
        }

        // 3. Conversion-based insights
        if (!hasContactForm && stats.totalViews > 50 && stats.totalConversions === 0) {
            suggestions.push({
                id: 'add-form',
                type: 'add',
                title: translations('dashboard.insights.addForm'),
                description: translations('dashboard.insights.addFormDesc'),
                action: { type: 'add', data: { blockType: 'form' } },
                impact: 'high',
            });
        }

        // 4. Content gaps
        if (!hasPricing && blocks.length > 3) {
            suggestions.push({
                id: 'add-pricing',
                type: 'add',
                title: translations('dashboard.insights.addPricing'),
                description: translations('dashboard.insights.addPricingDesc'),
                action: { type: 'add', data: { blockType: 'pricing' } },
                impact: 'high',
            });
        }

        if (!hasTestimonials && blocks.length > 5) {
            suggestions.push({
                id: 'add-testimonials',
                type: 'add',
                title: translations('dashboard.insights.addTestimonials'),
                description: translations('dashboard.insights.addTestimonialsDesc'),
                action: { type: 'add', data: { blockType: 'testimonial' } },
                impact: 'medium',
            });
        }

        // 5. Performance-based optimization
        if (stats.topBlocks && stats.topBlocks.length > 0 && stats.topBlocks[0].ctr > 15) {
            suggestions.push({
                id: 'duplicate-top',
                type: 'optimize',
                title: translations('dashboard.insights.duplicateTop'),
                description: translations('dashboard.insights.duplicateTopDesc', {
                    title: stats.topBlocks[0].blockTitle,
                    ctr: stats.topBlocks[0].ctr.toFixed(0)
                }),
                action: { type: 'duplicate', blockId: stats.topBlocks[0].blockId },
                impact: 'medium',
            });
        }

        return suggestions.slice(0, 4);
    }
}
