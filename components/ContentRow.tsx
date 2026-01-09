
import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../types';

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
}

const LazyImage: React.FC<{ src: string, alt: string, className?: string }> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (imgRef.current) observer.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: '200px', // Carrega a imagem 200px antes de entrar na viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef} className="w-full h-full bg-white/5 relative overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%] z-10" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`${className} transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

const ContentRow: React.FC<ContentRowProps> = ({ title, items, onSelect }) => {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const toggleTooltip = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the main modal
    setActiveTooltipId(activeTooltipId === id ? null : id);
  };

  return (
    <div className="py-8 px-6 sm:px-12 group/row">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest border-l-4 border-neon-cyan pl-4 leading-none">
          {title}
        </h2>
        <span className="text-[10px] font-bold text-gray-500 tracking-[0.4em] uppercase opacity-0 group-hover/row:opacity-100 transition-opacity">
          Deslize para explorar ({items.length} módulos)
        </span>
      </div>
      
      <div className="flex space-x-6 overflow-x-auto pb-10 scrollbar-hide -mx-4 px-4">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex-none w-[22rem] sm:w-[28rem] group cursor-pointer relative"
          >
            {/* Main Card Container */}
            <div className="aspect-video rounded-2xl overflow-hidden relative border-2 border-transparent group-hover:border-neon-cyan/50 transition-all duration-500 shadow-2xl group-hover:shadow-[0_0_30px_rgba(0,242,255,0.15)] group-hover:-translate-y-2">
              
              {/* Lazy Thumbnail */}
              <LazyImage 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050112] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              
              {/* Progress Bar */}
              {item.progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800/80 backdrop-blur-sm">
                  <div 
                    className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.8)]" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="text-[10px] font-black bg-neon-cyan text-black px-2 py-1 rounded-md uppercase tracking-tighter">
                  {item.type}
                </span>
              </div>
              
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {/* Info Icon */}
                <button 
                  onClick={(e) => toggleTooltip(e, item.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border ${activeTooltipId === item.id ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-black/40 text-neon-cyan border-neon-cyan/40 hover:bg-neon-cyan/20'}`}
                  title="Mais informações"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <span className="text-[10px] font-bold bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-lg text-neon-magenta border border-neon-magenta/40">
                  {item.ageRating}
                </span>
              </div>

              {/* Tooltip Description */}
              {activeTooltipId === item.id && (
                <div 
                  className="absolute inset-x-4 bottom-4 z-20 glass-card p-4 rounded-xl border-neon-cyan/50 animate-in fade-in zoom-in duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-neon-cyan uppercase tracking-widest">Resumo do Módulo</h4>
                    <button onClick={(e) => toggleTooltip(e, item.id)} className="text-gray-500 hover:text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <p className="text-white text-xs leading-relaxed line-clamp-4 font-medium italic">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center text-[10px] font-black text-neon-magenta uppercase tracking-[0.2em]">
                    Clique no card para ver detalhes completos
                    <svg className="w-3 h-3 ml-2 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                  </div>
                </div>
              )}

              {/* Quick Info on Hover (Only if tooltip is not active) */}
              {activeTooltipId !== item.id && (
                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
            
            {/* Title Section */}
            <div className="mt-5 px-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1 uppercase tracking-tight font-orbitron">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1 text-neon-cyan" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg>
                  {item.duration}
                </span>
                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                <span className="text-neon-magenta/80">Premium HD</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ContentRow;
