'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  Megaphone, 
  PenTool, 
  Palette, 
  Share2, 
  Wand2, 
  Download, 
  Layout, 
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MarketingWidget() {
  const { project, updatePhaseData } = useProjectStore();
  const { marketing } = project.data;
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'VISUAL' | 'STRATEGY'>('IDENTITY');
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  const generateContent = async (type: 'names' | 'description' | 'strategy' | 'logo') => {
    setIsGenerating(true);
    setGeneratedResult(null);
    try {
      // Construct a prompt based on current project state
      const context = {
        concept: project.data.concept,
        location: project.data.location,
        style: project.data.concept.style,
        colors: marketing.brandIdentity.colors
      };

      let prompt = "";
      if (type === 'names') {
        prompt = `Genera 5 nombres creativos y cortos para un restaurante con este concepto: ${JSON.stringify(context)}. Devuélvelos en una lista numerada en el campo 'message' del JSON.`;
      } else if (type === 'description') {
        prompt = `Genera una descripción comercial y un elevator pitch para este restaurante: ${JSON.stringify(context)}. Devuélvelos en el campo 'message' o actualiza directamente los campos si estás seguro.`;
      } else if (type === 'strategy') {
        prompt = `Crea una estrategia de redes sociales para este restaurante: ${JSON.stringify(context)}. Actualiza el campo 'socialMediaPlan' en 'updates'.`;
      } else if (type === 'logo') {
        // Prompt específico para generación de imagen
        prompt = `A professional, minimalist, modern restaurant logo for '${marketing.brandIdentity.name || 'Restaurant'}'. Style: ${JSON.stringify(context.style)}. Colors: ${JSON.stringify(context.colors)}. High quality, vector style, flat design, white background.`;
      }

      if (type === 'logo') {
        // Use the specific image generation endpoint
        const response = await fetch('/api/generate-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (data.success && data.image) {
           updatePhaseData('marketing', { brandIdentity: { ...marketing.brandIdentity, logoUrl: data.image } });
           setGeneratedResult("¡Logo generado con éxito! Imagen PNG creada por Gemini 2.0 Flash.");
        } else {
           setGeneratedResult("Error al generar el logo: " + (data.error || "Respuesta desconocida"));
        }

      } else {
        // Use the standard chat endpoint for text
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: `ACT_AS_GENERATOR: ${prompt}` }],
            currentPhase: 'MARKETING',
            projectState: project.data
          })
        });

        const data = await response.json();
        
        if (data.updates && data.updates.marketing) {
          updatePhaseData('marketing', data.updates.marketing);
        }
        
        if (data.message) {
           setGeneratedResult(data.message);
        }
      }

    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedResult("Hubo un error al conectar con la IA. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketing y Marca</h1>
          <p className="text-slate-500">Crea la identidad de tu marca y tu estrategia de lanzamiento.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('IDENTITY')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'IDENTITY' ? "bg-white shadow-sm text-pink-600" : "text-slate-500 hover:text-slate-700")}
          >
            <PenTool className="w-4 h-4" /> Identidad Verbal
          </button>
          <button 
            onClick={() => setActiveTab('VISUAL')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'VISUAL' ? "bg-white shadow-sm text-pink-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Palette className="w-4 h-4" /> Identidad Visual
          </button>
          <button 
            onClick={() => setActiveTab('STRATEGY')}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium", activeTab === 'STRATEGY' ? "bg-white shadow-sm text-pink-600" : "text-slate-500 hover:text-slate-700")}
          >
            <Megaphone className="w-4 h-4" /> Estrategia
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {generatedResult && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl relative">
              <button 
                onClick={() => setGeneratedResult(null)}
                className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> Sugerencias de la IA
              </h4>
              <div className="text-sm text-blue-800 whitespace-pre-wrap">
                {generatedResult}
              </div>
            </div>
          )}

          {activeTab === 'IDENTITY' && (
            <div className="space-y-6">
              {/* Naming Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-pink-500" /> Naming
                  </h3>
                  <button 
                    onClick={() => generateContent('names')}
                    disabled={isGenerating}
                    className="text-xs bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full font-medium hover:bg-pink-100 flex items-center gap-1 transition-colors"
                  >
                    <Wand2 className="w-3 h-3" /> {isGenerating ? 'Generando...' : 'Generar Ideas'}
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Nombre del Restaurante</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-slate-200 rounded-lg text-lg font-medium text-slate-900 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ej: La Trattoria de Madrid"
                    value={marketing.brandIdentity.name}
                    onChange={(e) => updatePhaseData('marketing', { brandIdentity: { ...marketing.brandIdentity, name: e.target.value } })}
                  />
                </div>
              </div>

              {/* Description & Pitch */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-pink-500" /> Mensaje de Marca
                  </h3>
                  <button 
                    onClick={() => generateContent('description')}
                    disabled={isGenerating}
                    className="text-xs bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full font-medium hover:bg-pink-100 flex items-center gap-1 transition-colors"
                  >
                    <Wand2 className="w-3 h-3" /> {isGenerating ? 'Redactando...' : 'Generar Textos'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Descripción Comercial</label>
                    <textarea 
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 min-h-[100px] focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Una descripción atractiva para tu web y redes sociales..."
                      value={marketing.brandIdentity.description}
                      onChange={(e) => updatePhaseData('marketing', { brandIdentity: { ...marketing.brandIdentity, description: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Elevator Pitch (Corto)</label>
                    <textarea 
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 min-h-[60px] focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Tu negocio resumido en una frase impactante..."
                      value={marketing.brandIdentity.elevatorPitch}
                      onChange={(e) => updatePhaseData('marketing', { brandIdentity: { ...marketing.brandIdentity, elevatorPitch: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'VISUAL' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-pink-500" /> Logo Generator
                  </h3>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md font-medium">BETA (Banana 2.0)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Genera un logo preliminar basado en tu nombre y estilo.
                    </p>
                    <div className="space-y-2">
                      <label className="block text-xs text-slate-500 uppercase tracking-wider">Estilo</label>
                      <select className="w-full p-2 border rounded-lg text-sm">
                        <option>Minimalista</option>
                        <option>Clásico / Elegante</option>
                        <option>Moderno / Bold</option>
                        <option>Rústico / Artesanal</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs text-slate-500 uppercase tracking-wider">Color Principal</label>
                      <div className="flex gap-2">
                        {['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'].map(color => (
                          <button 
                            key={color}
                            className="w-8 h-8 rounded-full border border-slate-200 focus:ring-2 ring-offset-2 ring-slate-400"
                            style={{ backgroundColor: color }}
                            onClick={() => updatePhaseData('marketing', { brandIdentity: { ...marketing.brandIdentity, colors: [color] } })}
                          />
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => generateContent('logo')}
                      disabled={isGenerating}
                      className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Wand2 className="w-4 h-4" /> {isGenerating ? 'Generando...' : 'Generar Logo'}
                    </button>
                  </div>

                  <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                    {marketing.brandIdentity.logoUrl ? (
                      <div className="w-full h-full p-8 flex items-center justify-center">
                        <img src={marketing.brandIdentity.logoUrl} alt="Logo generado" className="max-w-full max-h-full" />
                      </div>
                    ) : marketing.brandIdentity.name ? (
                      <div className="text-center p-6">
                        <div 
                          className="text-4xl font-bold mb-2" 
                          style={{ color: marketing.brandIdentity.colors?.[0] || '#000' }}
                        >
                          {marketing.brandIdentity.name}
                        </div>
                        <div className="text-sm text-slate-500 uppercase tracking-[0.2em]">RESTAURANT</div>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm text-center">
                        Introduce un nombre<br/>para previsualizar
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white rounded-full hover:bg-slate-100 text-slate-900"><Download className="w-4 h-4" /></button>
                      <button className="p-2 bg-white rounded-full hover:bg-slate-100 text-slate-900"><Share2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'STRATEGY' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                 <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-pink-500" /> Plan de Redes Sociales
                  </h3>
                  <button 
                    onClick={() => generateContent('strategy')}
                    disabled={isGenerating}
                    className="text-xs bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full font-medium hover:bg-pink-100 flex items-center gap-1 transition-colors"
                  >
                    <Wand2 className="w-3 h-3" /> {isGenerating ? 'Planificando...' : 'Generar Estrategia'}
                  </button>
                </div>

                <div className="space-y-4">
                  {(marketing.socialMediaPlan || []).length > 0 ? (
                    <div className="grid gap-4">
                      {marketing.socialMediaPlan.map((plan, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-900">{plan.platform}</h4>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">{plan.frequency}</span>
                          </div>
                          <p className="text-sm text-slate-600">{plan.strategy}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-100 rounded-lg">
                      No hay estrategia definida. Haz clic en generar para obtener un plan inicial.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Marketing Kit</h3>
            <p className="text-pink-100 text-sm mb-4">
              Tu identidad de marca es lo primero que verán tus clientes. Asegúrate de que transmita la esencia de tu cocina.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className={cn("w-2 h-2 rounded-full", marketing.brandIdentity.name ? "bg-green-400" : "bg-white/30")} />
                Naming
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={cn("w-2 h-2 rounded-full", marketing.brandIdentity.description ? "bg-green-400" : "bg-white/30")} />
                Mensaje
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={cn("w-2 h-2 rounded-full", (marketing.brandIdentity.colors || []).length > 0 ? "bg-green-400" : "bg-white/30")} />
                Identidad Visual
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={cn("w-2 h-2 rounded-full", (marketing.socialMediaPlan || []).length > 0 ? "bg-green-400" : "bg-white/30")} />
                Estrategia Social
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
