import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DelayedRecallTask } from '../DelayedRecallTask';

describe('DelayedRecallTask', () => {
  it('should render recall instruction and allow word selection', () => {
    const onComplete = vi.fn();
    render(<DelayedRecallTask onComplete={onComplete} />);
    
    // 1. Check Instruction
    expect(screen.getByText('memory.recall_instruction')).toBeInTheDocument();
    
    // 2. Select words
    const word1 = screen.getByText('memory.word1');
    fireEvent.click(word1);
    
    // 3. Click Finish
    fireEvent.click(screen.getByText('common.finish'));
    
    expect(onComplete).toHaveBeenCalled();
  });
});
