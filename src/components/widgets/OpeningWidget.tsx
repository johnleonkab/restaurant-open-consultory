'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { ChecklistItem } from '@/types/project';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OpeningWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { opening } = project.data;
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem['category']>('IMPORTANT');

  const addItem = () => {
    if (!newItemLabel.trim()) return;
    
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      label: newItemLabel,
      category: newItemCategory,
      checked: false
    };

    updatePhaseData('opening', {
      finalChecklist: [...opening.finalChecklist, newItem]
    });
    setNewItemLabel('');
  };

  const toggleItem = (id: string) => {
    const updatedList = opening.finalChecklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    updatePhaseData('opening', { finalChecklist: updatedList });
  };

  const deleteItem = (id: string) => {
    const updatedList = opening.finalChecklist.filter(item => item.id !== id);
    updatePhaseData('opening', { finalChecklist: updatedList });
  };

  const progress = opening.finalChecklist.length > 0
    ? Math.round((opening.finalChecklist.filter(i => i.checked).length / opening.finalChecklist.length) * 100)
    : 0;

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Apertura</h1>
          <p className="text-slate-500">Checklist final y cuenta atrás para el gran día.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold">Progreso</p>
            <p className="text-xl font-bold text-slate-900">{progress}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
             <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent transform -rotate-45" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)` }} /> 
             {progress === 100 ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Calendar className="w-5 h-5 text-slate-400" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Add Item Form */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-2">
            <select 
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as ChecklistItem['category'])}
              className="p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
            >
              <option value="MUST">Crítico</option>
              <option value="IMPORTANT">Importante</option>
              <option value="NICE_TO_HAVE">Opcional</option>
              <option value="GENERAL">General</option>
            </select>
            <input 
              type="text" 
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="Añadir tarea (ej: Comprar cambio para la caja...)"
              className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={addItem}
              className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {opening.finalChecklist.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No hay tareas pendientes. ¡Añade la primera!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {opening.finalChecklist.map((item) => (
                  <div key={item.id} className={cn("p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors group", item.checked && "bg-slate-50/50")}>
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "w-6 h-6 rounded border flex items-center justify-center transition-colors",
                        item.checked 
                          ? "bg-green-500 border-green-500 text-white" 
                          : "border-slate-300 hover:border-slate-400 bg-white"
                      )}
                    >
                      {item.checked && <CheckSquare className="w-4 h-4" />}
                    </button>
                    
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium transition-all", item.checked ? "text-slate-400 line-through" : "text-slate-900")}>
                        {item.label}
                      </p>
                    </div>

                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-1 rounded-full",
                      item.category === 'MUST' ? "bg-red-100 text-red-700" :
                      item.category === 'IMPORTANT' ? "bg-orange-100 text-orange-700" :
                      item.category === 'NICE_TO_HAVE' ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {item.category === 'MUST' ? 'Crítico' : 
                       item.category === 'IMPORTANT' ? 'Importante' : 
                       item.category === 'NICE_TO_HAVE' ? 'Opcional' : 'General'}
                    </span>

                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5" /> Tips de Apertura
            </h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Haz un "Soft Opening" (apertura suave) con amigos y familiares antes de abrir al público general.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Verifica que todos los TPVs y impresoras funcionen correctamente.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Asegúrate de tener cambio suficiente en la caja.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Revisa los permisos y licencias una última vez.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
