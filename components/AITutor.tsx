
import React, { useState, useRef, useEffect } from 'react';
import { askAITutor } from '../services/geminiService';

interface AITutorProps {
  userRole: 'child' | 'parent';
  onInteraction?: () => void;
}

const AITutor: React.FC<AITutorProps> = ({ userRole, onInteraction }) => {
  const [ageGroup, setAgeGroup] = useState<'child' | 'adult'>(userRole === 'parent' ? 'adult' : 'child');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: `Olá! Eu sou o Neo, seu guia no A.I KIDS LABS. Estou operando no modo ${ageGroup === 'child' ? 'Explorador Mirim' : 'Consultor Tech'}. O que você quer aprender sobre inteligência artificial hoje?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askAITutor(userMsg, ageGroup);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
    
    if (onInteraction) onInteraction();
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[75vh] flex flex-col glass-card rounded-[2.5rem] overflow-hidden mt-24 shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/10 animate-neon-page">
      <div className="p-6 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_10px_#00f2ff]"></div>
          <span className="font-orbitron font-black text-neon-cyan uppercase tracking-widest text-sm">NEO CORE INTERFACE</span>
        </div>
        
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
          <button onClick={() => setAgeGroup('child')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${ageGroup === 'child' ? 'bg-neon-cyan text-black' : 'text-gray-500 hover:text-white'}`}>Modo Criança</button>
          <button onClick={() => setAgeGroup('adult')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${ageGroup === 'adult' ? 'bg-neon-magenta text-white shadow-[0_0_10px_rgba(255,0,229,0.3)]' : 'text-gray-500 hover:text-white'}`}>Modo Adulto</button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-gradient-to-b from-transparent to-black/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-neon-magenta text-white rounded-tr-none border border-neon-magenta/20' : 'bg-white/5 text-gray-100 rounded-tl-none border border-white/10 backdrop-blur-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 px-6 py-4 rounded-3xl rounded-tl-none border border-white/10 animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-black/40 border-t border-white/10 backdrop-blur-xl">
        <div className="flex space-x-3 items-center">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={ageGroup === 'child' ? "Pergunte algo divertido..." : "Digite sua dúvida técnica..."} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all placeholder-gray-600" />
          <button onClick={handleSend} disabled={loading || !input.trim()} className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${loading || !input.trim() ? 'bg-gray-800 text-gray-600' : 'bg-neon-cyan text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,242,255,0.3)]'}`}>
            {loading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
