import {
  Crown,
  Home,
  LogOut,
  MessageSquare,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export function AppLayout() {
  const { logout, session } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink className="brand-button nav-brand" end to="/">
            <Crown size={22} />
            <span>Quiz Arena</span>
          </NavLink>
          <NavLink className="nav-link" end to="/">
            <Home size={18} />
            <span>Trang chủ</span>
          </NavLink>
          <NavLink className="nav-link" to="/contact">
            <MessageSquare size={18} />
            <span>Liên hệ</span>
          </NavLink>
          {session?.user.role === 'admin' ? (
            <NavLink className="nav-link admin-link" to="/admin">
              <ShieldCheck size={18} />
              <span>Quản trị</span>
            </NavLink>
          ) : null}
        </nav>

        <div className="topbar-actions">
          <span className="user-pill">
            <UserRound size={16} />
            {session?.user.username}
          </span>
          <button className="icon-button" type="button" onClick={handleLogout} aria-label="Đăng xuất">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <Outlet />
    </main>
  );
}
