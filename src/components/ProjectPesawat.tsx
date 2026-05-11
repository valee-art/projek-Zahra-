import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, getDocs, where } from 'firebase/firestore';
import { UserProfile, PlaneTicket } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Users, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectPesawatProps {
  profile: UserProfile;
}

export default function ProjectPesawat({ profile }: ProjectPesawatProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [manifest, setManifest] = useState<PlaneTicket[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    const q = collection(db, 'plane_tickets');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlaneTicket[];
      setManifest(data);
      setBookedSeats(data.map(t => t.seatNumber));
    });
    return () => unsubscribe();
  }, []);

  const handleBooking = async () => {
    if (!selectedSeat || loading) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'plane_tickets'), {
        flightNumber: 'GA-101',
        seatNumber: selectedSeat,
        passengerName: profile?.name || 'Anonymous',
        userId: profile?.uid || '',
        createdAt: new Date().toISOString()
      });
      setSelectedSeat(null);
      alert('Pemesanan Tiket Berhasil!');
    } catch (err) {
      console.error(err);
      alert('Gagal Booking: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const rows = Array.from({ length: 23 }, (_, i) => i + 1);
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-8">
       <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project 2: <span className="text-[#00a8ff]">Zahra Air Systems</span></h1>
          <p className="text-white/50">Sistem reservasi penerbangan premium kelas XI PPLG 1.</p>
        </div>
        <div className="flex space-x-2">
           <div className="px-4 py-2 bg-[#00a8ff]/10 border border-[#00a8ff]/20 rounded-xl flex items-center">
             <div className="w-2 h-2 rounded-full bg-[#00a8ff] animate-pulse mr-2"></div>
             <span className="text-[10px] uppercase font-bold text-[#00a8ff]">Flight GA-101</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="xl:col-span-2 bg-[#050505] border border-white/10 p-8 rounded-4xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Plane className="w-64 h-64 rotate-45" />
           </div>

           <div className="relative z-10 flex flex-col items-center">
              <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-t-[100px] h-20 mb-8 flex items-center justify-center">
                 <p className="text-white/20 uppercase tracking-[0.3em] font-bold text-xs italic">Cockpit Area</p>
              </div>

              <div className="w-full flex flex-col items-center custom-scrollbar max-h-[600px] overflow-y-auto px-4 pb-8">
                 <div className="grid grid-cols-6 gap-3 mb-4">
                    {cols.map(c => <div key={c} className="text-center text-white/20 font-bold text-xs">{c}</div>)}
                 </div>

                 <div className="space-y-3">
                   {rows.map(row => (
                     <div key={row} className="grid grid-cols-6 gap-3 items-center relative">
                       {cols.map((col, i) => {
                         const seatId = `${row}${col}`;
                         const isBooked = bookedSeats.includes(seatId);
                         const isSelected = selectedSeat === seatId;

                         return (
                           <div key={seatId} className="relative flex justify-center">
                             {i === 3 && <div className="absolute -left-5 h-full flex items-center text-[10px] text-white/10 italic">Aisle</div>}
                             <button
                               disabled={isBooked}
                               onClick={() => setSelectedSeat(seatId)}
                               className={cn(
                                 "w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs font-bold border",
                                 isBooked 
                                   ? "bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed" 
                                   : isSelected 
                                     ? "bg-[#00a8ff] border-[#00a8ff] text-[#050505] shadow-[0_0_15px_rgba(0,168,255,0.4)]" 
                                     : "bg-white/5 border-white/10 text-white/40 hover:border-[#00a8ff]/40 hover:bg-[#00a8ff]/5"
                               )}
                             >
                               {row}{col}
                             </button>
                           </div>
                         );
                       })}
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
           {/* Booking Info or Manifest */}
           {!isAdmin ? (
             <div className="bg-[#050505] border border-white/10 p-8 rounded-3xl h-full flex flex-col">
               <h2 className="text-xl font-bold mb-6 flex items-center">
                 <Users className="w-5 h-5 mr-3 text-[#00a8ff]" />
                 Pemesanan Kursi
               </h2>

               <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Status Keberangkatan</span>
                        <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">On Schedule</span>
                     </div>
                     <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl">
                        <MapPin className="w-5 h-5 text-[#00a8ff]" />
                        <div>
                           <p className="text-xs text-white/40 font-medium">Route</p>
                           <p className="text-sm font-bold">Jakarta (CGK) &rarr; Tokyo (HND)</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-[#00a8ff]/5 border border-dashed border-[#00a8ff]/30 rounded-2xl text-center">
                     <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Kursi Terpilih</p>
                     <p className="text-4xl font-black text-white">{selectedSeat || '--'}</p>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={!selectedSeat || loading}
                    className="w-full bg-[#00a8ff] text-[#050505] font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? 'Processing...' : 'Konfirmasi Reservasi'}
                  </button>
               </div>
             </div>
           ) : (
             <div className="bg-[#050505] border border-white/10 p-8 rounded-3xl h-full">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                   <ShieldCheck className="w-5 h-5 mr-3 text-[#00a8ff]" />
                   Sistem Manifest
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {manifest.map((ticket) => (
                     <div key={ticket.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:border-[#00a8ff]/20 transition-colors">
                        <div>
                           <p className="font-bold text-white text-sm">{ticket.passengerName}</p>
                           <p className="text-[10px] text-white/40 font-medium">{ticket.flightNumber} / {new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-center">
                           <p className="text-xs text-white/20 font-bold uppercase tracking-tighter">Seat</p>
                           <p className="text-lg font-black text-[#00a8ff]">{ticket.seatNumber}</p>
                        </div>
                     </div>
                   ))}
                   {manifest.length === 0 && <p className="text-center text-white/20 py-10 italic">Belum ada penumpang.</p>}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
