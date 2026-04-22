import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrientationModule } from '../OrientationModule';

describe('OrientationModule', () => {
  it('should flow through the orientation steps', () => {
    const onComplete = vi.fn();
    render(<OrientationModule onComplete={onComplete} />);

    // Step 1
    expect(screen.getByText('orientation.step1_welcome')).toBeInTheDocument();
    
    // Move to Step 2
    fireEvent.click(screen.getByText('common.next'));
    expect(screen.getByText('orientation.step2_navigation')).toBeInTheDocument();

    // Move to Finish
    fireEvent.click(screen.getByText('common.next'));
    expect(screen.getByText('orientation.ready_to_start')).toBeInTheDocument();

    // Complete
    fireEvent.click(screen.getByText('common.finish'));
    expect(onComplete).toHaveBeenCalled();
  });
});
