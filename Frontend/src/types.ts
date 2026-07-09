export type User = {
  id: number;
  username: string;
  role: 'admin' | 'user';
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type AuthSession = {
  token: string;
  user: User;
};

export type Question = {
  id: number;
  content: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  difficulty: number;
};

export type RoomQuestionsResponse = {
  message: string;
  roomCode: string;
  status: 'open' | 'full' | 'closed';
  totalQuestions: number;
  questions: Question[];
};

export type CreateRoomResponse = {
  message: string;
  roomCode: string;
  questionCount: number;
};

export type SubmitScoreResponse = {
  message: string;
  roomCode: string;
  userId: number;
  correctCount: number;
};

export type LeaderboardItem = {
  username: string;
  correct_count: number;
};

export type CommentItem = {
  name: string;
  content: string;
  rating: number;
  created_at: string;
};

export type AnswerKey = 'A' | 'B' | 'C' | 'D';
