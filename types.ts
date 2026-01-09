
export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  description: string;
  category: string;
  ageRating: '7+' | '12+' | 'Adulto';
  type: 'video' | 'interactive' | 'game';
  progress?: number;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: 'cyan' | 'magenta' | 'yellow';
}

export interface UserProfile {
  name: string;
  avatar: string;
  role: 'child' | 'parent';
  xp: number;
  level: number;
  badges: string[]; // IDs of earned badges
}

export interface LearningStat {
  topic: string;
  mastery: number; // 0-100
  timeSpent: number; // minutes
}
