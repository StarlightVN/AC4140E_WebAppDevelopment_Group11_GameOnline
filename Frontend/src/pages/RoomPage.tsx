import { Copy, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getRoomQuestions } from '../api/roomApi';
import { useAuth } from '../context/AuthContext';
import { createDemoRoom } from '../demoData';
import type { RoomQuestionsResponse } from '../types';

function getRoomStatusLabel(status: RoomQuestionsResponse['status']) {
  if (status === 'open') return 'Đang mở';
  if (status === 'full') return 'Đã đầy';
  return 'Đã đóng';
}

export function RoomPage() {
  const { roomCode = '' } = useParams();
  const { isDemo } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomQuestionsResponse | null>(null);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (isDemo) {
      setRoom(createDemoRoom(roomCode));
      setBusy(false);
      return;
    }

    getRoomQuestions(roomCode)
      .then(setRoom)
      .catch((error) => setNotice(error instanceof Error ? error.message : 'Không thể tải phòng.'))
      .finally(() => setBusy(false));
  }, [isDemo, roomCode]);

  async function copyRoomCode() {
    try {
      await navigator.clipboard.writeText(roomCode);
      setNotice('Đã sao chép mã phòng.');
    } catch {
      setNotice(roomCode);
    }
  }

  if (busy) {
    return <p className="page-status">Đang tải phòng {roomCode}...</p>;
  }

  if (!room) {
    return (
      <section className="empty-page">
        <h1>Không tìm thấy phòng</h1>
        <p className="notice">{notice || 'Mã phòng không tồn tại.'}</p>
        <button className="primary-action" type="button" onClick={() => navigate('/')}>
          Về trang chủ
        </button>
      </section>
    );
  }

  return (
    <>
      {notice ? (
        <button className="toast" type="button" onClick={() => setNotice('')}>
          {notice}
        </button>
      ) : null}

      <section className="lobby-layout">
        <article className="room-card room-code-card">
          <p className="eyebrow">Mã phòng</p>
          <h1>{room.roomCode}</h1>
          <div className="status-row">
            <span aria-hidden="true" />
            <strong>{getRoomStatusLabel(room.status)}</strong>
          </div>

          <div className="room-stats">
            <span>{room.questions.length} câu</span>
            <span>20 giây mỗi câu</span>
          </div>

          <button
            className="secondary-action wide"
            type="button"
            onClick={copyRoomCode}
          >
            <Copy size={18} />
            Chia sẻ mã
          </button>
        </article>

        <article className="question-preview">
          <div>
            <p className="eyebrow">Lộ trình câu hỏi</p>
            <h2>Độ khó tăng dần</h2>
            <p className="muted">Các câu được xếp từ dễ đến khó. Mỗi câu có 20 giây lựa chọn.</p>
          </div>

          <div className="difficulty-track">
            {room.questions.map((question, index) => (
              <span key={question.id}>
                <strong>{index + 1}</strong>
                <small>Mức {question.difficulty}</small>
              </span>
            ))}
          </div>

          <button
            className="primary-action wide"
            disabled={!room.questions.length}
            type="button"
            onClick={() => navigate(`/game/${room.roomCode}`)}
          >
            <Play size={18} />
            Bắt đầu thi đấu
          </button>
        </article>
      </section>
    </>
  );
}
