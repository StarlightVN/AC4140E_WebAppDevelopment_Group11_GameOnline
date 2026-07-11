import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { screenHeaderStyles as styles } from '@/src/styles';
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
