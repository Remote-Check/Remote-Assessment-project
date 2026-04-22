import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DigitSpanTask } from '../DigitSpanTask';

describe('DigitSpanTask', () => {
  it('should flow through forward and backward digit span tasks', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<DigitSpanTask onComplete={onComplete} />);
    
    // 1. Forward Instructions
    expect(screen.getAllByText('attention.digit_span_title')[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.next'));
    
    // 2. Display Phase (Forward: 2-1-8-5-4)
    expect(screen.getByText('2')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('1')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(4000); });
    
    // 3. Keypad Phase
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByLabelText('attention.keypad_submit'));
    
    // 4. Backward Instructions
    expect(screen.getByText('attention.digit_span_backward_instr')).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
