import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { colors, radius } from '@/src/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function FormField({ label, error, multiline, style, ...props }: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        selectionColor={colors.red}
        style={[styles.input, multiline && styles.multiline, style]}
        multiline={multiline}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 7,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.redDark,
    fontSize: 13,
  },
});
