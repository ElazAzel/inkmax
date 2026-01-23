import { describe, expect, it } from 'vitest';
import { validateEventBlock } from '@/lib/block-validators';

describe('validateEventBlock', () => {
  it('returns error when title missing', () => {
    const result = validateEventBlock({ formFields: [] });
    expect(result).toContain('Event title');
  });

  it('returns null when title and labels are provided', () => {
    const result = validateEventBlock({
      title: { ru: 'Событие', en: 'Event', kk: 'Іс-шара' },
      formFields: [
        { id: 'name', label_i18n: { ru: 'Имя', en: 'Name', kk: 'Аты' } },
      ],
    });
    expect(result).toBeNull();
  });
});
