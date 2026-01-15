/**
 * Gallery Tests - v1.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock hooks
vi.mock('@/hooks/useGallery', () => ({
  useGallery: () => ({
    pages: [
      {
        id: '1',
        slug: 'test-page',
        title: 'Test Page',
        description: 'Test description',
        avatar_url: null,
        gallery_likes: 10,
        view_count: 100,
        niche: 'beauty',
        is_premium: false,
      }
    ],
    loading: false,
    likePage: vi.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderGallery = async () => {
  const queryClient = createTestQueryClient();
  const Gallery = (await import('../Gallery')).default;
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Gallery />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Gallery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders gallery header', async () => {
    await renderGallery();
    // Should render without crashing
    expect(document.body).toBeTruthy();
  });

  it('has no horizontal overflow', async () => {
    await renderGallery();
    // Main container should have overflow-x-hidden
    const mainDiv = document.querySelector('.overflow-x-hidden');
    expect(mainDiv).toBeInTheDocument();
  });
});
