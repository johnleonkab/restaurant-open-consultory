'use client';

import { useProjectStore } from '@/store/projectStore';
import { 
  Monitor, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Smartphone, 
  CreditCard, 
  BarChart3,
  MessageSquare,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Predefined POS options
const POS_OPTIONS = [
  {
    id: 'last-app',
    name: 'Last.app',
    description: 'El sistema TPV más moderno y flexible. Ideal para todo tipo de restaurantes.',
    features: ['Gestión de mesas', 'Comandos de voz', 'Integración Delivery'],
    bestFor: 'Versátil (Todos)',
    color: 'bg-indigo-600'
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Perfecto para empezar rápido. Hardware elegante y pagos integrados.',
    features: ['Pagos integrados', 'Hardware gratuito', 'Fácil de usar'],
    bestFor: 'Cafeterías / Fast Casual',
    color: 'bg-slate-900'
  },
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    description: 'Potente y robusto. La elección de los grandes grupos de restauración.',
    features: ['Inventario avanzado', 'Multilocal', 'Informes detallados'],
    bestFor: 'Restaurantes grandes / Cadenas',
    color: 'bg-red-600'
  },
  {
    id: 'storyous',
    name: 'Storyous',
    description: 'Intuitivo y con buen soporte local. Una opción sólida para el mercado español.',
    features: ['Fácil aprendizaje', 'Soporte 24/7', 'Económico'],
    bestFor: 'Restaurantes medianos',
    color: 'bg-orange-500'
  }
];

export default function TechWidget() {
  const { project, updatePhaseData } = useProjectStore();
  // Safe access with fallback for existing projects
  const techData = project.data.tech || { 
    pos: { selected: null, status: 'PENDING' }, 
    reservation: { selected: null, status: 'PENDING' } 
  };

  const handleSelectPos = (id: string) => {
    updatePhaseData('tech', {
      pos: {
        selected: id,
        status: 'CONTACTED' // Assume selecting implies intent/contact
      }
    });
  };

  const handleUpdatePosStatus = (status: 'PENDING' | 'CONTACTED' | 'DEMO' | 'INSTALLED') => {
    updatePhaseData('tech', {
      pos: {
        ...techData.pos,
        status
      }
    });
  };

  const handleConnectCoverManager = () => {
    updatePhaseData('tech', {
      reservation: {
        selected: 'COVER_MANAGER',
        status: 'CONTACTED'
      }
    });
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tecnología y Sistemas</h1>
          <p className="text-slate-500">Digitaliza tu negocio con las mejores herramientas.</p>
        </div>
      </div>

      {/* POS Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Monitor className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Sistema TPV (POS)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POS_OPTIONS.map((pos) => {
            const isSelected = techData.pos?.selected === pos.id;
            return (
              <div 
                key={pos.id}
                className={cn(
                  "relative group rounded-xl border-2 transition-all duration-200 overflow-hidden",
                  isSelected 
                    ? "border-blue-600 bg-blue-50/50 shadow-md" 
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                )}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    SELECCIONADO
                  </div>
                )}
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl", pos.color)}>
                      {pos.name[0]}
                    </div>
                    {isSelected && (
                      <div className="flex gap-2">
                         <select 
                           value={techData.pos?.status}
                           onChange={(e) => handleUpdatePosStatus(e.target.value as any)}
                           className="text-xs border-none bg-transparent font-medium text-blue-700 focus:ring-0 cursor-pointer"
                         >
                           <option value="CONTACTED">Contactado</option>
                           <option value="DEMO">Demo Agendada</option>
                           <option value="INSTALLED">Instalado</option>
                         </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{pos.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{pos.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pos.features.map(feat => (
                      <span key={feat} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {pos.bestFor}
                    </span>
                    <button
                      onClick={() => handleSelectPos(pos.id)}
                      disabled={isSelected}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        isSelected 
                          ? "bg-green-100 text-green-700 cursor-default" 
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Seleccionado
                        </>
                      ) : (
                        <>
                          Elegir este
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reservations Section - CoverManager Highlight */}
      <section className="space-y-4 pt-8 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Gestión de Reservas</h2>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-medium mb-4">
                  <Star className="w-3 h-3 fill-current" /> Partner Recomendado
                </div>
                <h3 className="text-3xl font-bold mb-2">CoverManager</h3>
                <p className="text-slate-300 leading-relaxed">
                  El estándar de oro en la gestión de reservas y hospitalidad. 
                  Optimiza tus mesas, reduce los "no-shows" y fideliza a tus clientes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Smartphone className="w-5 h-5 text-indigo-300" />
                  </div>
                  <span className="text-sm font-medium">Reservas 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-indigo-300" />
                  </div>
                  <span className="text-sm font-medium">Garantía No-Show</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-300" />
                  </div>
                  <span className="text-sm font-medium">Analítica Avanzada</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-indigo-300" />
                  </div>
                  <span className="text-sm font-medium">CRM Clientes</span>
                </div>
              </div>

              <div className="pt-4">
                {techData.reservation?.status === 'CONTACTED' || techData.reservation?.status === 'ACTIVE' ? (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-100">Solicitud Enviada</p>
                      <p className="text-xs text-green-200/80">Un especialista de CoverManager te contactará pronto.</p>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleConnectCoverManager}
                    className="group bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/50"
                  >
                    Contactar con CoverManager
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            <div className="hidden md:block relative">
              {/* Abstract representation of the dashboard */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-32 bg-white/5 rounded-lg w-full animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-white/5 rounded-lg"></div>
                    <div className="h-20 bg-white/5 rounded-lg"></div>
                    <div className="h-20 bg-white/5 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
