import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme';

export function LoadingView({ label = 'Đang tải...' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.red} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    color: colors.muted,
    fontSize: 15,
  },
});
