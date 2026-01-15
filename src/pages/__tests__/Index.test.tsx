/**
 * Index (Landing Page) Tests - v1.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from '../Index';

// Mock hooks
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('@/components/landing/LandingGallerySection', () => ({
  LandingGallerySection: () => <div data-testid="gallery-section">Gallery</div>,
}));

vi.mock('@/components/landing/FAQSection', () => ({
  FAQSection: () => <div data-testid="faq-section">FAQ</div>,
}));

const renderIndex = () => {
  return render(
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  );
};

describe('Index (Landing Page)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero section', () => {
    renderIndex();
    expect(screen.getByText(/LinkMAX/)).toBeInTheDocument();
  });

  it('renders navigation', () => {
    renderIndex();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    renderIndex();
    // There should be a "get started" button
    const ctaButtons = screen.getAllByRole('button');
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('has no horizontal overflow', () => {
    renderIndex();
    // Check main container has overflow-x-hidden
    const mainDiv = document.querySelector('.overflow-x-hidden');
    expect(mainDiv).toBeInTheDocument();
  });
});
