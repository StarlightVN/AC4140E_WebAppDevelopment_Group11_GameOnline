import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { CommentList } from '@/src/features/results/components/CommentList';
import { Leaderboard } from '@/src/features/results/components/Leaderboard';
import { RatingForm } from '@/src/features/results/components/RatingForm';
import { ResultSummary } from '@/src/features/results/components/ResultSummary';
import { useRoomResults } from '@/src/features/results/hooks/useRoomResults';
import { resultsStyles as styles } from '@/src/styles';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ code: string; total?: string }>();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const total = Number(Array.isArray(params.total) ? params.total[0] : params.total ?? 15);
  const router = useRouter();

  const {
    session,
    leaderboard,
    comments,
    score,
    busy,
    error,
    setError,
    submitComment,
  } = useRoomResults(code ?? '');

  if (!session) {
    return <Redirect href="/auth" />;
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
          {code ? <ResultSummary code={code} score={score} total={total} /> : null}

          <View style={styles.actions}>
            <AppButton
              icon="replay"
              label="Chơi lại"
              onPress={() => code && router.replace({ pathname: '/game/[code]', params: { code } })}
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

          <Leaderboard leaderboard={leaderboard} />

          <RatingForm busy={busy} onError={setError} onSubmit={submitComment} />

          <CommentList comments={comments} />

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
