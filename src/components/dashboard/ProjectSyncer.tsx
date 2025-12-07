'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { createClient } from '@/lib/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { useSyncStore } from '@/store/syncStore';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProjectSyncer() {
  const { project, updateProject, resetProject } = useProjectStore();
  const { isSaving, setIsSaving, setLastSaved, lastSaved } = useSyncStore();
  const supabase = createClient();
  const debouncedProject = useDebounce(project, 2000); // Debounce save every 2 seconds

  // 1. Load project on mount/login
  useEffect(() => {
    const loadProject = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Safety check: If current project belongs to another user, reset it
      if (project.userId !== 'user-1' && project.userId !== user.id) {
        resetProject();
        // We continue execution to load the correct project for the new user
      }

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (projects && projects.length > 0) {
        // Load existing project
        const remoteProject = projects[0];
        // Merge or replace local state. For now, let's replace but keep local ID if it's default
        // Actually, we should probably respect the remote one if it exists.
        
        // Ensure dates are Date objects
        const loadedProject = {
          ...remoteProject,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          createdAt: new Date(remoteProject.created_at),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updatedAt: new Date(remoteProject.updated_at),
          currentPhase: remoteProject.current_phase,
          data: remoteProject.data
        };
        
        // Only update if remote is newer or we are on default project
        if (project.id === 'default-project' || loadedProject.updatedAt > project.updatedAt) {
           // We need to be careful not to overwrite if we just created a new one locally before logging in
           // But for simplicity in this MVP, let's load the remote one.
           // Ideally we would merge.
           
           // If we have a local project with data but 'default-project' id, we might want to SAVE it to supabase instead of loading.
           // But if the user already has a project in Supabase, we should probably load that one.
           
           updateProject(loadedProject);
        }
      } else {
        // User has no projects in Supabase, but might have local state.
        // We should create one for them if they have local data.
        if (project.id === 'default-project') {
             // Create new project in DB
             const { data: newProject, error: createError } = await supabase
              .from('projects')
              .insert({
                user_id: user.id,
                name: project.data.marketing.brandIdentity.name || 'Mi Restaurante',
                current_phase: project.currentPhase,
                data: project.data,
                updated_at: new Date().toISOString()
              })
              .select()
              .single();
              
             if (newProject) {
                updateProject({
                  id: newProject.id,
                  userId: user.id,
                  createdAt: new Date(newProject.created_at),
                  updatedAt: new Date(newProject.updated_at)
                });
             }
        }
      }
    };

    loadProject();
  }, [supabase.auth]); // Run once on mount (and when auth changes ideally, but supabase client is stable)

  // 2. Sync changes to Supabase
  useEffect(() => {
    const sync = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Don't sync default project unless we are creating it (handled above)
      if (debouncedProject.id === 'default-project') return;

      setIsSaving(true);

      const { error } = await supabase
        .from('projects')
        .update({
          name: debouncedProject.data.marketing.brandIdentity.name,
          current_phase: debouncedProject.currentPhase,
          data: debouncedProject.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', debouncedProject.id);

      if (error) {
        console.error('Error syncing project:', error);
      } else {
        console.log('Project synced to Supabase');
        setLastSaved(new Date());
      }
      setIsSaving(false);
    };

    if (debouncedProject) {
      sync();
    }
  }, [debouncedProject]);

  if (!lastSaved && !isSaving) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-full shadow-lg border border-slate-200 px-4 py-2 flex items-center gap-2 text-xs font-medium text-slate-600 animate-in slide-in-from-bottom-5 fade-in duration-300">
      {isSaving ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-[#1E4D3B]" />
          <span>Guardando...</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-3 h-3 text-[#1E4D3B]" />
          <span className="text-slate-400">
            Guardado {lastSaved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </>
      )}
    </div>
  );
}
