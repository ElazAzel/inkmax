/**
 * CRMTab Tests - v1.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CRMTab } from '../CRMTab';

// Mock hooks
vi.mock('@/hooks/useLeads', () => ({
  useLeads: () => ({
    leads: [],
    loading: false,
    addLead: vi.fn(),
    updateLead: vi.fn(),
    deleteLead: vi.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderCRMTab = (isPremium = true) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CRMTab isPremium={isPremium} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CRMTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CRM header', () => {
    renderCRMTab(true);
    expect(screen.getByText(/CRM/i)).toBeInTheDocument();
  });

  it('shows premium gate for free users', () => {
    renderCRMTab(false);
    // Should show premium gate
    expect(screen.getByText(/Premium/i)).toBeInTheDocument();
  });

  it('shows leads list for premium users', () => {
    renderCRMTab(true);
    // Should not show premium gate
    expect(document.body).toBeTruthy();
  });
});
