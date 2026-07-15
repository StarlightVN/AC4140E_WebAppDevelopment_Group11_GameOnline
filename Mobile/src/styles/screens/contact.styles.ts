import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../theme';

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
