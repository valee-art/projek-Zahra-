import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProjectTugas from './components/ProjectTugas';
import ProjectPesawat from './components/ProjectPesawat';
import ProjectBioskop from './components/ProjectBioskop';
import { UserProfile, MenuType } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Settings } from 'lucide-react';

// Enhanced Error Handler
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo.error;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setError(null);

      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setProfile({ uid: user.uid, ...userSnap.data() } as UserProfile);
            setLoading(false);
          } else {
            // Document might be being created by Login.tsx
            // We'll give it a moment or just set a temporary loading profile
            console.log("Profile doc not found yet, waiting...");
            // Optionally we can set a fallback if it doesn't appear in 2 seconds
            setTimeout(async () => {
              try {
                const retrySnap = await getDoc(userRef);
                if (retrySnap.exists()) {
                  setProfile({ uid: user.uid, ...retrySnap.data() } as UserProfile);
                } else {
                  // If still not there, create it from App
                  const newProfile: UserProfile = {
                    uid: user.uid,
                    email: user.email || '',
                    name: user.email?.split('@')[0] || 'Guest',
                    role: 'user'
                  };
                  await setDoc(userRef, {
                    email: newProfile.email,
                    name: newProfile.name,
                    role: newProfile.role
                  });
                  setProfile(newProfile);
                }
              } catch (err) {
                console.error("Retry profile load failed:", err);
              } finally {
                setLoading(false);
              }
            }, 1500);
          }
        } catch (err) {
          const errMsg = handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
          setError(`Gagal memuat profil: ${errMsg}`);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00a8ff]"></div>
          <p className="text-[#00a8ff] text-xs font-bold uppercase tracking-widest animate-pulse">Initializing System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-red-500/10 border border-red-500/20 p-8 rounded-3xl">
          <h2 className="text-red-500 font-bold text-xl mb-4">SYSTEM ERROR</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl"
          >
            Bersihkan Cache & Reload
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
      case 'stats':
        return <DashboardView profile={profile!} />;
      case 'tugas':
      case 'database':
        return <ProjectTugas profile={profile!} />;
      case 'pesawat':
        return <ProjectPesawat profile={profile!} />;
      case 'bioskop':
        return <ProjectBioskop profile={profile!} />;
      case 'settings':
        return (
          <div className="bg-white/5 border border-white/10 p-12 rounded-[32px] text-center">
            <Settings className="w-16 h-16 text-[#00a8ff] mx-auto mb-6 animate-spin-slow" />
            <h2 className="text-2xl font-black mb-4">SYSTEM PREFERENCES</h2>
            <p className="text-white/40 max-w-md mx-auto">Modul pengaturan sistem sedang dalam tahap enkripsi. Silakan kembali lagi nanti untuk penyesuaian parameter mendalam.</p>
          </div>
        );
      default:
        return <DashboardView profile={profile!} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        profile={profile}
      />

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/5 text-center pb-8">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
              Zahra - Lead Developer - XI PPLG 1 &copy; 2026
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
