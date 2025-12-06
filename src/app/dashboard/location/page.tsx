'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  MapPin, 
  Search, 
  CheckSquare, 
  Building, 
  Ruler, 
  Wind, 
  Euro, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_CHECKLIST = [
  { id: 'smoke', label: 'Salida de humos (o posibilidad real)', category: 'MUST', checked: false },
  { id: 'license', label: 'Licencia de actividad previa', category: 'MUST', checked: false },
  { id: 'sqm', label: 'Metros cuadrados suficientes', category: 'MUST', checked: false },
  { id: 'location', label: 'Zona con tráfico peatonal', category: 'IMPORTANT', checked: false },
  { id: 'facade', label: 'Fachada visible / Escaparate', category: 'IMPORTANT', checked: false },
  { id: 'accessibility', label: 'Accesibilidad / Planta calle', category: 'IMPORTANT', checked: false },
  { id: 'terrace', label: 'Posibilidad de terraza', category: 'NICE_TO_HAVE', checked: false },
  { id: 'condition', label: 'Buen estado de conservación', category: 'NICE_TO_HAVE', checked: false },
];

export default function LocationPage() {
  const { project, updatePhaseData } = useProjectStore();
  const [isClient, setIsClient] = useState(false);
  
  // Local state
  const [status, setStatus] = useState(project.data.location.status);
  const [checklist, setChecklist] = useState(
    project.data.location.searchChecklist.length > 0 
      ? project.data.location.searchChecklist 
      : DEFAULT_CHECKLIST
  );
  const [selectedLocation, setSelectedLocation] = useState(
    project.data.location.selectedLocation || {
      address: '',
      surfaceArea: 0,
      hasSmokeVent: false,
      monthlyRent: 0,
      condition: 'NEEDS_RENOVATION'
    }
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Sync with store
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePhaseData('location', { 
      status, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      searchChecklist: checklist as any, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectedLocation: selectedLocation as any
    });
  }, [status, checklist, selectedLocation, updatePhaseData]);

  const toggleCheck = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const calculateProgress = () => {
    const total = checklist.length;
    const checked = checklist.filter(i => i.checked).length;
    return Math.round((checked / total) * 100);
  };

  if (!isClient) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Búsqueda de Local</h1>
        <p className="text-slate-500 mt-2">Gestiona la búsqueda o registra los datos de tu local definitivo.</p>
      </div>

      {/* Status Toggle */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex">
        <button
          onClick={() => setStatus('SEARCHING')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            status === 'SEARCHING' 
              ? "bg-blue-50 text-blue-700 shadow-sm" 
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Search className="w-4 h-4" />
          Estoy buscando
        </button>
        <button
          onClick={() => setStatus('SELECTED')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            status === 'SELECTED' 
              ? "bg-green-50 text-green-700 shadow-sm" 
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <MapPin className="w-4 h-4" />
          Ya tengo local
        </button>
      </div>

      {status === 'SEARCHING' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Criterios de Búsqueda</h2>
                    <p className="text-sm text-slate-500">No te olvides de validar estos puntos en cada visita.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">{calculateProgress()}%</span>
                  <p className="text-xs text-slate-500">Completado</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> IMPRESCINDIBLES (MUST HAVE)
                  </h3>
                  <div className="space-y-2">
                    {checklist.filter(i => i.category === 'MUST').map(item => (
                      <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                        />
                        <span className={cn("text-sm", item.checked ? "text-slate-400 line-through" : "text-slate-700")}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-blue-600 mb-3">IMPORTANTES</h3>
                  <div className="space-y-2">
                    {checklist.filter(i => i.category === 'IMPORTANT').map(item => (
                      <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                        />
                        <span className={cn("text-sm", item.checked ? "text-slate-400 line-through" : "text-slate-700")}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-green-600 mb-3">DESEABLES (NICE TO HAVE)</h3>
                  <div className="space-y-2">
                    {checklist.filter(i => i.category === 'NICE_TO_HAVE').map(item => (
                      <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                        />
                        <span className={cn("text-sm", item.checked ? "text-slate-400 line-through" : "text-slate-700")}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Consejo Pro
              </h3>
              <p className="text-sm text-blue-800">
                Nunca alquiles un local sin salida de humos si planeas cocinar. Instalarla después es costoso, difícil y a veces imposible por la comunidad de vecinos.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Calculadora Rápida</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500">Alquiler Mensual (€)</label>
                  <input type="number" className="w-full p-2 border rounded-md" placeholder="2000" />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Facturación necesaria (x10)</p>
                  <p className="text-lg font-bold text-slate-900">20.000€ / mes</p>
                  <p className="text-xs text-slate-400 mt-1">Regla del 10%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Detalles del Local Seleccionado</h2>
                <p className="text-sm text-slate-500">Registra la información técnica para las siguientes fases.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección Completa</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Calle Principal 123, Madrid"
                  value={selectedLocation.address}
                  onChange={(e) => setSelectedLocation({ ...selectedLocation, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Ruler className="w-4 h-4" /> Superficie (m²)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  value={selectedLocation.surfaceArea}
                  onChange={(e) => setSelectedLocation({ ...selectedLocation, surfaceArea: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Euro className="w-4 h-4" /> Alquiler Mensual
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  value={selectedLocation.monthlyRent}
                  onChange={(e) => setSelectedLocation({ ...selectedLocation, monthlyRent: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Wind className="w-4 h-4" /> Salida de Humos
                </label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  value={selectedLocation.hasSmokeVent ? 'YES' : 'NO'}
                  onChange={(e) => setSelectedLocation({ ...selectedLocation, hasSmokeVent: e.target.value === 'YES' })}
                >
                  <option value="NO">No tiene</option>
                  <option value="YES">Sí tiene</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado del Local</label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  value={selectedLocation.condition}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setSelectedLocation({ ...selectedLocation, condition: e.target.value as any })}
                >
                  <option value="NEEDS_RENOVATION">Necesita Reforma</option>
                  <option value="NEW">Nuevo / Llave en mano</option>
                </select>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-2">Siguientes Pasos</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Verificar licencias en el Ayuntamiento</li>
                <li>Contactar con un arquitecto para el proyecto</li>
                <li>Solicitar presupuestos de reforma</li>
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
