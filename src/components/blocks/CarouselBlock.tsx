import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { CarouselBlock as CarouselBlockType, PageTheme } from '@/types/page';
import { getShadowClass } from '@/lib/block-utils';

interface CarouselBlockProps {
  block: CarouselBlockType;
  theme?: PageTheme;
}

export const CarouselBlock = memo(function CarouselBlockComponent({ block, theme }: CarouselBlockProps) {
  const autoplayPlugin = block.autoPlay
    ? Autoplay({ delay: block.interval || 3000, stopOnInteraction: true })
    : undefined;

  const handleImageClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (!block.images || block.images.length === 0) {
    return (
      <Card 
        className="border-current/20"
        style={{ 
          backgroundColor: theme?.textColor ? `${theme.textColor}08` : undefined,
          borderColor: theme?.textColor ? `${theme.textColor}33` : undefined
        }}
      >
        <CardContent className="p-6">
          <p className="text-sm opacity-60 text-center" style={{ color: theme?.textColor }}>
            No images added to carousel
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden border-current/20"
      style={{ 
        backgroundColor: theme?.textColor ? `${theme.textColor}08` : undefined,
        borderColor: theme?.textColor ? `${theme.textColor}33` : undefined
      }}
    >
      {block.title && (
        <CardHeader>
          <CardTitle style={{ color: theme?.textColor }}>{block.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={autoplayPlugin ? [autoplayPlugin] : undefined}
          className="w-full"
        >
          <CarouselContent>
            {block.images.map((image, index) => (
              <CarouselItem key={index}>
                <div
                  className="aspect-video overflow-hidden cursor-pointer"
                  style={{ backgroundColor: theme?.textColor ? `${theme.textColor}11` : undefined }}
                  onClick={() => handleImageClick(image.link)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Slide ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {block.images.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
});
