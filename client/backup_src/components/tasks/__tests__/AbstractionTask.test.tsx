import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AbstractionTask } from '../AbstractionTask';

describe('AbstractionTask', () => {
  it('should flow through the abstraction word pairs', () => {
    const onComplete = vi.fn();
    render(<AbstractionTask onComplete={onComplete} />);
    
    // 1. Example Pair (Orange/Banana)
    expect(screen.getByText('abstraction.pair_example')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.next'));
    
    // 2. Pair 1 (Train/Bicycle)
    expect(screen.getByText('abstraction.pair1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('abstraction.correct'));
    
    // 3. Pair 2 (Watch/Ruler)
    expect(screen.getByText('abstraction.pair2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('abstraction.correct'));
    
    expect(onComplete).toHaveBeenCalledWith({
      pair1: true,
      pair2: true
    });
  });
});
