import { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { LogIn, UserPlus, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          name: email.split('@')[0],
          role: selectedRole,
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Login Gagal! Pastikan email/password benar.');
      // Longer timeout to let users read the error
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00a8ff]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#050505] border border-[#00a8ff]/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,168,255,0.1)] relative z-10 backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">
              ZAHRA<span className="text-[#00a8ff]">.DASHBOARD</span>
            </h1>
            <p className="text-white/50 text-sm">Premium XI PPLG 1 System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#00a8ff] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
                placeholder="zahra@pplg.dev"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#00a8ff] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('user')}
                  className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                    selectedRole === 'user' ? 'bg-[#00a8ff]/20 border-[#00a8ff] text-white' : 'bg-transparent border-white/10 text-white/50'
                  }`}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                    selectedRole === 'admin' ? 'bg-[#00a8ff]/20 border-[#00a8ff] text-white' : 'bg-transparent border-white/10 text-white/50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Admin
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
              >
                <p className="text-red-500 text-xs text-center font-bold">
                  {error}
                </p>
                <p className="text-red-500/60 text-[10px] text-center mt-1 uppercase tracking-widest">
                  System akan refresh dalam 3 detik...
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-[#00a8ff] text-[#050505] font-bold py-3 rounded-lg hover:bg-[#00a8ff]/90 transition-all shadow-[0_0_20px_rgba(0,168,255,0.3)] flex items-center justify-center group"
            >
              {isRegistering ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
              {isRegistering ? 'Register Account' : 'Masuk Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-[#00a8ff] text-sm hover:underline font-bold"
            >
              {isRegistering ? 'Sudah punya akun? Login' : 'Belum punya akun? Registrasi'}
            </button>
          </div>
        </div>

        {/* Demo Accounts Info */}
        <div className="mt-8 bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Petunjuk Penggunaan</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Klik <span className="text-[#00a8ff]">Registrasi</span> untuk membuat akun pertama anda. 
            Firebase Auth saat ini kosong. Gunakan role <span className="text-[#00a8ff]">Admin</span> untuk kendali penuh.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
