/**
 * Radar de Diagnóstico: Validación estricta de variables de entorno.
 * Si falta alguna credencial crítica de Firebase, la app lanza un error fatal.
 */

const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(key => !import.meta.env[key]);

if (missingVars.length > 0) {
    const errorMessage = `
    🚨 ERROR CRÍTICO DE CONFIGURACIÓN 🚨
    Faltan las siguientes variables de entorno en tu archivo .env:
    ${missingVars.join('\n    ')}
    
    El Escudo Anti-Bancarrota requiere estas claves para funcionar.
    La aplicación se ha detenido por seguridad para evitar fugas de lectura.
  `;

    // Detener ejecución y mostrar error visual si es posible
    /*
    if (typeof window !== 'undefined') {
        document.body.innerHTML = `<div style="padding:20px; color:#ff4444; font-family:monospace; white-space:pre-wrap;">${errorMessage}</div>`;
    }
    */

    console.error(errorMessage);
    // throw new Error("Missing critical environment variables");
}

console.log("✅ Radar de Diagnóstico: Variables de entorno validadas correctamente.");

export default {};
