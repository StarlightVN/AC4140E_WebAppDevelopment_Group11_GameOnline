import { StyleSheet } from 'react-native';

import { colors, radius } from '../../theme';

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
