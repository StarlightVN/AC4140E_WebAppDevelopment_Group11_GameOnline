import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../theme';

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
