import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';

import { colors, radius } from '@/src/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Props = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.ink : colors.white} />
      ) : icon ? (
        <MaterialCommunityIcons
          color={variant === 'secondary' ? colors.ink : colors.white}
          name={icon}
          size={20}
        />
      ) : null}
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
