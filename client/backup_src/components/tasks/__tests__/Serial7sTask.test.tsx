import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Serial7sTask } from '../Serial7sTask';

describe('Serial7sTask', () => {
  it('should flow through the serial 7s subtraction task', () => {
    const onComplete = vi.fn();
    render(<Serial7sTask onComplete={onComplete} />);
    
    // 1. Instructions
    expect(screen.getAllByText('attention.serial_7s_title')[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.next'));
    
    // 2. First Subtraction (100 - 7)
    expect(screen.getByText('attention.serial_7s_prompt')).toBeInTheDocument();
    
    // Enter 93
    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByLabelText('attention.keypad_submit'));
    
    // 3. Second Subtraction (93 - 7)
    expect(screen.getByText('attention.serial_7s_next_prompt')).toBeInTheDocument();
    
    // Complete remaining steps (Total 5 subtractions)
    for (let i = 0; i < 4; i++) {
        fireEvent.click(screen.getByText('1')); // Placeholder input
        fireEvent.click(screen.getByLabelText('attention.keypad_submit'));
    }
    
    expect(onComplete).toHaveBeenCalled();
  });
});
