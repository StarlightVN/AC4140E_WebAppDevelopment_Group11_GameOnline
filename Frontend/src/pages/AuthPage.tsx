import { LogIn, Play, UserPlus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import arenaArt from '../assets/quiz-arena-banner.png';
import { login, register } from '../api/authApi';
import { DEMO_TOKEN, useAuth } from '../context/AuthContext';

type Props = {
  mode: 'login' | 'register';
};

export function AuthPage({ mode }: Props) {
  const { session, setAuthSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  if (session) {
    return <Navigate replace to="/" />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanUsername = username.trim();

    if (!cleanUsername || password.length < 3) {
      setNotice('Tên đăng nhập và mật khẩu cần ít nhất 3 ký tự.');
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      if (mode === 'register') {
        await register(cleanUsername, password);
      }

      const response = await login(cleanUsername, password);
      setAuthSession({ token: response.token, user: response.user });
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể xác thực tài khoản.';
      setNotice(
        message === 'Failed to fetch'
          ? 'Backend chưa chạy ở localhost:3000. Bạn có thể vào chế độ demo.'
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  function enterDemoMode() {
    setAuthSession({
      token: DEMO_TOKEN,
      user: {
        id: 9999,
        username: username.trim() || 'nora123',
        role: 'user',
      },
    });
    navigate('/', { replace: true });
  }

  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-label="Quiz Arena">
        <img src={arenaArt} alt="" />
        <div>
          <p className="eyebrow">Quiz Arena</p>
          <h1>Sàn đấu câu hỏi</h1>
          <p className="muted">Vào phòng, trả lời nhanh, leo bảng điểm.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="mode-tabs" role="tablist" aria-label="Chọn chế độ tài khoản">
          <button
            className={mode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => navigate('/login')}
          >
            <LogIn size={18} />
            Đăng nhập
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            type="button"
            onClick={() => navigate('/register')}
          >
            <UserPlus size={18} />
            Đăng ký
          </button>
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          <label>
            Tên đăng nhập
            <input
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="player11"
              value={username}
            />
          </label>
          <label>
            Mật khẩu
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••"
              type="password"
              value={password}
            />
          </label>

          {notice ? <p className="notice">{notice}</p> : null}

          <button className="primary-action" disabled={busy} type="submit">
            {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            {busy ? 'Đang xử lý...' : mode === 'login' ? 'Vào game' : 'Tạo tài khoản'}
          </button>
          <button className="secondary-action" type="button" onClick={enterDemoMode}>
            <Play size={18} />
            Chơi demo
          </button>
        </form>
      </section>
    </main>
  );
}
