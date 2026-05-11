import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  BookOpen, 
  Plane, 
  Film, 
  LogOut, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, MenuType } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeMenu: MenuType;
  setActiveMenu: (menu: MenuType) => void;
  profile: UserProfile | null;
}

export default function Sidebar({ activeMenu, setActiveMenu, profile }: SidebarProps) {
  const menuItems: { id: MenuType; label: string; icon: any; roles?: string[] }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tugas', label: 'Tugas PPLG', icon: BookOpen },
    { id: 'pesawat', label: 'Tiket Pesawat', icon: Plane },
    { id: 'bioskop', label: 'Tiket Bioskop', icon: Film },
  ];

  return (
    <aside className="w-72 bg-[#050505] border-r border-[#00a8ff]/20 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white tracking-tighter">
          ZAHRA<span className="text-[#00a8ff]">.SYS</span>
        </h2>
        <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">XI PPLG 1 - Lead Dev</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={cn(
              "w-full flex items-center px-4 py-4 rounded-xl transition-all group relative overflow-hidden",
              activeMenu === item.id 
                ? "bg-[#00a8ff]/10 text-[#00a8ff]" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            {activeMenu === item.id && (
              <motion.div 
                layoutId="active-nav"
                className="absolute left-0 top-0 bottom-0 w-1 bg-[#00a8ff]"
              />
            )}
            <item.icon className={cn("w-5 h-5 mr-3 transition-transform group-hover:scale-110", activeMenu === item.id && "animate-pulse")} />
            <span className="font-medium tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#00a8ff]/20 flex items-center justify-center border border-[#00a8ff]/30">
              {profile?.role === 'admin' ? <ShieldCheck className="w-5 h-5 text-[#00a8ff]" /> : <UserIcon className="w-5 h-5 text-white/70" />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{profile?.name || 'User'}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-tighter">{profile?.role || 'Guest'}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => signOut(auth)}
          className="w-full flex items-center justify-center space-x-2 py-3 text-red-500/80 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
}
