'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  Truck, 
  Package, 
  Hammer, 
  Armchair, 
  Plus, 
  Phone, 
  Mail, 
  Star,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Supplier } from '@/types/project';

export default function SuppliersWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { suppliers, menu, design } = project.data;
  const [activeTab, setActiveTab] = useState<'INGREDIENTS' | 'FURNITURE' | 'CONSTRUCTION'>('INGREDIENTS');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Collect all resources based on active tab
  const getAvailableResources = () => {
    switch (activeTab) {
      case 'INGREDIENTS':
        // Flatten all ingredients from all menu items
        const ingredients: { id: string, name: string, type: 'INGREDIENT' }[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processList = (list: any[]) => {
          list.forEach(item => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item.ingredients?.forEach((ing: any) => {
              if (!ingredients.find(i => i.name === ing.name)) {
                ingredients.push({ id: ing.name, name: ing.name, type: 'INGREDIENT' }); // Use name as ID for now as ingredients are embedded
              }
            });
          });
        };
        processList(menu.structure.starters);
        processList(menu.structure.mains);
        processList(menu.structure.desserts);
        processList(menu.structure.drinks);
        return ingredients;
      
      case 'FURNITURE':
        return design.equipmentChecklist.map(eq => ({
          id: eq.id,
          name: eq.name,
          type: 'EQUIPMENT'
        }));

      case 'CONSTRUCTION':
        return design.constructionTimeline.map(task => ({
          id: task.id,
          name: task.name,
          type: 'TASK'
        }));
        
      default: return [];
    }
  };

  const filteredSuppliers = suppliers.list.filter(s => s.category === activeTab);

  const handleSaveSupplier = (supplier: Supplier) => {
    if (isAdding) {
      updatePhaseData('suppliers', { list: [...suppliers.list, supplier] });
    } else {
      updatePhaseData('suppliers', { 
        list: suppliers.list.map(s => s.id === supplier.id ? supplier : s) 
      });
    }
    setEditingSupplier(null);
    setIsAdding(false);
  };

  const handleDeleteSupplier = (id: string) => {
    updatePhaseData('suppliers', { 
      list: suppliers.list.filter(s => s.id !== id) 
    });
  };

  const toggleResourceAssignment = (supplier: Supplier, resourceId: string) => {
    const currentResources = supplier.assignedResources || [];
    const newResources = currentResources.includes(resourceId)
      ? currentResources.filter(id => id !== resourceId)
      : [...currentResources, resourceId];
    
    handleSaveSupplier({ ...supplier, assignedResources: newResources });
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Proveedores</h1>
          <p className="text-slate-500">Encuentra y asigna proveedores para tus recursos.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('INGREDIENTS')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'INGREDIENTS' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Package className="w-4 h-4" /> Materia Prima
          </button>
          <button 
            onClick={() => setActiveTab('FURNITURE')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'FURNITURE' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Armchair className="w-4 h-4" /> Mobiliario
          </button>
          <button 
            onClick={() => setActiveTab('CONSTRUCTION')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'CONSTRUCTION' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Hammer className="w-4 h-4" /> Obra
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suppliers List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Proveedores Disponibles</h3>
            <button 
              onClick={() => {
                setEditingSupplier({
                  id: Date.now().toString(),
                  name: '',
                  category: activeTab,
                  contactInfo: '',
                  email: '',
                  phone: '',
                  status: 'POTENTIAL',
                  rating: 0,
                  deliveryDays: [],
                  assignedResources: []
                });
                setIsAdding(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Nuevo Proveedor
            </button>
          </div>

          {editingSupplier ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex justify-between">
                <h4 className="font-semibold text-slate-900">{isAdding ? 'Nuevo Proveedor' : 'Editar Proveedor'}</h4>
                <button onClick={() => setEditingSupplier(null)} className="text-slate-400 hover:text-slate-600">Cancelar</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Nombre Empresa</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg"
                    value={editingSupplier.name}
                    onChange={e => setEditingSupplier({...editingSupplier, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border rounded-lg"
                    value={editingSupplier.email || ''}
                    onChange={e => setEditingSupplier({...editingSupplier, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    className="w-full p-2 border rounded-lg"
                    value={editingSupplier.phone || ''}
                    onChange={e => setEditingSupplier({...editingSupplier, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Estado</label>
                  <select 
                    className="w-full p-2 border rounded-lg"
                    value={editingSupplier.status}
                    onChange={e => setEditingSupplier({...editingSupplier, status: e.target.value as Supplier['status']})}
                  >
                    <option value="POTENTIAL">Potencial</option>
                    <option value="CONTACTED">Contactado</option>
                    <option value="APPROVED">Aprobado</option>
                    <option value="REJECTED">Rechazado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Valoración</label>
                  <div className="flex gap-1 p-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star}
                        onClick={() => setEditingSupplier({...editingSupplier, rating: star})}
                        className={cn("w-6 h-6", (editingSupplier.rating || 0) >= star ? "text-yellow-400" : "text-slate-300")}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => handleSaveSupplier(editingSupplier)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar Proveedor
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSuppliers.map(supplier => (
                <div key={supplier.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{supplier.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          {supplier.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {supplier.phone}</span>}
                          {supplier.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {supplier.email}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        supplier.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                        supplier.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {supplier.status === 'APPROVED' ? 'Aprobado' : 
                         supplier.status === 'REJECTED' ? 'Rechazado' : 
                         supplier.status === 'CONTACTED' ? 'Contactado' : 'Potencial'}
                      </span>
                      <button onClick={() => setEditingSupplier(supplier)} className="p-1.5 text-slate-400 hover:text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteSupplier(supplier.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Resource Assignment UI */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2">Recursos Asignados:</p>
                    <div className="flex flex-wrap gap-2">
                      {supplier.assignedResources?.map(resId => {
                         // Find resource name (inefficient but works for now)
                         const res = getAvailableResources().find(r => r.id === resId);
                         return res ? (
                           <span key={resId} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-700">
                             <CheckCircle2 className="w-3 h-3 text-green-500" />
                             {res.name}
                             <button onClick={() => toggleResourceAssignment(supplier, resId)} className="ml-1 hover:text-red-500">×</button>
                           </span>
                         ) : null;
                      })}
                      <div className="relative group">
                        <button className="inline-flex items-center gap-1 px-2 py-1 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400">
                          <Plus className="w-3 h-3" /> Asignar
                        </button>
                        {/* Dropdown for assignment */}
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover:block z-10 max-h-48 overflow-y-auto">
                          {getAvailableResources().filter(r => !supplier.assignedResources?.includes(r.id)).map(res => (
                            <button 
                              key={res.id}
                              onClick={() => toggleResourceAssignment(supplier, res.id)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 text-slate-700 truncate"
                            >
                              {res.name}
                            </button>
                          ))}
                          {getAvailableResources().length === 0 && (
                            <div className="p-2 text-xs text-slate-400 text-center">No hay recursos disponibles</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredSuppliers.length === 0 && (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  No hay proveedores en esta categoría.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resources Status Sidebar */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Estado de Recursos</h3>
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span>Pendientes de asignar:</span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {getAvailableResources().map(res => {
                const isAssigned = suppliers.list.some(s => s.assignedResources?.includes(res.id));
                if (isAssigned) return null;
                return (
                  <div key={res.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg border border-orange-100">
                    <span className="text-sm text-slate-700 truncate flex-1" title={res.name}>{res.name}</span>
                    <span className="text-xs text-orange-600 font-medium whitespace-nowrap">Sin proveedor</span>
                  </div>
                );
              })}
              {getAvailableResources().every(res => suppliers.list.some(s => s.assignedResources?.includes(res.id))) && (
                <div className="text-center py-4 text-green-600 text-sm">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  ¡Todo cubierto!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
