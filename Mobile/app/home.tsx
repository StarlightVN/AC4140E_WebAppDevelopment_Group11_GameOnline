import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { createRoom } from '@/src/api/rooms';
import { useSession } from '@/src/context/SessionContext';
import { colors, radius, spacing } from '@/src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { session, signOut } = useSession();
  const [roomCode, setRoomCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const activeSession = session;

  if (!activeSession) {
    router.replace('/auth');
    return null;
  }

  const { token, user } = activeSession;

  async function handleCreateRoom() {
    setBusy(true);
    setError('');

    try {
      const response = await createRoom(user.id, token);
      router.push({ pathname: '/room/[code]', params: { code: response.roomCode } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tạo phòng.');
    } finally {
      setBusy(false);
    }
  }

  function handleJoinRoom() {
    const code = roomCode.replace(/\D/g, '').slice(0, 6);

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
          style={styles.banner}
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
            onChangeText={(value) => setRoomCode(value.replace(/\D/g, ''))}
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

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    marginHorizontal: 'auto',
    maxWidth: 720,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    width: '100%',
  },
  topbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.red,
    fontSize: 12,
    fontWeight: '900',
  },
  greeting: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 3,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  banner: {
    aspectRatio: 2.05,
    borderRadius: radius.md,
    width: '100%',
  },
  quickStats: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  statValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  sectionCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  codeInput: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 8,
    minHeight: 62,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    color: colors.redDark,
    padding: 12,
  },
  contactRow: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: spacing.md,
  },
  contactIcon: {
    alignItems: 'center',
    backgroundColor: colors.tealSoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  contactCopy: {
    flex: 1,
    minWidth: 0,
  },
  contactTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  contactText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});
