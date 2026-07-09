import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { FormField } from '@/components/FormField';
import { ScreenHeader } from '@/components/ScreenHeader';
import { submitFeedback } from '@/src/api/feedback';
import { useSession } from '@/src/context/SessionContext';
import { colors, radius, spacing } from '@/src/theme';

export default function ContactScreen() {
  const { session } = useSession();
  const [name, setName] = useState(session?.user.username ?? '');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!session || !name.trim() || !email.trim() || !content.trim()) {
      setError('Vui lòng nhập đầy đủ họ tên, email và nội dung.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await submitFeedback(
        { name: name.trim(), email: email.trim(), content: content.trim() },
        session.token,
      );
      setContent('');
      Alert.alert('Đã gửi góp ý', 'Nhóm 11 đã nhận được phản hồi của bạn.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể gửi góp ý.');
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
          <ScreenHeader back title="Liên hệ và góp ý" subtitle="Nhóm 11 · Web App Development" />

          <View style={styles.about}>
            <Text style={styles.aboutTitle}>Cổng game trắc nghiệm đối đầu</Text>
            <Text style={styles.aboutCopy}>
              Phản hồi của bạn giúp nhóm sửa câu hỏi, cải thiện trải nghiệm và theo dõi lỗi vận hành.
            </Text>
          </View>

          <View style={styles.form}>
            <FormField label="Họ và tên" onChangeText={setName} value={name} />
            <FormField
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="ban@example.com"
              value={email}
            />
            <FormField
              label="Nội dung"
              multiline
              onChangeText={setContent}
              placeholder="Mô tả góp ý hoặc lỗi bạn gặp..."
              value={content}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <AppButton
              disabled={!name.trim() || !email.trim() || !content.trim()}
              icon="send"
              label="Gửi góp ý"
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
    maxWidth: 640,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    width: '100%',
  },
  about: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  aboutTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  aboutCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
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
