import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * Radar de Diagnóstico: Error Boundary con Purga de Emergencia.
 * Blindaje contra bucles de muerte causados por estados persistentes corruptos.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("🚨 Radar de Diagnóstico - Error Crítico:", error, errorInfo);
    }

    /**
     * Purga de Caché: Limpiamos memoria persistente para evitar 
     * que el error se repita al recargar (Bucle de Muerte).
     */
    handleEmergencyReset = () => {
        console.warn("🧹 Iniciando purga de emergencia de localStorage y sessionStorage...");
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-surface border border-red-500/30 p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
                        <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-500 w-8 h-8" />
                        </div>

                        <h1 className="text-2xl font-bold mb-4 text-white">Emergencia en la Selva</h1>

                        <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                            La app ha colapsado. Vamos a realizar una limpieza de memoria para intentar un inicio limpio y seguro.
                        </p>

                        <div className="bg-red-500/5 p-4 rounded-xl mb-8 border border-red-500/10">
                            <p className="text-[10px] text-red-400 uppercase font-black mb-1">Causa del colapso</p>
                            <p className="font-mono text-[10px] text-red-300 break-all opacity-70">
                                {this.state.error?.message || "Error desconocido"}
                            </p>
                        </div>

                        <button
                            onClick={this.handleEmergencyReset}
                            className="mt-2 bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-2xl transition-all w-full flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-red-600/20"
                        >
                            <RefreshCw size={20} />
                            Purgar y Recargar App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
