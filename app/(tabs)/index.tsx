import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  const { session } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Home
      </ThemedText>

      <ThemedText type="defaultSemiBold" style={styles.email}>
        {session?.user.email}
      </ThemedText>

      <ThemedText type="default">
        You're signed in! 🎉
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 16,
  },
  email: {
    marginBottom: 8,
  },
});
