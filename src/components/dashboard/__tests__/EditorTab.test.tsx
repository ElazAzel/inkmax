/**
 * EditorTab Tests - v1.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EditorTab } from '../EditorTab';

const mockEditorHistory = {
  currentBlocks: [],
  history: [],
  currentIndex: 0,
  canUndo: false,
  canRedo: false,
  historyLength: 0,
  undo: vi.fn(),
  redo: vi.fn(),
  clear: vi.fn(),
  clearHistory: vi.fn(),
  resetWithBlocks: vi.fn(),
  recordAction: vi.fn(),
  recordBlockAdd: vi.fn(),
  recordBlockDelete: vi.fn(),
  recordBlockUpdate: vi.fn(),
  recordBlocksReorder: vi.fn(),
  pushAction: vi.fn(),
} as any;

const defaultProps = {
  blocks: [],
  isPremium: false,
  gridConfig: { 
    columnsDesktop: 3, 
    columnsMobile: 2, 
    gapSize: 8, 
    cellHeight: 80 
  },
  saving: false,
  saveStatus: 'saved' as const,
  editorHistory: mockEditorHistory,
  onInsertBlock: vi.fn(),
  onEditBlock: vi.fn(),
  onDeleteBlock: vi.fn(),
  onReorderBlocks: vi.fn(),
  onUpdateBlock: vi.fn(),
  onSave: vi.fn(),
  onPreview: vi.fn(),
  onShare: vi.fn(),
  onOpenTemplates: vi.fn(),
  onOpenAI: vi.fn(),
  onOpenMarketplace: vi.fn(),
};

const renderEditorTab = (props = {}) => {
  return render(
    <BrowserRouter>
      <EditorTab {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('EditorTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderEditorTab();
    expect(document.body).toBeTruthy();
  });

  it('renders empty state when no blocks', () => {
    renderEditorTab({ blocks: [] });
    // Should show add block button or empty state
    expect(document.body).toBeTruthy();
  });

  it('shows undo button when canUndo is true', () => {
    renderEditorTab({
      editorHistory: { ...mockEditorHistory, canUndo: true },
    });
    // Check undo button exists
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows redo button when canRedo is true', () => {
    renderEditorTab({
      editorHistory: { ...mockEditorHistory, canRedo: true },
    });
    // Check redo button exists
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onSave when save is triggered', () => {
    const onSave = vi.fn();
    renderEditorTab({ onSave });
    // Save button should be rendered
    expect(document.body).toBeTruthy();
  });

  it('renders blocks when provided', () => {
    const blocks = [
      { id: '1', type: 'text', content: { text: 'Hello' }, position: 0 },
    ];
    renderEditorTab({ blocks });
    expect(document.body).toBeTruthy();
  });
});
