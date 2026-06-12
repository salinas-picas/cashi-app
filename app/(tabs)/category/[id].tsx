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
import { useCategories } from '../../../hooks/useCategories';
import { useCategoryForm } from '../../../hooks/useCategoryForm';
import { colors } from '../../../constants/colors';
import { CategoryFormData } from '../../../schemas/category.schema';
import { Category } from '../../../types/category';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';
  const numericId = isNew ? 0 : Number(id);

  const { getById } = useCategories();
  const [existing, setExisting] = useState<Category | undefined>();
  const [loadingData, setLoadingData] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      getById(numericId).then(c => {
        setExisting(c);
        setLoadingData(false);
      });
    }
  }, [id]);

  const defaultValues = useMemo(
    () => (existing ? { name: existing.name } : undefined),
    [existing]
  );

  const handleSubmit = useCallback(
    async (_data: CategoryFormData) => {
      router.back();
    },
    [id, isNew]
  );

  const handleDelete = useCallback(async () => {
    router.back();
  }, [numericId]);

  const { name, setName, error, handleSubmit: submit } = useCategoryForm({
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
        <Text style={styles.title}>{isNew ? 'Nueva categoría' : 'Editar categoría'}</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la categoría"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
        />

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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
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
