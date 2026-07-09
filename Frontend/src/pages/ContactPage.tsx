import { Send } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { submitFeedback } from '../api/feedbackApi';
import { useAuth } from '../context/AuthContext';

export function ContactPage() {
  const { isDemo, session } = useAuth();
  const [name, setName] = useState(session?.user.username ?? '');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !content.trim()) {
      setNotice('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      if (!isDemo) {
        await submitFeedback({
          name: name.trim(),
          email: email.trim(),
          content: content.trim(),
        });
      }
      setContent('');
      setNotice(isDemo ? 'Đã ghi nhận góp ý trong chế độ demo.' : 'Gửi góp ý thành công.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể gửi góp ý.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="content-page">
      <header className="page-heading">
        <p className="eyebrow">Nhóm 11 · Web App Development</p>
        <h1>Liên hệ và góp ý</h1>
        <p className="muted">
          Gửi phản hồi về câu hỏi, lỗi vận hành hoặc trải nghiệm sử dụng Quiz Arena.
        </p>
      </header>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Họ và tên
          <input required value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Nội dung
          <textarea
            required
            rows={6}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>
        {notice ? <p className="notice">{notice}</p> : null}
        <button className="primary-action" disabled={busy} type="submit">
          <Send size={18} />
          {busy ? 'Đang gửi...' : 'Gửi ý kiến'}
        </button>
      </form>
    </section>
  );
}
