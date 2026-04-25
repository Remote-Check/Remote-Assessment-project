// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PatientForm } from '../PatientForm';

const insertMock = vi.fn();
const selectMock = vi.fn();
const singleMock = vi.fn();

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({
        data: { session: { user: { id: 'clinician-1' } } },
      })),
    },
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  },
}));

describe('PatientForm', () => {
  beforeEach(() => {
    insertMock.mockReturnValue({ select: selectMock });
    selectMock.mockReturnValue({ single: singleMock });
    singleMock.mockResolvedValue({ data: { id: 'case-record-1' }, error: null });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('creates an MVP case record with case ID only', async () => {
    const onCreated = vi.fn();
    render(<PatientForm open onClose={vi.fn()} onCreated={onCreated} />);

    await userEvent.type(screen.getByPlaceholderText('למשל CASE-20260425-001'), 'CASE-001');
    await userEvent.click(screen.getByRole('button', { name: 'פתח תיק' }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith('case-record-1'));
    expect(insertMock).toHaveBeenCalledWith({
      clinician_id: 'clinician-1',
      full_name: 'CASE-001',
      phone: null,
      date_of_birth: null,
      id_number: null,
      notes: null,
    });
  });

  it('requires a case ID before saving', async () => {
    render(<PatientForm open onClose={vi.fn()} onCreated={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'פתח תיק' }));

    expect(await screen.findByText('יש למלא מזהה תיק.')).toBeInTheDocument();
    expect(insertMock).not.toHaveBeenCalled();
  });
});
