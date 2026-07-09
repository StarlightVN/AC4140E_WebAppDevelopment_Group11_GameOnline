import { DoorOpen, Users, X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import arenaArt from '../assets/quiz-arena-banner.png';
import { createRoom } from '../api/roomApi';
import { useAuth } from '../context/AuthContext';

function formatRoomCode(value: string) {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function HomePage() {
  const { isDemo, session } = useAuth();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const hasClosedAd = document.cookie
      .split('; ')
      .some((row) => row.startsWith('adClosed='));

    if (hasClosedAd) {
      return;
    }

    const timer = window.setTimeout(() => setShowAd(true), 60000);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleCreateRoom() {
    if (!session) return;

    setBusy(true);
    setNotice('');

    try {
      if (isDemo) {
        navigate('/room/112233');
        return;
      }

      const response = await createRoom(session.user.id);
      navigate(`/room/${response.roomCode}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể tạo phòng.');
    } finally {
      setBusy(false);
    }
  }

  function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (roomCode.length !== 6) {
      setNotice('Mã phòng gồm đúng 6 chữ số.');
      return;
    }

    navigate(`/room/${roomCode}`);
  }

  function closeAd() {
    setShowAd(false);
    document.cookie = 'adClosed=true; max-age=86400; path=/';
  }

  return (
    <>
      {notice ? (
        <button className="toast" type="button" onClick={() => setNotice('')}>
          {notice}
        </button>
      ) : null}

      <section className="home-grid">
        <article className="command-panel">
          <div>
            <p className="eyebrow">Phòng chơi</p>
            <h1>Chọn phòng để bắt đầu</h1>
          </div>

          <div className="command-row">
            <button className="primary-action" type="button" onClick={handleCreateRoom} disabled={busy}>
              <Users size={18} />
              {isDemo ? 'Tạo phòng demo' : 'Tạo phòng'}
            </button>

            <form className="join-form" onSubmit={handleJoinRoom}>
              <input
                inputMode="numeric"
                onChange={(event) => setRoomCode(formatRoomCode(event.target.value))}
                placeholder="Mã phòng"
                value={roomCode}
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

      {showAd ? (
        <div className="ad-overlay" role="dialog" aria-modal="true" aria-labelledby="ad-title">
          <div className="ad-dialog">
            <button className="ad-close" type="button" onClick={closeAd} aria-label="Đóng quảng cáo">
              <X size={20} />
            </button>
            <p className="eyebrow">Ưu đãi đặc biệt</p>
            <h2 id="ad-title">Nâng cấp tài khoản VIP</h2>
            <p className="muted">
              Mở khóa bộ câu hỏi nâng cao và nhân đôi điểm thưởng trên bảng xếp hạng.
            </p>
            <div className="ad-actions">
              <button className="primary-action" type="button">Mua VIP ngay</button>
              <button className="secondary-action" type="button" onClick={closeAd}>
                Không, cảm ơn
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
