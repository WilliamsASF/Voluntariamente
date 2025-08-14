'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home, Users, Settings, Plus, Layers, Building } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-red-600 text-gray-800">
      <aside className="w-64 bg-red-600 text-white flex flex-col justify-between p-4 rounded-r-3xl">
        <div>
          <div className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="CInVoluntário" width={160} height={160} className="object-contain" />
          </div>
          <Link href="/nova-turma" className="flex items-center gap-2 bg-white text-red-600 font-semibold px-3 py-2 rounded-md w-full mb-4 hover:bg-gray-100 transition-colors">
            <Plus size={18} />
            Nova turma
          </Link>
          <nav className="space-y-3">
            <SidebarItem icon={<Home size={18} />} label="Página Inicial" href="/pagina_inicial" />
            <SidebarItem icon={<Users size={18} />} label="Alunos" href="/alunos" />
            <SidebarItem icon={<Layers size={18} />} label="Grupos" href="/grupos" />
            <SidebarItem icon={<Building size={18} />} label="Projeto" href="/projeto" />
            <SidebarItem icon={<Settings size={18} />} label="Configurações" href="/configuracoes" />
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white" />
          <div>
            <p className="text-sm font-semibold">Nome Professor</p>
            <p className="text-xs text-white/80">email@exemplo.com</p>
          </div>
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


