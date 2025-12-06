'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  Users, 
  ChefHat, 
  Utensils, 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit2,
  Euro,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Employee, EmployeeRole } from '@/types/project';

const ROLES: { id: EmployeeRole; label: string; category: 'KITCHEN' | 'SERVICE' | 'MANAGEMENT'; avgSalary: number }[] = [
  { id: 'HEAD_CHEF', label: 'Jefe de Cocina', category: 'KITCHEN', avgSalary: 2500 },
  { id: 'CHEF', label: 'Cocinero', category: 'KITCHEN', avgSalary: 1600 },
  { id: 'KITCHEN_PORTER', label: 'Ayudante / Office', category: 'KITCHEN', avgSalary: 1300 },
  { id: 'MANAGER', label: 'Gerente / Encargado', category: 'MANAGEMENT', avgSalary: 2200 },
  { id: 'HEAD_WAITER', label: 'Jefe de Sala', category: 'SERVICE', avgSalary: 1800 },
  { id: 'WAITER', label: 'Camarero', category: 'SERVICE', avgSalary: 1400 },
  { id: 'BARTENDER', label: 'Barman', category: 'SERVICE', avgSalary: 1500 },
  { id: 'HOST', label: 'Host / Recepción', category: 'SERVICE', avgSalary: 1300 },
];

