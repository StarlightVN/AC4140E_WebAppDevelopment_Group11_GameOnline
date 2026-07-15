import { useCallback, useEffect, useState } from 'react';

import { getComments, getLeaderboard, getMyResult, addComment } from '@/src/api/rooms';
import { useSession } from '@/src/context/SessionContext';

import type { CommentItem, LeaderboardItem } from '../types';

export function useRoomResults(code: string) {
  const { session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadResults = useCallback(async () => {
    if (!session || !code) {
      return;
    }

    try {
      const [leaderboardResponse, commentResponse, myResultResponse] = await Promise.all([
        getLeaderboard(code, session.token),
        getComments(code, session.token),
        getMyResult(code, session.token),
      ]);
      setLeaderboard(leaderboardResponse.leaderboard);
      setComments(commentResponse.comments);
      setScore(myResultResponse.correctCount);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tải kết quả.');
    }
  }, [code, session]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const submitComment = useCallback(
    async (email: string, content: string, rating: number) => {
      if (!session || !code) {
        return;
      }

      setBusy(true);
      setError('');

      try {
        await addComment(
          code,
          {
            name: session.user.username,
            email: email.trim(),
            content: content.trim(),
            rating,
          },
          session.token,
        );
        await loadResults();
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Không thể gửi đánh giá.');
        throw requestError;
      } finally {
        setBusy(false);
      }
    },
    [code, session, loadResults],
  );

  return {
    session,
    leaderboard,
    comments,
    score,
    busy,
    error,
    setError,
    loadResults,
    submitComment,
  };
}
