import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthButton } from '@/components/ui/auth-button';
import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  const { session, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Home
      </ThemedText>

      <ThemedText type="defaultSemiBold" style={styles.email}>
        {session?.user.email}
      </ThemedText>

      <ThemedText type="default" style={styles.message}>
        You're signed in! 🎉
      </ThemedText>

      <AuthButton
        title="Sign Out"
        onPress={handleSignOut}
        loading={loading}
        variant="ghost"
      />
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
  message: {
    marginBottom: 32,
  },
});
