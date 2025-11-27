import { memo, useState } from 'react';
import { Crown, Send } from 'lucide-react';
import type { FormBlock as FormBlockType, PageTheme } from '@/types/page';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getShadowClass } from '@/lib/block-utils';

interface FormBlockProps {
  block: FormBlockType;
  theme?: PageTheme;
}

export const FormBlock = memo(function FormBlock({ block, theme }: FormBlockProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check required fields
    const missingFields = block.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.name);
    
    if (missingFields.length > 0) {
      toast.error(`Заполните обязательные поля: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In production, this would send to an edge function
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Форма отправлена успешно!');
      setFormData({});
    } catch (error) {
      toast.error('Ошибка отправки формы');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormBlockType['fields'][0]) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required,
      value: formData[field.name] || '',
      onChange: (e: any) => setFormData({ ...formData, [field.name]: e.target.value }),
    };

    switch (field.type) {
      case 'textarea':
        return <Textarea {...commonProps} placeholder={`Введите ${field.name.toLowerCase()}`} />;
      case 'email':
        return <Input {...commonProps} type="email" placeholder="example@email.com" />;
      case 'phone':
        return <Input {...commonProps} type="tel" placeholder="+7 (___) ___-__-__" />;
      default:
        return <Input {...commonProps} type="text" placeholder={`Введите ${field.name.toLowerCase()}`} />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-lg">{block.title}</h3>
        <Crown className="h-4 w-4 text-primary" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {block.fields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            {renderField(field)}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Отправка...' : block.buttonText}
        </Button>
      </form>
    </Card>
  );
});
