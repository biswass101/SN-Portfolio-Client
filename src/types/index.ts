export interface Profile {
  _id: string;
  name: string;
  title: string;
  subtitle: string;
  bio: string[];
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  photo: string;
  resume: string;
  availableForWork: boolean;
  stats: { label: string; value: string }[];
  languages: { language: string; proficiency: string }[];
  highlights: { label: string; value: string; icon: string }[];
}

export interface Project {
  _id: string;
  title: string;
  tag: string;
  description: string;
  impact: string;
  icon: string;
  image: string;
  techStack: string[];
  order: number;
  isVisible: boolean;
  createdAt: string;
}

export interface Experience {
  _id: string;
  company: string;
  location: string;
  period: string;
  role: string;
  progression: string;
  bullets: string[];
  projects: string[];
  order: number;
  isVisible: boolean;
  createdAt: string;
}

export interface Skill {
  _id: string;
  title: string;
  text: string;
  icon: string;
  category: string;
  order: number;
  isVisible: boolean;
}

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  description: string;
  order: number;
  isVisible: boolean;
}

export interface Certification {
  _id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  order: number;
  isVisible: boolean;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  ip: string;
  createdAt: string;
}

export interface DashboardStats {
  counts: {
    totalProjects: number;
    visibleProjects: number;
    totalExperiences: number;
    totalSkills: number;
    totalMessages: number;
    newMessages: number;
    repliedMessages: number;
  };
  charts: {
    messagesChart: { month: string; count: number }[];
    statusDistribution: { name: string; value: number }[];
    projectsByTag: { tag: string; count: number }[];
  };
  recentMessages: ContactMessage[];
}
