'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  MapPin, 
  Search, 
  Plus, 
  Trash2, 
  Check, 
  Building2, 
  StickyNote,
  ExternalLink,
  Map as MapIcon,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CandidateLocation } from '@/types/project';
import dynamic from 'next/dynamic';

// Dynamically import Map component to avoid SSR issues with Leaflet
const MapView = dynamic<{ 
  candidates: CandidateLocation[]; 
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedPosition?: { lat: number; lng: number } | null | undefined;
}>(() => import('./MapView'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Cargando mapa...</div>
});

export default function LocationWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { location } = project.data;
  const [activeTab, setActiveTab] = useState<'SEARCH' | 'LIST' | 'MAP'>('LIST');
  const [isAdding, setIsAdding] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Partial<CandidateLocation>>({});

  const handleAddCandidate = () => {
    if (!newCandidate.name) return;
    
    const candidate: CandidateLocation = {
      id: Date.now().toString(),
      name: newCandidate.name,
      address: newCandidate.address || '',
      capacity: newCandidate.capacity || 0,
      monthlyRent: newCandidate.monthlyRent || 0,
      isOwned: newCandidate.isOwned || false,
      notes: newCandidate.notes || '',
      coordinates: newCandidate.coordinates, // Map picker should populate this
    };

    updatePhaseData('location', {
      candidates: [...(location.candidates || []), candidate]
    });
    setIsAdding(false);
    setNewCandidate({});
  };

  const handleDeleteCandidate = (id: string) => {
    updatePhaseData('location', {
      candidates: location.candidates.filter(c => c.id !== id)
    });
  };

  const handleSelectCandidate = (id: string) => {
    updatePhaseData('location', {
      selectedCandidateId: id,
      status: 'SELECTED'
    });
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ubicación</h1>
          <p className="text-slate-500">Gestión y selección del local.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('SEARCH')}
            className={cn("p-2 rounded-md transition-colors", activeTab === 'SEARCH' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('LIST')}
            className={cn("p-2 rounded-md transition-colors", activeTab === 'LIST' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <List className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('MAP')}
            className={cn("p-2 rounded-md transition-colors", activeTab === 'MAP' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {activeTab === 'SEARCH' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PortalCard 
            name="Idealista" 
            url="https://www.idealista.com/alquiler-locales/" 
            color="bg-purple-50 text-purple-700 hover:bg-purple-100" 
          />
          <PortalCard 
            name="Fotocasa" 
            url="https://www.fotocasa.es/es/alquiler/locales" 
            color="bg-blue-50 text-blue-700 hover:bg-blue-100" 
          />
          <PortalCard 
            name="Milanuncios" 
            url="https://www.milanuncios.com/alquiler-de-locales-comerciales/" 
            color="bg-green-50 text-green-700 hover:bg-green-100" 
          />
          <PortalCard 
            name="Habitaclia" 
            url="https://www.habitaclia.com/alquiler-locales.htm" 
            color="bg-orange-50 text-orange-700 hover:bg-orange-100" 
          />
        </div>
      )}

      {activeTab === 'LIST' && (
        <div className="space-y-4">
          {location.candidates?.map((candidate) => (
            <div 
              key={candidate.id} 
              className={cn(
                "bg-white rounded-xl p-4 border transition-all",
                location.selectedCandidateId === candidate.id 
                  ? "border-green-500 shadow-md ring-1 ring-green-500" 
                  : "border-slate-200 shadow-sm hover:border-blue-300"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {candidate.address}
                    </p>
                    {!candidate.coordinates && (
                      <button 
                        onClick={() => {
                          setNewCandidate(candidate);
                          setIsAdding(true);
                          handleDeleteCandidate(candidate.id); // Remove temporarily to re-add with coords
                        }}
                        className="text-xs text-red-500 font-medium hover:underline mt-1 flex items-center gap-1"
                      >
                        <MapIcon className="w-3 h-3" /> Ubicar en mapa (Requerido)
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {location.selectedCandidateId !== candidate.id && candidate.coordinates && (
                    <button 
                      onClick={() => handleSelectCandidate(candidate.id)}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Seleccionar como definitivo"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="p-2 bg-slate-50 rounded text-center">
                  <span className="block text-xs text-slate-500 uppercase">Alquiler</span>
                  <span className="font-semibold text-slate-900">{candidate.monthlyRent}€</span>
                </div>
                <div className="p-2 bg-slate-50 rounded text-center">
                  <span className="block text-xs text-slate-500 uppercase">Aforo</span>
                  <span className="font-semibold text-slate-900">{candidate.capacity} pax</span>
                </div>
                <div className="p-2 bg-slate-50 rounded text-center">
                  <span className="block text-xs text-slate-500 uppercase">Estado</span>
                  <span className="font-semibold text-slate-900">{candidate.isOwned ? 'Propiedad' : 'Alquiler'}</span>
                </div>
              </div>

              {candidate.notes && (
                <div className="text-sm text-slate-600 bg-yellow-50 p-3 rounded-lg flex gap-2">
                  <StickyNote className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  {candidate.notes}
                </div>
              )}
            </div>
          ))}

          {isAdding ? (
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-blue-300 space-y-4">
              <h3 className="font-semibold text-slate-900">Nuevo Candidato</h3>
              <input 
                type="text" 
                placeholder="Nombre (ej. Local Centro)" 
                className="w-full p-2 border rounded-lg"
                value={newCandidate.name || ''}
                onChange={e => setNewCandidate({...newCandidate, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Dirección" 
                className="w-full p-2 border rounded-lg"
                value={newCandidate.address || ''}
                onChange={e => setNewCandidate({...newCandidate, address: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Alquiler Mensual (€)" 
                  className="w-full p-2 border rounded-lg"
                  value={newCandidate.monthlyRent || ''}
                  onChange={e => setNewCandidate({...newCandidate, monthlyRent: Number(e.target.value)})}
                />
                <input 
                  type="number" 
                  placeholder="Aforo (pax)" 
                  className="w-full p-2 border rounded-lg"
                  value={newCandidate.capacity || ''}
                  onChange={e => setNewCandidate({...newCandidate, capacity: Number(e.target.value)})}
                />
              </div>
              <textarea 
                placeholder="Notas..." 
                className="w-full p-2 border rounded-lg"
                value={newCandidate.notes || ''}
                onChange={e => setNewCandidate({...newCandidate, notes: e.target.value})}
              />
              <div className="h-[300px] w-full rounded-lg overflow-hidden border border-slate-300 relative">
                <p className="absolute top-2 left-2 z-[1000] bg-white/90 px-2 py-1 text-xs font-medium rounded shadow-sm">
                  Haz clic en el mapa para ubicar el local
                </p>
                <MapView 
                  candidates={[]} 
                  interactive={true}
                  onLocationSelect={(lat, lng) => setNewCandidate({...newCandidate, coordinates: { lat, lng }})}
                  selectedPosition={newCandidate.coordinates}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddCandidate}
                  disabled={!newCandidate.name || !newCandidate.coordinates}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Añadir Candidato Manualmente
            </button>
          )}
        </div>
      )}

      {activeTab === 'MAP' && (
        <div className="h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
          <MapView candidates={location.candidates || []} />
        </div>
      )}
    </div>
  );
}

function PortalCard({ name, url, color }: { name: string, url: string, color: string }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn("flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02]", color)}
    >
      <span className="font-bold">{name}</span>
      <ExternalLink className="w-5 h-5 opacity-70" />
    </a>
  );
}
