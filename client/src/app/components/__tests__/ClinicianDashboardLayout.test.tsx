// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClinicianDashboardLayout } from "../ClinicianDashboardLayout";

vi.mock("../auth/useClinicianAuth", () => ({
  useClinicianAuth: () => ({
    profile: {
      full_name: "ד״ר כהן",
      clinic_name: "Remote Check Clinic",
    },
  }),
}));

vi.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(async () => undefined),
    },
  },
}));

function renderDashboardLayout(initialPath = "/dashboard/session/session-1") {
  const router = createMemoryRouter(
    [
      {
        path: "/dashboard",
        element: <ClinicianDashboardLayout />,
        children: [
          { index: true, element: <div>Dashboard home</div> },
          { path: "session/:sessionId", element: <div>Session detail</div> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

describe("ClinicianDashboardLayout", () => {
  afterEach(() => {
    cleanup();
  });

  it("links the Remote Check brand back to the logged-in dashboard home", async () => {
    const router = renderDashboardLayout();
    expect(screen.getByText("Session detail")).toBeInTheDocument();

    const brandLinks = screen.getAllByRole("link", {
      name: "Remote Check - חזרה למסך הראשי",
    });
    expect(brandLinks.length).toBeGreaterThan(0);
    expect(brandLinks[0]).toHaveAttribute("href", "/dashboard");

    await userEvent.click(brandLinks[0]);

    expect(router.state.location.pathname).toBe("/dashboard");
    expect(screen.getByText("Dashboard home")).toBeInTheDocument();
  });
});
