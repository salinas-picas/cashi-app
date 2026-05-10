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
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { colors } from '../../constants/colors';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, loading, error, recargar } = useTransactions();
  const { categories, recargar: recargarCategorias } = useCategories();

  useFocusEffect(
    useCallback(() => {
      recargar();
      recargarCategorias();
    }, [recargar, recargarCategorias])
  );

  const getCategoryName = (categoryId: string) =>
    categories.find(c => c.id === categoryId)?.name ?? 'Sin categoría';

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
        data={transactions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay transacciones</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(tabs)/transaction/${item.id}`)}
          >
            <View style={styles.row}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/transaction/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  description: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  amount: { fontSize: 16, fontWeight: '700' },
  income: { color: '#38A169' },
  expense: { color: colors.danger },
  category: { fontSize: 13, color: colors.muted, marginTop: 4 },
  date: { fontSize: 12, color: colors.muted, marginTop: 2 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  error: { color: colors.danger, textAlign: 'center', padding: 12 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.tint,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
