# Cashi — Finanzas Personales

Aplicación móvil de finanzas personales construida con React Native y Expo. Permite registrar ingresos y gastos, organizar transacciones por categorías y consultar el balance total de forma sencilla, con datos persistidos en una API REST remota.

## Demo en video

[Ver demo en Loom](https://www.loom.com/share/d2aaaa17588a45c4a1b222e623df8756)

---

## API consumida

**URL base:** `https://cashi-api-hp21.onrender.com`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |
| GET | `/categories` | Listar categorías |
| GET | `/transactions` | Listar transacciones |
| GET | `/transactions/:id` | Obtener transacción por ID |
| POST | `/transactions` | Crear transacción |
| PATCH | `/transactions/:id` | Actualizar transacción |
| DELETE | `/transactions/:id` | Eliminar transacción |
| GET | `/transactions/balance` | Consultar balance |
| POST | `/transactions/upload` | Subir foto de recibo |

---

## Qué cambió respecto a Evaluación 3

| Aspecto | Evaluación 3 | Evaluación 4 |
|---------|-------------|-------------|
| Autenticación | Credenciales hardcodeadas | Registro/login real contra API REST |
| Persistencia | AsyncStorage local | API REST remota (Prisma + PostgreSQL) |
| Tokens | No había | JWT guardado en `expo-secure-store` |
| IDs | `string` (Date.now) | `number` (Prisma Int autoincrement) |
| Balance | Calculado en cliente | Endpoint dedicado en la API |
| Categorías | CRUD local | Solo lectura desde la API |
| Contexto global | No había | `AuthContext` con `useAuth()` hook |
| Capa de red | No había | `services/apiService.ts` centralizado |
| Registro | No había | Pantalla `register.tsx` nueva |
| Foto de recibo | Se guardaba URI local | Se sube primero a `/transactions/upload`, se persiste la URL remota |
| Coordenadas GPS | Se guardaban en AsyncStorage | Se envían como `latitude`/`longitude` en el body al crear la transacción |

---

## Arquitectura

- **`services/apiService.ts`** — centraliza todo el `fetch`. Función genérica `request<T>()` que agrega `Content-Type` y `Authorization: Bearer` automáticamente, maneja errores HTTP y de red, y normaliza la respuesta de transacciones (convierte `latitude`/`longitude` planos a `{ location: { latitude, longitude } }`).
- **`contexts/AuthContext.tsx`** — provee el token JWT y el email vía `useAuth()`. Los componentes nunca acceden a `SecureStore` directamente; solo llaman a `login()`, `logout()` o `register()`.
- **Hooks de datos** — `useTransactions`, `useCategories` y `useBalance` obtienen el token de `useAuth()` internamente; las pantallas no reciben ni manejan el token como parámetro.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.81 | UI nativa multiplataforma |
| [Expo](https://expo.dev/) | ~54 | Toolchain y build system |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9 | Tipado estático |
| [Expo Router](https://expo.github.io/router/) | ^6 | Navegación basada en sistema de archivos |
| [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/) | ~14 | Almacenamiento seguro del JWT |
| [Zod](https://zod.dev/) | ^4 | Validación de esquemas y formularios |
| [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) | ~16 | Acceso a cámara y galería |
| [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) | ~18 | Acceso a la ubicación GPS del dispositivo |

---

## Características

- **Autenticación real** — registro y login contra API REST; token JWT persistido con SecureStore
- **Transacciones** — crear, editar y eliminar ingresos y gastos sincronizados con la API
- **Categorías** — listado desde la API (solo lectura)
- **Balance** — calculado por el servidor y mostrado en tiempo real
- **Foto adjunta** — tomar foto o elegir de galería; se sube automáticamente al guardar la transacción
- **Ubicación GPS** — coordenadas registradas y enviadas al backend
- **Navegación por tabs** — estructura de rutas con Expo Router
- **Redirección automática** — `_layout.tsx` detecta el token y redirige entre login y tabs

---

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- [Expo Go](https://expo.dev/go) instalado en tu dispositivo físico, **o** un emulador Android/iOS configurado

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/salinas-picas/cashi-app.git
cd cashi-app

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm start
```

Expo abrirá un QR en la terminal. Escanealo con la app **Expo Go** en tu teléfono, o presiona:
- `a` para abrir en emulador Android
- `i` para abrir en simulador iOS (requiere macOS)
- `w` para abrir en el navegador (modo web)

---

## Scripts disponibles

```bash
npm start          # Inicia Expo en modo interactivo
npm run android    # Lanza directamente en Android
npm run ios        # Lanza directamente en iOS
npm run web        # Lanza en navegador
```

---

## Estructura del proyecto

```
cashi-app/
├── app/
│   ├── index.tsx                  # Pantalla de login
│   ├── register.tsx               # Pantalla de registro (nueva)
│   ├── _layout.tsx                # Root layout con AuthProvider y guard de rutas
│   └── (tabs)/
│       ├── _layout.tsx            # Tab navigator
│       ├── index.tsx              # Lista de transacciones
│       ├── balance.tsx            # Pantalla de balance
│       ├── categories.tsx         # Lista de categorías
│       ├── profile.tsx            # Perfil y logout
│       ├── transaction/[id].tsx   # Detalle / edición de transacción
│       └── category/[id].tsx      # Detalle de categoría
├── contexts/
│   └── AuthContext.tsx            # AuthProvider + useAuth hook (nuevo)
├── services/
│   └── apiService.ts              # Capa HTTP centralizada (nuevo)
├── hooks/
│   ├── useLogin.ts                # Lógica de autenticación (reescrito)
│   ├── useTransactions.ts         # CRUD de transacciones via API (reescrito)
│   ├── useCategories.ts           # Categorías via API (reescrito)
│   ├── useBalance.ts              # Balance via API (reescrito)
│   ├── useTransactionForm.ts      # Formulario de transacción (actualizado)
│   ├── useImagePicker.ts          # Cámara y galería
│   └── useLocation.ts             # GPS del dispositivo
├── types/
│   ├── transaction.ts             # id: number, categoryId: number
│   └── category.ts                # id: number
├── schemas/
│   ├── transaction.schema.ts      # categoryId: z.number()
│   └── category.schema.ts
├── constants/
│   └── colors.ts
└── package.json
```

---

## Bugs encontrados y solucionados durante la integración

| Bug | Causa | Solución |
|-----|-------|----------|
| Logout no redirigía al login | La ruta `/` era ambigua entre `app/index.tsx` y `app/(tabs)/index.tsx`; `router.replace('/')` desde dentro de tabs resolvía a la tab de transacciones | Se creó `app/login.tsx` con ruta única `/login`; `app/index.tsx` quedó como `<Redirect href="/login" />` |
| Error genérico al crear transacción | `request()` en `apiService` no extraía el mensaje real del body de la API y caía siempre en `'Error desconocido'` | Se mejoró `request()` para leer el body como texto, parsearlo y extraer `error`, `message` o `detail` antes de usar el fallback genérico |
| Falta el campo `date` al crear transacción | El schema de la API requiere `date` (ISO string) y `agregar()` no lo enviaba | Se agregó `date: new Date().toISOString()` al body en `agregar()` |
| 404 al subir foto al editar | Endpoint incorrecto: `/upload/receipt` en vez de `/transactions/upload` | Corregido el endpoint en `apiService.uploadReceipt` |
| 404 al editar transacción | `apiService.updateTransaction` usaba método `PUT`, pero la API solo registra `PATCH /transactions/:id` | Cambiado a `PATCH` |
| 404 en balance | `apiService.getBalance` apuntaba a `/balance` en vez de `/transactions/balance` | Corregido el endpoint en `apiService.getBalance` |

---

## Uso de Inteligencia Artificial en el desarrollo

Se utilizó Claude (claude.ai y Claude Code) como asistente de desarrollo para la migración de AsyncStorage a la API REST, incluyendo la implementación de AuthContext, apiService y la reescritura de los hooks. Todo el código fue revisado y entendido.

---

## Licencia

Este proyecto es de uso educativo y personal.
