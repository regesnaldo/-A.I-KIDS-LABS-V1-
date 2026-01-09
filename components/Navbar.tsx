
import React from 'react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  onNavigate: (page: string) => void;
  activePage: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, activePage, searchQuery, onSearchChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass-card border-none bg-opacity-70 backdrop-blur-md">
      <div className="flex items-center space-x-8">
        <div 
          className="text-xl font-black font-orbitron tracking-tighter text-neon-cyan cursor-pointer whitespace-nowrap hover:scale-105 transition-transform"
          onClick={() => {
            onSearchChange('');
            onNavigate('home');
          }}
        >
          A.I KIDS <span className="text-neon-magenta">LABS</span>
        </div>
        
        <ul className="hidden md:flex space-x-6 text-sm font-semibold uppercase tracking-wider">
          {['home', 'lab', 'family'].map((page) => (
            <li 
              key={page}
              onClick={() => {
                onSearchChange('');
                onNavigate(page);
              }}
              className={`cursor-pointer transition-all duration-300 hover:text-neon-cyan relative py-1 ${activePage === page ? 'text-neon-cyan' : 'text-gray-400'}`}
            >
              {page === 'home' ? 'Início' : page === 'lab' ? 'Laboratório' : 'Família'}
              {activePage === page && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan shadow-[0_0_8px_#00f2ff]"></div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-neon-cyan transition-all group">
          <svg className="w-4 h-4 text-gray-500 group-focus-within:text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar módulos..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white px-3 w-48 focus:w-64 transition-all uppercase tracking-widest font-bold placeholder-gray-600"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="text-gray-500 hover:text-neon-magenta">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Nível e XP Interativo */}
        <button 
          onClick={() => onNavigate('family')}
          className="hidden sm:flex flex-col items-end group hover:scale-105 transition-transform px-3 py-1 rounded-xl hover:bg-white/5"
        >
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Progressão</span>
            <span className="text-xs font-black text-neon-magenta uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,0,229,0.3)]">Nível {user.level}</span>
          </div>
          <div className="w-28 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden relative border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-neon-magenta to-[#ff66eb] shadow-[0_0_10px_rgba(255,0,229,0.5)] transition-all duration-700 ease-out" 
              style={{ width: `${(user.xp % 100)}%` }}
            ></div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('family')}
          className="w-10 h-10 rounded-full border-2 border-neon-cyan overflow-hidden hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,242,255,0.2)] active:scale-90"
        >
          <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
