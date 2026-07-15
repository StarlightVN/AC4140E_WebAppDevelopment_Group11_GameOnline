import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../theme';

export const resultsStyles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    alignItems: 'stretch',
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  resultHeader: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  trophy: {
    alignItems: 'center',
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    height: 58,
    justifyContent: 'center',
    marginBottom: 14,
    width: 58,
  },
  eyebrow: {
    color: '#C6CDDA',
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 5,
  },
  score: {
    color: colors.white,
    fontSize: 54,
    fontWeight: '900',
    marginTop: 8,
  },
  scoreTotal: {
    color: '#AEB8C8',
    fontSize: 28,
  },
  scoreLabel: {
    color: '#C6CDDA',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  list: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rankRow: {
    alignItems: 'center',
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 12,
  },
  rank: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  rankTop: {
    backgroundColor: colors.gold,
  },
  rankText: {
    color: colors.ink,
    fontWeight: '900',
  },
  rankTextTop: {
    color: colors.white,
  },
  playerName: {
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  playerScore: {
    color: colors.red,
    fontSize: 17,
    fontWeight: '900',
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 7,
  },
  ratingButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    gap: 2,
    justifyContent: 'center',
    minHeight: 52,
  },
  ratingActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  ratingText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '800',
  },
  ratingTextActive: {
    color: colors.white,
  },
  commentInput: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    minHeight: 110,
    padding: 13,
  },
  comments: {
    gap: 9,
  },
  comment: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 7,
    padding: 13,
  },
  commentHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  commentRating: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  commentContent: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: colors.muted,
    padding: 16,
    textAlign: 'center',
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    color: colors.redDark,
    padding: 12,
  },
});
