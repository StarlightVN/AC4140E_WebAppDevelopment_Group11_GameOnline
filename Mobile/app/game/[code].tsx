import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { LoadingView } from '@/components/LoadingView';
import { getRoom, submitAnswers } from '@/src/api/rooms';
import { useSession } from '@/src/context/SessionContext';
import { gameStyles as styles } from '@/src/styles';
import { colors } from '@/src/theme';
import type { AnswerKey, Question, RoomQuestionsResponse } from '@/src/types';

const QUESTION_SECONDS = 20;
const answerKeys: AnswerKey[] = ['A', 'B', 'C', 'D'];

function getOption(question: Question, key: AnswerKey) {
  return question[`option_${key}`];
}

export default function GameScreen() {
  const params = useLocalSearchParams<{ code: string }>();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const router = useRouter();
  const { session } = useSession();
  const [room, setRoom] = useState<RoomQuestionsResponse | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerKey>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const question = room?.questions[questionIndex];
  const progress = room?.questions.length
    ? ((questionIndex + 1) / room.questions.length) * 100
    : 0;
  const selectedAnswer = question ? answers[question.id] : undefined;
  const isLastQuestion = room ? questionIndex === room.questions.length - 1 : false;

  useEffect(() => {
    if (!session || !code) {
      return;
    }

    getRoom(code, session.token)
      .then(setRoom)
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : 'Không thể tải câu hỏi.'),
      )
      .finally(() => setLoading(false));
  }, [code, session]);

  useEffect(() => {
    if (!question) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [question]);

  const timerColor = useMemo(() => {
    if (timeLeft <= 5) return colors.red;
    if (timeLeft <= 10) return colors.gold;
    return colors.teal;
  }, [timeLeft]);

  if (!session) {
    router.replace('/auth');
    return null;
  }

  if (loading) {
    return <LoadingView label="Đang tải bộ câu hỏi..." />;
  }

  async function handleAdvance() {
    if (!room || !session || !code) {
      return;
    }

    if (!isLastQuestion) {
      setTimeLeft(QUESTION_SECONDS);
      setQuestionIndex((current) => current + 1);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await submitAnswers(code, session.user.id, answers, session.token);
      router.replace({
        pathname: '/results/[code]',
        params: {
          code,
          score: String(result.correctCount),
          total: String(room.questions.length),
        },
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể nộp kết quả.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!question || !room) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <MaterialCommunityIcons color={colors.red} name="alert-outline" size={38} />
          <Text style={styles.errorText}>{error || 'Phòng chưa có câu hỏi.'}</Text>
          <AppButton label="Về trang chủ" onPress={() => router.replace('/home')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gameHeader}>
          <View>
            <Text style={styles.roomLabel}>PHÒNG {code}</Text>
            <Text style={styles.questionCount}>
              Câu {questionIndex + 1}/{room.questions.length}
            </Text>
          </View>
          <View style={[styles.timer, { borderColor: timerColor }]}>
            <Text style={[styles.timerValue, { color: timerColor }]}>{timeLeft}</Text>
            <Text style={styles.timerUnit}>giây</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.questionBlock}>
          <View style={styles.difficulty}>
            <MaterialCommunityIcons color={colors.red} name="signal" size={17} />
            <Text style={styles.difficultyText}>Mức độ {question.difficulty}</Text>
          </View>
          <Text style={styles.questionText}>{question.content}</Text>
        </View>

        <View style={styles.answers}>
          {answerKeys.map((key) => {
            const selected = selectedAnswer === key;

            return (
              <Pressable
                key={key}
                onPress={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: key,
                  }))
                }
                style={({ pressed }) => [
                  styles.answer,
                  selected && styles.answerSelected,
                  pressed && styles.answerPressed,
                ]}>
                <View style={[styles.answerKey, selected && styles.answerKeySelected]}>
                  <Text style={[styles.answerKeyText, selected && styles.answerKeyTextSelected]}>
                    {key}
                  </Text>
                </View>
                <Text style={[styles.answerText, selected && styles.answerTextSelected]}>
                  {getOption(question, key)}
                </Text>
                {selected ? (
                  <MaterialCommunityIcons color={colors.red} name="check-circle" size={23} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <AppButton
          icon={isLastQuestion ? 'flag-checkered' : 'arrow-right'}
          label={isLastQuestion ? 'Nộp kết quả' : 'Câu tiếp theo'}
          loading={submitting}
          onPress={handleAdvance}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
