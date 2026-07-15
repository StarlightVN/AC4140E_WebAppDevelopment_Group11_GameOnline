import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { FormField } from '@/components/FormField';
import { ScreenHeader } from '@/components/ScreenHeader';
import { submitFeedback } from '@/src/api/feedback';
import { useSession } from '@/src/context/SessionContext';
import { contactStyles as styles } from '@/src/styles';

export default function ContactScreen() {
  const { session } = useSession();
  const [name, setName] = useState(session?.user.username ?? '');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();
    const contentTrimmed = content.trim();

    if (!session || !nameTrimmed || !emailTrimmed || !contentTrimmed) {
      setError('Vui lòng nhập đầy đủ họ tên, email và nội dung.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setError('Email không đúng định dạng.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await submitFeedback(
        { name: nameTrimmed, email: emailTrimmed, content: contentTrimmed },
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
            <FormField label="Họ và tên" onChangeText={setName} value={name} maxLength={100} />
            <FormField
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="ban@example.com"
              value={email}
              maxLength={100}
            />
            <FormField
              label="Nội dung"
              multiline
              onChangeText={setContent}
              placeholder="Mô tả góp ý hoặc lỗi bạn gặp..."
              value={content}
              maxLength={1000}
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
