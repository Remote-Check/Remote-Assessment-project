import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AssessmentProvider } from './store/AssessmentContext';
import '../styles/index.css';

// App entry point with styles
export default function App() {
  return (
    <AssessmentProvider>
      <RouterProvider router={router} />
    </AssessmentProvider>
  );
}
