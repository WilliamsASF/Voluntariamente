'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home, Users, Settings, Plus, Layers, Building, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-red-600 text-gray-800">
      <aside className="w-64 bg-red-600 text-white flex flex-col justify-between p-4 rounded-r-3xl">
        <div>
          <div className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="CInVoluntário" width={230} height={230} className="object-contain" />
          </div>

          <nav className="space-y-3">
            <SidebarItem icon={<Home size={18} />} label="Página Inicial" href="/pagina_inicial" />
            <SidebarItem icon={<Users size={18} />} label="Alunos" href="/alunos" />
            <SidebarItem icon={<Layers size={18} />} label="Turmas" href="/grupos" />
            <SidebarItem icon={<Building size={18} />} label="Projeto" href="/projeto" />
            <SidebarItem icon={<Settings size={18} />} label="Configurações" href="/configuracoes" />
          </nav>
        </div>
        
        <div className="space-y-4">
          {/* User Profile Section */}
          <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || user?.username}</p>
              <p className="text-xs text-white/80 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="default"
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-white m-4 rounded-3xl shadow-md border-2 border-red-600">
        {children}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-red-600 font-semibold' : 'hover:bg-white/10'}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}


