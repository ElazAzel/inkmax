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
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            No images added to carousel
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {block.title && (
        <CardHeader>
          <CardTitle>{block.title}</CardTitle>
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
                  className="aspect-video overflow-hidden bg-muted cursor-pointer"
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
