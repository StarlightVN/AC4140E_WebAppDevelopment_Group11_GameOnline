import { apiRequest } from './client';
import type {
  CommentItem,
  CreateRoomResponse,
  LeaderboardItem,
  RoomQuestionsResponse,
} from '../types';

export function createRoom(userId: number) {
  return apiRequest<CreateRoomResponse>('/room/create', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function getRoomQuestions(roomCode: string) {
  return apiRequest<RoomQuestionsResponse>(`/room/${roomCode}`);
}

export function submitScore(roomCode: string, userId: number, correctCount: number) {
  return apiRequest<{ message: string; roomCode: string; userId: number; correctCount: number }>(
    `/room/${roomCode}/submit`,
    {
      method: 'POST',
      body: JSON.stringify({ userId, correctCount }),
    },
  );
}

export function getLeaderboard(roomCode: string) {
  return apiRequest<{ message: string; leaderboard: LeaderboardItem[] }>(
    `/room/${roomCode}/leaderboard`,
  );
}

export function addComment(
  roomCode: string,
  data: { name: string; email: string; content: string; rating: number },
) {
  return apiRequest<{ message: string }>(`/room/${roomCode}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getComments(roomCode: string) {
  return apiRequest<{ comments: CommentItem[] }>(`/room/${roomCode}/comments`);
}
