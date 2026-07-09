import type {
  AnswerKey,
  CommentItem,
  CreateRoomResponse,
  LeaderboardItem,
  RoomQuestionsResponse,
  SubmitScoreResponse,
} from '@/src/types';

import { apiRequest } from './client';

export function createRoom(userId: number, token: string) {
  return apiRequest<CreateRoomResponse>('/room/create', {
    method: 'POST',
    token,
    body: JSON.stringify({ userId }),
  });
}

export function getRoom(roomCode: string, token: string) {
  return apiRequest<RoomQuestionsResponse>(`/room/${roomCode}`, { token });
}

export function submitAnswers(
  roomCode: string,
  userId: number,
  answers: Record<number, AnswerKey>,
  token: string,
) {
  return apiRequest<SubmitScoreResponse>(`/room/${roomCode}/submit`, {
    method: 'POST',
    token,
    body: JSON.stringify({ userId, answers }),
  });
}

export function getLeaderboard(roomCode: string, token: string) {
  return apiRequest<{ message: string; leaderboard: LeaderboardItem[] }>(
    `/room/${roomCode}/leaderboard`,
    { token },
  );
}

export function addComment(
  roomCode: string,
  data: { name: string; email: string; content: string; rating: number },
  token: string,
) {
  return apiRequest<{ message: string }>(`/room/${roomCode}/comments`, {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function getComments(roomCode: string, token: string) {
  return apiRequest<{ comments: CommentItem[] }>(`/room/${roomCode}/comments`, { token });
}
