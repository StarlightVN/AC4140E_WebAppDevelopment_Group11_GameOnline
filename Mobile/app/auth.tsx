import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { FormField } from '@/components/FormField';
import { login, register } from '@/src/api/auth';
import { useSession } from '@/src/context/SessionContext';
import { colors, radius, spacing } from '@/src/theme';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    const cleanUsername = username.trim();

    if (!cleanUsername || password.length < 3) {
      setError('Tên đăng nhập và mật khẩu từ 3 ký tự.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      if (mode === 'register') {
        await register(cleanUsername, password);
      }

      const response = await login(cleanUsername, password);
      await signIn({ token: response.token, user: response.user });
      router.replace('/home');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể xác thực.');
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
          <Image
            accessibilityLabel="Sân khấu Quiz Arena"
            resizeMode="cover"
            source={require('@/assets/images/quiz-arena-banner.png')}
            style={styles.banner}
          />

          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <MaterialCommunityIcons color={colors.white} name="crown" size={25} />
            </View>
            <View>
              <Text style={styles.brand}>Quiz Arena</Text>
              <Text style={styles.tagline}>Trả lời nhanh. Leo bảng điểm.</Text>
            </View>
          </View>

          <View style={styles.segmented}>
            <Pressable
              onPress={() => {
                setMode('login');
                setError('');
              }}
              style={[styles.segment, mode === 'login' && styles.segmentActive]}>
              <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
                Đăng nhập
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMode('register');
                setError('');
              }}
              style={[styles.segment, mode === 'register' && styles.segmentActive]}>
              <Text
                style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}>
                Đăng ký
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <FormField
              autoCapitalize="none"
              autoComplete="username"
              label="Tên đăng nhập"
              onChangeText={setUsername}
              placeholder="player11"
              returnKeyType="next"
              value={username}
            />
            <FormField
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              label="Mật khẩu"
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
              placeholder="Tối thiểu 3 ký tự"
              secureTextEntry
              value={password}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <AppButton
              icon={mode === 'login' ? 'login' : 'account-plus'}
              label={mode === 'login' ? 'Vào đấu trường' : 'Tạo tài khoản'}
              loading={busy}
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    marginHorizontal: 'auto',
    maxWidth: 560,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    width: '100%',
  },
  banner: {
    aspectRatio: 1.9,
    borderRadius: radius.md,
    width: '100%',
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.red,
    borderRadius: radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  brand: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: '900',
  },
  tagline: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  segmented: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: 'row',
    padding: 4,
  },
  segment: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
  },
  segmentText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: colors.ink,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    color: colors.redDark,
    fontSize: 14,
    padding: 12,
  },
});
