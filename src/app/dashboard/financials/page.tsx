'use client';

import { useState, useEffect } from 'react';
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
  Wallet, 
  PiggyBank, 
  Building2, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function FinancialsPage() {
  const { project, updatePhaseData } = useProjectStore();
  const [isClient, setIsClient] = useState(false);

  // Local state for form handling
  const [investment, setInvestment] = useState(project.data.financials.investment);
  const [funding, setFunding] = useState(project.data.financials.funding);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Update store when local state changes
  useEffect(() => {
    const totalInvestment = 
      investment.location + 
      investment.kitchenEquipment + 
      investment.furniture + 
      investment.tech + 
      investment.initialStock + 
      investment.legal + 
      investment.marketing + 
      investment.operatingCushion;

    updatePhaseData('financials', {
      investment: { ...investment, total: totalInvestment }
    });
  }, [investment, updatePhaseData]);

  useEffect(() => {
    const totalFunding = 
      funding.ownFunds + 
      funding.loans + 
      funding.investors + 
      funding.other;

    updatePhaseData('financials', {
      funding: { ...funding, total: totalFunding }
    });
  }, [funding, updatePhaseData]);

  if (!isClient) return null;

  const totalInvestment = project.data.financials.investment.total;
  const totalFunding = project.data.financials.funding.total;
  const difference = totalFunding - totalInvestment;

  const fundingData = [
    { name: 'Fondos Propios', value: funding.ownFunds },
    { name: 'Préstamos', value: funding.loans },
    { name: 'Inversores', value: funding.investors },
    { name: 'Otros', value: funding.other },
  ].filter(item => item.value > 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Plan Financiero</h1>
        <p className="text-slate-500 mt-2">Calcula tu inversión inicial y define cómo vas a financiarla.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Investment (CAPEX) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Inversión Inicial (CAPEX)</h2>
                <p className="text-sm text-slate-500">Estima los costes de puesta en marcha.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Local y Obra
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Fianza, Reforma, Licencias de obra</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                      <input
                        type="number"
                        className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={investment.location}
                        onChange={(e) => setInvestment({ ...investment, location: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  Equipamiento
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Cocina y Maquinaria</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                      <input
                        type="number"
                        className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={investment.kitchenEquipment}
                        onChange={(e) => setInvestment({ ...investment, kitchenEquipment: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Mobiliario y Decoración</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                      <input
                        type="number"
                        className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={investment.furniture}
                        onChange={(e) => setInvestment({ ...investment, furniture: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-slate-400" />
                  Operativa Inicial
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Stock Inicial (Comida/Bebida)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                      <input
                        type="number"
                        className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={investment.initialStock}
                        onChange={(e) => setInvestment({ ...investment, initialStock: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Tecnología (TPV, Software)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                      <input
                        type="number"
                        className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={investment.tech}
                        onChange={(e) => setInvestment({ ...investment, tech: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  Otros y Colchón
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Legal, Gestoría, Marketing</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                      <input
                        type="number"
                        className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={investment.legal + investment.marketing} // Simplified for UI, could split if needed
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setInvestment({ ...investment, legal: val / 2, marketing: val / 2 });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Colchón de Seguridad (3-6 meses)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                      <input
                        type="number"
                        className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={investment.operatingCushion}
                        onChange={(e) => setInvestment({ ...investment, operatingCushion: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-lg">
              <span className="font-semibold text-slate-700">Total Inversión Estimada</span>
              <span className="text-2xl font-bold text-slate-900">{totalInvestment.toLocaleString()}€</span>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Fuentes de Financiación</h2>
                <p className="text-sm text-slate-500">¿De dónde saldrá el dinero?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fondos Propios (Ahorros)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                    <input
                      type="number"
                      className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                      value={funding.ownFunds}
                      onChange={(e) => setFunding({ ...funding, ownFunds: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Préstamos Bancarios</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                    <input
                      type="number"
                      className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                      value={funding.loans}
                      onChange={(e) => setFunding({ ...funding, loans: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Inversores / Socios</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                    <input
                      type="number"
                      className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                      value={funding.investors}
                      onChange={(e) => setFunding({ ...funding, investors: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Otros (Ayudas, Familia...)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">€</span>
                    <input
                      type="number"
                      className="w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                      value={funding.other}
                      onChange={(e) => setFunding({ ...funding, other: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Resumen Financiero</h3>
            
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
                  Añade fondos para ver el gráfico
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

            {difference < 0 && (
              <div className="mt-6">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Buscar Inversores
                </button>
                <p className="text-xs text-center text-slate-400 mt-2">
                  Te ayudamos a conectar con financiación
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
