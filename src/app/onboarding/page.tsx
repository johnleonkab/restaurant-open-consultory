'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  MapPin, 
  Wallet, 
  Hammer, 
  ChevronRight, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Concepto', icon: Store },
  { id: 2, title: 'Ubicación', icon: MapPin },
  { id: 3, title: 'Presupuesto', icon: Wallet },
  { id: 4, title: 'Estado', icon: Hammer },
];

const BUSINESS_TYPES = [
  { id: 'TRADITIONAL', label: 'Restaurante Tradicional', description: 'Servicio de mesa clásico' },
  { id: 'SPECIALTY', label: 'Especialidad', description: 'Italiano, Japonés, Mexicano...' },
  { id: 'CAFE', label: 'Cafetería / Brunch', description: 'Café, desayunos y meriendas' },
  { id: 'TAPAS', label: 'Bar de Tapas', description: 'Gastrobar y raciones' },
  { id: 'FAST_CASUAL', label: 'Fast Casual', description: 'Rápido pero de calidad' },
  { id: 'FOOD_TRUCK', label: 'Food Truck', description: 'Restaurante sobre ruedas' },
  { id: 'DARK_KITCHEN', label: 'Dark Kitchen', description: 'Solo delivery' },
];

const BUDGET_RANGES = [
  { id: '<30K', label: 'Menos de 30.000€', description: 'Low cost / Autoempleo' },
  { id: '30K-60K', label: '30.000€ - 60.000€', description: 'Local pequeño / Reforma leve' },
  { id: '60K-100K', label: '60.000€ - 100.000€', description: 'Estándar' },
  { id: '100K-200K', label: '100.000€ - 200.000€', description: 'Proyecto ambicioso' },
  { id: '>200K', label: 'Más de 200.000€', description: 'Gran inversión' },
  { id: 'UNKNOWN', label: 'No lo sé todavía', description: 'Necesito ayuda para calcularlo' },
];

