import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';

export default function ProfileScreen() {
  const { email, logout } = useAuth();
  const router = useRouter();
  const displayEmail = email ?? '';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayEmail.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={styles.email}>{displayEmail}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  email: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
