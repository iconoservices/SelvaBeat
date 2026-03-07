# 📜 Bitácora de Vuelo (CHANGELOG.md)

Todas las expediciones y descubrimientos técnicos se registran aquí.

---

## [1.0.0] - 2026-03-04
### 🦁 SelvaBeat Gold: Motor de Descubrimiento (PASO 10)
- **Implementado:** `Home.jsx` con búsqueda global y feed de tendencias (Piped API).
- **Añadido:** `TrackCard.jsx` diseño premium para resultados de búsqueda.
- **Navegación:** Implementada **Tab Bar Inferior** para alternar entre Descubrir y Bóveda (Offline).
- **Extracción Hi-Fi:** Integración de carga de streams directamente desde los resultados de búsqueda.
- **UX:** Sistema de carga resiliente v1.7 integrado en el flujo de búsqueda.

---

## [0.9.0] - 2026-03-04
### 🔊 Motor de Audio y Persistencia (PASO 9)
- **Implementado:** `useAudioEngine.js` motor único y global con sincronización anti-amnesia.
- **Añadido:** `MiniPlayer.jsx` barra de control persistente con progreso de 2px.
- **Media Session:** Soporte total para controles externos (Bluetooth/Lockscreen).
- **RAM Clean:** Protocolo `URL.revokeObjectURL()` reforzado para evitar fugas binarias.

---

## [0.6.0] - 2026-03-04
### 📚 La Biblioteca Virtualizada (PASO 6)
- **Añadido:** `Library.jsx` con virtualización de listas extrema (react-window).
- **Corregido:** Error de amnesia en el reproductor (Sincronización de currentTime).
- **Corregido:** Error de Byte-range en SW (Bypass offline al Frontend).
- **Seguridad:** Gestión de RAM Clean Protocol (`revokeObjectURL`).

---

## [0.5.0] - 2026-03-04
### 🔋 Resiliencia Offline (PASO 5)
- **Añadido:** `db.js` motor IndexedDB para almacenamiento de binarios.
- **Mejorado:** `FloatingPlayer.jsx` con la **Ley del Estrangulamiento**.
- **Radar de Cuota:** Implementado `storage.estimate()`.

---

## [0.4.0] - 2026-03-04
### 📺 El Reproductor Premium (PASO 4)
- **Añadido:** `FloatingPlayer.jsx` con diseño YT Premium.
- **Implementado:** Persistencia del reproductor a nivel de Layout global.
- **Añadido:** Control nativo de pistas (Next/Prev) desde el hardware.

---

## [0.3.0] - 2026-03-04
### 🔓 Bypass de Anuncios y Extracción (PASO 3)
- **Añadido:** `youtubeService.js` con Piped API multi-instancia.
- **Integrado:** `MediaSession API` para control en pantalla de bloqueo.
- **Refactorizado:** `InstallModal.jsx` con algoritmo de cortejo PWA.

---

## [0.2.0] - 2026-03-04
### 🚀 El Gran Pivote (PASO 2)
- **Implementado:** Definición de la **Lógica de Resiliencia v1.7** para IndexedDB.
- **Añadido:** Sistema de **ErrorBoundary** (El Bote de Salvamiento).
- **Control:** Gestión de estado global con **Zustand**.

---

## [0.1.0] - 2026-03-04
### 🛠️ Cimientos y Migración (PASO 1)
- **Cambio Estructural:** Migración total de Vanilla JS a **React + Vite**.
- **Limpieza:** El monolito de 2000 líneas fue enviado a `legacy/`.
- **Seguridad:** Implementado el `envValidator.js` (Escudo Anti-Bancarrota).
- **Configuración:** Alias de ruta `@/` y sistema de puerto `9090`.

---

> "Un código sin bitácora es una balsa a la deriva." - La Yoyita.
