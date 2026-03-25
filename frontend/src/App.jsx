import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Levels from './pages/Levels';
import LevelQuiz from './pages/LevelQuiz';
import Materials from './pages/Materials';
import ReportCard from './pages/ReportCard';
import Chat from './pages/Chat';
import Badges from './pages/Badges';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">🎮 Loading EduQuest...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/levels" element={<PrivateRoute><Levels /></PrivateRoute>} />
          <Route path="/levels/:id" element={<PrivateRoute><LevelQuiz /></PrivateRoute>} />
          <Route path="/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
          <Route path="/report" element={<PrivateRoute><ReportCard /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/badges" element={<PrivateRoute><Badges /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
