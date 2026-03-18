import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';

const COLLEGES = [
  'College of Computer Studies',
  'College of Engineering',
  'College of Arts and Sciences',
  'College of Business and Accountancy',
  'College of Criminology',
  'College of Education',
  'College of Music',
  'College of Nursing',
  'College of International Relations',
  'Graduate School',
  'College of Law',
  'College of Medicine'
];

const Onboarding: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [selected, setSelected] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await updateProfile({ college: selected });
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (profile?.college) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-6 items-center justify-center">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-600/20 mb-6">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black">Almost There!</h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Please select your department or college to complete your registration. This helps us tailor your library experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLLEGES.map((college) => (
            <button
              key={college}
              onClick={() => setSelected(college)}
              className={`
                p-6 rounded-2xl border text-left transition-all relative overflow-hidden group
                ${selected === college 
                  ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-600/20' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'}
              `}
            >
              <div className="font-bold text-lg leading-tight relative z-10">{college}</div>
              {selected === college && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <button
            disabled={!selected || isSubmitting}
            onClick={handleFinish}
            className={`
              flex items-center gap-2 px-12 py-5 rounded-2xl text-xl font-black transition-all
              ${selected && !isSubmitting
                ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-2xl shadow-white/10'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
            `}
          >
            {isSubmitting ? 'SAVING...' : 'FINISH REGISTRATION'}
            {!isSubmitting && <ArrowRight className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;