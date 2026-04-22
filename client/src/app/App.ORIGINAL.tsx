import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AssessmentProvider } from './store/AssessmentContext';

// ORIGINAL App before any changes
export default function App() {
  return (
    <AssessmentProvider>
      <RouterProvider router={router} />
    </AssessmentProvider>
  );
}
