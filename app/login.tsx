import { Link } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { colors } from '../constants/colors';

export default function LoginScreen() {
  const { email, password, error, loading, handleEmailChange, handlePasswordChange, handleLogin } = useLogin();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Cashi</Text>
          <Text style={styles.subtitle}>Finanzas personales</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
          </TouchableOpacity>

          <Link href="/register" style={styles.link}>
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.tint,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    color: colors.text,
    fontSize: 15,
  },
  error: { color: colors.danger, fontSize: 13, marginBottom: 8, textAlign: 'center' },
  button: {
    backgroundColor: colors.tint,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: colors.tint, fontSize: 14, textAlign: 'center' },
});
