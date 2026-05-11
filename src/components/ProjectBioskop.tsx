import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile, MovieTicket } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Ticket, Info, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectBioskopProps {
  profile: UserProfile;
}

export default function ProjectBioskop({ profile }: ProjectBioskopProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [sales, setSales] = useState<MovieTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState('Avengers: Doomsday');

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    const q = collection(db, 'movie_tickets');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MovieTicket[];
      setSales(data);
      setBookedSeats(data.map(t => t.seatNumber));
    });
    return () => unsubscribe();
  }, []);

  const handleBooking = async () => {
    if (!selectedSeat || loading) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'movie_tickets'), {
        movieTitle: selectedMovie,
        seatNumber: selectedSeat,
        passengerName: profile?.name || 'Anonymous',
        userId: profile?.uid || '',
        createdAt: new Date().toISOString()
      });
      setSelectedSeat(null);
      alert('Pemesanan Tiket Bioskop Berhasil!');
    } catch (err) {
      console.error(err);
      alert('Gagal Booking: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6];

  const movies = [
    { title: 'Avengers: Doomsday', genre: 'Action / Sci-Fi', img: 'https://images.unsplash.com/photo-1542204172-3c13ff402701?w=400&h=600&fit=crop' },
    { title: 'Oppenheimer', genre: 'Biography / Drama', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop' },
    { title: 'Dune: Part Two', genre: 'Sci-Fi / Adventure', img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Project 3: <span className="text-[#00a8ff]">Zahra Cinema XI</span></h1>
        <p className="text-white/50">Pengalaman menonton eksklusif dengan sistem booking cerdas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Movie selection */}
         <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold flex items-center">
               <Film className="w-5 h-5 mr-3 text-[#00a8ff]" />
               Sedang Tayang
            </h2>
            <div className="grid grid-cols-1 gap-4">
               {movies.map(movie => (
                 <button
                   key={movie.title}
                   onClick={() => setSelectedMovie(movie.title)}
                   className={cn(
                     "flex items-center space-x-4 p-4 rounded-3xl border transition-all text-left group",
                     selectedMovie === movie.title ? "bg-[#00a8ff]/10 border-[#00a8ff] shadow-lg shadow-[#00a8ff]/5" : "bg-white/5 border-white/10 hover:border-white/20"
                   )}
                 >
                    <div className="w-12 h-16 bg-white/10 rounded-lg overflow-hidden shrink-0">
                       <img src={movie.img} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                       <h3 className="font-bold text-sm text-white truncate">{movie.title}</h3>
                       <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{movie.genre}</p>
                    </div>
                 </button>
               ))}
            </div>

            <div className="bg-[#00a8ff]/5 border border-[#00a8ff]/20 p-6 rounded-3xl">
               <div className="flex items-center mb-3">
                 <Info className="w-4 h-4 text-[#00a8ff] mr-2" />
                 <h4 className="text-xs font-bold uppercase tracking-widest text-white">Informasi Bioskop</h4>
               </div>
               <p className="text-[11px] text-white/60 leading-relaxed font-medium capitalize">
                 "Zahra Cinema XI memberikan visual berkualitas tinggi dengan sistem audio Dolby Atmos terintegrasi."
               </p>
            </div>
         </div>

         {/* Seat Selection */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#050505] border border-white/10 p-10 rounded-4xl flex flex-col items-center">
               <div className="w-full max-w-sm h-2 bg-gradient-to-r from-transparent via-[#00a8ff] to-transparent rounded-full shadow-[0_5px_15px_rgba(0,168,255,0.5)] mb-12 flex items-center justify-center">
                  <p className="text-[10px] text-[#00a8ff]/50 font-bold uppercase tracking-[1em] translate-y-6">Screen</p>
               </div>

               <div className="grid grid-cols-6 gap-4">
                  {rows.map(row => (
                    cols.map(col => {
                      const seatId = `${row}${col}`;
                      const isBooked = bookedSeats.includes(seatId);
                      const isSelected = selectedSeat === seatId;

                      return (
                        <button
                          key={seatId}
                          disabled={isBooked}
                          onClick={() => setSelectedSeat(seatId)}
                          className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all border relative group",
                             isBooked 
                               ? "bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed" 
                               : isSelected 
                                 ? "bg-[#00a8ff] border-[#00a8ff] text-[#050505] shadow-[0_0_20px_rgba(0,168,255,0.4)]" 
                                 : "bg-white/5 border-white/10 text-white/40 hover:border-[#00a8ff] hover:text-[#00a8ff]"
                          )}
                        >
                           {seatId}
                           {!isBooked && !isSelected && (
                             <div className="absolute inset-0 bg-[#00a8ff]/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                           )}
                        </button>
                      );
                    })
                  ))}
               </div>

               <div className="mt-12 flex space-x-6 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center"><div className="w-3 h-3 bg-white/5 border border-white/10 rounded mr-2"></div> Available</div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-[#00a8ff] border border-[#00a8ff] rounded mr-2"></div> Selected</div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-red-500/20 border border-red-500/20 rounded mr-2"></div> Occupied</div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-[#050505] border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                {!isAdmin ? (
                  <>
                    <div className="flex items-center space-x-6">
                       <div className="text-center">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Terpilih</p>
                          <p className="text-2xl font-black text-[#00a8ff]">{selectedSeat || '--'}</p>
                       </div>
                       <div className="h-10 w-px bg-white/10"></div>
                       <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Harga</p>
                          <p className="text-2xl font-black text-white">IDR 50.000</p>
                       </div>
                    </div>
                    <button 
                       onClick={handleBooking}
                       disabled={!selectedSeat || loading}
                       className="w-full md:w-auto px-10 py-4 bg-[#00a8ff] text-[#050505] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                       {loading ? 'Booking...' : (
                         <div className="flex items-center">
                           <Ticket className="w-5 h-5 mr-2" />
                           Beli Tiket
                         </div>
                       )}
                    </button>
                  </>
                ) : (
                  <div className="w-full">
                     <h3 className="text-sm font-bold flex items-center mb-4">
                        <ShoppingBag className="w-4 h-4 mr-2 text-[#00a8ff]" />
                        Recent Sales (Admin Mode)
                     </h3>
                     <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                        {sales.map(s => (
                          <div key={s.id} className="shrink-0 bg-white/5 border border-white/10 p-3 rounded-2xl min-w-[150px]">
                             <p className="text-[10px] text-[#00a8ff] font-bold uppercase truncate">{s.movieTitle}</p>
                             <div className="flex justify-between items-end mt-1">
                                <span className="font-bold text-white text-lg">{s.seatNumber}</span>
                                <span className="text-[8px] text-white/20">{(s.passengerName || 'Guest').split(' ')[0]}</span>
                             </div>
                          </div>
                        ))}
                        {sales.length === 0 && <p className="text-white/20 text-xs italic">No sales data.</p>}
                     </div>
                  </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
}
