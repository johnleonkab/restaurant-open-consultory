'use client';

import { cn } from '@/lib/utils';
import { useProjectStore } from '@/store/projectStore';
import { useMobileUIStore } from '@/store/mobileUIStore';
import {
  LayoutDashboard,
  Lightbulb,
  Calculator,
  MapPin,
  Scale,
  PaintBucket,
  ChefHat,
  Truck,
  Monitor,
  Users,
  Megaphone,
  Rocket,
  LineChart
} from 'lucide-react';

import { ProjectPhase } from '@/types/project';
import { LucideIcon } from 'lucide-react';

const MENU_ITEMS: { title: string; href: string; icon: LucideIcon; phase: ProjectPhase }[] = [
  {
    title: 'Resumen',
    href: '/dashboard',
    icon: LayoutDashboard,
    phase: 'ONBOARDING',
  },
  {
    title: '1. Concepto y Viabilidad',
    href: '/dashboard/concept',
    icon: Lightbulb,
    phase: 'CONCEPT',
  },
  {
    title: '2. Plan Financiero',
    href: '/dashboard/financials',
    icon: Calculator,
    phase: 'FINANCIALS',
  },
  {
    title: '3. Local',
    href: '/dashboard/location',
    icon: MapPin,
    phase: 'LOCATION',
  },
  {
    title: '4. Legal',
    href: '/dashboard/legal',
    icon: Scale,
    phase: 'LEGAL',
  },
  {
    title: '5. Diseño y Obra',
    href: '/dashboard/design',
    icon: PaintBucket,
    phase: 'DESIGN',
  },
  {
    title: '6. Carta y Menú',
    href: '/dashboard/menu',
    icon: ChefHat,
    phase: 'MENU',
  },
  {
    title: '7. Proveedores',
    href: '/dashboard/suppliers',
    icon: Truck,
    phase: 'SUPPLIERS',
  },
  {
    title: '8. Tecnología',
    href: '/dashboard/tech',
    icon: Monitor,
    phase: 'TECH',
  },
  {
    title: '9. Equipo',
    href: '/dashboard/team',
    icon: Users,
    phase: 'TEAM',
  },
  {
    title: '10. Marketing',
    href: '/dashboard/marketing',
    icon: Megaphone,
    phase: 'MARKETING',
  },
  {
    title: '11. Apertura',
    href: '/dashboard/opening',
    icon: Rocket,
    phase: 'OPENING',
  },
  {
    title: 'Post-Apertura',
    href: '/dashboard/post-opening',
    icon: LineChart,
    phase: 'POST_OPENING',
  },
];

import { useRouter } from 'next/navigation';

export function Sidebar() {
  const { project } = useProjectStore();
  const { isSidebarOpen, closeSidebar } = useMobileUIStore();
  const router = useRouter();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className={cn(
        "w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-serif font-bold text-[#143328] tracking-tight">Savia</h1>
        <p className="text-xs text-slate-500 mt-1">
          {project.data.onboarding.businessType 
            ? project.data.onboarding.businessType.toLowerCase().replace('_', ' ') 
            : 'Nuevo Proyecto'}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = project.currentPhase === item.phase;
          
          return (
            <button
              key={item.phase}
              onClick={() => {
                useProjectStore.getState().setPhase(item.phase);
                router.push('/dashboard');
                closeSidebar();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left",
                isActive 
                  ? "bg-[#E8F5E9] text-[#1E4D3B]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-[#1E4D3B]" : "text-slate-400")} />
              {item.title}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs font-medium text-slate-500 mb-2">Progreso Global</p>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-[#1E4D3B] h-2 rounded-full" style={{ width: '10%' }} />
          </div>
          <p className="text-xs text-right text-slate-400 mt-1">10%</p>
        </div>
      </div>
      </div>
    </>
  );
}
