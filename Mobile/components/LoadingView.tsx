import { ActivityIndicator, Text, View } from 'react-native';

import { loadingViewStyles as styles } from '@/src/styles';
import { colors } from '@/src/theme';

export function LoadingView({ label = 'Đang tải...' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.red} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
