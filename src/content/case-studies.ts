import type { Lang } from '@/i18n';

export type Bilingual = { es: string; en: string };

export interface ArchNode {
  id: string;
  label: string;
  description: Bilingual;
}

export interface CaseStudy {
  slug: string;
  /** Show architecture diagram */
  hasArchitecture: boolean;
  problem?: Bilingual;
  role?: Bilingual;
  stack?: string[];
  decisions?: Bilingual[];
  results?: { label: Bilingual; value: string }[];
  architectureNodes?: ArchNode[];
  architectureEdges?: [string, string][];
}

/**
 * Only verified facts. Missing sections are omitted in the UI.
 */
export const caseStudies: Record<string, CaseStudy> = {
  'copa-relampago': {
    slug: 'copa-relampago',
    hasArchitecture: true,
    problem: {
      es: 'Gestionar torneos de fútbol amateur con fixtures, pagos, verificación de identidad y actualizaciones en tiempo real, sin perder consistencia entre paneles y tablas públicas.',
      en: 'Run amateur football tournaments with fixtures, payments, identity verification, and real-time updates—without losing consistency across admin panels and public standings.',
    },
    role: {
      es: 'Backend Developer: 100% del backend. ~600 commits en el repositorio.',
      en: 'Backend Developer: 100% of the backend. ~600 commits in the repository.',
    },
    stack: [
      'Node.js',
      'Express',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Socket.IO',
      'Redis',
      'Sentry',
      'Mercado Pago',
      'Firebase Auth',
    ],
    decisions: [
      {
        es: 'Prisma + PostgreSQL como fuente de verdad, con transacciones para eventos de partido.',
        en: 'Prisma + PostgreSQL as source of truth, with transactions for match events.',
      },
      {
        es: 'Redis para invalidar cachés de tablas tras cada cambio.',
        en: 'Redis to invalidate standings caches after each change.',
      },
      {
        es: 'Socket.IO para empujar actualizaciones a clientes conectados.',
        en: 'Socket.IO to push updates to connected clients.',
      },
      {
        es: 'Firebase Auth + roles, Mercado Pago para cobros, Sentry para errores en producción.',
        en: 'Firebase Auth + roles, Mercado Pago for payments, Sentry for production errors.',
      },
    ],
    results: [
      { label: { es: 'Modelos Prisma', en: 'Prisma models' }, value: '91' },
      { label: { es: 'Tests backend (archivos)', en: 'Backend test files' }, value: '69' },
      { label: { es: 'Tests frontend (archivos)', en: 'Frontend test files' }, value: '38' },
      { label: { es: 'CI', en: 'CI' }, value: 'Sí' },
      { label: { es: 'Commits (Joaquín)', en: 'Commits (Joaquín)' }, value: '~600' },
    ],
    architectureNodes: [
      {
        id: 'client',
        label: 'Client',
        description: {
          es: 'Paneles y tablas públicas que consumen la API y escuchan Socket.IO.',
          en: 'Admin panels and public standings that call the API and listen on Socket.IO.',
        },
      },
      {
        id: 'api',
        label: 'API',
        description: {
          es: 'Node.js + Express + TypeScript. Endpoints de torneos, partidos y eventos.',
          en: 'Node.js + Express + TypeScript. Tournament, match, and event endpoints.',
        },
      },
      {
        id: 'auth',
        label: 'Auth',
        description: {
          es: 'Firebase Auth con control de acceso por roles.',
          en: 'Firebase Auth with role-based access control.',
        },
      },
      {
        id: 'db',
        label: 'DB / Prisma',
        description: {
          es: 'PostgreSQL vía Prisma (91 modelos) y transacciones.',
          en: 'PostgreSQL via Prisma (91 models) and transactions.',
        },
      },
      {
        id: 'redis',
        label: 'Redis',
        description: {
          es: 'Caché e invalidación tras mutaciones.',
          en: 'Cache and invalidation after mutations.',
        },
      },
      {
        id: 'socket',
        label: 'Socket.IO',
        description: {
          es: 'Emite actualizaciones en tiempo real (p. ej. tabla_update).',
          en: 'Emits real-time updates (e.g. standings_update).',
        },
      },
      {
        id: 'external',
        label: 'External',
        description: {
          es: 'Mercado Pago (pagos) y Sentry (observabilidad).',
          en: 'Mercado Pago (payments) and Sentry (observability).',
        },
      },
    ],
    architectureEdges: [
      ['client', 'api'],
      ['api', 'auth'],
      ['api', 'db'],
      ['api', 'redis'],
      ['api', 'socket'],
      ['api', 'external'],
      ['socket', 'client'],
    ],
  },

  gnd: {
    slug: 'gnd',
    hasArchitecture: true,
    problem: {
      es: 'Necesidad de una API confiable para el e-commerce/gestión de Natural Design, con tests y un pipeline de deploy repetible hacia Hostinger.',
      en: 'Need for a reliable API for Natural Design’s storefront/ops, with tests and a repeatable deploy pipeline to Hostinger.',
    },
    role: {
      es: 'API REST: diseño y desarrollo.',
      en: 'REST API: design and development.',
    },
    stack: ['Docker', 'GitHub Actions'],
    decisions: [
      {
        es: 'Containerización con Docker para entornos consistentes.',
        en: 'Dockerized environments for consistency.',
      },
      {
        es: 'Deploy a Hostinger automatizado con GitHub Actions.',
        en: 'Automated deploy to Hostinger via GitHub Actions.',
      },
    ],
    results: [{ label: { es: 'Tests', en: 'Tests' }, value: '83' }],
    architectureNodes: [
      {
        id: 'client',
        label: 'Client',
        description: {
          es: 'Front de naturalonline.com.ar que consume la API.',
          en: 'naturalonline.com.ar front-end consuming the API.',
        },
      },
      {
        id: 'api',
        label: 'API',
        description: {
          es: 'API REST con cobertura de 83 tests.',
          en: 'REST API covered by 83 tests.',
        },
      },
      {
        id: 'auth',
        label: 'Auth',
        description: {
          es: 'Capa de autenticación/autorización de la API (ilustrativo).',
          en: 'API authentication/authorization layer (illustrative).',
        },
      },
      {
        id: 'db',
        label: 'DB',
        description: {
          es: 'Persistencia detrás de la API (ilustrativo).',
          en: 'Persistence behind the API (illustrative).',
        },
      },
      {
        id: 'ci',
        label: 'CI / Deploy',
        description: {
          es: 'GitHub Actions a Hostinger, con Docker.',
          en: 'GitHub Actions to Hostinger, with Docker.',
        },
      },
    ],
    architectureEdges: [
      ['client', 'api'],
      ['api', 'auth'],
      ['api', 'db'],
      ['ci', 'api'],
    ],
  },

  altiplano: {
    slug: 'altiplano',
    hasArchitecture: false,
    problem: {
      es: 'Reservas y experiencias turísticas en el noroeste argentino, con front y back conectados.',
      en: 'Tourism bookings and experiences in northwestern Argentina, with connected front and back ends.',
    },
    role: {
      es: 'Front y back: diseño y desarrollo.',
      en: 'Front end and back end: design and development.',
    },
  },

  maxshop: {
    slug: 'maxshop',
    hasArchitecture: false,
    problem: {
      es: 'E-commerce de colchones y hogar que necesita experiencia de compra e integraciones de envío y pago.',
      en: 'Mattress and home e-commerce that needs a solid shopping experience plus shipping and payment integrations.',
    },
    role: {
      es: 'Frontend e integraciones: Andreani (envíos) y Mercado Pago.',
      en: 'Frontend and integrations: Andreani (shipping) and Mercado Pago.',
    },
    stack: ['Andreani', 'Mercado Pago'],
  },

  loopin: {
    slug: 'loopin',
    hasArchitecture: false,
    problem: {
      es: 'Comercios que necesitan fidelizar clientes con una plataforma dedicada.',
      en: 'Businesses that need to retain customers with a dedicated loyalty platform.',
    },
    role: {
      es: 'Frontend Developer, participando en decisiones de producto.',
      en: 'Frontend Developer, participating in product decisions.',
    },
    // Stack omitted until owner-verified
  },

  landings: {
    slug: 'landings',
    hasArchitecture: false,
    role: {
      es: 'Frontend Developer en landings y sitios corporativos.',
      en: 'Frontend Developer on landing pages and corporate sites.',
    },
    stack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function tBi(value: Bilingual, lang: Lang): string {
  return value[lang];
}
