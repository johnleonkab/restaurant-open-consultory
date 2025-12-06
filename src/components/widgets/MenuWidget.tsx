'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  Utensils, 
  Wine, 
  IceCream, 
  Plus, 
  Trash2, 
  Edit2, 
  ChefHat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MenuItem, Ingredient } from '@/types/project';

export default function MenuWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { menu } = project.data;
  const [activeCategory, setActiveCategory] = useState<'STARTER' | 'MAIN' | 'DESSERT' | 'DRINK'>('STARTER');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Helper to get list based on category
  const getCurrentList = () => {
    switch (activeCategory) {
      case 'STARTER': return menu.structure.starters;
      case 'MAIN': return menu.structure.mains;
      case 'DESSERT': return menu.structure.desserts;
      case 'DRINK': return menu.structure.drinks;
      default: return [];
    }
  };

  const updateCurrentList = (newList: MenuItem[]) => {
    const structure = { ...menu.structure };
    switch (activeCategory) {
      case 'STARTER': structure.starters = newList; break;
      case 'MAIN': structure.mains = newList; break;
      case 'DESSERT': structure.desserts = newList; break;
      case 'DRINK': structure.drinks = newList; break;
    }
    updatePhaseData('menu', { structure });
  };

  const handleAddItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'Nuevo Plato',
      description: 'Descripción del plato...',
      category: activeCategory,
      ingredients: [],
      costPrice: 0,
      sellingPrice: 0,
      margin: 0
    };
    setEditingItem(newItem);
    setIsAdding(true);
  };

  const handleSaveItem = (item: MenuItem) => {
    const list = getCurrentList();
    if (isAdding) {
      updateCurrentList([...list, item]);
    } else {
      updateCurrentList(list.map(i => i.id === item.id ? item : i));
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    updateCurrentList(getCurrentList().filter(i => i.id !== id));
  };

  const calculateMargin = (cost: number, price: number) => {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diseño de Carta</h1>
          <p className="text-slate-500">Define tu oferta gastronómica y costes.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <CategoryButton 
            active={activeCategory === 'STARTER'} 
            onClick={() => setActiveCategory('STARTER')} 
            icon={Utensils} 
            label="Entrantes" 
          />
          <CategoryButton 
            active={activeCategory === 'MAIN'} 
            onClick={() => setActiveCategory('MAIN')} 
            icon={ChefHat} 
            label="Principales" 
          />
          <CategoryButton 
            active={activeCategory === 'DESSERT'} 
            onClick={() => setActiveCategory('DESSERT')} 
            icon={IceCream} 
            label="Postres" 
          />
          <CategoryButton 
            active={activeCategory === 'DRINK'} 
            onClick={() => setActiveCategory('DRINK')} 
            icon={Wine} 
            label="Bebidas" 
          />
        </div>
      </div>

      {editingItem ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {isAdding ? 'Añadir Nuevo Plato' : 'Editar Plato'}
            </h3>
            <button onClick={() => { setEditingItem(null); setIsAdding(false); }} className="text-slate-400 hover:text-slate-600">
              Cancelar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Nombre</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={editingItem.name}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
                <textarea 
                  className="w-full p-2 border rounded-lg h-24"
                  value={editingItem.description}
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-slate-700">Ingredientes (Escandallo)</h4>
                <button 
                  onClick={() => {
                    const newIng: Ingredient = {
                      id: Date.now().toString(),
                      name: '',
                      quantity: 1,
                      unit: 'kg',
                      costPerUnit: 0
                    };
                    setEditingItem({
                      ...editingItem,
                      ingredients: [...editingItem.ingredients, newIng]
                    });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Añadir Ingrediente
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {editingItem.ingredients?.map((ing, idx) => (
                  <div key={ing.id} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="Ingrediente"
                      className="flex-1 p-1.5 text-xs border rounded"
                      value={ing.name ?? ''}
                      onChange={(e) => {
                        const newIngs = [...editingItem.ingredients];
                        newIngs[idx].name = e.target.value;
                        setEditingItem({ ...editingItem, ingredients: newIngs });
                      }}
                    />
                    <input 
                      type="number" 
                      placeholder="Cant."
                      className="w-16 p-1.5 text-xs border rounded"
                      value={ing.quantity ?? ''}
                      onChange={(e) => {
                        const newIngs = [...editingItem.ingredients];
                        newIngs[idx].quantity = Number(e.target.value);
                        const totalCost = newIngs.reduce((acc, curr) => acc + (curr.quantity * curr.costPerUnit), 0);
                        setEditingItem({ 
                          ...editingItem, 
                          ingredients: newIngs,
                          costPrice: totalCost,
                          margin: calculateMargin(totalCost, editingItem.sellingPrice)
                        });
                      }}
                    />
                    <input 
                      type="text" 
                      placeholder="Ud."
                      className="w-14 p-1.5 text-xs border rounded"
                      value={ing.unit ?? ''}
                      onChange={(e) => {
                        const newIngs = [...editingItem.ingredients];
                        newIngs[idx].unit = e.target.value;
                        setEditingItem({ ...editingItem, ingredients: newIngs });
                      }}
                    />
                    <input 
                      type="number" 
                      placeholder="€/Ud"
                      className="w-16 p-1.5 text-xs border rounded"
                      value={ing.costPerUnit ?? ''}
                      onChange={(e) => {
                        const newIngs = [...editingItem.ingredients];
                        newIngs[idx].costPerUnit = Number(e.target.value);
                        const totalCost = newIngs.reduce((acc, curr) => acc + (curr.quantity * curr.costPerUnit), 0);
                        setEditingItem({ 
                          ...editingItem, 
                          ingredients: newIngs,
                          costPrice: totalCost,
                          margin: calculateMargin(totalCost, editingItem.sellingPrice)
                        });
                      }}
                    />
                    <button 
                      onClick={() => {
                        const newIngs = editingItem.ingredients.filter((_, i) => i !== idx);
                        const totalCost = newIngs.reduce((acc, curr) => acc + (curr.quantity * curr.costPerUnit), 0);
                        setEditingItem({ 
                          ...editingItem, 
                          ingredients: newIngs,
                          costPrice: totalCost,
                          margin: calculateMargin(totalCost, editingItem.sellingPrice)
                        });
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {editingItem.ingredients.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-2">
                    Añade ingredientes para calcular el coste exacto.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 mt-2">
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Coste Total (€)</label>
                  <div className="w-full p-2 bg-slate-100 rounded-lg font-medium text-slate-700">
                    {(editingItem.costPrice || 0).toFixed(2)}€
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Precio Venta (€)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded-lg"
                    value={editingItem.sellingPrice ?? ''}
                    onChange={e => {
                      const price = Number(e.target.value);
                      setEditingItem({
                        ...editingItem, 
                        sellingPrice: price,
                        margin: calculateMargin(editingItem.costPrice, price)
                      });
                    }}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Margen Bruto</span>
                  <span className={cn(
                    "text-lg font-bold",
                    (editingItem.margin || 0) < 70 ? "text-red-500" : "text-green-600"
                  )}>
                    {(editingItem.margin || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => handleSaveItem(editingItem)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Guardar Plato
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCurrentList().map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow group relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingItem({ ...item, ingredients: item.ingredients || [] })} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-md">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-bold text-slate-900 pr-16">{item.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1 h-10">{item.description}</p>
                
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="block text-xs text-slate-400">Precio</span>
                    <span className="font-semibold text-slate-900">{item.sellingPrice}€</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-slate-400">Margen</span>
                    <span className={cn(
                      "font-semibold text-sm",
                      (item.margin || 0) < 70 ? "text-red-500" : "text-green-600"
                    )}>
                      {(item.margin || 0).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={handleAddItem}
              className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all min-h-[160px]"
            >
              <Plus className="w-8 h-8" />
              <span className="font-medium">Añadir Plato</span>
            </button>
          </div>
          
          {getCurrentList().length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">
                Pide a la IA que genere una propuesta de carta para tu concepto.
                <br/>
                <span className="text-xs italic mt-2">Ej: &quot;Propón 5 entrantes para un restaurante italiano moderno&quot;</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CategoryButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

function CategoryButton({ active, onClick, icon: Icon, label }: CategoryButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium",
        active ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
