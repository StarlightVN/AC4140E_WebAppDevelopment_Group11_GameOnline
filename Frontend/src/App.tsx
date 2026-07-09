import { type CSSProperties, type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Crown,
  DoorOpen,
  Home,
  LogIn,
  LogOut,
  MessageSquare,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Timer,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import { login, register } from './api/authApi';
import {
  addComment,
  createRoom,
  getComments,
  getLeaderboard,
  getRoomQuestions,
  submitScore,
} from './api/roomApi';
import arenaArt from './assets/quiz-arena.svg';
import { demoComments, demoLeaderboard, demoQuestions } from './demoData';
import type { AnswerKey, CommentItem, LeaderboardItem, Question, User } from './types';

type Phase = 'home' | 'lobby' | 'game' | 'results' | 'admin' | 'contact';

type AuthSession = {
  token: string;
  user: User;
};

type AuthMode = 'login' | 'register';

const AUTH_STORAGE_KEY = 'quiz-arena-session';
const QUESTION_SECONDS = 25;
const OPTION_KEYS: AnswerKey[] = ['A', 'B', 'C', 'D'];
const DEMO_TOKEN = 'demo-local-session';
const DEMO_ROOM_CODE = '483920';

const seatNames = ['An', 'Binh', 'Chi', 'Duc', 'Ha', 'Khoa', 'Linh', 'Mai', 'Nam'];

function readStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function getOptionText(question: Question, key: AnswerKey) {
  return question[`option_${key}` as keyof Question] as string;
}

function formatRoomCode(value: string) {
  return value.replace(/\D/g, '').slice(0, 6);
}

export default function App() {
  const finishingRef = useRef(false);
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase] = useState<Phase>('home');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomStatus, setRoomStatus] = useState<'open' | 'full' | 'closed'>('open');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerKey>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [showAd, setShowAd] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const questionNumber = currentQuestionIndex + 1;
  const progressPercent = questions.length ? (questionNumber / questions.length) * 100 : 0;
  const timerPercent = (timeLeft / QUESTION_SECONDS) * 100;
  const isDemoSession = session?.token === DEMO_TOKEN;

  useEffect(() => {
    const hasClosedAd = document.cookie.split('; ').find(row => row.startsWith('adClosed='));
    if (!hasClosedAd) {
      const timer = setTimeout(() => {
        if (phase === 'home') {
          setShowAd(true);
          }
        }, 60000);
      return () => clearTimeout(timer);
      }
    }, [phase]);
    const handleCloseAd = () => {
      setShowAd(false);
      document.cookie = "adClosed=true; max-age=86400; path=/";
  };

  const seats = useMemo(() => {
    if (!session) {
      return [];
    }

    return [
      { name: session.user.username, role: 'Host', active: true },
      ...seatNames.slice(0, 5).map((name, index) => ({
        name,
        role: index < 3 ? 'Sẵn sàng' : 'Chờ',
        active: index < 3,
      })),
    ];
  }, [session]);

  useEffect(() => {
    if (phase !== 'game') {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, currentQuestionIndex]);

  useEffect(() => {
    if (phase !== 'game' || timeLeft !== 0) {
      return undefined;
    }

    const nextTimer = window.setTimeout(() => {
      goToNextQuestion();
    }, 400);

    return () => window.clearTimeout(nextTimer);
  }, [phase, timeLeft]);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');

    if (!username.trim() || password.length < 3) {
      setNotice('Tên đăng nhập và mật khẩu cần hợp lệ.');
      return;
    }

    setBusy(true);

    try {
      if (authMode === 'register') {
        await register(username.trim(), password);
      }

      const auth = await login(username.trim(), password);
      const nextSession = { token: auth.token, user: auth.user };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setCommentEmail(`${auth.user.username}@local.test`);
      setPhase('home');
      setUsername('');
      setPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể xác thực tài khoản.';
      setNotice(
        message === 'Failed to fetch'
          ? 'Backend chưa chạy ở localhost:3000. Bấm Chơi demo để vào game ngay.'
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  function activateDemoRoom(code: string) {
    setRoomCode(code);
    setRoomCodeInput(code);
    setRoomStatus('open');
    setQuestions(demoQuestions);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(QUESTION_SECONDS);
    setLeaderboard([]);
    setComments(demoComments);
  }

  function enterDemoMode() {
    const demoSession = {
      token: DEMO_TOKEN,
      user: { id: 9999, username: username.trim() || 'nora123', role: 'user' as const },
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoSession));
    setSession(demoSession);
    setCommentEmail(`${demoSession.user.username}@local.test`);
    activateDemoRoom(DEMO_ROOM_CODE);
    setPhase('lobby');
    setNotice('Đang dùng chế độ demo local, chưa cần backend.');
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
    setPhase('home');
    setRoomCode('');
    setQuestions([]);
    setAnswers({});
  }

  async function loadRoom(code: string) {
    const payload = await getRoomQuestions(code);
    setRoomCode(payload.roomCode);
    setRoomStatus(payload.status);
    setQuestions(payload.questions);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(QUESTION_SECONDS);
    setLeaderboard([]);
    setComments([]);
  }

  async function handleCreateRoom() {
    if (!session) {
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      if (isDemoSession) {
        activateDemoRoom(DEMO_ROOM_CODE);
        setPhase('lobby');
        return;
      }

      const created = await createRoom(session.user.id);
      await loadRoom(created.roomCode);
      setRoomCodeInput(created.roomCode);
      setPhase('lobby');
    } catch (error) {
      if (error instanceof Error && error.message === 'Failed to fetch') {
        activateDemoRoom(DEMO_ROOM_CODE);
        setPhase('lobby');
        setNotice('Backend chưa chạy, đã mở phòng demo local.');
      } else {
        setNotice(error instanceof Error ? error.message : 'Không thể tạo phòng.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = formatRoomCode(roomCodeInput);

    if (code.length !== 6) {
      setNotice('Mã phòng gồm 6 chữ số.');
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      if (isDemoSession) {
        activateDemoRoom(code);
        setPhase('lobby');
        return;
      }

      await loadRoom(code);
      setPhase('lobby');
    } catch (error) {
      if (error instanceof Error && error.message === 'Failed to fetch') {
        activateDemoRoom(code);
        setPhase('lobby');
        setNotice('Backend chưa chạy, đã vào phòng demo local.');
      } else {
        setNotice(error instanceof Error ? error.message : 'Không thể vào phòng.');
      }
    } finally {
      setBusy(false);
    }
  }

  function startGame() {
    finishingRef.current = false;
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(QUESTION_SECONDS);
    setPhase('game');
  }

  function chooseAnswer(questionId: number, answer: AnswerKey) {
    setAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  }

  function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((index) => index + 1);
      setTimeLeft(QUESTION_SECONDS);
      return;
    }

    finishGame();
  }

  async function finishGame() {
    if (finishingRef.current) {
      return;
    }

    finishingRef.current = true;

    if (!session || !roomCode) {
      setPhase('results');
      finishingRef.current = false;
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      if (isDemoSession) {
        setLeaderboard([
          { username: session.user.username, correct_count: answeredCount },
          ...demoLeaderboard.filter((item) => item.username !== session.user.username),
        ]);
        setComments(demoComments);
        return;
      }

      await submitScore(roomCode, session.user.id, answeredCount);
      const [leaderboardPayload, commentsPayload] = await Promise.all([
        getLeaderboard(roomCode),
        getComments(roomCode),
      ]);
      setLeaderboard(leaderboardPayload.leaderboard);
      setComments(commentsPayload.comments);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể nộp kết quả.');
    } finally {
      setBusy(false);
      setPhase('results');
      finishingRef.current = false;
    }
  }

  async function refreshLeaderboard() {
    if (!roomCode) {
      return;
    }

    setBusy(true);

    try {
      if (isDemoSession && session) {
        setLeaderboard([
          { username: session.user.username, correct_count: answeredCount },
          ...demoLeaderboard.filter((item) => item.username !== session.user.username),
        ]);
        return;
      }

      const payload = await getLeaderboard(roomCode);
      setLeaderboard(payload.leaderboard);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể tải bảng xếp hạng.');
    } finally {
      setBusy(false);
    }
  }

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session || !roomCode || !commentContent.trim()) {
      return;
    }

    setBusy(true);

    try {
      if (isDemoSession) {
        setComments((current) => [
          {
            name: session.user.username,
            content: commentContent.trim(),
            rating,
            created_at: new Date().toISOString(),
          },
          ...current,
        ]);
        setCommentContent('');
        return;
      }

      await addComment(roomCode, {
        name: session.user.username,
        email: commentEmail || `${session.user.username}@local.test`,
        content: commentContent.trim(),
        rating,
      });
      const payload = await getComments(roomCode);
      setComments(payload.comments);
      setCommentContent('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể gửi đánh giá.');
    } finally {
      setBusy(false);
    }
  }

  async function copyRoomCode() {
    if (!roomCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(roomCode);
      setNotice('Đã sao chép mã phòng.');
    } catch {
      setNotice(roomCode);
    }
  }

  if (!session) {
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
              className={authMode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => setAuthMode('login')}
            >
              <LogIn size={18} />
              Đăng nhập
            </button>
            <button
              className={authMode === 'register' ? 'active' : ''}
              type="button"
              onClick={() => setAuthMode('register')}
            >
              <UserPlus size={18} />
              Đăng ký
            </button>
          </div>

          <form className="stack" onSubmit={handleAuthSubmit}>
            <label>
              Tên đăng nhập
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="player11"
                autoComplete="username"
              />
            </label>

            <label>
              Mật khẩu
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••"
                type="password"
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
            </label>

            {notice ? <p className="notice">{notice}</p> : null}

            <button className="primary-action" disabled={busy} type="submit">
              {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {busy ? 'Đang xử lý...' : authMode === 'login' ? 'Vào game' : 'Tạo tài khoản'}
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

  return (
    <main className="app-shell">
      <header className="topbar">
        {/* Cụm Logo và Menu điều hướng bên trái */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Nút Logo / Trang chủ hiện tại của bạn */}
          <button className="brand-button" type="button" onClick={() => setPhase('home')}>
            <Crown size={22} color="var(--gold)" />
            <span>Quiz Arena</span>
          </button>

          <button 
            className="brand-button" 
            type="button"
            onClick={() => setPhase('contact')}
            style={{ background: 'transparent', border: '1px solid var(--line)' }}
          >
            <MessageSquare size={20} /> 
            <span className="hide-mobile">Liên hệ</span>
          </button>

          {session.user.role === 'admin' && (
            <button 
              className="brand-button" 
              type="button"
              onClick={() => setPhase('admin')}
              style={{ background: 'var(--red)', color: 'white', border: 'none' }}
            >
              <ShieldCheck size={18} /> 
              <span className="hide-mobile">Admin</span>
            </button>
          )}
        </div>

        <div className="topbar-actions">
          <span className="user-pill">
            <UserPlus size={16} />
            {session.user.username}
          </span>
          <button className="icon-button" type="button" onClick={logout} aria-label="Đăng xuất">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {notice ? (
        <button className="toast" type="button" onClick={() => setNotice('')}>
          {notice}
        </button>
      ) : null}

      {phase === 'home' ? (
        <section className="home-grid">
          <article className="command-panel">
            <div>
              <p className="eyebrow">Phòng chơi</p>
              <h1>Chọn phòng để bắt đầu</h1>
            </div>

            <div className="command-row">
              <button className="primary-action" type="button" onClick={handleCreateRoom} disabled={busy}>
                <Users size={18} />
                {isDemoSession ? 'Tạo phòng demo' : 'Tạo phòng'}
              </button>

              <form className="join-form" onSubmit={handleJoinRoom}>
                <input
                  value={roomCodeInput}
                  onChange={(event) => setRoomCodeInput(formatRoomCode(event.target.value))}
                  placeholder="Mã phòng"
                  inputMode="numeric"
                />
                <button className="secondary-action" disabled={busy} type="submit">
                  <DoorOpen size={18} />
                  Vào
                </button>
              </form>
            </div>
          </article>

          <article className="arena-card">
            <img src={arenaArt} alt="" />
          </article>

          <article className="metrics-strip">
            <div>
              <span>Quy mô</span>
              <strong>4-10</strong>
            </div>
            <div>
              <span>Bộ câu hỏi</span>
              <strong>15</strong>
            </div>
            <div>
              <span>API</span>
              <strong>REST</strong>
            </div>
          </article>
        </section>
      ) : null}

      {phase === 'lobby' ? (
        <section className="lobby-layout">
          <article className="room-card">
            <div className="room-code-row">
              <div>
                <p className="eyebrow">Mã phòng</p>
                <h1>{roomCode}</h1>
              </div>
              <button className="icon-button" type="button" onClick={copyRoomCode} aria-label="Sao chép mã phòng">
                <Copy size={18} />
              </button>
            </div>

            <div className="room-stats">
              <span>{roomStatus}</span>
              <span>{questions.length} câu</span>
              <span>{seats.length}/10 người</span>
            </div>

            <div className="seat-grid">
              {Array.from({ length: 10 }).map((_, index) => {
                const seat = seats[index];
                return (
                  <div className={seat ? 'seat filled' : 'seat'} key={index}>
                    <span>{seat?.name ?? 'Trống'}</span>
                    <small>{seat?.role ?? `Ghế ${index + 1}`}</small>
                  </div>
                );
              })}
            </div>

            <button
              className="primary-action wide"
              type="button"
              onClick={startGame}
              disabled={busy || questions.length === 0}
            >
              <Play size={18} />
              Bắt đầu
            </button>
          </article>

          <article className="question-preview">
            <p className="eyebrow">Bộ đề</p>
            <h2>Độ khó tăng dần</h2>
            <div className="difficulty-track">
              {questions.map((question) => (
                <span key={question.id}>{question.difficulty}</span>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {phase === 'game' && currentQuestion ? (
        <section className="game-layout">
          <article className="game-board">
            <div className="game-head">
              <div>
                <p className="eyebrow">Câu {questionNumber}</p>
                <h1>{currentQuestion.content}</h1>
              </div>
              <div className="timer-ring" style={{ '--timer': `${timerPercent}%` } as CSSProperties}>
                <Timer size={19} />
                <strong>{timeLeft}</strong>
              </div>
            </div>

            <div className="progress-line" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="answer-grid">
              {OPTION_KEYS.map((key) => {
                const selected = answers[currentQuestion.id] === key;
                return (
                  <button
                    className={selected ? 'answer selected' : 'answer'}
                    key={key}
                    type="button"
                    onClick={() => chooseAnswer(currentQuestion.id, key)}
                  >
                    <span>{key}</span>
                    {getOptionText(currentQuestion, key)}
                    {selected ? <Check size={18} /> : null}
                  </button>
                );
              })}
            </div>

            <div className="game-actions">
              <button className="secondary-action" type="button" onClick={() => setPhase('lobby')}>
                <Home size={18} />
                Phòng
              </button>
              <button className="primary-action" type="button" onClick={goToNextQuestion} disabled={busy}>
                {currentQuestionIndex === questions.length - 1 ? <Trophy size={18} /> : <Play size={18} />}
                {currentQuestionIndex === questions.length - 1 ? 'Kết thúc' : 'Câu tiếp'}
              </button>
            </div>
          </article>

          <aside className="side-panel">
            <div>
              <p className="eyebrow">Tiến độ</p>
              <h2>
                {answeredCount}/{questions.length}
              </h2>
            </div>
            <div className="mini-rank">
              {seats.slice(0, 6).map((seat, index) => (
                <div key={seat.name}>
                  <span>{index + 1}</span>
                  <strong>{seat.name}</strong>
                  <small>{seat.active ? 'online' : 'idle'}</small>
                </div>
              ))}
            </div>
          </aside>
        </section>
      ) : null}

      {phase === 'results' ? (
        <section className="results-layout">
          <article className="result-card">
            <Trophy size={36} />
            <p className="eyebrow">Kết quả</p>
            <h1>
              {answeredCount}/{questions.length}
            </h1>
            <p className="muted">Điểm tạm theo số câu đã chọn đáp án.</p>

            <div className="result-actions">
              <button className="primary-action" type="button" onClick={refreshLeaderboard} disabled={busy}>
                <Trophy size={18} />
                Cập nhật BXH
              </button>
              <button className="secondary-action" type="button" onClick={startGame}>
                <RotateCcw size={18} />
                Chơi lại
              </button>
            </div>
          </article>

          <article className="leaderboard-card">
            <div className="section-title">
              <Trophy size={20} />
              <h2>Bảng xếp hạng</h2>
            </div>

            <div className="leaderboard-list">
              {leaderboard.length ? (
                leaderboard.map((item, index) => (
                  <div key={`${item.username}-${index}`}>
                    <span>{index + 1}</span>
                    <strong>{item.username}</strong>
                    <small>{item.correct_count}</small>
                  </div>
                ))
              ) : (
                <p className="muted">Chưa có dữ liệu.</p>
              )}
            </div>
          </article>

          <article className="comment-card">
            <div className="section-title">
              <MessageSquare size={20} />
              <h2>Đánh giá phòng</h2>
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input
                value={commentEmail}
                onChange={(event) => setCommentEmail(event.target.value)}
                placeholder="Email"
                type="email"
              />
              <div className="rating-row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    className={rating === value ? 'active' : ''}
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <textarea
                value={commentContent}
                onChange={(event) => setCommentContent(event.target.value)}
                placeholder="Cảm nhận của bạn"
                rows={4}
              />
              <button className="primary-action" type="submit" disabled={busy || !commentContent.trim()}>
                <Send size={18} />
                Gửi
              </button>
            </form>

            <div className="comment-list">
              {comments.slice(0, 4).map((comment, index) => (
                <div key={`${comment.name}-${comment.created_at}-${index}`}>
                  <strong>{comment.name}</strong>
                  <span>{comment.rating}/5</span>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}
      {/* ================= GIAO DIỆN TRANG LIÊN HỆ ================= */}
      {phase === 'contact' && (
        <section className="arena-panel" style={{ maxWidth: '600px', margin: '40px auto' }}>
          <h2 style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare /> Liên hệ & Góp ý
          </h2>
          <p style={{ color: 'var(--muted)' }}>
            Dự án Cổng Game Trắc Nghiệm Đối Đầu.<br/>
            Thực hiện bởi: <strong>Nhóm 11 - Web App Development</strong>
          </p>
          
          <form 
            style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}
            onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Cảm ơn bạn! Ý kiến của bạn đã được gửi tới Ban Quản Trị.'); 
              setPhase('home'); 
            }}
          >
            <input type="text" placeholder="Họ và tên của bạn" required />
            <input type="email" placeholder="Email liên hệ" required />
            <textarea placeholder="Nhập nội dung ý kiến, báo lỗi hoặc góp ý..." rows={5} required />
            <button className="primary-action" type="submit">
              <Send size={18} /> Gửi Ý Kiến
            </button>
          </form>
        </section>
      )}

      {showAd && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'var(--panel)', padding: '30px', borderRadius: '16px',
            border: '2px solid var(--gold)', maxWidth: '400px', textAlign: 'center',
            boxShadow: 'var(--shadow)', margin: '20px'
          }}>
            <h2 style={{ color: 'var(--gold)', marginTop: 0, fontSize: '24px' }}>Ưu Đãi Đặc Biệt!</h2>
            <p style={{ color: 'var(--text)', lineHeight: '1.5', marginBottom: '24px' }}>Nâng cấp tài khoản VIP ngay hôm nay để mở khóa toàn bộ gói câu hỏi cực khó và nhận X2 điểm thưởng trên Bảng Xếp Hạng!</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="primary-action" 
                onClick={() => alert('Tính năng thanh toán đang phát triển!')}
              >Mua VIP Ngay
              </button>
              <button 
                className="secondary-action" 
                onClick={handleCloseAd}
                style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' }}
              >
                Không, cảm ơn
              </button>
            </div>
          </div>
        </div>
      )}

            {phase === 'admin' && (
        <section className="arena-panel" style={{ margin: '40px auto', maxWidth: '800px' }}>
          <h2 style={{ color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck /> Bảng Điều Khiển Quản Trị Viên
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {/* Box Thống kê View */}
            <div style={{ background: 'var(--panel-strong)', padding: '20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--muted)' }}>Tổng lượt truy cập web</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--gold)' }}>
                1,245 <span style={{ fontSize: '16px', color: 'var(--text)' }}>views</span>
              </div>
            </div>

            <div style={{ background: 'var(--panel-strong)', padding: '20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--muted)' }}>Ngân hàng câu hỏi</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text)' }}>
                15 <span style={{ fontSize: '16px' }}>câu</span>
              </div>
              <button 
                className="secondary-action" 
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => alert('Tính năng Thêm/Sửa câu hỏi đang được kết nối API')}
              >
                + Cập nhật câu hỏi
              </button>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: 'var(--gold)' }}>Quản lý Bình luận người dùng</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'var(--panel-strong)', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--gold)' }}>Nguyễn Văn A</strong> <span style={{ color: 'var(--muted)', fontSize: '12px' }}>- 5 sao</span>
                  <p style={{ margin: '5px 0 0 0' }}>Bộ câu hỏi rất hay, web chạy mượt!</p>
                </div>
                <button 
                  style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.parentElement!.style.display = 'none';
                    alert('Đã xóa bình luận thành công!');
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
