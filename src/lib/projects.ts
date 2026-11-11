export type Lang = 'es' | 'en';

export interface ProjectMetric {
  label: { es: string; en: string };
  value: string;
  verified: boolean;
}

export interface ProjectLink {
  type: 'live' | 'code' | 'case';
  url: string;
  label?: { es: string; en: string };
}

export interface ProjectData {
  order: number;
  slug: string;
  title: { es: string; en: string };
  summary: { es: string; en: string };
  role: { es: string; en: string };
  stack: string[];
  metrics?: ProjectMetric[];
  links?: ProjectLink[];
  embedPolicy: 'live' | 'video' | 'api';
  embedUrl?: string;
  status: 'active' | 'development' | 'maintenance';
  featured: boolean;
  clientPermission: boolean;
  tint: string;
  screenshots: {
    mac: string[];
    ipad: string[];
    iphone: string[];
  };
  serverFlow?: { es: string; en: string }[];
}

export const PROJECT_TINTS: Record<string, string> = {
  'copa-relampago': '#30D158',
  loopin: '#BF5AF2',
  gnd: '#FF9F0A',
  altiplano: '#64D2FF',
  maxshop: '#0A84FF',
  landings: '#FF375F',
};

export function getTint(slug: string): string {
  return PROJECT_TINTS[slug] ?? '#0A84FF';
}
