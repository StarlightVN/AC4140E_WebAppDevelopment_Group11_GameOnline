import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { createRoom } from '@/src/api/rooms';
import { useSession } from '@/src/context/SessionContext';
import { homeStyles as styles } from '@/src/styles';
import { colors, spacing } from '@/src/theme';

import { formatRoomCode } from '@/src/utils/gameHelpers';

const BANNER_ASPECT_RATIO = 2.05;

export default function HomeScreen() {
  const router = useRouter();
  const { session, signOut } = useSession();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [roomCode, setRoomCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const activeSession = session;
  const bannerWidth = Math.max(
    0,
    windowWidth - insets.left - insets.right - spacing.md * 2,
  );

  if (!activeSession) {
    return <Redirect href="/auth" />;
  }

  const { token, user } = activeSession;

  async function handleCreateRoom() {
    setBusy(true);
    setError('');

    try {
      const response = await createRoom(token);
      router.push({ pathname: '/room/[code]', params: { code: response.roomCode } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tạo phòng.');
    } finally {
      setBusy(false);
    }
  }

  function handleJoinRoom() {
    const code = formatRoomCode(roomCode);

    if (code.length !== 6) {
      setError('Mã phòng phải có đúng 6 chữ số.');
      return;
    }

    setError('');
    router.push({ pathname: '/room/[code]', params: { code } });
  }

  async function handleLogout() {
    await signOut();
    router.replace('/auth');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.eyebrow}>QUIZ ARENA</Text>
            <Text style={styles.greeting}>Chào, {user.username}</Text>
          </View>
          <Pressable accessibilityLabel="Đăng xuất" onPress={handleLogout} style={styles.iconButton}>
            <MaterialCommunityIcons color={colors.ink} name="logout" size={23} />
          </Pressable>
        </View>

        <Image
          accessibilityLabel="Đấu trường câu hỏi"
          resizeMode="cover"
          source={require('@/assets/images/quiz-arena-banner.png')}
          style={[
            styles.banner,
            {
              height: Math.round(bannerWidth / BANNER_ASPECT_RATIO),
              width: bannerWidth,
            },
          ]}
        />

        <View style={styles.quickStats}>
          <View style={styles.stat}>
            <MaterialCommunityIcons color={colors.red} name="timer-outline" size={22} />
            <Text style={styles.statValue}>20 giây</Text>
            <Text style={styles.statLabel}>mỗi câu</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons color={colors.teal} name="help-circle-outline" size={22} />
            <Text style={styles.statValue}>15 câu</Text>
            <Text style={styles.statLabel}>mỗi phòng</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons color={colors.gold} name="trophy-outline" size={22} />
            <Text style={styles.statValue}>Top 10</Text>
            <Text style={styles.statLabel}>bảng điểm</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mở phòng mới</Text>
          <Text style={styles.sectionCopy}>Tạo bộ 15 câu hỏi ngẫu nhiên từ ngân hàng dữ liệu.</Text>
          <AppButton
            icon="plus-circle-outline"
            label="Tạo phòng"
            loading={busy}
            onPress={handleCreateRoom}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vào bằng mã phòng</Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={(value) => setRoomCode(formatRoomCode(value))}
            onSubmitEditing={handleJoinRoom}
            placeholder="Nhập 6 chữ số"
            placeholderTextColor={colors.muted}
            style={styles.codeInput}
            value={roomCode}
          />
          <AppButton
            disabled={roomCode.length !== 6}
            icon="login-variant"
            label="Vào phòng"
            onPress={handleJoinRoom}
            variant="secondary"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={() => router.push('/contact')} style={styles.contactRow}>
          <View style={styles.contactIcon}>
            <MaterialCommunityIcons color={colors.teal} name="message-text-outline" size={22} />
          </View>
          <View style={styles.contactCopy}>
            <Text style={styles.contactTitle}>Liên hệ và góp ý</Text>
            <Text style={styles.contactText}>Báo lỗi câu hỏi hoặc gửi phản hồi cho nhóm.</Text>
          </View>
          <MaterialCommunityIcons color={colors.muted} name="chevron-right" size={24} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
