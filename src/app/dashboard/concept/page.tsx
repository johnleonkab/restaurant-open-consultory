'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
  Calculator, 
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ConceptPage() {
  const { project } = useProjectStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Derived calculations for the widget (read-only from store now, driven by chat)
  const concept = project.data.concept || {};
  const viability = concept.viability || {};
  const fixedCosts = viability.fixedCosts || {};
  const dailyRotations = viability.dailyRotations || {};
  
  const totalFixedCosts = 
    (fixedCosts.rent || 0) + 
    (fixedCosts.staff || 0) + 
    (fixedCosts.utilities || 0) + 
    (fixedCosts.licenses || 0) + 
    (fixedCosts.other || 0);

  const averageTicket = viability.averageTicket || 0;
  const capacity = viability.capacity || 0;
  const monthlyOpenDays = viability.monthlyOpenDays || 0;

  const marginPerTicket = averageTicket * 0.7; // Assuming 30% food cost
  const breakEvenPoint = marginPerTicket > 0 ? Math.ceil(totalFixedCosts / marginPerTicket) : 0;
  const breakEvenRevenue = breakEvenPoint * averageTicket;

  const dailyCapacity = capacity * ((dailyRotations.lunch || 0) + (dailyRotations.dinner || 0));
  const monthlyCapacity = dailyCapacity * monthlyOpenDays;
  const monthlyPotentialRevenue = monthlyCapacity * averageTicket;
  
  const occupationNeeded = monthlyCapacity > 0 ? (breakEvenPoint / monthlyCapacity) * 100 : 0;

  let viabilityStatus: 'VIABLE' | 'TIGHT' | 'NOT_VIABLE' = 'VIABLE';
  if (occupationNeeded > 80) viabilityStatus = 'NOT_VIABLE';
  else if (occupationNeeded > 60) viabilityStatus = 'TIGHT';

  const chartData = [
    { name: '0%', revenue: 0, costs: totalFixedCosts },
    { name: '25%', revenue: monthlyPotentialRevenue * 0.25, costs: totalFixedCosts + (monthlyPotentialRevenue * 0.25 * 0.3) },
    { name: '50%', revenue: monthlyPotentialRevenue * 0.50, costs: totalFixedCosts + (monthlyPotentialRevenue * 0.50 * 0.3) },
    { name: '75%', revenue: monthlyPotentialRevenue * 0.75, costs: totalFixedCosts + (monthlyPotentialRevenue * 0.75 * 0.3) },
    { name: '100%', revenue: monthlyPotentialRevenue, costs: totalFixedCosts + (monthlyPotentialRevenue * 0.3) },
  ];

  return (
    <div className="h-[calc(100vh-2rem)] p-4 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: CHAT (40%) */}
      <div className="lg:col-span-5 h-full">
        <ChatInterface />
      </div>

      {/* RIGHT COLUMN: WIDGET (60%) */}
      <div className="lg:col-span-7 h-full overflow-y-auto pr-2 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Concepto y Viabilidad</h1>
          <p className="text-slate-500">Panel de control en tiempo real.</p>
        </div>

        {/* Concept Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tu Concepto</h2>
              <p className="text-slate-600 mt-1 italic">
                {concept.description || "Describe tu idea en el chat para empezar..."}
              </p>
            </div>
          </div>
        </div>

        {/* Viability Status Card */}
        <div className={cn(
          "rounded-xl p-6 border-2 shadow-sm transition-colors",
          viabilityStatus === 'VIABLE' ? "bg-green-50 border-green-200" :
          viabilityStatus === 'TIGHT' ? "bg-yellow-50 border-yellow-200" :
          "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center gap-3 mb-4">
            {viabilityStatus === 'VIABLE' ? <CheckCircle2 className="w-8 h-8 text-green-600" /> :
             viabilityStatus === 'TIGHT' ? <AlertCircle className="w-8 h-8 text-yellow-600" /> :
             <XCircle className="w-8 h-8 text-red-600" />}
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {viabilityStatus === 'VIABLE' ? 'Proyecto Viable' :
                 viabilityStatus === 'TIGHT' ? 'Viabilidad Ajustada' :
                 'Proyecto de Alto Riesgo'}
              </h3>
              <p className="text-sm text-slate-600">
                Ocupación necesaria: <span className="font-bold">{occupationNeeded.toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Ticket Medio" value={`${averageTicket}€`} />
          <MetricCard label="Capacidad" value={`${capacity} pax`} />
          <MetricCard label="Costes Fijos" value={`${totalFixedCosts.toLocaleString()}€/mes`} />
          <MetricCard label="Fact. Mínima" value={`${breakEvenRevenue.toLocaleString()}€/mes`} />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[300px]">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Proyección de Beneficios</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()}€`} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" name="Ingresos" strokeWidth={2} />
              <Line type="monotone" dataKey="costs" stroke="#ef4444" name="Costes" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Costs (Read Only) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Desglose de Costes
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Alquiler</span>
              <span className="font-medium">{fixedCosts.rent || 0}€</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Personal</span>
              <span className="font-medium">{fixedCosts.staff || 0}€</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span>Suministros</span>
              <span className="font-medium">{fixedCosts.utilities || 0}€</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
