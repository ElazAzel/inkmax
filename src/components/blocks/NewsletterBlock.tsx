import { useState } from 'react';
import { Mail, Crown } from 'lucide-react';
import type { NewsletterBlock as NewsletterBlockType } from '@/types/page';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NewsletterBlockProps {
  block: NewsletterBlockType;
}

export function NewsletterBlock({ block }: NewsletterBlockProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Введите корректный email');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In production, this would send to newsletter API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Вы успешно подписались!');
      setEmail('');
    } catch (error) {
      toast.error('Ошибка подписки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">{block.title}</h3>
        <Crown className="h-4 w-4 text-primary ml-auto" />
      </div>
      {block.description && (
        <p className="text-sm text-muted-foreground mb-4">{block.description}</p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="flex-1"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : block.buttonText}
        </Button>
      </form>
    </Card>
  );
}
