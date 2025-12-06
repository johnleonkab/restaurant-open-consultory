'use client';

import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';
import Canvas from '@/components/dashboard/Canvas';
import WelcomeModal from '@/components/dashboard/WelcomeModal';

export default function DashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full p-4 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <WelcomeModal />
      
      {/* LEFT COLUMN: CHAT (40%) */}
      <div className="lg:col-span-4 xl:col-span-3 h-full">
        <ChatInterface />
      </div>

      {/* RIGHT COLUMN: CANVAS (60%) */}
      <div className="lg:col-span-8 xl:col-span-9 h-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        <Canvas />
      </div>
    </motion.div>
  );
}
