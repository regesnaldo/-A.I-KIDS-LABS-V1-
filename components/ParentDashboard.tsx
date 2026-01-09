
import React from 'react';
import { LearningStat, UserProfile } from '../types';
import { BADGES } from '../constants';

interface ParentDashboardProps {
  user: UserProfile;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user }) => {
  const stats: LearningStat[] = [
    { topic: 'Fundamentos de IA', mastery: 85, timeSpent: 120 },
    { topic: 'Segurança Online', mastery: 60, timeSpent: 45 },
    { topic: 'Robótica Básica', mastery: 40, timeSpent: 30 },
    { topic: 'Ética Digital', mastery: 95, timeSpent: 80 }
  ];

  const earnedBadges = BADGES.filter(b => user.badges.includes(b.id));

  return (
    <div className="p-8 mt-20 max-w-6xl mx-auto animate-neon-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black font-orbitron mb-2">PAINEL DA <span className="text-neon-cyan">FAMÍLIA</span></h1>
          <p className="text-gray-400 uppercase text-xs font-bold tracking-[0.2em]">Monitoramento Pedagógico e Segurança</p>
        </div>
        <div className="mt-6 md:mt-0 glass-card px-6 py-4 rounded-2xl flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase">Progresso Total</p>
            <p className="text-2xl font-orbitron text-neon-magenta">{user.xp} XP</p>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase">Nível de IA</p>
            <p className="text-2xl font-orbitron text-neon-cyan">Lvl {user.level}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl">
          <h2 className="text-xl font-orbitron font-bold mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3"></span>
            PROGRESSO DE APRENDIZAGEM
          </h2>
          <div className="space-y-6">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-gray-300 uppercase">{stat.topic}</span>
                  <span className="text-sm font-bold text-neon-cyan">{stat.mastery}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)] transition-all duration-1000" style={{ width: `${stat.mastery}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <h2 className="text-xl font-orbitron font-bold mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-magenta rounded-full mr-3"></span>
            CONQUISTAS DESBLOQUEADAS
          </h2>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {earnedBadges.map(badge => (
                <div key={badge.id} className={`p-4 rounded-2xl border ${badge.color === 'cyan' ? 'border-neon-cyan/20 bg-neon-cyan/5' : badge.color === 'magenta' ? 'border-neon-magenta/20 bg-neon-magenta/5' : 'border-yellow-400/20 bg-yellow-400/5'} flex flex-col items-center text-center`}>
                  <span className="text-4xl mb-3">{badge.icon}</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{badge.title}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Nenhuma conquista ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
