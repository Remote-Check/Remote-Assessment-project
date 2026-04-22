import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssessmentLayout } from '../AssessmentLayout';

describe('AssessmentLayout', () => {
  it('should render the title and children', () => {
    render(
      <AssessmentLayout title="Test Title" onNext={() => {}} isLastStep={false}>
        <div>Test Content</div>
      </AssessmentLayout>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should call onNext when the next button is clicked', () => {
    const onNext = vi.fn();
    render(
      <AssessmentLayout title="Test" onNext={onNext} isLastStep={false}>
        <div>Content</div>
      </AssessmentLayout>
    );

    fireEvent.click(screen.getByText('common.next'));
    expect(onNext).toHaveBeenCalled();
  });

  it('should show back button and call onBack when clicked', () => {
    const onBack = vi.fn();
    render(
      <AssessmentLayout title="Test" onNext={() => {}} onBack={onBack} isLastStep={false}>
        <div>Content</div>
      </AssessmentLayout>
    );

    const backBtn = screen.getByText('common.back');
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();
  });

  it('should show finish button on the last step', () => {
    render(
      <AssessmentLayout title="Test" onNext={() => {}} isLastStep={true}>
        <div>Content</div>
      </AssessmentLayout>
    );

    expect(screen.getByText('common.finish')).toBeInTheDocument();
  });
});
