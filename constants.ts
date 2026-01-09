
import { ContentItem, Badge } from './types';

export const BADGES: Badge[] = [
  { id: 'first_step', title: 'Primeiro Passo', icon: '🚀', description: 'Completou seu primeiro módulo de IA!', color: 'cyan' },
  { id: 'season_1_master', title: 'Mestre da Temporada 1', icon: '🤖', description: 'Dominou todos os conceitos iniciais da Temporada 1.', color: 'magenta' },
  { id: 'ai_talker', title: 'Conversador de IA', icon: '💬', description: 'Interagiu com o tutor Neo no laboratório.', color: 'yellow' },
  { id: 'data_explorer', title: 'Explorador de Dados', icon: '📊', description: 'Completou 5 módulos de Big Data.', color: 'cyan' },
  { id: 'ethics_hero', title: 'Herói da Ética', icon: '⚖️', description: 'Finalizou a trilha de Ética em Silício.', color: 'magenta' }
];

const seasonTitles = [
  "O Despertar da Máquina",
  "Circuitos da Imaginação",
  "A Lógica dos Robôs",
  "Visão Computacional",
  "Linguagem das Estrelas",
  "O Futuro das Redes",
  "Ética em Silício",
  "Algoritmos Criativos",
  "Deep Learning Profundo",
  "Interface Humano-IA",
  "Agentes Inteligentes",
  "Big Data Galáctico",
  "Segurança na Matrix",
  "IA e Sustentabilidade",
  "Medicina Digital",
  "Exploração Espacial com IA",
  "Cidades Inteligentes",
  "O Jogo da Imitação",
  "Neuro-evolução",
  "Singularidade e Além"
];

const seasonVisualThemes = [
  "cyberpunk", "circuit", "robotics", "optics", "cosmos", 
  "internet", "justice", "painting", "data", "cyborg", 
  "automation", "statistics", "firewall", "nature", "biology", 
  "rocket", "skyscraper", "hacker", "evolution", "energy"
];

const STOCK_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-artificial-intelligence-interface-of-a-computer-screen-31367-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-38541-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-circuit-board-with-glowing-lights-41078-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-robot-hand-pointing-a-finger-at-the-screen-31368-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-connection-of-digital-network-nodes-and-lines-31366-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-robotic-arm-working-in-a-factory-31370-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-futuristic-holographic-projection-of-a-brain-31371-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-binary-code-and-numbers-31365-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-blue-circuit-board-background-41079-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-working-with-digital-screen-31369-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-keyboard-38543-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-digital-server-room-with-blue-lights-31372-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-motherboard-and-electronic-components-41080-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-electronic-circuits-and-components-41081-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-interacting-with-a-holographic-screen-31373-large.mp4"
];

const VIDEO_CATEGORIES = {
  AI_CORE: [0, 6, 7],
  CODING: [1, 10, 11],
  HARDWARE: [2, 8, 12, 13],
  ROBOTICS: [3, 5],
  NETWORK: [4, 9, 14],
};

const topicToVideoCat: Record<string, keyof typeof VIDEO_CATEGORIES> = {
  "Neurônios Digitais": "AI_CORE",
  "Lógica Binária": "CODING",
  "Sensores Ativos": "HARDWARE",
  "Processamento de Imagem": "NETWORK",
  "NLP Básico": "AI_CORE",
  "Redes Neurais": "NETWORK",
  "Aprendizado por Reforço": "CODING",
  "IA Generativa": "AI_CORE",
  "Ética e Viés": "NETWORK",
  "Robótica Móvel": "ROBOTICS",
  "Visão de Máquina": "NETWORK",
  "Dados em Nuvem": "CODING",
  "Criptografia": "CODING",
  "Simulações de Vida": "AI_CORE",
  "Bio-informática": "HARDWARE",
  "Sistemas Especialistas": "AI_CORE",
  "Fronteiras da IA": "NETWORK",
  "Consciência Sintética": "AI_CORE",
  "Hardware Futurista": "HARDWARE",
  "A Grande Integração": "ROBOTICS"
};

