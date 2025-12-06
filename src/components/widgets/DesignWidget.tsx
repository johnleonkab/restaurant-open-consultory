'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  LayoutDashboard, 
  Hammer, 
  Refrigerator, 
  CheckCircle2, 
  Circle,
  Plus,
  Trash2,
  Map as MapIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquipmentItem, ConstructionTask } from '@/types/project';
import FloorPlanEditor from './FloorPlanEditor';

export default function DesignWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { design } = project.data;
  const [activeTab, setActiveTab] = useState<'LAYOUT' | 'EQUIPMENT' | 'CONSTRUCTION' | 'PLAN'>('LAYOUT');
  const [newEquipment, setNewEquipment] = useState('');
  const [newTask, setNewTask] = useState('');

  // Layout Handlers
  const updateLayout = (field: keyof typeof design.layout, value: number) => {
    updatePhaseData('design', {
      layout: { ...design.layout, [field]: value }
    });
  };

  // Equipment Handlers
  const addEquipment = () => {
    if (!newEquipment) return;
    const item: EquipmentItem = {
      id: Date.now().toString(),
      name: newEquipment,
      category: 'HOT', // Default, user can change
      estimatedCost: 0,
      purchased: false
    };
    updatePhaseData('design', {
      equipmentChecklist: [...design.equipmentChecklist, item]
    });
    setNewEquipment('');
  };

  const toggleEquipment = (id: string) => {
    const updated = design.equipmentChecklist.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    );
    updatePhaseData('design', { equipmentChecklist: updated });
  };

  const deleteEquipment = (id: string) => {
    const updated = design.equipmentChecklist.filter(item => item.id !== id);
    updatePhaseData('design', { equipmentChecklist: updated });
  };

  // Construction Handlers
  const addTask = () => {
    if (!newTask) return;
    const task: ConstructionTask = {
      id: Date.now().toString(),
      name: newTask,
      status: 'PENDING'
    };
    updatePhaseData('design', {
      constructionTimeline: [...design.constructionTimeline, task]
    });
    setNewTask('');
  };

  const updateTaskStatus = (id: string, status: ConstructionTask['status']) => {
    const updated = design.constructionTimeline.map(task => 
      task.id === id ? { ...task, status } : task
    );
    updatePhaseData('design', { constructionTimeline: updated });
  };

  const deleteTask = (id: string) => {
    const updated = design.constructionTimeline.filter(task => task.id !== id);
    updatePhaseData('design', { constructionTimeline: updated });
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diseño y Obra</h1>
          <p className="text-slate-500">Distribución, equipamiento y reformas.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('LAYOUT')}
            className={cn("p-2 rounded-md transition-colors", activeTab === 'LAYOUT' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Distribución"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('EQUIPMENT')}
            className={cn("p-2 rounded-md transition-colors", activeTab === 'EQUIPMENT' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Equipamiento"
          >
            <Refrigerator className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('CONSTRUCTION')}
            className={cn("p-2 rounded-md transition-colors", activeTab === 'CONSTRUCTION' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Obra"
          >
            <Hammer className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('PLAN')}
            className={cn("p-2 rounded-md transition-colors", activeTab === 'PLAN' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Planos"
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {activeTab === 'LAYOUT' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Distribución de Espacios (m²)</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Sala / Comedor</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  value={design.layout.diningAreaSqM}
                  onChange={(e) => updateLayout('diningAreaSqM', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Cocina</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  value={design.layout.kitchenAreaSqM}
                  onChange={(e) => updateLayout('kitchenAreaSqM', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Aseos / Almacén</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  value={design.layout.toiletsAreaSqM}
                  onChange={(e) => updateLayout('toiletsAreaSqM', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Capacidad Estimada</label>
                <div className="w-full p-2 bg-slate-50 rounded-lg font-medium text-slate-700">
                  {Math.floor(design.layout.diningAreaSqM / 1.5)} pax (aprox.)
                </div>
              </div>
            </div>
            
            {/* Visual Bar */}
            <div className="h-8 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold"
                style={{ width: `${(design.layout.diningAreaSqM / (design.layout.diningAreaSqM + design.layout.kitchenAreaSqM + design.layout.toiletsAreaSqM || 1)) * 100}%` }}
              >
                Sala
              </div>
              <div 
                className="h-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold"
                style={{ width: `${(design.layout.kitchenAreaSqM / (design.layout.diningAreaSqM + design.layout.kitchenAreaSqM + design.layout.toiletsAreaSqM || 1)) * 100}%` }}
              >
                Cocina
              </div>
              <div 
                className="h-full bg-slate-400 flex items-center justify-center text-[10px] text-white font-bold"
                style={{ width: `${(design.layout.toiletsAreaSqM / (design.layout.diningAreaSqM + design.layout.kitchenAreaSqM + design.layout.toiletsAreaSqM || 1)) * 100}%` }}
              >
                Otros
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PLAN' && (
        <FloorPlanEditor 
          floors={design.floorPlan || []} 
          onChange={(floors) => updatePhaseData('design', { floorPlan: floors })} 
        />
      )}

      {activeTab === 'EQUIPMENT' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Añadir equipamiento (ej. Horno Convención)" 
              className="flex-1 p-2 border rounded-lg"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEquipment()}
            />
            <button 
              onClick={addEquipment}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {design.equipmentChecklist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleEquipment(item.id)}>
                    {item.purchased ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-slate-300" />}
                  </button>
                  <span className={cn(item.purchased && "line-through text-slate-400")}>{item.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-500">{item.category}</span>
                </div>
                <button onClick={() => deleteEquipment(item.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {design.equipmentChecklist.length === 0 && (
              <p className="text-center text-slate-500 py-8 italic">
                Pide a la IA que genere una lista de equipamiento para tu cocina.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'CONSTRUCTION' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nueva tarea de obra (ej. Demolición tabiques)" 
              className="flex-1 p-2 border rounded-lg"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              onClick={addTask}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {design.constructionTimeline.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    task.status === 'COMPLETED' ? "bg-green-500" :
                    task.status === 'IN_PROGRESS' ? "bg-blue-500" : "bg-slate-300"
                  )} />
                  <span className="font-medium">{task.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as ConstructionTask['status'])}
                    className="text-xs border rounded p-1 bg-slate-50"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="IN_PROGRESS">En Curso</option>
                    <option value="COMPLETED">Completado</option>
                  </select>
                  <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
             {design.constructionTimeline.length === 0 && (
              <p className="text-center text-slate-500 py-8 italic">
                Pide a la IA un cronograma de obra estimado.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
