import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VigilanceTask } from '../VigilanceTask';

describe('VigilanceTask', () => {
  it('should flow through the vigilance letter tapping task', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<VigilanceTask onComplete={onComplete} />);
    
    // 1. Instructions
    expect(screen.getAllByText('attention.vigilance_title')[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.next'));
    
    // 2. Tapping Phase
    const tapBtn = screen.getByText('attention.vigilance_tap_btn');
    
    // First letter 'פ' (no tap expected but we can tap)
    act(() => { vi.advanceTimersByTime(1000); });
    
    // Third letter 'א' (tap expected)
    act(() => { vi.advanceTimersByTime(2000); }); 
    fireEvent.click(tapBtn);
    
    // Fast forward to end of sequence
    act(() => { vi.advanceTimersByTime(30000); });
    
    expect(onComplete).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
