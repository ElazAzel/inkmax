import { describe, it, expect } from 'vitest';
import { createBlock } from '@/lib/block-factory';
import { buildBlocksPayload } from '@/lib/page-blocks';

const titleFromBlock = (block: { type: string }) => (block.type === 'event' ? 'Event title' : null);

describe('buildBlocksPayload', () => {
  it('builds payload for event blocks', () => {
    const eventBlock = createBlock('event');
    const payload = buildBlocksPayload([eventBlock], titleFromBlock);

    expect(payload).toHaveLength(1);
    expect(payload[0].type).toBe('event');
    expect(payload[0].title).toBe('Event title');
    expect(payload[0].content).toMatchObject({
      type: 'event',
      eventId: eventBlock.eventId,
    });
    expect(payload[0].schedule).toBeNull();
  });
});
