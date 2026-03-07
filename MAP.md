# 🗺️ Mapa de la Selva (MAP.md)
## SelvaBeat Premium: YouTube Clone PWA

Este documento es el GPS técnico del proyecto. Si te pierdes en la maleza, vuelve aquí.

### 🌟 Visión del Producto
Un clon de YouTube Premium ultra-ligero, mobile-first, sin anuncios y con capacidad offline. Diseñado para funcionar en dispositivos de gama media bajo el sol de la selva.

---

### 🏗️ Arquitectura de Poder (The Stack)
- **El Motor:** React + Vite (Velocidad de rayo ⚡).
- **El Corazón (Estado):** Zustand (Ligero, atómico, sin boilerplate).
- **La Piel (UI):** Tailwind CSS (Mobile-first extremo + Glassmorphism).
- **La Base:** Firebase (Sincronización en tiempo real).

---

### 🧭 Guía de Navegación (File Map)

#### 🛡️ Seguridad y Blindaje
- `src/utils/envValidator.js` **(El Escudo):** Valida las llaves de Firebase antes de que el motor arranque. Si falta algo, bloquea la app para evitar la "Bancarrota" de lecturas infinitas.
- `src/components/ErrorBoundary.jsx` **(El Bote de Salvamento):** Captura explosiones en los componentes y ofrece una salida digna (botón de recarga) en lugar de la pantalla blanca.

#### 🎮 Lógica de Negocio
- `src/store/usePlayerStore.js` **(El Director de Orquesta):** Controla el estado del reproductor global. Decide si el video está maximizado, minimizado o si la música debe sonar.
- `src/store/useToastStore.js` **(El Mensajero):** Sistema de notificaciones que fluye por encima de toda la UI.
- `src/hooks/useAudioEngine.js` **(El Corazón Pulmonar - v2.1):** Gestión del flujo binario. Implementa el **Watchdog de Metadata** (rescate automático en 4s) y el **Bypass de Google** vía túnel `/stream`.
- `src/components/Player/FloatingPlayer.jsx` **(La Capa Persistente):** Mantiene el elemento multimedia vivo incluso al navegar o minimizar. Intercambia dinámicamente entre Video Nativo y YouTube Embed.

#### 📡 Comunicaciones & Extracción
- `src/api/apiClient.js` **(El Radar):** `fetchSafe` clasifica errores y realiza saltos automáticos entre servidores.
- `src/api/youtubeService.js` **(La Bóveda de Piped):** Matriz de instancias (Bypass) que garantiza el flujo de datos incluso si un servidor se satura.

#### 🏛️ UI & Páginas
- `src/pages/Home.jsx` **(El Motor de Descubrimiento):** Donde la magia de la búsqueda y las tendencias sucede.
- `src/pages/Library.jsx` **(La Bóveda Offline):** Almacén virtualizado para escuchar sin internet.
- `src/components/Player/MiniPlayer.jsx` **(El Control Persistente):** Barra de navegación musical que nunca desaparece.

#### 🔄 Ciclo de Vida & PWA
- `public/sw.js` **(El Conserje):** Gestiona la caché y permite que la app respire sin red.
- `src/components/UpdatePWA.jsx` **(El Vigilante):** Detecta nuevas versiones y ofrece actualizaciones instantáneas (OTA).

---

### 📜 Decisiones Técnicas Clave (ADRs)
1. **Zustand sobre Redux:** Elegido por su nula fricción y capacidad de manejar el estado del reproductor global en el Layout sin re-renders masivos.
2. **Exclusión de Legacy:** Los archivos antiguos viven en `legacy/` y están bloqueados por `vite.config.js` para evitar contaminación del bundle moderno.
3. **videoData = null:** Inicializamos el video como `null` para que React no intente renderizar el reproductor "en el aire" antes de tener datos reales.
4. **Modo Rescate (YouTube Embed):** Si los proxies de Piped fallan tras 2 intentos o 4 segundos, el motor inyecta un iframe de YouTube de emergencia. Funcionalidad sobre Purismo.
5. **Túnel /stream:** Todas las peticiones de audio pasan por un túnel local de Vite para evitar bloqueos de firma y CORS de Google.
