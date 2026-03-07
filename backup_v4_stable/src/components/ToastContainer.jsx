import React from 'react';
import { useToastStore } from '@/store/useToastStore';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-[320px]">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            flex items-center gap-3 p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300
            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-200' :
                            toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-200' :
                                'bg-zinc-900 border-zinc-700 text-zinc-100'}
          `}
                >
                    <div className="shrink-0">
                        {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                        {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
                        {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
                    </div>

                    <p className="text-sm font-medium flex-1">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
