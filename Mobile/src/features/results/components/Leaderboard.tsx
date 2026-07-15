import { Text, View } from 'react-native';

import { resultsStyles as styles } from '@/src/styles';

import type { LeaderboardItem } from '../types';

type Props = {
  leaderboard: LeaderboardItem[];
};

export function Leaderboard({ leaderboard }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Bảng xếp hạng</Text>
      <View style={styles.list}>
        {leaderboard.length ? (
          leaderboard.map((item, index) => (
            <View key={`${item.username}-${index}`} style={styles.rankRow}>
              <View style={[styles.rank, index < 3 && styles.rankTop]}>
                <Text style={[styles.rankText, index < 3 && styles.rankTextTop]}>
                  {index + 1}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.playerName}>
                {item.username}
              </Text>
              <Text style={styles.playerScore}>{item.correct_count}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Chưa có dữ liệu xếp hạng.</Text>
        )}
      </View>
    </View>
  );
}
