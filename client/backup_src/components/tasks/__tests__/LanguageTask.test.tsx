import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageTask } from '../LanguageTask';

describe('LanguageTask', () => {
  it('should flow through sentence repetition and verbal fluency', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<LanguageTask onComplete={onComplete} />);
    
    // 1. Sentence 1 Repetition
    expect(screen.getByText('language.rep_instr')).toBeInTheDocument();
    expect(screen.getByText('language.s1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('language.correct'));
    
    // 2. Sentence 2 Repetition
    expect(screen.getByText('language.s2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('language.correct'));
    
    // 3. Verbal Fluency Instructions
    expect(screen.getByText('language.fluency_instr')).toBeInTheDocument();
    fireEvent.click(screen.getByText('language.start_timer'));
    
    // 4. Timer Running
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByText(/30/)).toBeInTheDocument();
    
    // 5. Timer Finish
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    
    // 6. Record Count
    expect(screen.getByText('language.words_count')).toBeInTheDocument();
    const incrementBtn = screen.getByLabelText('increment');
    fireEvent.click(incrementBtn);
    
    // Click Finish
    fireEvent.click(screen.getByText('common.finish'));
    
    expect(onComplete).toHaveBeenCalledWith({
      rep1: true,
      rep2: true,
      fluencyCount: 1
    });
    vi.useRealTimers();
  });
});
