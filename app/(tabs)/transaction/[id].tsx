import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { useImagePicker } from '../../../hooks/useImagePicker';
import { useLocation } from '../../../hooks/useLocation';
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

  const imagePicker = useImagePicker();
  const locationHook = useLocation();
  const { reset: resetPhoto } = imagePicker;
  const { reset: resetLocation } = locationHook;

  useEffect(() => {
    recargarCategorias();
    resetPhoto(null);
    resetLocation(null);

    if (!isNew) {
      setExisting(undefined);
      setLoadingData(true);
      getById(id).then(t => {
        setExisting(t);
        resetPhoto(t?.photoUri ?? null);
        resetLocation(t?.location ?? null);
        setLoadingData(false);
      });
    }
  }, [id, resetPhoto, resetLocation]);

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
      const fullData: Omit<Transaction, 'id' | 'date'> = {
        ...data,
        ...(imagePicker.photoUri ? { photoUri: imagePicker.photoUri } : {}),
        ...(locationHook.location ? { location: locationHook.location } : {}),
      };
      if (isNew) {
        await agregar(fullData);
      } else {
        await actualizar(id, fullData);
      }
      router.back();
    },
    [id, isNew, imagePicker.photoUri, locationHook.location]
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

        <Text style={styles.label}>Foto</Text>
        <View style={styles.photoRow}>
          <TouchableOpacity
            style={[styles.mediaBtn, imagePicker.loading && styles.mediaBtnDisabled]}
            onPress={imagePicker.takePhoto}
            disabled={imagePicker.loading}
          >
            <Text style={styles.mediaBtnText}>Tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mediaBtn, imagePicker.loading && styles.mediaBtnDisabled]}
            onPress={imagePicker.pickFromGallery}
            disabled={imagePicker.loading}
          >
            <Text style={styles.mediaBtnText}>Elegir de galería</Text>
          </TouchableOpacity>
        </View>
        {imagePicker.loading && <ActivityIndicator color={colors.tint} style={styles.loader} />}
        {imagePicker.error ? <Text style={styles.error}>{imagePicker.error}</Text> : null}
        {imagePicker.photoUri ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: imagePicker.photoUri }} style={styles.photo} resizeMode="cover" />
            <TouchableOpacity onPress={imagePicker.clearPhoto} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Quitar foto</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.label}>Ubicación</Text>
        <TouchableOpacity
          style={[styles.mediaBtn, locationHook.loading && styles.mediaBtnDisabled]}
          onPress={locationHook.getLocation}
          disabled={locationHook.loading}
        >
          <Text style={styles.mediaBtnText}>Registrar ubicación</Text>
        </TouchableOpacity>
        {locationHook.loading && <ActivityIndicator color={colors.tint} style={styles.loader} />}
        {locationHook.error ? <Text style={styles.error}>{locationHook.error}</Text> : null}
        {locationHook.location ? (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>Lat: {locationHook.location.latitude.toFixed(6)}</Text>
            <Text style={styles.locationText}>Lon: {locationHook.location.longitude.toFixed(6)}</Text>
            <TouchableOpacity onPress={locationHook.clearLocation} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Quitar ubicación</Text>
            </TouchableOpacity>
          </View>
        ) : null}

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
  photoRow: { flexDirection: 'row', gap: 12 },
  mediaBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tint,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  mediaBtnDisabled: { opacity: 0.5 },
  mediaBtnText: { color: colors.tint, fontWeight: '500' },
  loader: { marginTop: 8 },
  photoContainer: { marginTop: 12 },
  photo: { width: '100%', height: 200, borderRadius: 10 },
  clearBtn: { marginTop: 8, alignItems: 'center' },
  clearBtnText: { color: colors.danger, fontSize: 13 },
  locationContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: { color: colors.text, fontSize: 14 },
});
