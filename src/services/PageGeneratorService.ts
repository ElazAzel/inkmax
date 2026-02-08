import { BaseBlock, BlockType, generateBlockId } from '@/domain/entities/Block';
import { PageGoal, PageNiche } from '@/domain/value-objects/PageGeneration';
import { FormBlock } from '@/types/page';

export class PageGeneratorService {

    static generateBlocks(niche: PageNiche, goal: PageGoal, language: string = 'en'): BaseBlock[] {
        const blocks: BaseBlock[] = [];

        // 1. Always add a Profile/Header block first
        blocks.push(this.createBlock('profile', {
            blockStyle: { padding: 'lg', backgroundColor: '#ffffff' }
        }));

        // 2. Main CTA based on Goal
        switch (goal) {
            case 'collect_leads':
                blocks.push(this.createBlock('text', {
                    // In a real implementation, we'd add actual text content in a separate 'content' field if the Block entity supports it.
                    // For now, assuming BaseBlock is just structure.
                }));
                blocks.push(this.createFormBlock(niche));
                break;
            case 'sell_product':
                blocks.push(this.createBlock('product'));
                blocks.push(this.createBlock('button')); // "Buy Now"
                break;
            case 'schedule_appointment':
                blocks.push(this.createBlock('booking'));
                break;
            case 'showcase_portfolio':
                blocks.push(this.createBlock('carousel'));
                break;
            case 'grow_social_media':
                blocks.push(this.createBlock('socials'));
                break;
            case 'newsletter_signup':
                blocks.push(this.createBlock('newsletter'));
                break;
        }

        // 3. Niche specific content
        switch (niche) {
            case 'real_estate':
                blocks.push(this.createBlock('map')); // Show location
                blocks.push(this.createBlock('image')); // Property showcase
                break;
            case 'fitness':
                blocks.push(this.createBlock('before_after'));
                blocks.push(this.createBlock('pricing'));
                break;
            case 'beauty':
                blocks.push(this.createBlock('carousel'));
                blocks.push(this.createBlock('testimonial'));
                break;
            // ... translate others ...
        }

        // 4. Fallback/General blocks
        if (blocks.length < 4) {
            blocks.push(this.createBlock('socials'));
            blocks.push(this.createFormBlock(niche)); // fallback form
        }

        return blocks;
    }



    private static createBlock(type: BlockType, result: Partial<BaseBlock> = {}): BaseBlock {
        return {
            id: generateBlockId(type),
            type,
            createdAt: new Date().toISOString(),
            ...result
        };
    }

    private static createFormBlock(niche: PageNiche): any {
        const base = this.createBlock('form') as any;

        const standardFields = [
            { name: 'Name', type: 'text', required: true, placeholder: 'Your Name' },
            { name: 'Phone', type: 'phone', required: true, placeholder: '+1 (555) 000-0000' }
        ];

        let customFields: any[] = [];
        let title = 'Contact Us';
        let buttonText = 'Send Message';

        switch (niche) {
            case 'real_estate':
                title = 'Book a Viewing';
                buttonText = 'Request Viewing';
                customFields = [
                    { name: 'Property Interest', type: 'text', required: false, placeholder: 'Which property?' },
                    { name: 'Budget', type: 'text', required: false, placeholder: 'Your budget range' }
                ];
                break;
            case 'fitness':
                title = 'Start Your Transformation';
                buttonText = 'Get Started';
                customFields = [
                    { name: 'Goal', type: 'textarea', required: false, placeholder: 'Weight loss, muscle gain, etc.' }
                ];
                break;
            case 'coaching':
                title = 'Apply for Coaching';
                buttonText = 'Apply Now';
                customFields = [
                    { name: 'Current Challenge', type: 'textarea', required: true, placeholder: 'What are you struggling with?' }
                ];
                break;
            default:
                customFields = [
                    { name: 'Message', type: 'textarea', required: false, placeholder: 'How can we help?' }
                ];
        }

        return {
            ...base,
            title,
            buttonText,
            submitEmail: '', // user will set this
            fields: [...standardFields, ...customFields]
        };
    }
}
