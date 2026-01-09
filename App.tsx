
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Navbar from './components/Navbar';
import ContentRow from './components/ContentRow';
import AITutor from './components/AITutor';
import ParentDashboard from './components/ParentDashboard';
import ModulePlayer from './components/ModulePlayer';
import { MOCK_CONTENT, CATEGORIES, BADGES } from './constants';
import { UserProfile, ContentItem, Badge } from './types';

interface Notification {
  id: string;
  type: 'xp' | 'badge';
  title: string;
  subtitle: string;
  icon?: string;
  color: 'cyan' | 'magenta' | 'yellow';
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [activeModule, setActiveModule] = useState<ContentItem | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Video Generation States
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState(0);

  const [ageFilter, setAgeFilter] = useState<'Todos' | '7+' | '12+' | 'Adulto'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [userProgress, setUserProgress] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    MOCK_CONTENT.forEach(item => {
      if (item.progress !== undefined) initial[item.id] = item.progress;
    });
    return initial;
  });

  const [user, setUser] = useState<UserProfile>({
    name: 'Leo',
    avatar: 'https://picsum.photos/seed/user123/200',
    role: 'child',
    xp: 450,
    level: 5,
    badges: []
  });

  const ageOptions: ('Todos' | '7+' | '12+' | 'Adulto')[] = ['Todos', '7+' , '12+', 'Adulto'];

  const loadingMessages = [
    "Iniciando Motores Neurais...",
    "Sincronizando Vetores de Conhecimento...",
    "Renderizando Futuros Possíveis...",
    "Compilando Experiência Imersiva...",
    "Ajustando Matriz de Neon...",
    "Quase lá: Finalizando Realidade Sintética..."
  ];

  useEffect(() => {
    if (isGeneratingVideo) {
      const interval = setInterval(() => {
        setGenerationStep(prev => (prev + 1) % loadingMessages.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isGeneratingVideo]);

  const addNotification = (notif: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notif, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const awardBadge = (badgeId: string) => {
    if (user.badges.includes(badgeId)) return;
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      setUser(prev => ({ ...prev, badges: [...prev.badges, badgeId] }));
      addNotification({
        type: 'badge',
        title: 'Emblema Desbloqueado!',
        subtitle: badge.title,
        icon: badge.icon,
        color: badge.color
      });
      playAwardSound();
    }
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100);
      if (newLevel > prev.level) {
        addNotification({
          type: 'xp',
          title: 'Nível Subiu!',
          subtitle: `Você alcançou o Nível ${newLevel}`,
          color: 'yellow'
        });
        playLevelUpSound();
      }
      return { ...prev, xp: newXP, level: newLevel };
    });
    addNotification({
      type: 'xp',
      title: `+${amount} XP`,
      subtitle: 'Progressão Neural',
      color: 'cyan'
    });
  };

  const playAwardSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorStop(osc, ctx.currentTime + 0.3, ctx);
    } catch(e){}
  };

  const playLevelUpSound = () => {
     try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(550, ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorStop(osc, ctx.currentTime + 0.6, ctx);
    } catch(e){}
  };

  const oscillatorStop = (osc: any, time: number, ctx: any) => {
    osc.stop(time);
    setTimeout(() => ctx.close(), (time - ctx.currentTime) * 1000 + 100);
  };

  const generateSeasonTrailer = async () => {
    try {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
      setIsGeneratingVideo(true);
      setGeneratedVideoUrl(null);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A cinematic trailer for a futuristic AI lab with neon-cyan and magenta aesthetic, floating holographic interfaces, and diverse happy children interacting with digital tools.',
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setGeneratedVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      }
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      setIsGeneratingVideo(false);
    }
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    setUserProgress(prev => {
      const current = prev[id] || 0;
      if (progress > current) {
        if (progress === 100 && current < 100) {
          addXP(50);
          awardBadge('first_step');
          
          // Check for Season 1 Completion
          const season1Items = MOCK_CONTENT.filter(item => item.category === CATEGORIES[0]);
          const allDone = season1Items.every(item => (id === item.id ? 100 : prev[item.id]) === 100);
          if (allDone) {
            addXP(200);
            awardBadge('season_1_master');
          }
        }
        return { ...prev, [id]: progress };
      }
      return prev;
    });
  };

  const filteredContentRows = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return CATEGORIES.map(category => {
      const filteredItems = MOCK_CONTENT.filter(item => {
        const matchesCategory = item.category === category;
        const matchesAge = ageFilter === 'Todos' || item.ageRating === ageFilter;
        const matchesSearch = !query || 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query);
        return matchesCategory && matchesAge && matchesSearch;
      }).map(item => ({
        ...item,
        progress: userProgress[item.id]
      }));
      return { category, items: filteredItems };
    }).filter(row => row.items.length > 0);
  }, [ageFilter, searchQuery, userProgress]);

  const handleOpenModule = (module: ContentItem) => {
    setSelectedContent(null);
    setActiveModule(module);
  };

  const renderContent = () => {
    if (activePage === 'lab') return <AITutor userRole={user.role} onInteraction={() => awardBadge('ai_talker')} />;
    if (activePage === 'family') return <ParentDashboard user={user} />;
    
    return (
      <div className="pt-24 pb-12">
        {!searchQuery && (
          <section className="px-6 sm:px-12 mb-16 relative overflow-hidden group">
            <div className="aspect-[21/9] rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1920&h=1080" 
                alt="Hero AI" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050112] via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-center px-16 max-w-3xl">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-neon-cyan/20 text-neon-cyan font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-neon-cyan/30">
                    IA KIDS ORIGINAL
                  </span>
                  <span className="bg-neon-magenta text-white text-[10px] px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-widest">
                    LABORATÓRIO VIVO
                  </span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-black font-orbitron mb-8 leading-[1.1] uppercase tracking-tighter">
                  DOMINE A <br/> <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">INTELIGÊNCIA</span>
                </h1>
                <p className="text-gray-300 text-xl mb-10 line-clamp-3 font-light leading-relaxed max-w-xl">
                  Prepare-se para o futuro com a plataforma imersiva de IA. Criatividade, ética e lógica em um só lugar.
                </p>
                <div className="flex flex-wrap gap-6">
                  <button onClick={generateSeasonTrailer} className="bg-neon-cyan text-black font-black px-10 py-5 rounded-2xl hover:bg-white transition-all uppercase text-sm tracking-[0.2em] flex items-center shadow-2xl hover:scale-105 active:scale-95">
                    <svg className="w-6 h-6 mr-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Ver Trailer da IA
                  </button>
                  <button onClick={() => setActivePage('lab')} className="glass-card text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/10 transition-all uppercase text-sm tracking-[0.2em] border-2 border-white/20">
                    Entrar no Lab
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className={`sticky top-20 z-40 bg-[#050112]/90 backdrop-blur-2xl px-6 sm:px-12 py-4 mb-8 border-y border-white/5 transition-all shadow-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-neon-cyan uppercase tracking-[0.4em] mb-1">Filtro de Conteúdo</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Seletor de Faixa</span>
              </div>
              <div className="relative flex bg-white/5 p-1 rounded-2xl border border-white/10 h-12 overflow-hidden">
                <div className="absolute top-1 bottom-1 bg-neon-cyan rounded-xl transition-all duration-500 ease-out shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                  style={{ left: `${ageOptions.indexOf(ageFilter) * (100 / ageOptions.length)}%`, margin: '0 4px', width: `calc(${100 / ageOptions.length}% - 8px)` }}
                />
                {ageOptions.map((option) => (
                  <button key={option} onClick={() => setAgeFilter(option)} className={`relative z-10 px-8 h-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 min-w-[100px] ${ageFilter === option ? 'text-black' : 'text-gray-500 hover:text-white'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {filteredContentRows.map(row => (
            <ContentRow key={row.category} title={row.category} items={row.items} onSelect={(item) => setSelectedContent(item)} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050112] text-white selection:bg-neon-magenta selection:text-white relative">
      <Navbar user={user} activePage={activePage} searchQuery={searchQuery} onSearchChange={setSearchQuery} onNavigate={(page) => { setActivePage(page); setActiveModule(null); window.scrollTo(0, 0); }} />
      
      {/* Notifications Overlay */}
      <div className="fixed top-24 right-8 z-[200] space-y-4 pointer-events-none">
        {notifications.map(notif => (
          <div key={notif.id} className={`glass-card p-6 rounded-3xl border-l-4 ${notif.color === 'cyan' ? 'border-neon-cyan shadow-[0_0_20px_rgba(0,242,255,0.2)]' : notif.color === 'magenta' ? 'border-neon-magenta shadow-[0_0_20px_rgba(255,0,229,0.2)]' : 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]'} flex items-center space-x-4 animate-in slide-in-from-right-10 fade-in duration-500 min-w-[280px]`}>
            {notif.icon && <span className="text-3xl">{notif.icon}</span>}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${notif.color === 'cyan' ? 'text-neon-cyan' : notif.color === 'magenta' ? 'text-neon-magenta' : 'text-yellow-400'}`}>{notif.title}</p>
              <p className="text-sm font-bold text-white uppercase">{notif.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {renderContent()}

      {(isGeneratingVideo || generatedVideoUrl) && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-700">
          <div className="relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(0,242,255,0.2)] border border-neon-cyan/20 bg-black">
            <button onClick={() => { setIsGeneratingVideo(false); setGeneratedVideoUrl(null); }} className="absolute top-8 right-8 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/80 text-white hover:bg-neon-magenta hover:scale-110 transition-all border border-white/10">✕</button>
            {isGeneratingVideo && !generatedVideoUrl ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="relative mb-12">
                  <div className="w-32 h-32 rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan animate-spin"></div>
                </div>
                <h2 className="text-3xl font-orbitron font-black text-white mb-4 uppercase tracking-[0.2em]">Síntese Neural</h2>
                <p className="text-neon-cyan text-sm font-black uppercase tracking-[0.4em] animate-pulse">{loadingMessages[generationStep]}</p>
              </div>
            ) : (
              generatedVideoUrl && <video autoPlay controls className="w-full h-full object-cover" src={generatedVideoUrl} />
            )}
          </div>
        </div>
      )}

      {activeModule && (
        <ModulePlayer 
          module={{...activeModule, progress: userProgress[activeModule.id]}} 
          onBack={() => setActiveModule(null)}
          onUpdateProgress={handleUpdateProgress}
          onSelectModule={(m) => setActiveModule(m)}
          onOpenTutor={() => { setActiveModule(null); setActivePage('lab'); }}
        />
      )}

      {selectedContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in zoom-in duration-500">
          <div className="glass-card w-full max-w-6xl rounded-[3rem] overflow-hidden relative border-neon-cyan/20 flex flex-col lg:flex-row h-fit max-h-[90vh]">
            <button onClick={() => setSelectedContent(null)} className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-neon-magenta transition-all">✕</button>
            <div className="lg:w-[55%] relative group"><img src={selectedContent.thumbnail} className="w-full h-full object-cover" /></div>
            <div className="lg:w-[45%] p-12 flex flex-col justify-center bg-gradient-to-br from-[#0a0520] to-[#050112]">
              <h2 className="text-4xl font-orbitron font-black mb-6 uppercase leading-tight tracking-tighter">{selectedContent.title}</h2>
              <p className="text-gray-300 mb-10 text-lg border-l-2 border-white/10 pl-6 italic">{selectedContent.description}</p>
              <button onClick={() => handleOpenModule(selectedContent)} className="bg-neon-cyan text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Assistir Agora
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 py-24 px-12 bg-[#020008] text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start">
          <div className="text-neon-cyan text-2xl font-orbitron mb-6 tracking-tighter">A.I KIDS <span className="text-neon-magenta">LABS</span></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
