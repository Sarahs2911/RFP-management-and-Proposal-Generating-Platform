import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'celebrate' | 'warning';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="pointer-events-auto bg-[#050F2A] text-white rounded-2xl p-4 shadow-xl border border-[#7BBBFF]/30 flex items-start gap-3 backdrop-blur-md"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'celebrate' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7BBBFF] to-[#B8A9FF] flex items-center justify-center text-[#050F2A]">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'warning' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {(!toast.type || toast.type === 'info') && (
                <div className="w-8 h-8 rounded-xl bg-[#7BBBFF]/20 text-[#7BBBFF] flex items-center justify-center border border-[#7BBBFF]/30">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs font-bold text-white tracking-tight">{toast.title}</h5>
              {toast.message && (
                <p className="text-[11px] text-[#F2FDFF]/75 mt-0.5 leading-relaxed font-normal">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
