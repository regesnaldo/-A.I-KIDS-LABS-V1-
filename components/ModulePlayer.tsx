
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ContentItem } from '../types';
import { MOCK_CONTENT } from '../constants';

interface ModulePlayerProps {
  module: ContentItem;
  onBack: () => void;
  onOpenTutor: () => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onSelectModule: (module: ContentItem) => void;
}

const ModulePlayer: React.FC<ModulePlayerProps> = ({ module, onBack, onOpenTutor, onUpdateProgress, onSelectModule }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastReportedProgress = useRef<number>(module.progress || 0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(module.videoUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [genStep, setGenStep] = useState(0);
  
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadingMessages = [
    "Analisando contexto pedagógico...",
    "Sintetizando imagens neurais...",
    "Renderizando simulação 4K...",
    "Finalizando matriz de vídeo sintético..."
  ];

  const nextModules = useMemo(() => {
    const categoryItems = MOCK_CONTENT.filter(item => item.category === module.category);
    const currentIndex = categoryItems.findIndex(item => item.id === module.id);
    return [
      categoryItems[(currentIndex + 1) % categoryItems.length],
      categoryItems[(currentIndex + 2) % categoryItems.length],
      categoryItems[(currentIndex + 3) % categoryItems.length]
    ];
  }, [module.id, module.category]);

  // Sync internal state when module prop changes
  useEffect(() => {
    setCurrentVideoUrl(module.videoUrl);
    lastReportedProgress.current = module.progress || 0;
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [module.id, module.videoUrl]);

  const handleAISynthesis = async () => {
    try {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }

      setIsGenerating(true);
      const interval = setInterval(() => setGenStep(p => (p + 1) % loadingMessages.length), 3500);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A high-tech cinematic educational video for children about ${module.title}. Friendly robots, floating glowing holographic neural networks, and vibrant neon colors. Hyper-detailed, 4k resolution.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setCurrentVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      }
      clearInterval(interval);
      setIsGenerating(false);
    } catch (e: any) {
      console.error("AI Video Generation Error:", e);
      if (e.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      videoRef.current.muted = nextMuted;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setCurrentTime(video.currentTime);
    if (video.duration) {
      const progress = Math.floor((video.currentTime / video.duration) * 100);
      if (progress > lastReportedProgress.current) {
        lastReportedProgress.current = progress;
        onUpdateProgress(module.id, progress);
      }
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleEnded = () => {
    if (isLooping) {
      videoRef.current?.play();
    } else if (isAutoplay) {
      const next = nextModules[0];
      if (next) {
        onSelectModule(next);
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>;
    }
    if (volume < 0.5) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m-10.95-2.536H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
    }
    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#050112] text-white flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-neon-cyan transition-colors group"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-orbitron font-bold text-xs uppercase tracking-widest">Voltar ao Catálogo</span>
        </button>
        
        <div className="text-center">
          <p className="text-[10px] font-black text-neon-magenta uppercase tracking-[0.3em] mb-1">{module.category}</p>
          <h1 className="text-sm font-bold uppercase tracking-tight text-white">{module.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleAISynthesis}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-neon-magenta/10 hover:bg-neon-magenta/30 text-neon-magenta px-4 py-2 rounded-xl border border-neon-magenta/20 transition-all group disabled:opacity-50 shadow-[0_0_20px_rgba(255,0,229,0.1)]"
          >
            <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest">{isGenerating ? 'Processando...' : 'Síntese de IA'}</span>
          </button>
          
          <button 
            onClick={onOpenTutor}
            className="bg-neon-cyan text-black p-2 rounded-lg hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,242,255,0.4)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-black to-[#050112] flex flex-col lg:flex-row">
        <div className="lg:w-3/4 flex flex-col">
          <div 
            className="aspect-video w-full bg-black relative group flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {isGenerating && (
              <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="relative mb-12">
                   <div className="w-24 h-24 rounded-full border-4 border-neon-magenta/20 border-t-neon-magenta animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-12 h-12 rounded-full bg-neon-magenta/10 animate-pulse border border-neon-magenta/30"></div>
                   </div>
                </div>
                <h3 className="text-xl font-orbitron font-black text-white mb-2 uppercase tracking-[0.2em]">Criando Vídeo com IA</h3>
                <p className="text-neon-magenta text-xs font-black uppercase tracking-[0.4em] animate-pulse">
                  {loadingMessages[genStep]}
                </p>
                <p className="mt-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest max-w-xs text-center">
                  A geração por inteligência artificial demora cerca de 1 a 2 minutos para ser concluída.
                </p>
              </div>
            )}
            
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
              className="w-full h-full object-contain"
              src={currentVideoUrl}
            />
            
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-500 flex flex-col justify-between p-6 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex justify-between items-start">
                <div className="p-4 glass-card border-neon-cyan/20">
                  <p className="text-neon-cyan text-[10px] font-black tracking-widest uppercase">Transmissão em HD</p>
                  <p className="text-white text-xs font-bold">{module.title}</p>
                </div>
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                  4K ULTRA HD
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group/seeker h-8 flex items-center">
                  <input 
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-neon-cyan outline-none z-10"
                  />
                  <div 
                    className="absolute h-1 bg-neon-cyan rounded-full pointer-events-none shadow-[0_0_10px_rgba(0,242,255,0.8)] z-0" 
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button onClick={togglePlay} className="text-white hover:text-neon-cyan transition-colors">
                      {isPlaying ? (
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>

                    <button onClick={() => skip(-10)} className="text-gray-400 hover:text-white transition-colors flex flex-col items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                      </svg>
                      <span className="text-[8px] font-bold">-10s</span>
                    </button>
                    <button onClick={() => skip(10)} className="text-gray-400 hover:text-white transition-colors flex flex-col items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                      </svg>
                      <span className="text-[8px] font-bold">+10s</span>
                    </button>

                    <div className="text-[10px] font-orbitron font-bold text-gray-300 tracking-wider">
                      {formatTime(currentTime)} <span className="text-gray-600 mx-1">/</span> {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => setIsAutoplay(!isAutoplay)}
                      className={`flex flex-col items-center transition-colors ${isAutoplay ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
                      title="Reprodução Automática"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[8px] font-bold uppercase mt-1">Auto</span>
                    </button>

                    <button 
                      onClick={() => setIsLooping(!isLooping)}
                      className={`flex flex-col items-center transition-colors ${isLooping ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
                      title="Repetir Módulo"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-[8px] font-bold uppercase mt-1">Loop</span>
                    </button>

                    <div className="flex items-center space-x-2 group/volume h-10">
                      <button onClick={toggleMute} className="text-gray-400 hover:text-neon-cyan transition-colors">
                        {renderVolumeIcon()}
                      </button>
                      <div className="w-0 group-hover/volume:w-24 transition-all duration-300 flex items-center overflow-hidden h-full">
                        <input 
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-neon-cyan outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-6">
               <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-gray-400 font-bold">{module.ageRating}</span>
               <span className="text-neon-magenta text-xs font-bold uppercase tracking-widest">{module.type}</span>
               <span className="text-gray-500 text-xs font-bold uppercase">{module.duration}</span>
            </div>
            <h2 className="text-3xl font-orbitron font-black mb-6 uppercase tracking-tight">O que você vai aprender</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl font-light mb-8">
              {module.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button 
                onClick={() => onUpdateProgress(module.id, 100)}
                className="flex items-center space-x-3 bg-neon-cyan text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span>Marcar como Completo</span>
              </button>

              <button 
                className="flex items-center space-x-3 glass-card border-neon-magenta/30 text-neon-magenta px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-neon-magenta/10 hover:scale-105 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Baixar Recursos</span>
              </button>
            </div>
            
            <div className="mb-12 max-w-4xl">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Progresso da Missão</span>
                 <span className="text-[10px] font-black text-neon-cyan uppercase tracking-widest">{module.progress ? `${Math.floor(module.progress)}%` : 'Iniciando...'}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.6)] transition-all duration-300" 
                  style={{ width: `${module.progress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/4 bg-[#080218] border-l border-white/5 p-8">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-6">Próximos Módulos</h3>
          <div className="space-y-6">
            {nextModules.map((nextItem) => (
              <div key={nextItem.id} className="group cursor-pointer" onClick={() => onSelectModule(nextItem)}>
                <div className="aspect-video rounded-xl overflow-hidden mb-3 relative">
                  <img src={nextItem.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={nextItem.title} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-tight group-hover:text-neon-cyan transition-colors">{nextItem.title}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{nextItem.duration} • HD</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 rounded-3xl bg-neon-cyan/5 border border-neon-cyan/10">
            <h4 className="text-[10px] font-black text-neon-cyan uppercase tracking-widest mb-4">Suporte de IA</h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Ficou com alguma dúvida sobre o conteúdo deste módulo? O Neo está online e pronto para explicar!</p>
            <button 
              onClick={onOpenTutor}
              className="w-full py-3 bg-neon-cyan text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
            >
              Falar com o Tutor
            </button>
          </div>
        </div>
      </main>

      <style>{`
        /* Seek bar custom thumb */
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #00f2ff;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 242, 255, 0.8);
          border: 2px solid white;
          margin-top: -7px; /* Centers thumb on track */
        }
        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #00f2ff;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 242, 255, 0.8);
          border: 2px solid white;
        }
        input[type='range']::-webkit-slider-runnable-track {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        input[type='range']:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ModulePlayer;