const STATUS_OPTIONS = [
  { id: 'IDEA', label: 'Solo es una idea', description: 'Estoy explorando opciones' },
  { id: 'PLAN', label: 'Tengo un plan', description: 'Pero nada concreto aún' },
  { id: 'HAS_LOCATION', label: 'Ya tengo local', description: 'Busco qué hacer con él' },
  { id: 'LICENSES', label: 'Trámites iniciados', description: 'Licencias en proceso' },
  { id: 'CONSTRUCTION', label: 'En obras', description: 'A punto de abrir' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { project, updatePhaseData, setPhase } = useProjectStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      // Finish onboarding
      setIsExiting(true);
      
      // Wait for exit animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updatePhaseData('onboarding', { completed: true });
      setPhase('CONCEPT'); // Move to next phase
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelectType = (type: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePhaseData('onboarding', { businessType: type as any });
    setTimeout(handleNext, 300);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  const handleSelectBudget = (range: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePhaseData('onboarding', { budgetRange: range as any });
    setTimeout(handleNext, 300);
  };

  const handleSelectStatus = (status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePhaseData('onboarding', { currentStatus: status as any });
    setTimeout(handleNext, 300);
  };

  if (!isClient) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    })
  };

  if (isExiting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[600px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 border-4 border-[#1E4D3B] border-t-transparent rounded-full animate-spin" />
            <h2 className="text-2xl font-bold text-slate-900">Preparando tu cocina...</h2>
            <p className="text-slate-500">Configurando el espacio de trabajo</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* ... (rest of the component) */}
        {/* Progress Bar */}
        <div className="bg-white p-8 pb-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Vamos a crear tu restaurante
                </h1>
                <p className="text-slate-500 text-sm">Configuración inicial del proyecto</p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#1E4D3B] bg-[#E8F5E9] px-3 py-1 rounded-full">
              Paso {currentStep} de {STEPS.length}
            </span>
          </div>
          
          <div className="relative mx-4 mb-4">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full" />
            
            {/* Active Line */}
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-[#1E4D3B] -z-10 -translate-y-1/2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <div className="flex justify-between">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <div 
                    key={step.id} 
                    className="flex flex-col items-center gap-2 relative"
                  >
                    <motion.div 
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors z-10",
                        isActive ? "border-[#C8E036] bg-[#1E4D3B] text-white shadow-lg shadow-[#1E4D3B]/20" : 
                        isCompleted ? "border-[#1E4D3B] bg-[#1E4D3B] text-white" : "border-slate-50 bg-white text-slate-300"
                      )}
                      animate={{ 
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isActive ? "#1E4D3B" : isCompleted ? "#1E4D3B" : "#ffffff"
                      }}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <span className={cn(
                      "text-xs font-semibold absolute -bottom-6 w-24 text-center transition-colors",
                      isActive ? "text-[#1E4D3B]" : isCompleted ? "text-[#1E4D3B]" : "text-slate-300"
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[450px] bg-slate-50/30 relative">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 p-8 overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">¿Qué tipo de negocio quieres abrir?</h2>
                <p className="text-center text-slate-500 mb-8">Selecciona la opción que mejor describa tu idea</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BUSINESS_TYPES.map((type) => (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      key={type.id}
                      onClick={() => handleSelectType(type.id)}
                      className={cn(
                        "p-5 border rounded-2xl text-left transition-all group relative overflow-hidden",
                        project.data.onboarding.businessType === type.id 
                          ? "border-[#1E4D3B] bg-[#E8F5E9] shadow-md shadow-[#1E4D3B]/10" 
                          : "border-slate-200 bg-white hover:border-[#C8E036] hover:shadow-lg hover:shadow-slate-100"
                      )}
                    >
                      <div className="relative z-10">
                        <div className={cn(
                          "font-bold text-lg mb-1 group-hover:text-[#1E4D3B] transition-colors",
                          project.data.onboarding.businessType === type.id ? "text-[#1E4D3B]" : "text-slate-800"
                        )}>
                          {type.label}
                        </div>
                        <div className="text-sm text-slate-500">{type.description}</div>
                      </div>
                      {project.data.onboarding.businessType === type.id && (
                        <motion.div 
                          layoutId="selectedType"
                          className="absolute inset-0 bg-[#E8F5E9] -z-0"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 p-8 overflow-y-auto flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-md">
                  <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">¿Dónde lo vas a montar?</h2>
                  <p className="text-center text-slate-500 mb-8">La ubicación es clave para el éxito de tu restaurante</p>
                  
                  <form onSubmit={handleLocationSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad o Zona</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Madrid, Barrio de Salamanca"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#C8E036]/50 focus:border-[#C8E036] outline-none transition-all text-lg shadow-sm"
                        value={project.data.onboarding.locationCity}
                        onChange={(e) => updatePhaseData('onboarding', { locationCity: e.target.value })}
                        autoFocus
                      />
                      <p className="text-sm text-slate-500 mt-3 flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        Esto nos ayudará a buscar la normativa local, analizar la competencia y estimar el tráfico de clientes.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!project.data.onboarding.locationCity}
                      className="w-full bg-[#1E4D3B] text-white py-4 rounded-xl font-bold hover:bg-[#143328] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200"
                    >
                      Continuar <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 p-8 overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">¿Cuál es tu presupuesto estimado?</h2>
                <p className="text-center text-slate-500 mb-8">No te preocupes, esto es solo una estimación inicial</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BUDGET_RANGES.map((range) => (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      key={range.id}
                      onClick={() => handleSelectBudget(range.id)}
                      className={cn(
                        "p-5 border rounded-2xl text-left transition-all group relative overflow-hidden",
                        project.data.onboarding.budgetRange === range.id 
                          ? "border-[#1E4D3B] bg-[#E8F5E9] shadow-md shadow-[#1E4D3B]/10" 
                          : "border-slate-200 bg-white hover:border-[#C8E036] hover:shadow-lg hover:shadow-slate-100"
                      )}
                    >
                      <div className="relative z-10">
                        <div className={cn(
                          "font-bold text-lg mb-1 group-hover:text-[#1E4D3B] transition-colors",
                          project.data.onboarding.budgetRange === range.id ? "text-[#1E4D3B]" : "text-slate-800"
                        )}>
                          {range.label}
                        </div>
                        <div className="text-sm text-slate-500">{range.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 p-8 overflow-y-auto flex flex-col items-center"
              >
                <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">¿En qué fase estás ahora mismo?</h2>
                <p className="text-center text-slate-500 mb-8">Para adaptar las recomendaciones a tu estado actual</p>
                
                <div className="grid grid-cols-1 gap-4 max-w-lg w-full">
                  {STATUS_OPTIONS.map((status) => (
                    <motion.button
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      key={status.id}
                      onClick={() => handleSelectStatus(status.id)}
                      className={cn(
                        "p-5 border rounded-2xl text-left transition-all group flex items-center justify-between bg-white",
                        project.data.onboarding.currentStatus === status.id 
                          ? "border-[#1E4D3B] bg-[#E8F5E9] shadow-md shadow-[#1E4D3B]/10" 
                          : "border-slate-200 hover:border-[#C8E036] hover:shadow-md hover:shadow-slate-100"
                      )}
                    >
                      <div>
                        <div className={cn(
                          "font-bold text-lg mb-1 group-hover:text-[#1E4D3B] transition-colors",
                          project.data.onboarding.currentStatus === status.id ? "text-[#1E4D3B]" : "text-slate-800"
                        )}>
                          {status.label}
                        </div>
                        <div className="text-sm text-slate-500">{status.description}</div>
                      </div>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                        project.data.onboarding.currentStatus === status.id ? "bg-[#1E4D3B]/20 text-[#1E4D3B]" : "bg-slate-100 text-slate-400 group-hover:bg-[#E8F5E9] group-hover:text-[#1E4D3B]"
                      )}>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
