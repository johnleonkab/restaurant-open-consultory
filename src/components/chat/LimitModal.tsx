'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LimitModal({ isOpen, onClose }: LimitModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden h-[80vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-full h-full pt-12">
            <iframe 
                src="https://tally.so/r/obEG0V?transparentBackground=1" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                title="Limit Reached"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
