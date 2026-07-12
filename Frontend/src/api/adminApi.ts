import { apiRequest } from './client';
import type { AnswerKey } from '../types';

export type AdminCommentItem = {
  id: number;
  author: string;
  rating: number;
  content: string;
  created_at: string;
};

export type AdminFeedbackItem = {
  id: number;
  name: string;
  email: string;
  content: string;
  created_at: string;
};

export type AdminQuestionItem = {
  id: number;
  content: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  correct_answer: AnswerKey;
  difficulty: number;
};

export type QuestionPayload = Omit<AdminQuestionItem, 'id'>;

export function getAdminComments(token: string) {
  return apiRequest<{ comments: AdminCommentItem[] }>('/room/admin/comments/all', { token });
}

export function getAdminFeedbacks(token: string) {
  return apiRequest<{ feedbacks: AdminFeedbackItem[] }>('/feedback/admin/all', { token });
}

export function deleteAdminFeedback(feedbackId: number, token: string) {
  return apiRequest<{ message: string }>(`/feedback/admin/${feedbackId}`, {
    method: 'DELETE',
    token,
  });
}

export function deleteAdminComment(commentId: number, token: string) {
  return apiRequest<{ message: string }>(`/room/admin/comments/${commentId}`, {
    method: 'DELETE',
    token,
  });
}

export function getAdminQuestions(token: string) {
  return apiRequest<{ total: number; questions: AdminQuestionItem[] }>('/room/admin/questions', {
    token,
  });
}

export function createAdminQuestion(data: QuestionPayload, token: string) {
  return apiRequest<{ message: string; question: AdminQuestionItem }>('/room/admin/questions', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export function updateAdminQuestion(questionId: number, data: QuestionPayload, token: string) {
  return apiRequest<{ message: string; question: AdminQuestionItem }>(
    `/room/admin/questions/${questionId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    },
  );
}

export function deleteAdminQuestion(questionId: number, token: string) {
  return apiRequest<{ message: string }>(`/room/admin/questions/${questionId}`, {
    method: 'DELETE',
    token,
  });
}
