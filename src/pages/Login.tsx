import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { user, login, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-4xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-3/5 space-y-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <img src="https://raw.githubusercontent.com/shinramyeon22/Software_Engineering_2_PROJECT/main/NEULogo.jpg" 
            alt="NEU Logo" 
            className="w-10 h-10 rounded-full" />
            <h2 className="text-4xl font-extrabold tracking-wide text-white">NEU LIBRARY</h2>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter text-white">
            NEW ERA UNIVERSITY<br />
            <span className="text-orange-500 underline decoration-orange-500/30">Library Session</span>
          </h1>

          <p className="text-xl md:text-2xl text-orange-100/80 font-light max-w-xl">
            Log your visits, track your research, and manage your library time effortlessly with our new digital system.
          </p>

          <button 
            onClick={login}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-orange-500/20 transition-all active:scale-95"
          >
            <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            Sign in with @neu.edu.ph
          </button>
        </div>

        <div className="lg:w-2/5 hidden lg:block">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-4xl mb-6">📖</div>
                <div className="space-y-4">
                  <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                  <div className="h-2 w-full bg-white/10 rounded"></div>
                  <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 text-white/40">
                  <div className="w-10 h-10 rounded-full bg-white/5"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-20 bg-white/10 rounded"></div>
                    <div className="h-2 w-12 bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;