import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import './utils/envValidator'
import ErrorBoundary from '@/components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)

// Registro del SW para Offline y PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('🌴 Selva PWA: Service Worker Activo (Offline Capable)'))
            .catch(err => console.error('Error registrando SW:', err));
    });
}
