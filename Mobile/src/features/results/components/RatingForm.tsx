import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { FormField } from '@/components/FormField';
import { resultsStyles as styles } from '@/src/styles';
import { colors } from '@/src/theme';

type Props = {
  onSubmit: (email: string, content: string, rating: number) => Promise<void>;
  busy: boolean;
  onError: (msg: string) => void;
};

export function RatingForm({ onSubmit, busy, onError }: Props) {
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  async function handleSend() {
    const emailTrimmed = email.trim();
    const contentTrimmed = content.trim();

    if (!emailTrimmed) {
      onError('Vui lòng nhập email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      onError('Email không đúng định dạng.');
      return;
    }

    if (!contentTrimmed) {
      onError('Vui lòng nhập nội dung đánh giá.');
      return;
    }

    try {
      await onSubmit(emailTrimmed, contentTrimmed, rating);
      setContent('');
      onError('');
    } catch (err) {
      // Error is set in the hook
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Đánh giá phòng</Text>
      <FormField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="ban@example.com"
        value={email}
        maxLength={100}
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
        maxLength={1000}
      />
      <AppButton
        disabled={!content.trim() || !email.trim()}
        icon="send"
        label="Gửi đánh giá"
        loading={busy}
        onPress={handleSend}
      />
    </View>
  );
}
