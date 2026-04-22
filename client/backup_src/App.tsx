import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientAssessmentPage from './pages/PatientAssessmentPage';
import LoginPage from './pages/LoginPage';
import PatientList from './pages/dashboard/PatientList';
import SessionDetail from './pages/dashboard/SessionDetail';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ClinicianLayout } from './components/layout/ClinicianLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Patient Assessment Route */}
        <Route path="/" element={<PatientAssessmentPage />} />
        <Route path="/assess/:token" element={<PatientAssessmentPage />} />
        
        {/* Clinician Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <ClinicianLayout>
                <Routes>
                  <Route path="/" element={<PatientList />} />
                  <Route path="/session/:id" element={<SessionDetail />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </ClinicianLayout>
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
