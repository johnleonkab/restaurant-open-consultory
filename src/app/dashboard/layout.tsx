import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { ProjectSyncer } from '@/components/dashboard/ProjectSyncer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      <ProjectSyncer />
      <Sidebar />
      <main className="pl-64 h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
