import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type ImagePickerFieldProps = {
  uri: string | null;
  onSelect: (uri: string) => void;
  onRemove: () => void;
};

export function ImagePickerField({ uri, onSelect, onRemove }: ImagePickerFieldProps) {
  const borderColor = useThemeColor({}, 'inputBorder');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onSelect(result.assets[0].uri);
    }
  };

  if (uri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri }} style={styles.preview} contentFit="cover" />
        <Pressable style={styles.removeBtn} onPress={onRemove}>
          <Ionicons name="close-circle" size={26} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePick}
      style={[styles.placeholder, { borderColor, backgroundColor }]}
    >
      <Ionicons name="image-outline" size={36} color={iconColor} />
      <ThemedText style={[styles.label, { color: iconColor }]}>Add Photo</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  preview: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  placeholder: {
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
