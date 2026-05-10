import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useBalance } from '../../hooks/useBalance';
import { colors } from '../../constants/colors';

export default function BalanceScreen() {
  const { totalIncome, totalExpense, balance, loading, error, recargar } = useBalance();

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
      <View style={styles.content}>
        <Text style={styles.label}>Balance</Text>
        <Text style={[styles.balance, { color: balance >= 0 ? '#38A169' : colors.danger }]}>
          ${balance.toFixed(2)}
        </Text>
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Ingresos</Text>
            <Text style={[styles.cardAmount, { color: '#38A169' }]}>+${totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Gastos</Text>
            <Text style={[styles.cardAmount, { color: colors.danger }]}>-${totalExpense.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 16, color: colors.muted, marginBottom: 8 },
  balance: { fontSize: 48, fontWeight: '800', marginBottom: 40 },
  row: { flexDirection: 'row', gap: 16 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: { fontSize: 14, color: colors.muted, marginBottom: 8 },
  cardAmount: { fontSize: 22, fontWeight: '700' },
  error: { color: colors.danger, textAlign: 'center', padding: 12 },
});
