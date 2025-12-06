'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';

export default function HomePage() {
  const router = useRouter();
  const { project } = useProjectStore();

  useEffect(() => {
    // Check if we are on the client to access the store properly
    const hasCompletedOnboarding = project.data.onboarding.completed;

    if (hasCompletedOnboarding) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  }, [project.data.onboarding.completed, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#1E4D3B] rounded-full opacity-20"></div>
        <p className="text-slate-400 font-medium">Cargando tu restaurante...</p>
      </div>
    </div>
  );
}
