import { memo } from 'react';
import { Star, Crown } from 'lucide-react';
import type { TestimonialBlock as TestimonialBlockType, PageTheme } from '@/types/page';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getShadowClass } from '@/lib/block-utils';

interface TestimonialBlockProps {
  block: TestimonialBlockType;
  theme?: PageTheme;
}

export const TestimonialBlock = memo(function TestimonialBlock({ block, theme }: TestimonialBlockProps) {
  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4"
            style={{ 
              fill: i < rating ? (theme?.accentColor || theme?.textColor) : 'transparent',
              color: i < rating ? (theme?.accentColor || theme?.textColor) : theme?.textColor,
              opacity: i < rating ? 1 : 0.3
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {block.title && (
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg" style={{ color: theme?.textColor }}>{block.title}</h3>
          <Crown className="h-4 w-4" style={{ color: theme?.accentColor || theme?.textColor }} />
        </div>
      )}
      <div className="grid gap-4">
        {block.testimonials.map((testimonial, index) => (
          <Card 
            key={index} 
            className="p-6 border-current/20"
            style={{ 
              backgroundColor: theme?.textColor ? `${theme.textColor}08` : undefined,
              borderColor: theme?.textColor ? `${theme.textColor}33` : undefined
            }}
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback style={{ backgroundColor: theme?.accentColor, color: theme?.backgroundColor }}>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold" style={{ color: theme?.textColor }}>{testimonial.name}</div>
                    {testimonial.role && (
                      <div className="text-sm opacity-60" style={{ color: theme?.textColor }}>{testimonial.role}</div>
                    )}
                  </div>
                  {testimonial.rating && renderStars(testimonial.rating)}
                </div>
                <p className="text-sm opacity-70 italic" style={{ color: theme?.textColor }}>"{testimonial.text}"</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});
