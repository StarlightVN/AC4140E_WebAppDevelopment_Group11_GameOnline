import { Eye, MessageSquare, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';

type ModerationItem = {
  id: number;
  author: string;
  rating: number;
  content: string;
};

const initialComments: ModerationItem[] = [
  {
    id: 1,
    author: 'Nguyễn Văn A',
    rating: 5,
    content: 'Bộ câu hỏi rất hay, web chạy mượt!',
  },
];

export function AdminPage() {
  const [comments, setComments] = useState(initialComments);
  const [notice, setNotice] = useState('');

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
          <strong>1,245</strong>
          <small>Dữ liệu mẫu, chưa nối API thống kê</small>
        </article>
        <article>
          <Pencil size={22} />
          <span>Ngân hàng câu hỏi</span>
          <strong>29</strong>
          <button
            className="secondary-action"
            type="button"
            onClick={() => setNotice('API cập nhật câu hỏi chưa được triển khai.')}
          >
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
          {comments.length ? (
            comments.map((comment) => (
              <article key={comment.id}>
                <div>
                  <strong>{comment.author}</strong>
                  <span>{comment.rating}/5</span>
                  <p>{comment.content}</p>
                </div>
                <button
                  className="danger-action"
                  type="button"
                  onClick={() => {
                    setComments((current) => current.filter((item) => item.id !== comment.id));
                    setNotice('Đã ẩn bình luận khỏi giao diện quản trị.');
                  }}
                >
                  <Trash2 size={17} />
                  Xóa
                </button>
              </article>
            ))
          ) : (
            <p className="muted">Không còn bình luận chờ xử lý.</p>
          )}
        </div>
      </section>
    </section>
  );
}
