'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { LoginForm } from './LoginForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function AuthModal({ isOpen, onClose, message }: AuthModalProps) {
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
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            {message && (
              <div className="mb-6 p-4 bg-[#E8F5E9] border border-[#1E4D3B]/20 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-[#1E4D3B] shadow-sm">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#143328] text-sm">Guarda tu progreso</h3>
                  <p className="text-xs text-[#1E4D3B]/80 mt-1">
                    {message}
                  </p>
                </div>
              </div>
            )}
            
            <LoginForm onSuccess={onClose} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
