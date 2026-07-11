import { Eye, MessageSquare, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  deleteAdminComment,
  getAdminComments,
  type AdminCommentItem,
  getAdminQuestions,
  type AdminQuestionItem,
} from '../api/adminApi';
import { getViewCount } from '../api/statsApi';
import { QuestionManager } from '../components/QuestionManager';
import { useAuth } from '../context/AuthContext';

export function AdminPage() {
  const { session } = useAuth();
  const token = session?.token ?? '';
  const [comments, setComments] = useState<AdminCommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<AdminQuestionItem[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState('');
  const [questionManagerOpen, setQuestionManagerOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    let active = true;

    getViewCount()
      .then((response) => {
        if (active) {
          setViewCount(Number(response.view_count) || 0);
        }
      })
      .catch(() => {
        if (active) {
          setStatsError('Không thể tải thống kê lúc này.');
        }
      });

    if (!token) {
      setCommentsLoading(false);
      setQuestionsLoading(false);
      return () => {
        active = false;
      };
    }

    getAdminComments(token)
      .then((response) => {
        if (active) {
          setComments(response.comments);
        }
      })
      .catch((error) => {
        if (active) {
          setCommentsError(
            error instanceof Error ? error.message : 'Không thể tải bình luận.',
          );
        }
      })
      .finally(() => {
        if (active) {
          setCommentsLoading(false);
        }
      });

    getAdminQuestions(token)
      .then((response) => {
        if (active) {
          setQuestions(response.questions);
        }
      })
      .catch((error) => {
        if (active) {
          setQuestionsError(
            error instanceof Error ? error.message : 'Không thể tải ngân hàng câu hỏi.',
          );
        }
      })
      .finally(() => {
        if (active) {
          setQuestionsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleDeleteComment(commentId: number) {
    setDeletingCommentId(commentId);
    setNotice('');

    try {
      await deleteAdminComment(commentId, token);
      setComments((current) => current.filter((item) => item.id !== commentId));
      setNotice('Đã xóa bình luận khỏi database.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể xóa bình luận.');
    } finally {
      setDeletingCommentId(null);
    }
  }

  return (
    <section className="content-page admin-page">
      <header className="page-heading">
        <p className="eyebrow">Khu vực hạn chế</p>
        <h1>
          <ShieldCheck size={30} />
          Bảng điều khiển quản trị
        </h1>
        <p className="muted">Theo dõi nội dung và phản hồi của người dùng.</p>
      </header>

      {notice ? (
        <button className="toast" type="button" onClick={() => setNotice('')}>
          {notice}
        </button>
      ) : null}

      <div className="admin-metrics">
        <article>
          <Eye size={22} />
          <span>Tổng lượt truy cập</span>
          <strong aria-live="polite">
            {viewCount === null ? '—' : viewCount.toLocaleString('vi-VN')}
          </strong>
          <small>{statsError || 'Dữ liệu cập nhật trực tiếp từ hệ thống'}</small>
        </article>
        <article>
          <Pencil size={22} />
          <span>Ngân hàng câu hỏi</span>
          <strong aria-live="polite">
            {questionsLoading ? '—' : questions.length.toLocaleString('vi-VN')}
          </strong>
          <small>{questionsError || 'Dữ liệu cập nhật trực tiếp từ database'}</small>
          <button
            className="secondary-action"
            disabled={questionsLoading}
            type="button"
            onClick={() => setQuestionManagerOpen(true)}
          >
            <Pencil size={17} />
            Quản lý câu hỏi
          </button>
        </article>
      </div>

      <section className="moderation-section">
        <div className="section-title">
          <MessageSquare size={20} />
          <h2>Kiểm duyệt bình luận</h2>
        </div>
        <div className="moderation-list">
          {commentsLoading ? (
            <p className="muted">Đang tải bình luận...</p>
          ) : commentsError ? (
            <p className="notice">{commentsError}</p>
          ) : comments.length ? (
            comments.map((comment) => (
              <article key={comment.id}>
                <div>
                  <strong>{comment.author}</strong>
                  <span>{comment.rating}/5</span>
                  <p>{comment.content}</p>
                </div>
                <button
                  className="danger-action"
                  disabled={deletingCommentId === comment.id}
                  type="button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 size={17} />
                  {deletingCommentId === comment.id ? 'Đang xóa...' : 'Xóa'}
                </button>
              </article>
            ))
          ) : (
            <p className="muted">Không còn bình luận chờ xử lý.</p>
          )}
        </div>
      </section>

      <QuestionManager
        onClose={() => setQuestionManagerOpen(false)}
        onNotice={setNotice}
        onQuestionsChange={(nextQuestions) => {
          setQuestions(nextQuestions);
          setQuestionsError('');
        }}
        open={questionManagerOpen}
        questions={questions}
        token={token}
      />
    </section>
  );
}
