import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { LogOut, Calendar, Clock, BookMarked, LayoutDashboard, History } from 'lucide-react';
import { format } from 'date-fns';

interface Visit {
  id: string;
  purposes: string[];
  college: string;
  timestamp: Timestamp;
}

const Dashboard: React.FC = () => {
  const { profile, logout } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile?.email) return;

    const q = query(
      collection(db, 'visits'),
      where('userEmail', '==', profile.email),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const visitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Visit[];
      setVisits(visitsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [profile?.email]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://raw.githubusercontent.com/shinramyeon22/Software_Engineering_2_PROJECT/main/NEULogo.jpg" 
               alt="NEU Logo" 
               className="w-10 h-10 rounded-full" />
            <div className="hidden sm:block">
              <div className="font-black text-lg tracking-tighter">NEU LIBRARY</div>
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none">Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
                <div className="font-bold text-sm">{profile?.displayName}</div>
                <div className="text-zinc-500 text-xs">{profile?.email}</div>
             </div>
             
             {profile?.role === 'admin' && (
               <button 
                 onClick={() => navigate('/admin')}
                 className="px-5 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-sm font-bold transition-colors"
               >
                 ADMIN PANEL
               </button>
             )}

             <img src={profile?.photoURL} alt="" className="w-10 h-10 rounded-full border border-zinc-800" />
             <button 
               onClick={logout}
               className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800 text-zinc-400 hover:text-white"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
           <div className="relative z-10 space-y-4">
              <h1 className="text-4xl md:text-5xl font-black">Your Library Activity</h1>
              <p className="text-zinc-400 text-lg max-w-2xl">
                Track your research sessions and library visits. You've logged 
                <span className="text-orange-500 font-bold mx-1">{visits.length}</span> 
                sessions so far.
              </p>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                 <History className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-2xl font-black">{visits.length}</div>
                 <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Visits</div>
              </div>
           </div>
           <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
                 <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-sm font-bold truncate max-w-[150px]">{profile?.college}</div>
                 <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Department</div>
              </div>
           </div>
           <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                 <Calendar className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-2xl font-black">{visits.length > 0 ? format(visits[0].timestamp.toDate(), 'dd MMM') : '--'}</div>
                 <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Latest Visit</div>
              </div>
           </div>
        </div>

        {/* History Table */}
        <div className="bg-zinc-900/40 rounded-[2rem] border border-zinc-900 overflow-hidden">
           <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-3">
                 <BookMarked className="w-6 h-6 text-orange-500" />
                 Recent History
              </h3>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-900">
                       <th className="px-8 py-5">Date & Time</th>
                       <th className="px-8 py-5">Purpose of Visit</th>
                       <th className="px-8 py-5">Department</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-900/50">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-zinc-600">Loading history...</td>
                      </tr>
                    ) : visits.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-zinc-600">No records found yet.</td>
                      </tr>
                    ) : (
                      visits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-zinc-800/30 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="font-bold">{format(visit.timestamp.toDate(), 'dd MMM yyyy')}</div>
                              <div className="text-zinc-500 text-xs flex items-center gap-1">
                                 <Clock className="w-3 h-3" />
                                 {format(visit.timestamp.toDate(), 'hh:mm a')}
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex flex-wrap gap-2">
                                 {visit.purposes.map((purpose, i) => (
                                    <span key={i} className="px-3 py-1 bg-zinc-800 rounded-lg text-xs font-medium text-zinc-300">
                                       {purpose}
                                    </span>
                                 ))}
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-zinc-400 font-medium">{visit.college}</span>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;