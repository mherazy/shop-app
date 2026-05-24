import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';

type AuthMode = 'signin' | 'signup';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const { loading, error, signIn, signUp, clearError } = useAuth();
  const errorColor = useThemeColor({}, 'error');
  const iconColor = useThemeColor({}, 'icon');

  const isSignIn = mode === 'signin';

  const handleToggleMode = () => {
    setMode(isSignIn ? 'signup' : 'signin');
    clearError();
  };

  const handleSubmit = async () => {
    const success = isSignIn
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);

    if (success) {
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </ThemedText>
            <ThemedText type="default" style={[styles.subtitle, { color: iconColor }]}>
              {isSignIn
                ? 'Sign in to continue to your account'
                : 'Sign up to get started today'}
            </ThemedText>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder={isSignIn ? 'Your password' : 'Choose a strong password'}
              secureTextEntry
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              editable={!loading}
            />

            {error ? (
              <ThemedText style={[styles.error, { color: errorColor }]}>
                {error}
              </ThemedText>
            ) : null}

            <AuthButton
              title={isSignIn ? 'Sign In' : 'Sign Up'}
              onPress={handleSubmit}
              loading={loading}
              disabled={!email || !password}
              variant="primary"
            />

            <AuthButton
              title={isSignIn ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              onPress={handleToggleMode}
              disabled={loading}
              variant="ghost"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    marginTop: -4,
  },
});
