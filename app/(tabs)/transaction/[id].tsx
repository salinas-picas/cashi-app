import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTransactions } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { useTransactionForm } from '../../../hooks/useTransactionForm';
import { colors } from '../../../constants/colors';
import { TransactionFormData } from '../../../schemas/transaction.schema';
import { Transaction } from '../../../types/transaction';

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { agregar, actualizar, eliminar, getById } = useTransactions();
  const { categories, recargar: recargarCategorias } = useCategories();
  const [existing, setExisting] = useState<Transaction | undefined>();
  const [loadingData, setLoadingData] = useState(!isNew);

  useEffect(() => {
    recargarCategorias();
    if (!isNew) {
      getById(id).then(t => {
        setExisting(t);
        setLoadingData(false);
      });
    }
  }, [id]);

  const defaultValues = useMemo(
    () =>
      existing
        ? {
            amount: existing.amount,
            type: existing.type,
            description: existing.description,
            categoryId: existing.categoryId,
          }
        : undefined,
    [existing]
  );

  const handleSubmit = useCallback(
    async (data: TransactionFormData) => {
      if (isNew) {
        await agregar(data);
      } else {
        await actualizar(id, data);
      }
      router.back();
    },
    [id, isNew]
  );

  const handleDelete = useCallback(async () => {
    await eliminar(id);
    router.back();
  }, [id]);

  const {
    amount, setAmount,
    type, setType,
    description, setDescription,
    categoryId, setCategoryId,
    error,
    handleSubmit: submit,
  } = useTransactionForm({
    mode: isNew ? 'create' : 'edit',
    defaultValues,
    onSubmit: handleSubmit,
  });

  if (loadingData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{isNew ? 'Nueva transacción' : 'Editar transacción'}</Text>

        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.muted}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>
              Ingreso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>
              Gasto
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          placeholderTextColor={colors.muted}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Categoría</Text>
        {categories.length === 0 ? (
          <Text style={styles.hint}>Crea una categoría primero</Text>
        ) : (
          categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryBtn, categoryId === cat.id && styles.categoryBtnActive]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text style={[styles.categoryBtnText, categoryId === cat.id && styles.categoryBtnTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>{isNew ? 'Crear' : 'Guardar'}</Text>
        </TouchableOpacity>

        {!isNew && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 24 },
  label: { fontSize: 14, color: colors.muted, marginBottom: 6, marginTop: 12 },
  hint: { fontSize: 13, color: colors.muted, fontStyle: 'italic', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  typeBtnActive: { backgroundColor: colors.tint, borderColor: colors.tint },
  typeBtnText: { color: colors.text, fontWeight: '500' },
  typeBtnTextActive: { color: '#fff' },
  categoryBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  categoryBtnActive: { backgroundColor: colors.tint, borderColor: colors.tint },
  categoryBtnText: { color: colors.text },
  categoryBtnTextActive: { color: '#fff' },
  error: { color: colors.danger, fontSize: 13, marginTop: 8, textAlign: 'center' },
  button: {
    backgroundColor: colors.tint,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  deleteButton: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteButtonText: { color: colors.danger, fontWeight: '600', fontSize: 16 },
});
