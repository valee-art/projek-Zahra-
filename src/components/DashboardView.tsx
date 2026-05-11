import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { 
  Trophy, 
  MessageSquare, 
  Clock, 
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
}

export default function DashboardView({ profile }: DashboardViewProps) {
  const stats = [
    { label: 'Tugas Selesai', value: '12', icon: Trophy, color: 'text-green-500' },
    { label: 'Tiket Aktif', value: '03', icon: Clock, color: 'text-[#00a8ff]' },
    { label: 'Feedback', value: '124', icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Efficiency', value: '98%', icon: BarChart3, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Selamat Datang, <span className="text-[#00a8ff]">{profile.name}</span>
        </h1>
        <p className="text-white/50">Overview sistem global dan statistik performa anda hari ini.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#050505] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-[#00a8ff]/30 transition-colors shadow-2xl"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-16 h-16" />
             </div>
             
             <div className="relative z-10">
               <div className={`p-2 rounded-lg bg-white/5 w-fit mb-4 ${stat.color}`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <p className="text-white/40 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
               <h3 className="text-3xl font-bold mt-1 text-white">{stat.value}</h3>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#050505] border border-white/10 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#00a8ff]" />
              Grafik Perkembangan
            </h3>
            <div className="flex space-x-2 text-xs">
              <span className="px-3 py-1 bg-[#00a8ff]/10 text-[#00a8ff] rounded-full border border-[#00a8ff]/20">Mingguan</span>
              <span className="px-3 py-1 text-white/40 rounded-full">Bulanan</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between px-4">
             {[40, 70, 45, 90, 65, 85, 55].map((height, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${height}%` }}
                 className="w-12 bg-gradient-to-t from-[#00a8ff]/20 to-[#00a8ff] rounded-t-lg relative group transition-all"
               >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   {height} Pts
                 </div>
               </motion.div>
             ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">
            <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
          </div>
        </div>

        <div className="bg-[#050505] border border-white/10 p-8 rounded-3xl flex flex-col justify-between">
           <div>
             <h3 className="text-xl font-bold mb-6 flex items-center text-[#00a8ff]">
               <Activity className="w-5 h-5 mr-2" />
               Status Sistem
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-white/60">Server Uptime</span>
                      <span className="text-green-500">99.9%</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[99.9%] bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-white/60">Memory Usage</span>
                      <span className="text-[#00a8ff]">42%</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[42%] bg-[#00a8ff] rounded-full shadow-[0_0_10px_rgba(0,168,255,0.5)]"></div>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-white/60">Security Firewall</span>
                      <span className="text-green-500">Active</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-green-500 rounded-full"></div>
                   </div>
                </div>
             </div>
           </div>

           <div className="mt-8 p-4 bg-[#00a8ff]/5 border border-[#00a8ff]/20 rounded-2xl">
              <p className="text-xs text-[#00a8ff]/80 italic">"Technology is best when it brings people together."</p>
           </div>
        </div>
      </div>
    </div>
  );
}
