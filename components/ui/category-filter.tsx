import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type CategoryFilterProps = {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const primary = useThemeColor({}, 'primary');
  const inputBorder = useThemeColor({}, 'inputBorder');
  const textColor = useThemeColor({}, 'text');

  const all = [null, ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      {all.map((cat) => {
        const isActive = selected === cat;
        return (
          <Pressable
            key={cat ?? '__all__'}
            onPress={() => onSelect(cat)}
            style={[
              styles.pill,
              isActive
                ? { backgroundColor: primary, borderColor: primary }
                : { borderColor: inputBorder },
            ]}
          >
            <Text style={[styles.label, { color: isActive ? '#fff' : textColor }]}>
              {cat ?? 'All'}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    gap: 8,
    paddingHorizontal: 1,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
