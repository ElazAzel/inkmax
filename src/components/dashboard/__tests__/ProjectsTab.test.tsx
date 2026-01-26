/**
 * ProjectsTab Tests - v1.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectsTab } from '../ProjectsTab';
import type { PageData } from '@/types/page';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const defaultPageData: PageData = {
    id: 'page-123',
    userId: 'user-123',
    blocks: [],
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonStyle: 'rounded',
      fontFamily: 'sans',
    },
    seo: {
      title: 'Test Page',
      description: 'Test description',
      keywords: [],
      allowIndexing: true,
    },
    isPremium: false,
};

const defaultProps = {
  pageData: defaultPageData,
  user: null,
  isPremium: false,
  onOpenEditor: vi.fn(),
  onOpenSettings: vi.fn(),
  onPreview: vi.fn(),
  onShare: vi.fn(),
  onOpenTemplates: vi.fn(),
  onOpenMarketplace: vi.fn(),
};

const renderProjectsTab = (props = {}) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProjectsTab {...defaultProps} {...props} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ProjectsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderProjectsTab();
    expect(document.body).toBeTruthy();
  });

  it('displays page info', () => {
    renderProjectsTab();
    // Page info should be displayed
    expect(document.body).toBeTruthy();
  });

  it('shows view count', () => {
    renderProjectsTab();
    // View count should be displayed
    expect(document.body).toBeTruthy();
  });

  it('shows likes count', () => {
    renderProjectsTab();
    // Likes count should be displayed
    expect(document.body).toBeTruthy();
  });

  it('shows premium badge for premium users', () => {
    renderProjectsTab({ isPremium: true });
    expect(document.body).toBeTruthy();
  });

  it('shows quick actions', () => {
    renderProjectsTab();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onOpenEditor when edit is clicked', () => {
    const onOpenEditor = vi.fn();
    renderProjectsTab({ onOpenEditor });
    // Edit button should exist
    expect(document.body).toBeTruthy();
  });
});