export default function TeamWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { team } = project.data;
  const [activeTab, setActiveTab] = useState<'NEEDS' | 'EMPLOYEES'>('NEEDS');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // --- Logic for Needs ---
  const updateStaffNeeds = (category: 'kitchen' | 'service' | 'management', value: number) => {
    updatePhaseData('team', {
      staffNeeds: {
        ...team.staffNeeds,
        [category]: value
      }
    });
  };

  // --- Logic for Employees ---
  const handleSaveEmployee = (emp: Employee) => {
    if (isAdding) {
      updatePhaseData('team', { employees: [...team.employees, emp] });
    } else {
      updatePhaseData('team', { 
        employees: team.employees.map(e => e.id === emp.id ? emp : e) 
      });
    }
    setEditingEmployee(null);
    setIsAdding(false);
  };

  const handleDeleteEmployee = (id: string) => {
    updatePhaseData('team', { 
      employees: team.employees.filter(e => e.id !== id) 
    });
  };

  // Calculate totals
  const totalEmployees = team.employees.length;
  const totalCost = team.employees.reduce((acc, curr) => acc + (curr.salary || 0), 0);
  const hiredCount = team.employees.filter(e => e.status === 'HIRED').length;

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Equipo y RRHH</h1>
          <p className="text-slate-500">Define tu plantilla y gestiona el personal.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('NEEDS')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'NEEDS' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Users className="w-4 h-4" /> Estructura
          </button>
          <button 
            onClick={() => setActiveTab('EMPLOYEES')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'EMPLOYEES' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Briefcase className="w-4 h-4" /> Plantilla ({totalEmployees})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'NEEDS' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Estimación de Personal Necesario</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Define cuántas personas necesitas por área para cubrir los turnos rotativos.
                  <br/>
                  <span className="text-xs italic">Tip: Un restaurante medio necesita 1.5 personas por puesto para cubrir descansos.</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center space-y-3">
                    <div className="w-10 h-10 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div className="font-medium text-slate-700">Cocina</div>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => updateStaffNeeds('kitchen', Math.max(0, team.staffNeeds.kitchen - 1))} className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center">-</button>
                      <span className="text-2xl font-bold text-slate-900">{team.staffNeeds.kitchen}</span>
                      <button onClick={() => updateStaffNeeds('kitchen', team.staffNeeds.kitchen + 1)} className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center space-y-3">
                    <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div className="font-medium text-slate-700">Sala</div>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => updateStaffNeeds('service', Math.max(0, team.staffNeeds.service - 1))} className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center">-</button>
                      <span className="text-2xl font-bold text-slate-900">{team.staffNeeds.service}</span>
                      <button onClick={() => updateStaffNeeds('service', team.staffNeeds.service + 1)} className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center space-y-3">
                    <div className="w-10 h-10 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="font-medium text-slate-700">Gerencia</div>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => updateStaffNeeds('management', Math.max(0, team.staffNeeds.management - 1))} className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center">-</button>
                      <span className="text-2xl font-bold text-slate-900">{team.staffNeeds.management}</span>
                      <button onClick={() => updateStaffNeeds('management', team.staffNeeds.management + 1)} className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'EMPLOYEES' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Listado de Personal</h3>
                <button 
                  onClick={() => {
                    setEditingEmployee({
                      id: Date.now().toString(),
                      name: '',
                      role: 'WAITER',
                      salary: 1400,
                      status: 'CANDIDATE',
                      contractType: 'FULL_TIME'
                    });
                    setIsAdding(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <UserPlus className="w-4 h-4" /> Nuevo Empleado
                </button>
              </div>

              {editingEmployee ? (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-slate-900">{isAdding ? 'Nuevo Empleado' : 'Editar Empleado'}</h4>
                    <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600">Cancelar</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-lg"
                        value={editingEmployee.name}
                        onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Puesto</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={editingEmployee.role}
                        onChange={e => {
                          const role = e.target.value as EmployeeRole;
                          const defaultSalary = ROLES.find(r => r.id === role)?.avgSalary || 0;
                          setEditingEmployee({...editingEmployee, role, salary: defaultSalary});
                        }}
                      >
                        {ROLES.map(role => (
                          <option key={role.id} value={role.id}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Salario Bruto (€/mes)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border rounded-lg"
                        value={editingEmployee.salary}
                        onChange={e => setEditingEmployee({...editingEmployee, salary: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Estado</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={editingEmployee.status}
                        onChange={e => setEditingEmployee({...editingEmployee, status: e.target.value as any})}
                      >
                        <option value="CANDIDATE">Candidato</option>
                        <option value="INTERVIEWING">Entrevistando</option>
                        <option value="HIRED">Contratado</option>
                        <option value="REJECTED">Descartado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Contrato</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={editingEmployee.contractType}
                        onChange={e => setEditingEmployee({...editingEmployee, contractType: e.target.value as any})}
                      >
                        <option value="FULL_TIME">Jornada Completa</option>
                        <option value="PART_TIME">Media Jornada</option>
                        <option value="TEMPORARY">Temporal / Extra</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={() => handleSaveEmployee(editingEmployee)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Guardar Ficha
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {team.employees.map(emp => (
                    <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                          emp.status === 'HIRED' ? "bg-green-500" : "bg-slate-300"
                        )}>
                          {emp.name[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{emp.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-medium text-slate-700">{ROLES.find(r => r.id === emp.role)?.label}</span>
                            <span>•</span>
                            <span>{emp.contractType === 'FULL_TIME' ? '40h' : '20h'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <div className="font-medium text-slate-900">{emp.salary}€</div>
                          <div className={cn(
                            "text-xs font-medium",
                            emp.status === 'HIRED' ? "text-green-600" : "text-orange-500"
                          )}>
                            {emp.status === 'HIRED' ? 'ACTIVO' : emp.status}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setEditingEmployee(emp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteEmployee(emp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {team.employees.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      No hay empleados registrados.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Euro className="w-4 h-4" /> Resumen Salarial
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Empleados</span>
                <span className="font-medium">{totalEmployees}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Contratados</span>
                <span className="font-medium text-green-600">{hiredCount}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="font-medium text-slate-900">Coste Mensual</span>
                <span className="font-bold text-lg text-slate-900">{totalCost.toLocaleString()}€</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                * Estimación bruta sin seguridad social (+30% aprox).
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <h4 className="font-semibold text-blue-900 mb-2">Cobertura de Puestos</h4>
            <div className="space-y-3">
              {[
                { label: 'Cocina', needed: team.staffNeeds.kitchen, current: team.employees.filter(e => ROLES.find(r => r.id === e.role)?.category === 'KITCHEN' && e.status === 'HIRED').length },
                { label: 'Sala', needed: team.staffNeeds.service, current: team.employees.filter(e => ROLES.find(r => r.id === e.role)?.category === 'SERVICE' && e.status === 'HIRED').length },
                { label: 'Gerencia', needed: team.staffNeeds.management, current: team.employees.filter(e => ROLES.find(r => r.id === e.role)?.category === 'MANAGEMENT' && e.status === 'HIRED').length },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-700">{stat.label}</span>
                    <span className={cn(
                      "font-medium",
                      stat.current >= stat.needed ? "text-green-600" : "text-orange-600"
                    )}>
                      {stat.current} / {stat.needed}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", stat.current >= stat.needed ? "bg-green-500" : "bg-orange-400")}
                      style={{ width: `${Math.min(100, (stat.current / (stat.needed || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
