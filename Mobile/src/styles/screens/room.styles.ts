import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../theme';

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
