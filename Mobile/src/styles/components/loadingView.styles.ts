import { StyleSheet } from 'react-native';

import { colors } from '../../theme';

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
