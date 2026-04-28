// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClinicianDashboardList } from '../ClinicianDashboardList';

const supabaseMocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  from: vi.fn(),
}));

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: supabaseMocks.getSession,
    },
    from: supabaseMocks.from,
  },
}));

const orderMock = vi.fn();
const eqMock = vi.fn(() => ({ order: orderMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));

function renderDashboardList() {
  render(
    <MemoryRouter>
      <ClinicianDashboardList />
    </MemoryRouter>,
  );
}

describe('ClinicianDashboardList', () => {
  beforeEach(() => {
    supabaseMocks.getSession.mockResolvedValue({
      data: { session: { user: { id: 'clinician-1' }, access_token: 'clinician-token' } },
    });
    supabaseMocks.from.mockReturnValue({ select: selectMock });
    orderMock.mockResolvedValue({
      data: [
        {
          id: 'patient-1',
          case_id: 'CASE-1',
          created_at: '2026-04-25T12:00:00.000Z',
          sessions: [
            {
              id: 'session-1',
              status: 'completed',
              created_at: '2026-04-25T12:05:00.000Z',
              scoring_reports: {
                total_adjusted: 29,
                total_score: 29,
                total_provisional: true,
                needs_review: true,
                pending_review_count: 1,
              },
            },
          ],
        },
      ],
      error: null,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('loads cases when Supabase returns a single scoring report object', async () => {
    renderDashboardList();

    expect(await screen.findByText('1 תיקים · 1 דורשים סקירה')).toBeInTheDocument();
    expect(screen.getAllByText('29/30 (זמני)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('דורש סקירה').length).toBeGreaterThan(0);
    expect(screen.queryByText('ציון MoCA ממוצע')).not.toBeInTheDocument();
    expect(screen.getByText('שינוי בציון MoCA לאורך זמן')).toBeInTheDocument();
    expect(screen.getByText('0 מבדקים סופיים')).toBeInTheDocument();
    expect(screen.getByText('אין עדיין מבדקים סופיים להצגת שינוי בציון.')).toBeInTheDocument();
    expect(selectMock).toHaveBeenCalledWith(expect.not.stringContaining('full_name'));
    await waitFor(() => expect(screen.queryByText('טוען...')).not.toBeInTheDocument());
  });

  it('renders the score trend chart from completed final scores only', async () => {
    orderMock.mockResolvedValueOnce({
      data: [
        {
          id: 'patient-new',
          case_id: 'CASE-NEW',
          created_at: '2026-04-26T12:00:00.000Z',
          sessions: [
            {
              id: 'session-review',
              status: 'awaiting_review',
              created_at: '2026-04-27T09:00:00.000Z',
              scoring_reports: {
                total_adjusted: 30,
                total_score: 30,
                total_provisional: true,
                needs_review: true,
                pending_review_count: 1,
              },
            },
            {
              id: 'session-new-final',
              status: 'completed',
              created_at: '2026-04-26T12:05:00.000Z',
              scoring_reports: {
                total_adjusted: 26,
                total_score: 26,
                total_provisional: false,
                needs_review: false,
                pending_review_count: 0,
              },
            },
          ],
        },
        {
          id: 'patient-old',
          case_id: 'CASE-OLD',
          created_at: '2026-04-24T12:00:00.000Z',
          sessions: [
            {
              id: 'session-old-final',
              status: 'completed',
              created_at: '2026-04-24T12:05:00.000Z',
              scoring_reports: {
                total_adjusted: 24,
                total_score: 24,
                total_provisional: false,
                needs_review: false,
                pending_review_count: 0,
              },
            },
          ],
        },
      ],
      error: null,
    });

    renderDashboardList();

    expect(await screen.findByText('2 מבדקים סופיים')).toBeInTheDocument();
    expect(screen.getAllByText('26/30').length).toBeGreaterThan(0);
    expect(screen.getByRole('img', { name: 'שינוי ציון MoCA מ-24 ל-26' })).toBeInTheDocument();
    expect(screen.queryByText('אין עדיין מבדקים סופיים להצגת שינוי בציון.')).not.toBeInTheDocument();
  });
});