const topicKeywords: Record<string, string> = {
  "Neurônios Digitais": "neuron",
  "Lógica Binária": "coding",
  "Sensores Ativos": "electronics",
  "Processamento de Imagem": "camera",
  "NLP Básico": "chatbot",
  "Redes Neurais": "ai",
  "Aprendizado por Reforço": "gamer",
  "IA Generativa": "art",
  "Ética e Viés": "ethics",
  "Robótica Móvel": "drone",
  "Visão de Máquina": "scanner",
  "Dados em Nuvem": "server",
  "Criptografia": "security",
  "Simulações de Vida": "simulation",
  "Bio-informática": "dna",
  "Sistemas Especialistas": "scientist",
  "Fronteiras da IA": "futuristic",
  "Consciência Sintética": "brain",
  "Hardware Futurista": "microchip",
  "A Grande Integração": "connection"
};

function getModuleTopic(m: number, s: number): string {
  const topics = [
    "Neurônios Digitais", "Lógica Binária", "Sensores Ativos", "Processamento de Imagem",
    "NLP Básico", "Redes Neurais", "Aprendizado por Reforço", "IA Generativa",
    "Ética e Viés", "Robótica Móvel", "Visão de Máquina", "Dados em Nuvem",
    "Criptografia", "Simulações de Vida", "Bio-informática", "Sistemas Especialistas",
    "Fronteiras da IA", "Consciência Sintética", "Hardware Futurista", "A Grande Integração"
  ];
  return topics[(m - 1 + s) % topics.length];
}

export const CATEGORIES = seasonTitles.map((title, i) => `Temporada ${i + 1}: ${title}`);

export const MOCK_CONTENT: ContentItem[] = [];

for (let s = 0; s < 20; s++) {
  const seasonTheme = seasonVisualThemes[s];
  for (let m = 1; m <= 20; m++) {
    const id = `${s + 1}-${m}`;
    const ageRating = (['7+', '12+', 'Adulto'] as const)[(s + m) % 3];
    const type = (['video', 'interactive', 'game'] as const)[(s * m) % 3];
    const topic = getModuleTopic(m, s);
    const topicTag = topicKeywords[topic] || "technology";
    const query = `${topicTag},technology,${seasonTheme}`;
    const lockId = (s * 20) + m + 7000;
    const categoryName = topicToVideoCat[topic] || "AI_CORE";
    const videoPool = VIDEO_CATEGORIES[categoryName];
    const videoIndex = videoPool[(s + m) % videoPool.length];
    const videoUrl = STOCK_VIDEOS[videoIndex];

    let description = `Neste módulo da Temporada ${s + 1}, mergulhamos no conceito de ${topic.toLowerCase()}. Descubra como essa tecnologia está moldando o futuro através de exemplos práticos e simulações imersivas.`;

    // Special customization for the first module based on "Neurônios Digitais"
    if (id === '1-1') {
      description = "Bem-vindos ao primeiro módulo. A era dos neurônios digitais chegou. Explore como as simulações imersivas e a lógica neural estão moldando o futuro da inteligência artificial. Prepare-se para uma jornada onde a biologia encontra o código.";
    }

    MOCK_CONTENT.push({
      id,
      title: `Módulo ${m}: ${topic}`,
      thumbnail: `https://loremflickr.com/800/450/${query}?lock=${lockId}`,
      videoUrl: videoUrl,
      duration: type === 'video' ? `${5 + (m % 15)} min` : (type === 'game' ? 'Desafio' : 'Interativo'),
      description,
      category: CATEGORIES[s],
      ageRating,
      type,
      progress: m < 3 && s === 0 ? 100 : (m === 3 && s === 0 ? 45 : undefined)
    });
  }
}
