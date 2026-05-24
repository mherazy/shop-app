import { Colors } from '@/constants/theme';
import { useThemePreference } from '@/contexts/theme-preference';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { effectiveScheme } = useThemePreference();
  const colorFromProps = props[effectiveScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[effectiveScheme][colorName];
  }
}
