import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from './theme';

export const rootLayoutStyles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export const appButtonStyles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.red,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
  },
  danger: {
    backgroundColor: colors.redDark,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.48,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryLabel: {
    color: colors.ink,
  },
});

export const formFieldStyles = StyleSheet.create({
  group: {
    gap: 7,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.redDark,
    fontSize: 13,
  },
});

export const loadingViewStyles = StyleSheet.create({
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

export const screenHeaderStyles = StyleSheet.create({
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

export const authStyles = StyleSheet.create({
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
  banner: {
    alignSelf: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.red,
    borderRadius: radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  brand: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: '900',
  },
  tagline: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  segmented: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: 'row',
    padding: 4,
  },
  segment: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
  },
  segmentText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: colors.ink,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    color: colors.redDark,
    fontSize: 14,
    padding: 12,
  },
});

export const homeStyles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'stretch',
    gap: 20,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  topbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.red,
    fontSize: 12,
    fontWeight: '900',
  },
  greeting: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 3,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  banner: {
    alignSelf: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  quickStats: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  statValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  sectionCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  codeInput: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 5,
    minHeight: 58,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    color: colors.redDark,
    padding: 12,
  },
  contactRow: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: spacing.md,
  },
  contactIcon: {
    alignItems: 'center',
    backgroundColor: colors.tealSoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  contactCopy: {
    flex: 1,
    minWidth: 0,
  },
  contactTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  contactText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});

export const contactStyles = StyleSheet.create({
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
  about: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  aboutTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  aboutCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    color: colors.redDark,
    fontSize: 14,
    padding: 12,
  },
});

export const roomStyles = StyleSheet.create({
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
  codePanel: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    gap: 12,
    padding: spacing.lg,
  },
  codeLabel: {
    color: '#C6CDDA',
    fontSize: 12,
    fontWeight: '900',
  },
  code: {
    color: colors.white,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 7,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  statusDot: {
    backgroundColor: '#53D69B',
    borderRadius: 6,
    height: 9,
    width: 9,
  },
  statusText: {
    color: '#DCE2EB',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  sectionCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  levelCell: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    minWidth: 58,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  levelNumber: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  levelLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  errorBox: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    gap: 12,
    padding: spacing.md,
  },
  errorText: {
    color: colors.redDark,
    lineHeight: 20,
    textAlign: 'center',
  },
});

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
