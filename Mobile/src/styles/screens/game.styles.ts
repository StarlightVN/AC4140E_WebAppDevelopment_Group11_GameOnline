import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../theme';

export const gameStyles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'stretch',
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  gameHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomLabel: {
    color: colors.red,
    fontSize: 12,
    fontWeight: '900',
  },
  questionCount: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 4,
  },
  timer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    height: 62,
    justifyContent: 'center',
    width: 70,
  },
  timerValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  timerUnit: {
    color: colors.muted,
    fontSize: 10,
  },
  progressTrack: {
    backgroundColor: colors.line,
    borderRadius: 3,
    height: 6,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.red,
    height: '100%',
  },
  questionBlock: {
    gap: 12,
  },
  difficulty: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  difficultyText: {
    color: colors.red,
    fontSize: 13,
    fontWeight: '800',
  },
  questionText: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 32,
  },
  answers: {
    gap: 10,
  },
  answer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 68,
    padding: 12,
  },
  answerSelected: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.red,
  },
  answerPressed: {
    opacity: 0.82,
  },
  answerKey: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  answerKeySelected: {
    backgroundColor: colors.red,
  },
  answerKeyText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  answerKeyTextSelected: {
    color: colors.white,
  },
  answerText: {
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  answerTextSelected: {
    color: colors.redDark,
  },
  errorBanner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    color: colors.redDark,
    padding: 12,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.muted,
    lineHeight: 21,
    textAlign: 'center',
  },
});
