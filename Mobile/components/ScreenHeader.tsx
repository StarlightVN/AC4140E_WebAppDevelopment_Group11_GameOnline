import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/theme';

type Props = {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, subtitle, back = false, right }: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {back ? (
        <Pressable
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
          style={styles.iconButton}>
          <MaterialCommunityIcons color={colors.ink} name="arrow-left" size={24} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
});
