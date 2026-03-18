import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { 
  Users, BarChart3, Shield, LogOut, Search, Calendar 
} from 'lucide-react';


interface Visit {
  id: string;
  userEmail: string;
  college: string;
  purposes: string[];
  timestamp: any; // Timestamp
}

interface UserProfile {
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  college?: string;
  blocked?: boolean;
}

const Admin: React.FC = () => {
  const { profile, logout } = useAuth();
  

  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  
  
  const [visits, setVisits] = useState<Visit[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  
  useEffect(() => {
   
    const visitsQuery = query(collection(db, 'visits'), orderBy('timestamp', 'desc'));
    const unsubVisits = onSnapshot(visitsQuery, (snap) => {
      setVisits(snap.docs.map(d => ({ id: d.id, ...d.data() } as Visit)));
    });


    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      interface UserProfileWithId extends UserProfile {
  id?: string;
}
setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfileWithId)));
    });

    return () => {
      unsubVisits();
      unsubUsers();
    };
  }, []);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const getStartDate = () => {
    if (period === 'today') return todayStart;
    if (period === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    if (period === 'month') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d;
    }
    return null;
  };

  const startDate = getStartDate();

  let filteredVisits = visits;
  if (startDate && period !== 'custom') {
    filteredVisits = visits.filter(v => {
      const visitDate = v.timestamp.toDate();
      return visitDate >= startDate;
    });
  } else if (period === 'custom' && customFrom && customTo) {
    const from = new Date(customFrom);
    const to = new Date(customTo);
    to.setHours(23, 59, 59);
    filteredVisits = visits.filter(v => {
      const visitDate = v.timestamp.toDate();
      return visitDate >= from && visitDate <= to;
    });
  }

  const todayVisitsCount = visits.filter(v => {
    const visitDate = v.timestamp.toDate();
    return visitDate >= todayStart;
  }).length;

  const periodVisits = filteredVisits.length;
  const uniqueUsersPeriod = new Set(filteredVisits.map(v => v.userEmail)).size;

  const filteredUsers = users
    .filter(u => 
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const updateRole = async (email: string, newRole: 'user' | 'admin') => {
    await setDoc(doc(db, 'users', email), { role: newRole }, { merge: true });
  };

  const toggleBlock = async (email: string, currentBlocked: boolean) => {
    if (email === profile?.email) {
      alert("You cannot block yourself.");
      return;
    }
    const newBlocked = !currentBlocked;
    await setDoc(doc(db, 'users', email), { blocked: newBlocked }, { merge: true });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="https://raw.githubusercontent.com/shinramyeon22/Software_Engineering_2_PROJECT/main/NEULogo.jpg" 
              alt="NEU Logo" 
              className="w-10 h-10 rounded-full" 
            />
            <div>
              <div className="font-black text-xl tracking-tighter">NEU LIBRARY</div>
              <div className="text-orange-500 text-xs font-bold uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="font-medium">{profile?.displayName}</div>
              <div className="text-zinc-500">({profile?.email})</div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2 bg-zinc-900 hover:bg-red-950/50 rounded-2xl border border-zinc-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-4 font-semibold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'border-b-2 border-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <BarChart3 className="w-5 h-5" />
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-8 py-4 font-semibold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'border-b-2 border-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <Users className="w-5 h-5" />
            USER MANAGEMENT
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Today's Visitors Card (always visible) */}
            <div className="mb-8 bg-zinc-900/60 border border-orange-500/30 rounded-3xl p-8 flex items-center gap-6">
              <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <div className="text-5xl font-black text-orange-500">{todayVisitsCount}</div>
                <div className="text-xl text-zinc-400">Visitors logged today</div>
              </div>
            </div>

            {/* Period Filter */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-500">Period</div>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="custom">Custom range</option>
              </select>

              {period === 'custom' && (
                <div className="flex items-center gap-3">
                  <input 
                    type="date" 
                    value={customFrom} 
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white"
                  />
                  <span className="text-zinc-500">to</span>
                  <input 
                    type="date" 
                    value={customTo} 
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white"
                  />
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-zinc-500 font-bold uppercase">Visits in period</div>
                    <div className="text-6xl font-black mt-2">{periodVisits}</div>
                  </div>
                  <Calendar className="w-10 h-10 text-orange-500" />
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-zinc-500 font-bold uppercase">Unique users</div>
                    <div className="text-6xl font-black mt-2">{uniqueUsersPeriod}</div>
                  </div>
                  <Users className="w-10 h-10 text-emerald-500" />
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-zinc-500 font-bold uppercase">Total registered users</div>
                    <div className="text-6xl font-black mt-2">{users.length}</div>
                  </div>
                  <Shield className="w-10 h-10 text-zinc-400" />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-5 top-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 pl-14 py-4 rounded-3xl text-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* User Table */}
            <div className="bg-zinc-900/40 rounded-3xl border border-zinc-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <th className="px-8 py-6 text-left">User</th>
                    <th className="px-8 py-6 text-left">Email</th>
                    <th className="px-8 py-6 text-left">College</th>
                    <th className="px-8 py-6 text-left">Role</th>
                    <th className="px-8 py-6 text-left">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredUsers.map((user) => {
                    const isSelf = user.email === profile?.email;
                    
                    return (
                      <tr key={user.email} className="hover:bg-zinc-800/50">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img 
                              src={user.photoURL || 'https://via.placeholder.com/40'} 
                              alt="" 
                              className="w-10 h-10 rounded-full border border-zinc-700" 
                            />
                            <div className="font-semibold">{user.displayName}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-zinc-400 font-medium">{user.email}</td>
                        <td className="px-8 py-6 text-zinc-400">{user.college || '—'}</td>
                        
                        {/* Role dropdown */}
                        <td className="px-8 py-6">
                          <select 
                            value={user.role}
                            onChange={(e) => updateRole(user.email, e.target.value as 'user' | 'admin')}
                            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-1 text-sm focus:outline-none focus:border-orange-500"
                          >
                            <option value="user">Student</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold ${user.blocked ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {user.blocked ? 'BLOCKED' : 'ACTIVE'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => toggleBlock(user.email, !!user.blocked)}
                            disabled={isSelf}
                            className={`px-6 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 mx-auto ${user.blocked ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'} ${isSelf ? 'opacity-30 cursor-not-allowed' : ''}`}
                          >
                            <Shield className="w-4 h-4" />
                            {user.blocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;