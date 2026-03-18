import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { BookOpen, Monitor, Library, PenTool, Search, CheckCircle2, LogOut } from 'lucide-react';

const PURPOSES = [
  { id: 'borrowing', label: 'Borrowing Books', icon: BookOpen },
  { id: 'computer', label: 'Computer Use', icon: Monitor },
  { id: 'reading', label: 'Reading', icon: Library },
  { id: 'studying', label: 'Studying', icon: PenTool },
  { id: 'thesis', label: 'Thesis Work', icon: Search },
];

const SessionEntry: React.FC = () => {
  const { profile, logout } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const togglePurpose = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleEnter = async () => {
    if (selected.length === 0 || !profile) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'visits'), {
        userEmail: profile.email,
        college: profile.college,
        purposes: selected.map(id => PURPOSES.find(p => p.id === id)?.label),
        timestamp: serverTimestamp()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error logging session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <img src="https://raw.githubusercontent.com/shinramyeon22/Software_Engineering_2_PROJECT/main/NEULogo.jpg" 
            alt="NEU Logo" 
            className="w-10 h-10 rounded-full" />
          <span className="font-black text-xl tracking-tighter">NEU LIBRARY</span>
        </div>
        <button onClick={logout} className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors text-zinc-500 hover:text-white">
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-orange-500 font-bold uppercase tracking-widest text-sm">Welcome back, {profile?.displayName?.split(' ')[0]}</h2>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">What's your purpose today?</h1>
            <p className="text-zinc-500 text-lg">Select all that apply to your current visit. Your participation helps us improve library services.</p>
          </div>

          <div className="flex items-center gap-4 p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800/50 backdrop-blur-md">
            <div className="w-12 h-12 bg-orange-600/20 text-orange-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-zinc-400 text-xs font-bold uppercase tracking-tighter">Current Department</div>
              <div className="font-bold">{profile?.college}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {PURPOSES.map((p) => {
              const Icon = p.icon;
              const isSelected = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePurpose(p.id)}
                  className={`
                    group flex items-center justify-between p-5 rounded-2xl border-2 transition-all
                    ${isSelected 
                      ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-600/20' 
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{p.label}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-white border-white' : 'border-zinc-700'}`}>
                    {isSelected && <div className="w-2 h-2 bg-orange-600 rounded-full"></div>}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            disabled={selected.length === 0 || isSubmitting}
            onClick={handleEnter}
            className={`
              w-full py-6 rounded-2xl text-xl font-black transition-all transform active:scale-[0.98]
              ${selected.length > 0 && !isSubmitting
                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-2xl shadow-orange-600/30'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
            `}
          >
            {isSubmitting ? 'LOGGING IN...' : 'ENTER SESSION'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionEntry;