import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  BookOpen, 
  Plane, 
  Film, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  BarChart3,
  Settings,
  Database,
  Layers
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
  const sections = [
    {
      title: 'Main System',
      items: [
        { id: 'dashboard', label: 'Global Analytics', icon: LayoutDashboard },
        { id: 'stats', label: 'System Stats', icon: BarChart3 },
      ]
    },
    {
      title: 'Project 1 - Akademik',
      items: [
        { id: 'tugas', label: 'Tugas PPLG', icon: BookOpen },
        { id: 'database', label: 'Database Tugas', icon: Layers },
      ]
    },
    {
      title: 'Project 2 - Transport',
      items: [
        { id: 'pesawat', label: 'Zahra Air Booking', icon: Plane },
      ]
    },
    {
      title: 'Project 3 - Entertainment',
      items: [
        { id: 'bioskop', label: 'Zahra Cinema XI', icon: Film },
      ]
    },
    {
      title: 'System Settings',
      items: [
        { id: 'settings', label: 'Preferences', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#050505] border-r border-[#00a8ff]/10 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-[#00a8ff] flex items-center justify-center font-black text-[#050505] text-xs">Z</div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tighter uppercase leading-none">
              Zahra<span className="text-[#00a8ff]">.Dev</span>
            </h2>
            <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">XI PPLG 1 System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={section.title} className={cn("mb-6", idx === 0 && "mt-2")}>
            <p className="px-4 mb-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as MenuType)}
                  className={cn(
                    "w-full flex items-center px-4 py-2 rounded-lg transition-all group relative",
                    activeMenu === item.id 
                      ? "bg-[#00a8ff]/10 text-[#00a8ff] border border-[#00a8ff]/20" 
                      : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon className={cn("w-4 h-4 mr-3", activeMenu === item.id ? "text-[#00a8ff]" : "text-white/20 group-hover:text-white/60")} />
                  <span className="text-xs font-bold tracking-tight">{item.label}</span>
                  {activeMenu === item.id && (
                    <motion.div layoutId="nav-glow" className="absolute inset-0 bg-[#00a8ff]/5 rounded-lg blur-sm -z-10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 bg-[#080808]">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 border border-white/10 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00a8ff] to-[#00a8ff]/50 flex items-center justify-center border border-[#00a8ff]/20 shrink-0">
             <UserIcon className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1 overflow-hidden">
             <p className="text-[11px] font-black text-white truncate">{profile?.name || 'Zahra'}</p>
             <div className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                <span className="text-[8px] text-white/40 uppercase tracking-widest font-black">Lead Developer</span>
             </div>
          </div>
        </div>
        
        <button 
          onClick={() => signOut(auth)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-red-500/60 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit System</span>
        </button>
      </div>
    </aside>
  );
}
