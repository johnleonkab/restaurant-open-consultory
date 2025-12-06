'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ConceptWidget from '@/components/widgets/ConceptWidget';
import FinancialsWidget from '@/components/widgets/FinancialsWidget';
import LocationWidget from '@/components/widgets/LocationWidget';
import LegalWidget from '@/components/widgets/LegalWidget';
import DesignWidget from '@/components/widgets/DesignWidget';
import MenuWidget from '@/components/widgets/MenuWidget';
import SuppliersWidget from '@/components/widgets/SuppliersWidget';
import TechWidget from '@/components/widgets/TechWidget';
import TeamWidget from '@/components/widgets/TeamWidget';
import MarketingWidget from '@/components/widgets/MarketingWidget';
import OpeningWidget from '@/components/widgets/OpeningWidget';
import { useProjectStore } from '@/store/projectStore';

// Map phases to widgets
const WIDGETS: Record<string, React.ComponentType> = {
  CONCEPT: ConceptWidget,
  FINANCIALS: FinancialsWidget,
  LOCATION: LocationWidget,
  LEGAL: LegalWidget,
  DESIGN: DesignWidget,
  MENU: MenuWidget,
  SUPPLIERS: SuppliersWidget,
  TECH: TechWidget,
  TEAM: TeamWidget,
  MARKETING: MarketingWidget,
  OPENING: OpeningWidget,
  // Add others as they are created
};

export default function Canvas() {
  const { project } = useProjectStore();
  const currentPhase = project.currentPhase;
  
  const ActiveWidget = WIDGETS[currentPhase] || ConceptWidget;

  return (
    <div className="h-full w-full bg-[#FDFDFD] p-6 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full w-full overflow-y-auto pr-2"
        >
          <ActiveWidget />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
