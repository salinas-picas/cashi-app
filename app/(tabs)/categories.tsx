import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCategories } from '../../hooks/useCategories';
import { colors } from '../../constants/colors';

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories, loading, error, recargar } = useCategories();

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay categorías</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(tabs)/category/${item.id}`)}
          >
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 80 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  error: { color: colors.danger, textAlign: 'center', padding: 12 },
});
