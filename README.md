# Cashi — Finanzas Personales

Aplicación móvil de finanzas personales construida con React Native y Expo. Permite registrar ingresos y gastos, organizar transacciones por categorías y consultar el balance total de forma sencilla.

## Demo en video

[Ver demo en Loom](https://www.loom.com/share/875a4a4a73284cd8878cf737df921dfe)

---

## Capturas de pantalla

| Login | Transacciones | Balance | Categorías |
|-------|--------------|---------|-----------|
| Pantalla de acceso con validación | Listado y CRUD de movimientos | Resumen de ingresos y gastos | Gestión de categorías |

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.81 | UI nativa multiplataforma |
| [Expo](https://expo.dev/) | ~54 | Toolchain y build system |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9 | Tipado estático |
| [Expo Router](https://expo.github.io/router/) | ^6 | Navegación basada en sistema de archivos |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | 2.2 | Persistencia local de datos |
| [Zod](https://zod.dev/) | ^4 | Validación de esquemas y formularios |
| [React Native Screens](https://github.com/software-mansion/react-native-screens) | ~4.16 | Optimización de navegación nativa |
| [Expo Status Bar](https://docs.expo.dev/versions/latest/sdk/status-bar/) | ~3 | Control de la barra de estado |

---

## Características

- **Autenticación** — pantalla de login con validación de credenciales mediante Zod
- **Transacciones** — crear, editar y eliminar ingresos y gastos
- **Categorías** — CRUD completo para organizar los movimientos
- **Balance** — vista consolidada con total de ingresos, gastos y saldo neto
- **Persistencia local** — todos los datos se guardan en AsyncStorage, sin backend requerido
- **Navegación por tabs** — estructura de rutas con Expo Router (file-based routing)

---

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9 (o yarn / pnpm)
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

## Credenciales de acceso

La app incluye un usuario de prueba preconfigurado:

| Campo | Valor |
|---|---|
| Email | `usuario@correo.com` |
| Contraseña | `1234` |

> Los datos de sesión y transacciones se almacenan localmente en el dispositivo mediante AsyncStorage.

---

## Estructura del proyecto

```
cashi-app/
├── app/
│   ├── index.tsx                  # Pantalla de login
│   ├── _layout.tsx                # Root layout (Stack)
│   └── (tabs)/
│       ├── _layout.tsx            # Tab navigator
│       ├── index.tsx              # Lista de transacciones
│       ├── balance.tsx            # Pantalla de balance
│       ├── categories.tsx         # Lista de categorías
│       ├── transaction/[id].tsx   # Detalle / edición de transacción
│       └── category/[id].tsx      # Detalle / edición de categoría
├── hooks/
│   ├── useLogin.ts                # Lógica de autenticación
│   ├── useTransactions.ts         # CRUD de transacciones
│   ├── useCategories.ts           # CRUD de categorías
│   └── useBalance.ts              # Cálculo de balance
├── constants/
│   └── colors.ts                  # Paleta de colores centralizada
├── assets/                        # Íconos y splash screen
├── package.json
└── tsconfig.json
```

---

## Uso de Inteligencia Artificial en el desarrollo

Este proyecto fue desarrollado con el apoyo de **Claude** (Anthropic) a través de [claude.ai](https://claude.ai) y **Claude Code** (CLI), las cuales agilizaron y enriquecieron el proceso de desarrollo en las siguientes áreas:

### Arquitectura de hooks
Claude ayudó a diseñar la separación de lógica de negocio en hooks reutilizables (`useTransactions`, `useCategories`, `useBalance`, `useLogin`), siguiendo el principio de responsabilidad única y facilitando la testabilidad del código.

### Validación con Zod
Se utilizó Claude para definir los esquemas de validación con Zod v4, tanto para los formularios de login como para la creación y edición de transacciones y categorías, asegurando tipos seguros en tiempo de ejecución.

### Estructura de navegación con Expo Router
Claude orientó la organización del sistema de rutas basado en archivos de Expo Router, incluyendo la configuración del tab navigator, las rutas dinámicas (`[id].tsx`) para edición de registros, y el manejo de pantallas ocultas en la barra de tabs.

---

## Licencia

Este proyecto es de uso educativo y personal.
