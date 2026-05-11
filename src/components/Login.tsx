import { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { LogIn, UserPlus, ShieldCheck, User as UserIcon, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);

    try {
      if (password.length < 6) {
        throw new Error('Password minimal 6 karakter.');
      }

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
      console.error("Auth Error:", err);
      let msg = err.message || 'Gagal terhubung ke server.';
      let shouldRefresh = true;
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Email atau Password salah. Jika belum punya akun, silakan gunakan menu Registrasi.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Email ini sudah terdaftar. Mengalihkan ke menu Login...';
        setIsRegistering(false); 
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Koneksi internet tidak stabil atau terputus.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Format alamat email tidak valid.';
        shouldRefresh = false;
      } else if (err.code === 'auth/weak-password' || !err.code) {
        msg = err.message || 'Password terlalu lemah. Gunakan minimal 6 karakter.';
        shouldRefresh = false;
      }
      
      setError(msg);
      setIsSubmitting(false);
      
      // Auto-refresh logic (Zahra requirement - but only for critical errors)
      if (shouldRefresh) {
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
    }
  };

  // Helper to determine if we should show the refresh timer
  const isCriticalError = (msg: string) => {
    return msg.includes('Gagal terhubung') || msg.includes('internet') || msg.includes('Email atau Password salah') || msg.includes('terdaftar');
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
        <div className="bg-[#050505] border border-[#00a8ff]/20 p-10 rounded-[32px] shadow-[0_0_100px_rgba(0,168,255,0.05)] relative z-10 backdrop-blur-xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#00a8ff] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(0,168,255,0.4)]">
               <ShieldCheck className="w-8 h-8 text-[#050505]" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              ZAHRA<span className="text-[#00a8ff]">.SYS</span>
            </h1>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#00a8ff]">Identity Email</label>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]/20 transition-all text-sm font-medium"
                placeholder="developer@zahra.sys"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#00a8ff]">Security Key</label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-bold text-white/30 hover:text-[#00a8ff] transition-colors flex items-center"
                >
                  {showPassword ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]/20 transition-all text-sm font-medium"
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
                <p className="text-red-400 text-xs text-center font-bold mb-2">
                  {error}
                </p>
                {isCriticalError(error) && (
                  <>
                    <div className="w-full h-1 bg-red-500/10 rounded-full overflow-hidden mb-2">
                       <motion.div 
                         initial={{ width: "100%" }}
                         animate={{ width: "0%" }}
                         transition={{ duration: 4, ease: "linear" }}
                         className="h-full bg-red-500"
                       />
                    </div>
                    <p className="text-red-500/40 text-[8px] text-center font-black uppercase tracking-widest">
                      System Refresh in 4 Seconds...
                    </p>
                  </>
                )}
                {!isCriticalError(error) && (
                  <p className="text-red-500/40 text-[8px] text-center font-black uppercase tracking-widest">
                    Silakan perbaiki data anda
                  </p>
                )}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00a8ff] text-[#050505] font-bold py-3 rounded-lg hover:bg-[#00a8ff]/90 transition-all shadow-[0_0_20px_rgba(0,168,255,0.3)] flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  {isRegistering ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                  {isRegistering ? 'Register Account' : 'Masuk Dashboard'}
                </>
              )}
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
