import {
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { formFieldStyles as styles } from '@/src/styles';
import { colors } from '@/src/theme';

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
