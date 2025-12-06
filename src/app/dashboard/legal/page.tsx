'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  Scale, 
  FileText, 
  Building2, 
  User, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LEGAL_FORMS = [
  { 
    id: 'AUTONOMO', 
    label: 'Autónomo', 
    description: 'Ideal para empezar solo. Menos burocracia.', 
    icon: User 
  },
  { 
    id: 'SL', 
    label: 'Sociedad Limitada (S.L.)', 
    description: 'Protege tu patrimonio. Recomendado si facturas > 40k.', 
    icon: Building2 
  },
  { 
    id: 'CB', 
    label: 'Comunidad de Bienes', 
    description: 'Si sois varios socios y queréis algo sencillo.', 
    icon: Users 
  },
];

const LICENSES_TEMPLATE = [
  { id: 'l1', name: 'Licencia de Obra', category: 'CITY', estimatedCost: 1500, estimatedTime: '1-3 meses', status: 'PENDING' },
  { id: 'l2', name: 'Licencia de Actividad', category: 'CITY', estimatedCost: 2000, estimatedTime: '2-4 meses', status: 'PENDING' },
  { id: 'l3', name: 'Alta en Seguridad Social', category: 'OTHER', estimatedCost: 0, estimatedTime: '1 día', status: 'PENDING' },
  { id: 'l4', name: 'Alta en Hacienda (036)', category: 'OTHER', estimatedCost: 0, estimatedTime: '1 día', status: 'PENDING' },
  { id: 'l5', name: 'Manipulador de Alimentos', category: 'HEALTH', estimatedCost: 50, estimatedTime: '1 semana', status: 'PENDING' },
  { id: 'l6', name: 'Plan APPCC (Sanidad)', category: 'HEALTH', estimatedCost: 400, estimatedTime: '1 mes', status: 'PENDING' },
  { id: 'l7', name: 'Seguro de Responsabilidad Civil', category: 'OTHER', estimatedCost: 600, estimatedTime: '1 semana', status: 'PENDING' },
];

export default function LegalPage() {
  const { project, updatePhaseData } = useProjectStore();
  const [isClient, setIsClient] = useState(false);

  const [legalForm, setLegalForm] = useState(project.data.legal.legalForm);
  const [licenses, setLicenses] = useState(
    project.data.legal.licenses.length > 0 
      ? project.data.legal.licenses 
      : LICENSES_TEMPLATE
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePhaseData('legal', { legalForm: legalForm as any, licenses: licenses as any });
  }, [legalForm, licenses, updatePhaseData]);

  const updateLicenseStatus = (id: string, newStatus: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setLicenses(licenses.map(l => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      l.id === id ? { ...l, status: newStatus as any } : l
    ));
  };

  if (!isClient) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Legal y Administrativo</h1>
        <p className="text-slate-500 mt-2">Define tu estructura legal y gestiona las licencias obligatorias.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Legal Form */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Forma Jurídica</h2>
                <p className="text-sm text-slate-500">¿Cómo vas a constituir la empresa?</p>
              </div>
            </div>

            <div className="space-y-4">
              {LEGAL_FORMS.map((form) => {
                const Icon = form.icon;
                const isSelected = legalForm === form.id;
                return (
                  <button
                    key={form.id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setLegalForm(form.id as any)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 hover:border-blue-300 hover:bg-blue-50",
                      isSelected ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-blue-200 text-blue-800" : "bg-slate-100 text-slate-500"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={cn("font-semibold", isSelected ? "text-blue-900" : "text-slate-900")}>
                        {form.label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{form.description}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {legalForm === 'SL' && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Pasos Extra para S.L.
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Certificado de nombre (Reg. Mercantil)</li>
                  <li>Aportar capital social (3.000€)</li>
                  <li>Ir al Notario (Escrituras)</li>
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Licenses */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Licencias y Trámites</h2>
                <p className="text-sm text-slate-500">Gestor de estado de la burocracia.</p>
              </div>
            </div>

            <div className="space-y-4">
              {licenses.map((license) => (
                <div key={license.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-2 h-12 rounded-full",
                      license.status === 'APPROVED' ? "bg-green-500" :
                      license.status === 'IN_PROGRESS' ? "bg-yellow-500" : "bg-slate-300"
                    )} />
                    <div>
                      <h3 className="font-medium text-slate-900">{license.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {license.estimatedTime}
                        </span>
                        <span>Coste est: {license.estimatedCost}€</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={license.status}
                      onChange={(e) => updateLicenseStatus(license.id, e.target.value)}
                      className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-full border outline-none cursor-pointer",
                        license.status === 'APPROVED' ? "bg-green-100 text-green-800 border-green-200" :
                        license.status === 'IN_PROGRESS' ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        "bg-slate-100 text-slate-600 border-slate-200"
                      )}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="IN_PROGRESS">En Trámite</option>
                      <option value="APPROVED">Aprobado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Ver guía detallada de trámites <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
