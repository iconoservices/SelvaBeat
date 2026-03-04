// src/envValidator.js
// This module validates that all required NEXT_PUBLIC_ environment variables are present.
// It should be imported at the very start of your application (e.g., in index.html before other scripts).

const REQUIRED_VARS = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
];

function getEnvVar(name) {
    const value = window?.process?.env?.[name] ?? window?.[name]; // support both bundler env and global vars
    if (!value) {
        console.error(`🚨 Missing environment variable: ${name}`);
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = (() => {
    const envObj = {};
    REQUIRED_VARS.forEach((key) => {
        envObj[key] = getEnvVar(key);
    });
    return envObj;
})();

// Optional: expose a helper for runtime checks in non‑React code
export function assertEnv() {
    // All checks already performed during import; just keep this for explicit calls.
    return true;
}
