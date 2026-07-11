import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { FormField } from '@/components/FormField';
import {
  addComment,
  getComments,
  getLeaderboard,
} from '@/src/api/rooms';
import { useSession } from '@/src/context/SessionContext';
import { resultsStyles as styles } from '@/src/styles';
import { colors } from '@/src/theme';
import type { CommentItem, LeaderboardItem } from '@/src/types';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ code: string; score?: string; total?: string }>();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const score = Number(Array.isArray(params.score) ? params.score[0] : params.score ?? 0);
  const total = Number(Array.isArray(params.total) ? params.total[0] : params.total ?? 15);
  const router = useRouter();
  const { session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const activeSession = session;

  const loadResults = useCallback(async () => {
    if (!session || !code) {
      return;
    }

    try {
      const [leaderboardResponse, commentResponse] = await Promise.all([
        getLeaderboard(code, session.token),
        getComments(code, session.token),
      ]);
      setLeaderboard(leaderboardResponse.leaderboard);
      setComments(commentResponse.comments);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tải kết quả.');
    }
  }, [code, session]);

  useEffect(() => {
    if (!session || !code) {
      return;
    }

    let active = true;

    Promise.all([
      getLeaderboard(code, session.token),
      getComments(code, session.token),
    ])
      .then(([leaderboardResponse, commentResponse]) => {
        if (active) {
          setLeaderboard(leaderboardResponse.leaderboard);
          setComments(commentResponse.comments);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Không thể tải kết quả.');
        }
      });

    return () => {
      active = false;
    };
  }, [code, session]);

  if (!activeSession) {
    router.replace('/auth');
    return null;
  }

  const { token, user } = activeSession;

  async function handleComment() {
    if (!code || !content.trim()) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      await addComment(
        code,
        {
          name: user.username,
          email: email.trim() || `${user.username}@local.test`,
          content: content.trim(),
          rating,
        },
        token,
      );
      setContent('');
      await loadResults();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể gửi đánh giá.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.resultHeader}>
            <View style={styles.trophy}>
              <MaterialCommunityIcons color={colors.white} name="trophy" size={34} />
            </View>
            <Text style={styles.eyebrow}>HOÀN THÀNH PHÒNG {code}</Text>
            <Text style={styles.title}>Kết quả của bạn</Text>
            <Text style={styles.score}>
              {score}<Text style={styles.scoreTotal}>/{total}</Text>
            </Text>
            <Text style={styles.scoreLabel}>câu trả lời chính xác</Text>
          </View>

          <View style={styles.actions}>
            <AppButton
              icon="replay"
              label="Chơi lại"
              onPress={() => router.replace({ pathname: '/game/[code]', params: { code } })}
              style={styles.action}
              variant="secondary"
            />
            <AppButton
              icon="home-outline"
              label="Trang chủ"
              onPress={() => router.replace('/home')}
              style={styles.action}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bảng xếp hạng</Text>
            <View style={styles.list}>
              {leaderboard.length ? (
                leaderboard.map((item, index) => (
                  <View key={`${item.username}-${index}`} style={styles.rankRow}>
                    <View style={[styles.rank, index < 3 && styles.rankTop]}>
                      <Text style={[styles.rankText, index < 3 && styles.rankTextTop]}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text numberOfLines={1} style={styles.playerName}>
                      {item.username}
                    </Text>
                    <Text style={styles.playerScore}>{item.correct_count}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Chưa có dữ liệu xếp hạng.</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đánh giá phòng</Text>
            <FormField
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder={`${user.username}@local.test`}
              value={email}
            />
            <Text style={styles.fieldLabel}>Mức đánh giá</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  accessibilityLabel={`${value} sao`}
                  key={value}
                  onPress={() => setRating(value)}
                  style={[styles.ratingButton, rating === value && styles.ratingActive]}>
                  <MaterialCommunityIcons
                    color={rating === value ? colors.white : colors.gold}
                    name="star"
                    size={22}
                  />
                  <Text
                    style={[styles.ratingText, rating === value && styles.ratingTextActive]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              multiline
              onChangeText={setContent}
              placeholder="Cảm nhận của bạn..."
              placeholderTextColor={colors.muted}
              style={styles.commentInput}
              textAlignVertical="top"
              value={content}
            />
            <AppButton
              disabled={!content.trim()}
              icon="send"
              label="Gửi đánh giá"
              loading={busy}
              onPress={handleComment}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bình luận gần đây</Text>
            <View style={styles.comments}>
              {comments.length ? (
                comments.slice(0, 6).map((comment, index) => (
                  <View key={`${comment.name}-${comment.created_at}-${index}`} style={styles.comment}>
                    <View style={styles.commentHead}>
                      <Text style={styles.commentName}>{comment.name}</Text>
                      <Text style={styles.commentRating}>{comment.rating}/5</Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Hãy là người đầu tiên đánh giá phòng này.</Text>
              )}
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
