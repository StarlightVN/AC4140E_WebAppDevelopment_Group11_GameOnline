import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { LoadingView } from '@/components/LoadingView';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getRoom } from '@/src/api/rooms';
import { useSession } from '@/src/context/SessionContext';
import { roomStyles as styles } from '@/src/styles';
import { colors } from '@/src/theme';
import type { RoomQuestionsResponse } from '@/src/types';

export default function RoomScreen() {
  const params = useLocalSearchParams<{ code: string }>();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const router = useRouter();
  const { session } = useSession();
  const [room, setRoom] = useState<RoomQuestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadRoom = useCallback(async () => {
    if (!session || !code) {
      return;
    }

    setError('');

    try {
      setRoom(await getRoom(code, session.token));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tải phòng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [code, session]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  if (!session) {
    return <Redirect href="/auth" />;
  }

  if (loading) {
    return <LoadingView label="Đang chuẩn bị phòng..." />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              setRefreshing(true);
              loadRoom();
            }}
            refreshing={refreshing}
            tintColor={colors.red}
          />
        }
        showsVerticalScrollIndicator={false}>
        <ScreenHeader back subtitle={room ? `${room.totalQuestions} câu hỏi` : undefined} title="Phòng chờ" />

        {room ? (
          <>
            <View style={styles.codePanel}>
              <Text style={styles.codeLabel}>MÃ PHÒNG</Text>
              <Text adjustsFontSizeToFit numberOfLines={1} style={styles.code}>
                {room.roomCode}
              </Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {room.status === 'open' ? 'Đang mở' : room.status}
                </Text>
              </View>
              <AppButton
                icon="share-variant-outline"
                label="Chia sẻ mã"
                onPress={() =>
                  Share.share({ message: `Vào Quiz Arena với mã phòng ${room.roomCode}` })
                }
                variant="secondary"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lộ trình câu hỏi</Text>
              <Text style={styles.sectionCopy}>
                Các câu được xếp từ dễ đến khó. Mỗi câu có 20 giây lựa chọn.
              </Text>
              <View style={styles.levelGrid}>
                {room.questions.map((question, index) => (
                  <View key={question.id} style={styles.levelCell}>
                    <Text style={styles.levelNumber}>{index + 1}</Text>
                    <Text style={styles.levelLabel}>Mức {question.difficulty}</Text>
                  </View>
                ))}
              </View>
            </View>

            <AppButton
              disabled={!room.questions.length}
              icon="play"
              label="Bắt đầu thi đấu"
              onPress={() =>
                router.push({ pathname: '/game/[code]', params: { code: room.roomCode } })
              }
            />
          </>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons color={colors.redDark} name="alert-circle-outline" size={24} />
            <Text style={styles.errorText}>{error}</Text>
            <AppButton label="Thử lại" onPress={loadRoom} variant="secondary" />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
