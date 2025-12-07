'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, ChefHat, Save, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';
import { useMobileUIStore } from '@/store/mobileUIStore';

export function Navbar() {
  const { project, resetProject } = useProjectStore();
  const { toggleSidebar } = useMobileUIStore();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user && user.email) {
        // @ts-ignore
        if (window.amplitude) {
          // @ts-ignore
          window.amplitude.setUserId(user.email);
        }
      }
    };
    getUser();
  }, [supabase.auth]);

  // Exit warning for unauthenticated users
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!user) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  const handleSave = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Logic for manual save if needed, or just a toast
      // For now, we assume auto-save works and this is just a reassurance or trigger
      console.log('Saving progress...');
    }
  };

  const handleLogout = async () => {
    resetProject(); // Clear local state
    await supabase.auth.signOut();
    router.push('/login');
  };

  const projectName = project.data.marketing.brandIdentity.name || 
                      (project.data.onboarding.businessType 
                        ? project.data.onboarding.businessType.toLowerCase().replace('_', ' ') 
                        : 'Nuevo Proyecto');

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Left: Project Info */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="w-8 h-8 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#1E4D3B]">
          <ChefHat className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-sm capitalize">
            {projectName}
          </h2>
          <p className="text-xs text-slate-500">
            {project.currentPhase}
          </p>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {!user && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E4D3B] text-white rounded-lg font-medium hover:bg-[#143328] transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Guardar</span>
          </button>
        )}

        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900">
                  {user.email?.split('@')[0] || 'Usuario'}
                </p>
                <p className="text-xs text-slate-500">
                  {user.email || ''}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#1E4D3B] rounded-full flex items-center justify-center text-white shadow-md shadow-[#1E4D3B]/20">
                <UserIcon className="w-5 h-5" />
              </div>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-slate-50 md:hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-sm font-medium text-[#1E4D3B] hover:text-[#143328] hover:bg-[#E8F5E9] px-4 py-2 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </button>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        message="Crea una cuenta gratuita para guardar tu progreso y no perder tus avances."
      />
    </header>
  );
}
