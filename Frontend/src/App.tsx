import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { incrementViewCount } from './api/statsApi';
import { AppLayout } from './components/AppLayout';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { ContactPage } from './pages/ContactPage';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { RoomPage } from './pages/RoomPage';

const VIEW_COUNTED_SESSION_KEY = 'quiz-arena-view-counted';

export default function App() {
  const { session } = useAuth();

  useEffect(() => {
    if (sessionStorage.getItem(VIEW_COUNTED_SESSION_KEY)) {
      return;
    }

    sessionStorage.setItem(VIEW_COUNTED_SESSION_KEY, 'true');
    incrementViewCount().catch(() => {
      sessionStorage.removeItem(VIEW_COUNTED_SESSION_KEY);
    });
  }, []);

  return (
    <Routes>
      <Route element={<AuthPage mode="login" />} path="/login" />
      <Route element={<AuthPage mode="register" />} path="/register" />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<HomePage />} index />
          <Route element={<RoomPage />} path="/room/:roomCode" />
          <Route element={<GamePage />} path="/game/:roomCode" />
          <Route element={<ResultsPage />} path="/results/:roomCode" />
          <Route element={<ContactPage />} path="/contact" />
          <Route element={<AdminRoute />}>
            <Route element={<AdminPage />} path="/admin" />
          </Route>
        </Route>
      </Route>

      <Route element={<Navigate replace to={session ? '/' : '/login'} />} path="*" />
    </Routes>
  );
}
