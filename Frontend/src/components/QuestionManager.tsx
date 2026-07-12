import {
  ArrowDown,
  ArrowUp,
  Filter,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';

import {
  createAdminQuestion,
  deleteAdminQuestion,
  type AdminQuestionItem,
  type QuestionPayload,
  updateAdminQuestion,
} from '../api/adminApi';
import type { AnswerKey } from '../types';

const DIFFICULTIES = Array.from({ length: 15 }, (_, index) => index + 1);
const ANSWER_KEYS: AnswerKey[] = ['A', 'B', 'C', 'D'];
const EMPTY_QUESTION: QuestionPayload = {
  content: '',
  option_A: '',
  option_B: '',
  option_C: '',
  option_D: '',
  correct_answer: 'A',
  difficulty: 1,
};

type SortDirection = 'asc' | 'desc';

type Props = {
  open: boolean;
  questions: AdminQuestionItem[];
  token: string;
  onClose: () => void;
  onNotice: (message: string) => void;
  onQuestionsChange: (questions: AdminQuestionItem[]) => void;
};

export function QuestionManager({
  open,
  questions,
  token,
  onClose,
  onNotice,
  onQuestionsChange,
}: Props) {
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<QuestionPayload>({ ...EMPTY_QUESTION });
  const [editorError, setEditorError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const visibleQuestions = useMemo(() => {
    const filtered = difficultyFilter === 'all'
      ? [...questions]
      : questions.filter((question) => question.difficulty === Number(difficultyFilter));

    filtered.sort((left, right) =>
      sortDirection === 'asc'
        ? left.difficulty - right.difficulty || left.id - right.id
        : right.difficulty - left.difficulty || right.id - left.id,
    );

    return filtered;
  }, [difficultyFilter, questions, sortDirection]);

  function closeManager() {
    if (saving || deletingId !== null) return;
    setEditorMode(null);
    setEditorError('');
    onClose();
  }

  function openCreateEditor() {
    setEditingId(null);
    setDraft({ ...EMPTY_QUESTION });
    setEditorError('');
    setEditorMode('create');
  }

  function openEditEditor(question: AdminQuestionItem) {
    const { id, ...questionData } = question;
    setEditingId(id);
    setDraft(questionData);
    setEditorError('');
    setEditorMode('edit');
  }

  function closeEditor() {
    if (saving) return;
    setEditorMode(null);
    setEditorError('');
  }

  function updateDraft<Key extends keyof QuestionPayload>(
    key: Key,
    value: QuestionPayload[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hasEmptyField = [
      draft.content,
      draft.option_A,
      draft.option_B,
      draft.option_C,
      draft.option_D,
    ].some((value) => !value.trim());

    if (hasEmptyField) {
      setEditorError('Vui lòng nhập nội dung câu hỏi và đầy đủ 4 đáp án.');
      return;
    }

    setSaving(true);
    setEditorError('');

    try {
      if (editorMode === 'edit' && editingId !== null) {
        const response = await updateAdminQuestion(editingId, draft, token);
        onQuestionsChange(
          questions.map((question) =>
            question.id === editingId ? response.question : question,
          ),
        );
        onNotice(response.message);
      } else {
        const response = await createAdminQuestion(draft, token);
        onQuestionsChange([...questions, response.question]);
        onNotice(response.message);
      }

      setEditorMode(null);
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : 'Không thể lưu câu hỏi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(question: AdminQuestionItem) {
    const confirmed = window.confirm(
      `Xóa câu hỏi #${question.id}? Câu hỏi sẽ bị gỡ khỏi các phòng đang sử dụng.`,
    );

    if (!confirmed) return;

    setDeletingId(question.id);

    try {
      const response = await deleteAdminQuestion(question.id, token);
      onQuestionsChange(questions.filter((item) => item.id !== question.id));
      onNotice(response.message);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Không thể xóa câu hỏi.');
    } finally {
      setDeletingId(null);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="admin-dialog-overlay">
        <section
          aria-labelledby="question-manager-title"
          aria-modal="true"
          className="question-manager-dialog"
          role="dialog"
        >
          <header className="admin-dialog-header">
            <div>
              <p className="eyebrow">Ngân hàng dữ liệu</p>
              <h2 id="question-manager-title">Quản lý câu hỏi</h2>
              <p className="muted">{questions.length} câu hỏi trong hệ thống</p>
            </div>
            <button
              aria-label="Đóng quản lý câu hỏi"
              className="icon-button"
              onClick={closeManager}
              title="Đóng"
              type="button"
            >
              <X size={20} />
            </button>
          </header>

          <div className="question-toolbar">
            <label className="question-control">
              <span><Filter size={16} /> Độ khó</span>
              <select
                onChange={(event) => setDifficultyFilter(event.target.value)}
                value={difficultyFilter}
              >
                <option value="all">Tất cả mức</option>
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>Mức {difficulty}</option>
                ))}
              </select>
            </label>

            <p className="question-result-count">
              Hiển thị <strong>{visibleQuestions.length}</strong> câu
            </p>

            <button className="primary-action" onClick={openCreateEditor} type="button">
              <Plus size={18} />
              Thêm câu hỏi
            </button>
          </div>

          <div className="question-table-scroll">
            <table className="question-table">
              <thead>
                <tr>
                  <th scope="col">Câu hỏi</th>
                  <th scope="col">4 đáp án</th>
                  <th scope="col">Đáp án đúng</th>
                  <th
                    aria-sort={sortDirection === 'asc' ? 'ascending' : 'descending'}
                    scope="col"
                  >
                    <button
                      aria-label={`Sắp xếp độ khó ${sortDirection === 'asc' ? 'giảm dần' : 'tăng dần'}`}
                      className="question-sort-button"
                      onClick={() =>
                        setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
                      }
                      title={`Đang xếp ${sortDirection === 'asc' ? 'tăng dần' : 'giảm dần'}`}
                      type="button"
                    >
                      Độ khó
                      {sortDirection === 'asc' ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
                    </button>
                  </th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {visibleQuestions.map((question) => (
                  <tr key={question.id}>
                    <td className="question-content-cell">
                      <small>#{question.id}</small>
                      <strong>{question.content}</strong>
                    </td>
                    <td>
                      <ul className="question-option-list">
                        {ANSWER_KEYS.map((key) => (
                          <li
                            className={question.correct_answer === key ? 'correct' : ''}
                            key={key}
                          >
                            <strong>{key}</strong>
                            <span>{question[`option_${key}`]}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td><span className="correct-answer-badge">{question.correct_answer}</span></td>
                    <td><span className="difficulty-badge">Mức {question.difficulty}</span></td>
                    <td>
                      <div className="question-row-actions">
                        <button
                          aria-label={`Sửa câu hỏi ${question.id}`}
                          className="icon-button"
                          onClick={() => openEditEditor(question)}
                          title="Sửa câu hỏi"
                          type="button"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          aria-label={`Xóa câu hỏi ${question.id}`}
                          className="icon-button question-delete-button"
                          disabled={deletingId === question.id}
                          onClick={() => handleDelete(question)}
                          title="Xóa câu hỏi"
                          type="button"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleQuestions.length === 0 ? (
              <p className="question-empty">Không có câu hỏi phù hợp với bộ lọc.</p>
            ) : null}
          </div>
        </section>
      </div>

      {editorMode ? (
        <div className="admin-dialog-overlay question-editor-overlay">
          <section
            aria-labelledby="question-editor-title"
            aria-modal="true"
            className="question-editor-dialog"
            role="dialog"
          >
            <header className="admin-dialog-header">
              <div>
                <p className="eyebrow">{editorMode === 'create' ? 'Câu hỏi mới' : `Câu hỏi #${editingId}`}</p>
                <h2 id="question-editor-title">
                  {editorMode === 'create' ? 'Thêm câu hỏi' : 'Sửa câu hỏi'}
                </h2>
              </div>
              <button
                aria-label="Đóng biểu mẫu câu hỏi"
                className="icon-button"
                onClick={closeEditor}
                title="Đóng"
                type="button"
              >
                <X size={20} />
              </button>
            </header>

            <form className="question-editor-form" onSubmit={handleSave}>
              <label>
                Nội dung câu hỏi
                <textarea
                  autoFocus
                  onChange={(event) => updateDraft('content', event.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  rows={3}
                  value={draft.content}
                />
              </label>

              <div className="question-option-editor-grid">
                {ANSWER_KEYS.map((key) => (
                  <label key={key}>
                    Đáp án {key}
                    <input
                      onChange={(event) => updateDraft(`option_${key}`, event.target.value)}
                      placeholder={`Nội dung đáp án ${key}`}
                      value={draft[`option_${key}`]}
                    />
                  </label>
                ))}
              </div>

              <div className="question-editor-meta">
                <label>
                  Đáp án chính xác
                  <select
                    onChange={(event) =>
                      updateDraft('correct_answer', event.target.value as AnswerKey)
                    }
                    value={draft.correct_answer}
                  >
                    {ANSWER_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>

                <label>
                  Độ khó
                  <select
                    onChange={(event) => updateDraft('difficulty', Number(event.target.value))}
                    value={draft.difficulty}
                  >
                    {DIFFICULTIES.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>Mức {difficulty}</option>
                    ))}
                  </select>
                </label>
              </div>

              {editorError ? <p className="notice">{editorError}</p> : null}

              <div className="question-editor-actions">
                <button className="secondary-action" onClick={closeEditor} type="button">
                  Hủy
                </button>
                <button className="primary-action" disabled={saving} type="submit">
                  <Save size={18} />
                  {saving ? 'Đang lưu...' : 'Lưu câu hỏi'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
