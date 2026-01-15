/**
 * Dashboard Tests - v1.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@/hooks/useDashboard', () => ({
  useDashboard: () => ({
    loading: false,
    user: { id: 'test-user' },
    pageData: {
      id: 'test-page',
      blocks: [],
      title: 'Test Page',
      theme: {}
    },
    profileBlock: null,
    isPremium: false,
    premiumTier: 'free',
    premiumLoading: false,
    chatbotContext: '',
    setChatbotContext: vi.fn(),
    save: vi.fn(),
    updatePageDataPartial: vi.fn(),
    updateBlock: vi.fn(),
    updateNiche: vi.fn(),
    handleSignOut: vi.fn(),
    handleApplyTemplate: vi.fn(),
    blockEditor: {
      editingBlock: null,
      editorOpen: false,
      closeEditor: vi.fn(),
      handleSaveBlock: vi.fn(),
      handleInsertBlock: vi.fn(),
    },
    aiState: {
      aiGeneratorOpen: false,
      setAiGeneratorOpen: vi.fn(),
    },
    usernameState: {
      usernameInput: 'testuser',
      setUsernameInput: vi.fn(),
      handleUpdateUsername: vi.fn(),
      saving: false,
    },
    userProfile: {
      profile: null,
      updateEmailNotifications: vi.fn(),
      updateTelegramNotifications: vi.fn(),
    },
  }),
}));

vi.mock('@/hooks/useFreemiumLimits', () => ({
  useFreemiumLimits: () => ({
    canUseCustomPageBackground: () => true,
  }),
}));

vi.mock('@/hooks/useEditorHistory', () => ({
  useEditorHistory: () => ({
    currentBlocks: [],
    history: [],
    currentIndex: 0,
    canUndo: false,
    canRedo: false,
    historyLength: 0,
    undo: vi.fn(),
    redo: vi.fn(),
    clear: vi.fn(),
    recordBlockAdd: vi.fn(),
    recordBlockDelete: vi.fn(),
    recordBlockUpdate: vi.fn(),
    recordBlocksReorder: vi.fn(),
    pushAction: vi.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderDashboard = async () => {
  const queryClient = createTestQueryClient();
  const Dashboard = (await import('../Dashboard')).default;
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders without crashing', async () => {
    await renderDashboard();
    // Dashboard should render content
    expect(document.body).toBeTruthy();
  });

  it('does not show onboarding wizard', async () => {
    await renderDashboard();
    // Onboarding wizard should not be visible
    expect(screen.queryByText('Выберите вашу нишу')).not.toBeInTheDocument();
  });
});
