import { Check, Home, Play, Timer, Trophy } from 'lucide-react';
import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getRoomQuestions, submitScore } from '../api/roomApi';
import { useAuth } from '../context/AuthContext';
import { createDemoRoom } from '../demoData';
import type { AnswerKey, Question, RoomQuestionsResponse } from '../types';

const OPTION_KEYS: AnswerKey[] = ['A', 'B', 'C', 'D'];
const QUESTION_SECONDS = 20;
const seatNames = ['An', 'Bình', 'Chi', 'Dũng', 'Hà'];

function getOptionText(question: Question, key: AnswerKey) {
  return question[`option_${key}`];
}

export function GamePage() {
  const { roomCode = '' } = useParams();
  const { isDemo, session } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomQuestionsResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerKey>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
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
      .catch((error) => setNotice(error instanceof Error ? error.message : 'Không thể tải câu hỏi.'))
      .finally(() => setBusy(false));
  }, [isDemo, roomCode]);

  useEffect(() => {
    if (!room?.questions[currentQuestionIndex]) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentQuestionIndex, room]);

  const currentQuestion = room?.questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = room?.questions.length
    ? (questionNumber / room.questions.length) * 100
    : 0;
  const timerPercent = (timeLeft / QUESTION_SECONDS) * 100;
  const seats = useMemo(
    () => [
      { name: session?.user.username ?? 'Host', active: true },
      ...seatNames.map((name, index) => ({ name, active: index < 3 })),
    ],
    [session],
  );

  async function goToNextQuestion() {
    if (!room || !session) return;

    if (currentQuestionIndex < room.questions.length - 1) {
      setTimeLeft(QUESTION_SECONDS);
      setCurrentQuestionIndex((current) => current + 1);
      return;
    }

    setBusy(true);
    setNotice('');

    try {
      const score = isDemo
        ? answeredCount
        : (await submitScore(roomCode, session.user.id, answers)).correctCount;

      navigate(`/results/${roomCode}`, {
        replace: true,
        state: { score, total: room.questions.length },
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không thể nộp kết quả.');
    } finally {
      setBusy(false);
    }
  }

  if (busy && !room) {
    return <p className="page-status">Đang tải câu hỏi...</p>;
  }

  if (!room || !currentQuestion) {
    return (
      <section className="empty-page">
        <h1>Không thể mở trò chơi</h1>
        <p className="notice">{notice || 'Phòng chưa có câu hỏi.'}</p>
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
                  onClick={() =>
                    setAnswers((current) => ({ ...current, [currentQuestion.id]: key }))
                  }
                >
                  <span>{key}</span>
                  {getOptionText(currentQuestion, key)}
                  {selected ? <Check size={18} /> : null}
                </button>
              );
            })}
          </div>

          <div className="game-actions">
            <button
              className="secondary-action"
              type="button"
              onClick={() => navigate(`/room/${roomCode}`)}
            >
              <Home size={18} />
              Phòng
            </button>
            <button className="primary-action" type="button" onClick={goToNextQuestion} disabled={busy}>
              {currentQuestionIndex === room.questions.length - 1 ? (
                <Trophy size={18} />
              ) : (
                <Play size={18} />
              )}
              {currentQuestionIndex === room.questions.length - 1 ? 'Kết thúc' : 'Câu tiếp'}
            </button>
          </div>
        </article>

        <aside className="side-panel">
          <div>
            <p className="eyebrow">Tiến độ</p>
            <h2>
              {answeredCount}/{room.questions.length}
            </h2>
          </div>
          <div className="mini-rank">
            {seats.map((seat, index) => (
              <div key={seat.name}>
                <span>{index + 1}</span>
                <strong>{seat.name}</strong>
                <small>{seat.active ? 'online' : 'idle'}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
