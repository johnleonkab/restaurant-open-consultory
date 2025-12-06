'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquarePlus, ArrowRight } from 'lucide-react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal shortly after mounting
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-white/50"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#143328] to-[#1E4D3B]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative pt-12 px-8 pb-8">
                {/* Icon */}
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 relative z-10 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Sparkles className="w-10 h-10 text-[#1E4D3B]" />
                  </div>

                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    ¡Tu restaurante empieza aquí!
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Estás a un paso de convertir tu idea en realidad. 
                    Nuestra <strong>IA experta</strong> está lista para ayudarte a configurar cada detalle, desde el concepto hasta el menú.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // Focus chat input if possible, or just close
                      const chatInput = document.querySelector('textarea[placeholder*="Escribe"]');
                      if (chatInput instanceof HTMLElement) chatInput.focus();
                    }}
                    className="w-full py-4 bg-[#1E4D3B] text-white rounded-xl font-bold text-lg hover:bg-[#143328] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <MessageSquarePlus className="w-5 h-5" />
                    Hablar con la IA
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 text-sm hover:text-slate-600 py-2"
                  >
                    Explorar por mi cuenta
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
