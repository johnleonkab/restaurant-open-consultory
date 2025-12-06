'use client';

import { useState } from 'react';
import { Floor, Table, Obstacle } from '@/types/project';
import { 
  Plus, 
  Trash2, 
  RotateCw, 
  Square, 
  Circle, 
  Layout,
  DoorOpen,
  Columns
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloorPlanEditorProps {
  floors: Floor[];
  onChange: (floors: Floor[]) => void;
}

export default function FloorPlanEditor({ floors, onChange }: FloorPlanEditorProps) {
  const [activeFloorId, setActiveFloorId] = useState<string | null>(floors[0]?.id || null);
  const [draggedItem, setDraggedItem] = useState<{ type: 'TABLE' | 'OBSTACLE', id: string, startX: number, startY: number } | null>(null);
  
  const activeFloor = floors.find(f => f.id === activeFloorId);

  const handleAddFloor = () => {
    const newFloor: Floor = {
      id: Date.now().toString(),
      name: `Planta ${floors.length + 1}`,
      width: 15, // meters
      height: 10, // meters
      tables: [],
      obstacles: []
    };
    onChange([...floors, newFloor]);
    setActiveFloorId(newFloor.id);
  };

  const handleDeleteFloor = (id: string) => {
    const newFloors = floors.filter(f => f.id !== id);
    onChange(newFloors);
    if (activeFloorId === id) {
      setActiveFloorId(newFloors[0]?.id || null);
    }
  };

  const handleAddTable = (type: Table['type'], capacity: number) => {
    if (!activeFloor) return;
    const newTable: Table = {
      id: Date.now().toString(),
      name: `M${activeFloor.tables.length + 1}`,
      type,
      capacity,
      x: 2,
      y: 2,
      width: type === 'RECTANGLE' ? 1.2 : 0.8,
      height: 0.8,
      rotation: 0
    };
    const updatedFloors = floors.map(f => 
      f.id === activeFloorId ? { ...f, tables: [...f.tables, newTable] } : f
    );
    onChange(updatedFloors);
  };

  const handleAddObstacle = (type: Obstacle['type']) => {
    if (!activeFloor) return;
    const newObstacle: Obstacle = {
      id: Date.now().toString(),
      type,
      x: 5,
      y: 5,
      width: type === 'BAR' ? 3 : 0.5,
      height: type === 'BAR' ? 1 : 0.5,
      rotation: 0
    };
    const updatedFloors = floors.map(f => 
      f.id === activeFloorId ? { ...f, obstacles: [...f.obstacles, newObstacle] } : f
    );
    onChange(updatedFloors);
  };

  const updateItemPosition = (type: 'TABLE' | 'OBSTACLE', id: string, x: number, y: number) => {
    if (!activeFloor) return;
    const updatedFloors = floors.map(f => {
      if (f.id !== activeFloorId) return f;
      if (type === 'TABLE') {
        return { ...f, tables: f.tables.map(t => t.id === id ? { ...t, x, y } : t) };
      } else {
        return { ...f, obstacles: f.obstacles.map(o => o.id === id ? { ...o, x, y } : o) };
      }
    });
    onChange(updatedFloors);
  };

  const rotateItem = (type: 'TABLE' | 'OBSTACLE', id: string) => {
    if (!activeFloor) return;
    const updatedFloors = floors.map(f => {
      if (f.id !== activeFloorId) return f;
      if (type === 'TABLE') {
        return { ...f, tables: f.tables.map(t => t.id === id ? { ...t, rotation: (t.rotation + 45) % 360 } : t) };
      } else {
        return { ...f, obstacles: f.obstacles.map(o => o.id === id ? { ...o, rotation: (o.rotation + 45) % 360 } : o) };
      }
    });
    onChange(updatedFloors);
  };

  const deleteItem = (type: 'TABLE' | 'OBSTACLE', id: string) => {
    if (!activeFloor) return;
    const updatedFloors = floors.map(f => {
      if (f.id !== activeFloorId) return f;
      if (type === 'TABLE') {
        return { ...f, tables: f.tables.filter(t => t.id !== id) };
      } else {
        return { ...f, obstacles: f.obstacles.filter(o => o.id !== id) };
      }
    });
    onChange(updatedFloors);
  };

  // Canvas scaling (pixels per meter)
  const SCALE = 40; 

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-slate-50">
        <div className="flex items-center gap-2 overflow-x-auto">
          {floors.map(floor => (
            <div key={floor.id} className="flex items-center">
              <button
                onClick={() => setActiveFloorId(floor.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-l-lg border-y border-l transition-colors",
                  activeFloorId === floor.id 
                    ? "bg-white text-blue-600 border-blue-200 z-10" 
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                )}
              >
                {floor.name}
              </button>
              <button
                onClick={() => handleDeleteFloor(floor.id)}
                className={cn(
                  "px-2 py-2 text-slate-400 hover:text-red-500 border-y border-r rounded-r-lg transition-colors",
                  activeFloorId === floor.id 
                    ? "bg-white border-blue-200" 
                    : "bg-slate-100 border-slate-200"
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button 
            onClick={handleAddFloor}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-2"
            title="Añadir Planta"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tools */}
        <div className="w-48 bg-slate-50 border-r p-4 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Mesas</h4>
            <div className="space-y-2">
              <ToolButton onClick={() => handleAddTable('SQUARE', 2)} icon={Square} label="Cuadrada (2p)" />
              <ToolButton onClick={() => handleAddTable('RECTANGLE', 4)} icon={Layout} label="Rectang. (4p)" />
              <ToolButton onClick={() => handleAddTable('ROUND', 4)} icon={Circle} label="Redonda (4p)" />
              <ToolButton onClick={() => handleAddTable('RECTANGLE', 6)} icon={Layout} label="Grande (6p)" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Estructura</h4>
            <div className="space-y-2">
              <ToolButton onClick={() => handleAddObstacle('BAR')} icon={Columns} label="Barra" />
              <ToolButton onClick={() => handleAddObstacle('COLUMN')} icon={Square} label="Columna" />
              <ToolButton onClick={() => handleAddObstacle('DOOR')} icon={DoorOpen} label="Puerta" />
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-100 relative overflow-auto p-8">
          {activeFloor ? (
            <div 
              className="bg-white shadow-lg mx-auto relative transition-all"
              style={{ 
                width: activeFloor.width * SCALE, 
                height: activeFloor.height * SCALE,
                backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / SCALE;
                const y = (e.clientY - rect.top) / SCALE;
                
                if (draggedItem) {
                   // Adjust for center of item roughly
                   updateItemPosition(draggedItem.type, draggedItem.id, x, y);
                   setDraggedItem(null);
                }
              }}
            >
              {/* Tables */}
              {activeFloor.tables.map(table => (
                <DraggableItem
                  key={table.id}
                  x={table.x * SCALE}
                  y={table.y * SCALE}
                  width={table.width * SCALE}
                  height={table.height * SCALE}
                  rotation={table.rotation}
                  shape={table.type}
                  onDragStart={() => setDraggedItem({ type: 'TABLE', id: table.id, startX: 0, startY: 0 })}
                  onRotate={() => rotateItem('TABLE', table.id)}
                  onDelete={() => deleteItem('TABLE', table.id)}
                >
                   <div className="flex items-center justify-center w-full h-full">
                      <span className="text-xs font-bold text-slate-600">{table.capacity}p</span>
                   </div>
                </DraggableItem>
              ))}

              {/* Obstacles */}
              {activeFloor.obstacles.map(obs => (
                <DraggableItem
                  key={obs.id}
                  x={obs.x * SCALE}
                  y={obs.y * SCALE}
                  width={obs.width * SCALE}
                  height={obs.height * SCALE}
                  rotation={obs.rotation}
                  shape={obs.type === 'COLUMN' ? 'SQUARE' : 'RECTANGLE'}
                  className={obs.type === 'BAR' ? 'bg-slate-800 text-white' : 'bg-slate-300'}
                  onDragStart={() => setDraggedItem({ type: 'OBSTACLE', id: obs.id, startX: 0, startY: 0 })}
                  onRotate={() => rotateItem('OBSTACLE', obs.id)}
                  onDelete={() => deleteItem('OBSTACLE', obs.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Selecciona o crea una planta para empezar a diseñar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ToolButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

function ToolButton({ onClick, icon: Icon, label }: ToolButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-blue-600"
    >
      <div className="p-1.5 bg-white rounded border shadow-sm">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

interface DraggableItemProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape?: string;
  className?: string;
  children?: React.ReactNode;
  onDragStart: () => void;
  onRotate: () => void;
  onDelete: () => void;
}

function DraggableItem({ x, y, width, height, rotation, shape, className, children, onDragStart, onRotate, onDelete }: DraggableItemProps) {
  return (
    <div
      draggable
      onDragStart={() => {
        // e.dataTransfer.setDragImage(new Image(), 0, 0); // Hide ghost
        onDragStart();
      }}
      className={cn(
        "absolute cursor-move group flex items-center justify-center border-2 transition-colors",
        shape === 'ROUND' ? "rounded-full" : "rounded-md",
        className || "bg-white border-slate-400 hover:border-blue-500"
      )}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
      
      {/* Controls (visible on hover) */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 rounded p-1 shadow-lg z-50 pointer-events-none group-hover:pointer-events-auto">
        <button onClick={onRotate} className="p-1 text-white hover:text-blue-300" title="Rotar">
          <RotateCw className="w-3 h-3" />
        </button>
        <button onClick={onDelete} className="p-1 text-white hover:text-red-300" title="Eliminar">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
