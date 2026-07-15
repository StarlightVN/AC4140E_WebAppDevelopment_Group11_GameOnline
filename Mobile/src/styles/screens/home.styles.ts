import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../theme';

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
