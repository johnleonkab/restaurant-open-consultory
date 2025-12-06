'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  Scale, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Euro, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Building,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LegalWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { legal } = project.data;
  const [activeTab, setActiveTab] = useState<'FORM' | 'LICENSES'>('FORM');
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null);

  const handleLegalFormSelect = (form: "AUTONOMO" | "SL" | "CB") => {
    updatePhaseData('legal', { legalForm: form });
  };

  const toggleLicenseStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'APPROVED' ? 'PENDING' : 'APPROVED';
    const updatedLicenses = legal.licenses.map(l => 
      l.id === id ? { ...l, status: newStatus as "PENDING" | "APPROVED" | "IN_PROGRESS" } : l
    );
    updatePhaseData('legal', { licenses: updatedLicenses });
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Legal y Permisos</h1>
          <p className="text-slate-500">Guía administrativa y legal.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('FORM')}
            className={cn("px-4 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'FORM' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            Forma Jurídica
          </button>
          <button 
            onClick={() => setActiveTab('LICENSES')}
            className={cn("px-4 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'LICENSES' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
          >
            Licencias ({legal.licenses?.length || 0})
          </button>
        </div>
      </div>

      {activeTab === 'FORM' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LegalFormCard 
              title="Autónomo" 
              icon={User}
              selected={legal.legalForm === 'AUTONOMO'}
              onClick={() => handleLegalFormSelect('AUTONOMO')}
              pros={["Trámites sencillos y rápidos", "Menor coste de gestión", "Control total"]}
              cons={["Responsabilidad ilimitada (patrimonio personal)", "Impuestos progresivos (IRPF)"]}
              idealFor="Negocios pequeños, bajo riesgo, inicio rápido."
            />
            <LegalFormCard 
              title="Sociedad Limitada (S.L.)" 
              icon={Building}
              selected={legal.legalForm === 'SL'}
              onClick={() => handleLegalFormSelect('SL')}
              pros={["Responsabilidad limitada al capital", "Imagen más profesional", "Tipo impositivo fijo (IS)"]}
              cons={["Constitución más cara y lenta", "Mayor carga administrativa", "Capital mínimo 3.000€"]}
              idealFor="Restaurantes con inversión media/alta, socios."
            />
            <LegalFormCard 
              title="Comunidad de Bienes (C.B.)" 
              icon={User}
              selected={legal.legalForm === 'CB'}
              onClick={() => handleLegalFormSelect('CB')}
              pros={["Sencilla de constituir (sin notario a veces)", "Sin capital mínimo", "Gestión compartida"]}
              cons={["Responsabilidad ilimitada y solidaria", "Menos ayudas que S.L.", "Fiscalidad en IRPF"]}
              idealFor="Pequeños negocios con socios de confianza."
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5" /> Consejo de Antigravity
            </h3>
            <p className="text-blue-800 text-sm">
              {legal.legalForm === 'AUTONOMO' ? "Como Autónomo, podrás empezar a facturar casi de inmediato. Es ideal para validar tu concepto con el mínimo coste administrativo. Recuerda que respondes con tus bienes." :
               legal.legalForm === 'SL' ? "La S.L. es la opción más robusta para un restaurante serio. Proteges tu patrimonio personal y das una imagen de solidez ante proveedores y bancos. El coste de gestoría será mayor." :
               legal.legalForm === 'CB' ? "La Comunidad de Bienes es un híbrido interesante si sois varios socios y queréis empezar rápido sin desembolsar los 3.000€ de capital inicial de la S.L." :
               "Selecciona una forma jurídica arriba o pregunta al chat cuál te conviene más según tu situación personal y de inversión."}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'LICENSES' && (
        <div className="space-y-4">
          {legal.licenses?.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">Lista de Licencias Vacía</h3>
              <p className="text-slate-500 max-w-md mx-auto mt-2">
                Pide a la IA que genere la lista de licencias necesarias para tu {project.data.concept.location.city || 'ciudad'}.
                <br/>
                <span className="text-xs italic mt-2 block">Ej: &quot;Genera la lista de licencias para abrir en Madrid&quot;</span>
              </p>
            </div>
          )}

          {legal.licenses?.map((license) => (
            <div 
              key={license.id} 
              className={cn(
                "bg-white rounded-xl border transition-all overflow-hidden",
                license.status === 'APPROVED' ? "border-green-200 bg-green-50/30" : "border-slate-200"
              )}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                onClick={() => setExpandedLicense(expandedLicense === license.id ? null : license.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    license.status === 'APPROVED' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {license.status === 'APPROVED' ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={cn("font-semibold", license.status === 'APPROVED' ? "text-green-900" : "text-slate-900")}>
                      {license.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {license.estimatedTime}</span>
                      <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> {license.estimatedCost}€</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded uppercase tracking-wider font-medium">{license.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLicenseStatus(license.id, license.status);
                    }}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      license.status === 'APPROVED' 
                        ? "bg-white border border-green-200 text-green-700 hover:bg-green-50" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {license.status === 'APPROVED' ? 'Completado' : 'Marcar Listo'}
                  </button>
                  {expandedLicense === license.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {expandedLicense === license.id && (
                <div className="px-4 pb-4 pt-0 bg-slate-50/50 border-t border-slate-100">
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">Descripción</h4>
                      <p className="text-sm text-slate-600">{license.description || "Sin descripción disponible."}</p>
                    </div>
                    
                    {license.requirements && license.requirements.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Requisitos y Documentación</h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {license.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {license.procedure && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Cómo solicitarlo</h4>
                        <p className="text-sm text-blue-800">{license.procedure}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface LegalFormCardProps {
  title: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
  pros: string[];
  cons: string[];
  idealFor: string;
}

function LegalFormCard({ title, icon: Icon, selected, onClick, pros, cons, idealFor }: LegalFormCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "border rounded-xl p-5 cursor-pointer transition-all relative",
        selected 
          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-md" 
          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 text-blue-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}
      <div className={cn("p-2 rounded-lg w-fit mb-3", selected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600")}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4 italic">{idealFor}</p>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-green-700 mb-1">Ventajas</p>
          <ul className="text-xs text-slate-600 space-y-1">
            {pros.map((p: string, i: number) => <li key={i} className="flex items-start gap-1"><span className="text-green-500">•</span> {p}</li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-700 mb-1">Inconvenientes</p>
          <ul className="text-xs text-slate-600 space-y-1">
            {cons.map((c: string, i: number) => <li key={i} className="flex items-start gap-1"><span className="text-red-500">•</span> {c}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
