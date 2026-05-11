import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { UserProfile, Assignment } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, FileText, CheckCircle, Clock } from 'lucide-react';

interface ProjectTugasProps {
  profile: UserProfile;
}

export default function ProjectTugas({ profile }: ProjectTugasProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];
      setAssignments(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'assignments'), {
        title,
        description,
        studentName: profile.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Project 1: <span className="text-[#00a8ff]">Submission System</span></h1>
        <p className="text-white/50">Kelola dan pantau tugas XI PPLG 1 anda di sini.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <section className="bg-[#050505] border border-white/10 p-8 rounded-3xl h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Send className="w-5 h-5 mr-3 text-[#00a8ff]" />
            Input Tugas Baru
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#00a8ff] mb-2">Judul Tugas</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
                placeholder="Contoh: Project React Dashboard"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#00a8ff] mb-2">Deskripsi Singkat</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00a8ff] transition-colors resize-none"
                placeholder="Berikan detail mengenai progress tugas anda..."
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-[#00a8ff] text-[#050505] font-bold py-3 rounded-xl hover:bg-[#00a8ff]/90 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kumpulkan Tugas'}
            </button>
          </form>
        </section>

        {/* History */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-3 text-[#00a8ff]" />
            Riwayat Pengumpulan
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {assignments.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start space-x-4 group hover:border-[#00a8ff]/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-[#00a8ff]" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                       <h3 className="font-bold text-white truncate pr-2">{item.title}</h3>
                       <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                         item.status === 'submitted' ? 'bg-blue-500/20 text-blue-500' : 
                         item.status === 'graded' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                       }`}>
                         {item.status}
                       </span>
                    </div>
                    <p className="text-white/40 text-sm mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center mt-3 text-[10px] text-white/20 uppercase tracking-widest space-x-4">
                       <span className="flex items-center font-bold">
                         <Clock className="w-3 h-3 mr-1" />
                         {new Date(item.createdAt).toLocaleDateString()}
                       </span>
                       <span className="flex items-center font-bold">
                         <CheckCircle className="w-3 h-3 mr-1" />
                         {item.studentName}
                       </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {assignments.length === 0 && (
              <p className="text-center text-white/20 py-12 border-2 border-dashed border-white/5 rounded-3xl uppercase tracking-widest font-bold">
                Belum ada pengumpulan
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
