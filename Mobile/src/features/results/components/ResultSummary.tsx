import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';

import { resultsStyles as styles } from '@/src/styles';
import { colors } from '@/src/theme';

type Props = {
  code: string;
  score: number | null;
  total: number;
};

export function ResultSummary({ code, score, total }: Props) {
  return (
    <View style={styles.resultHeader}>
      <View style={styles.trophy}>
        <MaterialCommunityIcons color={colors.white} name="trophy" size={34} />
      </View>
      <Text style={styles.eyebrow}>HOÀN THÀNH PHÒNG {code}</Text>
      <Text style={styles.title}>Kết quả của bạn</Text>
      <Text style={styles.score}>
        {score === null ? '--' : score}
        <Text style={styles.scoreTotal}>/{total}</Text>
      </Text>
      <Text style={styles.scoreLabel}>câu trả lời chính xác</Text>
    </View>
  );
}
