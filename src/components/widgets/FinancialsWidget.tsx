'use client';

import { useProjectStore } from '@/store/projectStore';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { 
  Calculator, 
  Building2, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function FinancialsWidget() {
  const { project } = useProjectStore();

  const investment = project.data.financials?.investment || {
    location: 0, kitchenEquipment: 0, furniture: 0, tech: 0, initialStock: 0, legal: 0, marketing: 0, operatingCushion: 0, total: 0
  };
  const funding = project.data.financials?.funding || {
    ownFunds: 0, loans: 0, investors: 0, other: 0, total: 0
  };

  const totalInvestment = investment.total || 0;
  const totalFunding = funding.total || 0;
  const difference = totalFunding - totalInvestment;

  const fundingData = [
    { name: 'Fondos Propios', value: funding.ownFunds },
    { name: 'Préstamos', value: funding.loans },
    { name: 'Inversores', value: funding.investors },
    { name: 'Otros', value: funding.other },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Plan Financiero</h1>
        <p className="text-slate-500">Resumen de inversión y financiación.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Estado de Financiación</h3>
        
        <div className="h-[200px] w-full mb-6">
          {totalFunding > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fundingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `${Number(value).toLocaleString()}€`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-lg">
              Añade fondos en el chat para ver el gráfico
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-600">Total Inversión</span>
            <span className="font-semibold text-slate-900">{totalInvestment.toLocaleString()}€</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-600">Total Financiación</span>
            <span className="font-semibold text-green-600">{totalFunding.toLocaleString()}€</span>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg flex items-center gap-3",
            difference >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {difference >= 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <div>
              <p className="text-xs font-medium opacity-80">Resultado</p>
              <p className="text-lg font-bold">
                {difference >= 0 ? 'Cubierto' : 'Faltan Fondos'}
              </p>
              <p className="text-sm font-semibold">
                {Math.abs(difference).toLocaleString()}€ {difference >= 0 ? 'de sobra' : 'necesarios'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Desglose de Inversión</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InvestmentItem icon={Building2} label="Local y Obra" value={investment.location} />
          <InvestmentItem icon={TrendingUp} label="Cocina y Maquinaria" value={investment.kitchenEquipment} />
          <InvestmentItem icon={Users} label="Mobiliario" value={investment.furniture} />
          <InvestmentItem icon={Wallet} label="Stock Inicial" value={investment.initialStock} />
          <InvestmentItem icon={AlertCircle} label="Colchón Operativo" value={investment.operatingCushion} />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InvestmentItem({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <span className="font-semibold text-slate-900">{value?.toLocaleString()}€</span>
    </div>
  );
}
