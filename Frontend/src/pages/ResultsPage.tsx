import {
  Home,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Send,
  Star,
  Trophy,
} from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  addComment,
  getComments,
  getLeaderboard,
} from '../api/roomApi';
import { useAuth } from '../context/AuthContext';
import { demoComments, demoLeaderboard } from '../demoData';
import type { CommentItem, LeaderboardItem } from '../types';

type ResultState = {
  score?: number;
  total?: number;
};

export function ResultsPage() {
  const { roomCode = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemo, session } = useAuth();
  const resultState = (location.state as ResultState | null) ?? {};
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [score, setScore] = useState<number | null>(resultState.score ?? null);
  const [total] = useState(resultState.total ?? 15);
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const loadResults = useCallback(async () => {
    if (!session) return;

    if (isDemo) {
      const demoBoard = [
        { username: session.user.username, correct_count: score ?? 0 },
        ...demoLeaderboard.filter((item) => item.username !== session.user.username),
      ];
      setLeaderboard(demoBoard);
      setComments(demoComments);
      return;
    }

    const [leaderboardResponse, commentsResponse] = await Promise.all([
      getLeaderboard(roomCode),
      getComments(roomCode),
    ]);
    setLeaderboard(leaderboardResponse.leaderboard);
    setComments(commentsResponse.comments);

    if (score === null) {
      const currentResult = leaderboardResponse.leaderboard.find(
        (item) => item.username === session.user.username,
      );
      setScore(currentResult?.correct_count ?? 0);
    }
  }, [isDemo, roomCode, score, session]);

  useEffect(() => {
    loadResults().catch((error) =>
      setNotice(error instanceof Error ? error.message : 'Không thể tải kết quả.'),
    );
  }, [loadResults]);

  const displayedScore = score ?? 0;
  const scoreLabel = useMemo(
    () => (isDemo ? 'Số câu đã chọn trong chế độ demo.' : 'Số câu trả lời chính xác.'),
    [isDemo],
  );

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !commentContent.trim()) return;

    setBusy(true);
    setNotice('');

    try {
      if (isDemo) {
        setComments((current) => [
          {
            name: session.user.username,
            content: commentContent.trim(),
            rating,
            created_at: new Date().toISOString(),
          },
          ...current,
        ]);
      } else {
        await addComment(roomCode, {
          name: session.user.username,
          email: commentEmail || `${session.user.username}@local.test`,
          content: commentContent.trim(),
          rating,
        });
        const response = await getComments(roomCode);
        setComments(response.comments);
      }
      setCommentContent('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể gửi đánh giá.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {notice ? (
        <button className="toast" type="button" onClick={() => setNotice('')}>
          {notice}
        </button>
      ) : null}

      <section className="results-layout">
        <article className="result-card">
          <span className="result-trophy" aria-hidden="true">
            <Trophy size={32} />
          </span>
          <p className="eyebrow">Hoàn thành phòng {roomCode}</p>
          <h2>Kết quả của bạn</h2>
          <p className="result-score">
            <strong>{displayedScore}</strong>
            <span>/{total}</span>
          </p>
          <p className="muted">{scoreLabel}</p>

          <div className="result-actions">
            <button
              className="secondary-action"
              type="button"
              onClick={() => navigate(`/game/${roomCode}`)}
            >
              <RotateCcw size={18} />
              Chơi lại
            </button>
            <button className="primary-action" type="button" onClick={() => navigate('/')}>
              <Home size={18} />
              Trang chủ
            </button>
          </div>
        </article>

        <article className="leaderboard-card">
          <div className="section-title section-title-between">
            <span>
              <Trophy size={20} />
              <h2>Bảng xếp hạng</h2>
            </span>
            <button
              aria-label="Cập nhật bảng xếp hạng"
              className="icon-button"
              disabled={busy}
              onClick={loadResults}
              title="Cập nhật bảng xếp hạng"
              type="button"
            >
              <RefreshCw size={18} />
            </button>
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
          <section className="feedback-section">
            <div className="section-title">
              <MessageSquare size={20} />
              <h2>Đánh giá phòng</h2>
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <label>
                Email
                <input
                  onChange={(event) => setCommentEmail(event.target.value)}
                  placeholder={`${session?.user.username ?? 'player'}@local.test`}
                  type="email"
                  value={commentEmail}
                />
              </label>
              <fieldset className="rating-fieldset">
                <legend>Mức đánh giá</legend>
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      aria-label={`${value} sao`}
                      className={rating === value ? 'active' : ''}
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                    >
                      <Star size={20} fill="currentColor" />
                      <span>{value}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <textarea
                aria-label="Cảm nhận của bạn"
                onChange={(event) => setCommentContent(event.target.value)}
                placeholder="Cảm nhận của bạn..."
                rows={5}
                value={commentContent}
              />
              <button className="primary-action" type="submit" disabled={busy || !commentContent.trim()}>
                <Send size={18} />
                Gửi đánh giá
              </button>
            </form>
          </section>

          <section className="recent-comments">
            <div className="section-title">
              <MessageSquare size={20} />
              <h2>Bình luận gần đây</h2>
            </div>
            <div className="comment-list">
              {comments.length ? (
                comments.slice(0, 6).map((comment, index) => (
                  <div key={`${comment.name}-${comment.created_at}-${index}`}>
                    <strong>{comment.name}</strong>
                    <span>{comment.rating}/5</span>
                    <p>{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="empty-comments">Hãy là người đầu tiên đánh giá phòng này.</p>
              )}
            </div>
          </section>
        </article>
      </section>
    </>
  );
}
