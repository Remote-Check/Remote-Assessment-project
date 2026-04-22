import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryLearningTask } from '../MemoryLearningTask';

describe('MemoryLearningTask', () => {
  it('should flow through instructions, display, and recall phases', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<MemoryLearningTask onComplete={onComplete} />);
    
    // 1. Instruction Phase - check for multiple instances as title appears in header and box
    expect(screen.getAllByText('memory.learning_title')[0]).toBeInTheDocument();
    
    // Click Next to start display
    fireEvent.click(screen.getByText('common.next'));
    
    // 2. Display Phase (Words shown one by one)
    // First word
    expect(screen.getByText('memory.word1')).toBeInTheDocument();
    
    // Fast forward to finish display (1500ms * 5 words)
    act(() => {
      vi.advanceTimersByTime(1500 * 5);
    });
    
    // 3. Recall Phase
    expect(screen.getByText('memory.recall_instruction')).toBeInTheDocument();
    
    // Select a word
    const wordBtn = screen.getByText('memory.word1');
    fireEvent.click(wordBtn);
    
    // Click Next to move to Trial 2
    fireEvent.click(screen.getByText('common.next'));
    
    // Should return to instructions for Trial 2
    expect(screen.getAllByText('memory.learning_title')[0]).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
