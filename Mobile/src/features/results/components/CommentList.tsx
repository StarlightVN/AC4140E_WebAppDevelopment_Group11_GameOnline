import { Text, View } from 'react-native';

import { resultsStyles as styles } from '@/src/styles';

import type { CommentItem } from '../types';

type Props = {
  comments: CommentItem[];
};

export function CommentList({ comments }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Bình luận gần đây</Text>
      <View style={styles.comments}>
        {comments.length ? (
          comments.slice(0, 6).map((comment, index) => (
            <View key={`${comment.name}-${comment.created_at}-${index}`} style={styles.comment}>
              <View style={styles.commentHead}>
                <Text style={styles.commentName}>{comment.name}</Text>
                <Text style={styles.commentRating}>{comment.rating}/5</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Hãy là người đầu tiên đánh giá phòng này.</Text>
        )}
      </View>
    </View>
  );
}
