import React from 'react';
import { SimpleRouter } from './SimpleRouter';
import { AssessmentLayout } from './components/AssessmentLayout';
import { LandingHub } from './components/LandingHub';
import { ClinicianDashboardLayout } from './components/ClinicianDashboardLayout';

// App entry point
export default function App() {
  // Initialize hash route
  if (!window.location.hash) {
    window.location.hash = '/';
  }

  // Define routes inside component to avoid module-level JSX
  const routes = [
    { path: '/', element: <LandingHub /> },
    { path: '/patient', element: <AssessmentLayout /> },
    { path: '/patient/trail-making', element: <AssessmentLayout /> },
    { path: '/patient/cube', element: <AssessmentLayout /> },
    { path: '/patient/clock', element: <AssessmentLayout /> },
    { path: '/patient/naming', element: <AssessmentLayout /> },
    { path: '/patient/memory', element: <AssessmentLayout /> },
    { path: '/patient/digit-span', element: <AssessmentLayout /> },
    { path: '/patient/vigilance', element: <AssessmentLayout /> },
    { path: '/patient/serial7', element: <AssessmentLayout /> },
    { path: '/patient/language', element: <AssessmentLayout /> },
    { path: '/patient/abstraction', element: <AssessmentLayout /> },
    { path: '/patient/delayed-recall', element: <AssessmentLayout /> },
    { path: '/patient/orientation', element: <AssessmentLayout /> },
    { path: '/patient/end', element: <AssessmentLayout /> },
    { path: '/dashboard', element: <ClinicianDashboardLayout /> },
    { path: '/dashboard/:patientId', element: <ClinicianDashboardLayout /> },
  ];

  return <SimpleRouter routes={routes} />;
}
