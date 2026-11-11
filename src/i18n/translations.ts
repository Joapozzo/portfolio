export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    // Meta
    'meta.title': 'Joaquín Pozzo | Backend & Full Stack Developer',
    'meta.description':
      'Desarrollador Backend & Full Stack especializado en Node.js, TypeScript y PostgreSQL. Desarrollador web en Gentío MKT desde 2023.',

    // Navigation
    'nav.home': 'Inicio',
    'nav.projects': 'Proyectos',
    'nav.about': 'Sobre mí',
    'nav.cv': 'CV',
    'nav.contact': 'Contacto',

    // Theme
    'theme.light': 'Tema claro',
    'theme.dark': 'Tema oscuro',
    'theme.system': 'Sistema',

    // Accessibility
    'a11y.skipToContent': 'Saltar al contenido principal',
    'a11y.reduceMotion': 'Reducir movimiento',
    'a11y.motionEnabled': 'Animaciones activadas',
    'a11y.motionDisabled': 'Animaciones desactivadas',

    // Home
    'home.greeting': '¡Hola! Soy',
    'home.role': 'Backend & Full Stack Developer',
    'home.tagline': 'Construyo aplicaciones robustas con Node.js, TypeScript y PostgreSQL',
    'home.yearsNote': 'Desarrollador web en Gentío MKT desde 2023',
    'home.cta.projects': 'Ver proyectos',
    'home.cta.cv': 'Descargar CV',
    'home.available': 'Abierto a oportunidades Frontend, Backend y Full Stack',
    'home.featured': 'Destacados',
    'home.openProject': 'Ver proyecto',

    // Carousel
    'carousel.title': 'Proyectos destacados',
    'carousel.prev': 'Proyecto anterior',
    'carousel.next': 'Siguiente proyecto',
    'carousel.goTo': 'Ir al proyecto',
    'carousel.openCinema': 'Abrir modo cine',

    // Cinema mode
    'cinema.title': 'Modo cine',
    'cinema.close': 'Cerrar',
    'cinema.desktop': 'Mac',
    'cinema.tablet': 'iPad',
    'cinema.mobile': 'iPhone',
    'cinema.console': 'Servidor',
    'cinema.consolePlaceholder': 'Aquí se mostrará el flujo de datos en tiempo real...',
    'cinema.liveDemo': 'Probar en vivo',
    'cinema.videoFallback': 'Video de demostración',
    'cinema.loading': 'Cargando...',
    'cinema.error': 'Error al cargar. Intenta abrir el sitio directamente.',
    'cinema.openExternal': 'Abrir sitio',
    'cinema.gallery': 'Galería',
    'cinema.illustrative': 'Ilustrativo',

    // Projects
    'projects.viewCase': 'Ver caso de estudio',
    'projects.viewCode': 'Ver código',
    'projects.viewLive': 'Ver en vivo',
    'projects.role': 'Rol',
    'projects.stack': 'Stack',
    'projects.metrics': 'Métricas',
    'projects.status': 'Estado',
    'projects.statusActive': 'En producción',
    'projects.statusDevelopment': 'En desarrollo',
    'projects.statusMaintenance': 'En mantenimiento',
    'projects.back': 'Proyectos',
    'projects.problem': 'Problema',
    'projects.myRole': 'Mi rol',
    'projects.architecture': 'Arquitectura',
    'projects.decisions': 'Decisiones',
    'projects.results': 'Resultados',
    'projects.tapNode': 'Tocá un nodo para ver qué hace.',
    'projects.openLive': 'Ver en vivo',
    'projects.cinema': 'Modo cine',
    'projects.play': 'Reproducir',
    'projects.pause': 'Pausa',
    'projects.replay': 'Reiniciar',

    // Footer
    'footer.madeWith': 'Hecho con',
    'footer.and': 'y',
    'footer.inCordoba': 'en Córdoba, Argentina',
    'footer.copyright': '© 2026 Joaquín Pozzo. Todos los derechos reservados.',

    // 404
    'error.notFound': 'Página no encontrada',
    'error.notFoundDescription': 'La página que buscas no existe.',
    'error.goHome': 'Volver al inicio',

    // About
    'about.title': 'Sobre mí',
    'about.description': 'Conoce más sobre mi trayectoria y experiencia.',

    // CV
    'cv.title': 'Curriculum Vitae',
    'cv.download': 'Descargar PDF',

    // Contact
    'contact.title': 'Contacto',
    'contact.description': '¿Tienes un proyecto en mente? Hablemos.',
    'contact.name': 'Nombre',
    'contact.email': 'Email',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar',
    'contact.sending': 'Enviando…',
    'contact.success': 'Listo. Te respondo pronto.',
    'contact.error': 'No se pudo enviar. Probá de nuevo o usá el mail.',
    'contact.mailtoFallback': 'Abrir mail',

    // Chat
    'chat.open': 'Abrir Joaquín AI',
    'chat.title': 'Joaquín AI',
    'chat.close': 'Cerrar chat',
    'chat.placeholder': 'Preguntame sobre proyectos o stack…',
    'chat.send': 'Enviar',
    'chat.disclaimer': 'Asistente IA basado en la info verificada del sitio.',
    'chat.soonTitle': 'Próximamente',
    'chat.soonBody':
      'Joaquín AI todavía no está conectado. Mientras tanto, escribinme por email.',
    'chat.emailCta': 'Escribime',
    'chat.errorGeneric': 'Hubo un problema. Probá de nuevo o escribinos por mail.',
    'chat.limitHint': 'Hasta 5 mensajes/día · respuestas solo sobre Joaquín.',
  },
  en: {
    // Meta
    'meta.title': 'Joaquín Pozzo | Backend & Full Stack Developer',
    'meta.description':
      'Backend & Full Stack Developer specializing in Node.js, TypeScript, and PostgreSQL. Web developer at Gentío MKT since 2023.',

    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.cv': 'CV',
    'nav.contact': 'Contact',

    // Theme
    'theme.light': 'Light theme',
    'theme.dark': 'Dark theme',
    'theme.system': 'System',

    // Accessibility
    'a11y.skipToContent': 'Skip to main content',
    'a11y.reduceMotion': 'Reduce motion',
    'a11y.motionEnabled': 'Animations enabled',
    'a11y.motionDisabled': 'Animations disabled',

    // Home
    'home.greeting': 'Hi! I\'m',
    'home.role': 'Backend & Full Stack Developer',
    'home.tagline': 'Building robust applications with Node.js, TypeScript, and PostgreSQL',
    'home.yearsNote': 'Web developer at Gentío MKT since 2023',
    'home.cta.projects': 'View projects',
    'home.cta.cv': 'Download CV',
    'home.available': 'Open to Frontend, Backend & Full Stack roles',
    'home.featured': 'Featured',
    'home.openProject': 'View project',

    // Carousel
    'carousel.title': 'Featured projects',
    'carousel.prev': 'Previous project',
    'carousel.next': 'Next project',
    'carousel.goTo': 'Go to project',
    'carousel.openCinema': 'Open cinema mode',

    // Cinema mode
    'cinema.title': 'Cinema mode',
    'cinema.close': 'Close',
    'cinema.desktop': 'Mac',
    'cinema.tablet': 'iPad',
    'cinema.mobile': 'iPhone',
    'cinema.console': 'Server',
    'cinema.consolePlaceholder': 'Real-time data flow will be displayed here...',
    'cinema.liveDemo': 'Try live',
    'cinema.videoFallback': 'Demo video',
    'cinema.loading': 'Loading...',
    'cinema.error': 'Failed to load. Try opening the site directly.',
    'cinema.openExternal': 'Open site',
    'cinema.gallery': 'Gallery',
    'cinema.illustrative': 'Illustrative',

    // Projects
    'projects.viewCase': 'View case study',
    'projects.viewCode': 'View code',
    'projects.viewLive': 'View live',
    'projects.role': 'Role',
    'projects.stack': 'Tech stack',
    'projects.metrics': 'Metrics',
    'projects.status': 'Status',
    'projects.statusActive': 'In production',
    'projects.statusDevelopment': 'In development',
    'projects.statusMaintenance': 'In maintenance',
    'projects.back': 'Projects',
    'projects.problem': 'Problem',
    'projects.myRole': 'My role',
    'projects.architecture': 'Architecture',
    'projects.decisions': 'Decisions',
    'projects.results': 'Results',
    'projects.tapNode': 'Tap a node to see what it does.',
    'projects.openLive': 'View live',
    'projects.cinema': 'Cinema mode',
    'projects.play': 'Play',
    'projects.pause': 'Pause',
    'projects.replay': 'Replay',

    // Footer
    'footer.madeWith': 'Made with',
    'footer.and': 'and',
    'footer.inCordoba': 'in Córdoba, Argentina',
    'footer.copyright': '© 2026 Joaquín Pozzo. All rights reserved.',

    // 404
    'error.notFound': 'Page not found',
    'error.notFoundDescription': 'The page you\'re looking for doesn\'t exist.',
    'error.goHome': 'Go home',

    // About
    'about.title': 'About me',
    'about.description': 'Learn more about my journey and experience.',

    // CV
    'cv.title': 'Curriculum Vitae',
    'cv.download': 'Download PDF',

    // Contact
    'contact.title': 'Contact',
    'contact.description': 'Have a project in mind? Let\'s talk.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.sending': 'Sending…',
    'contact.success': 'Sent. I’ll get back to you soon.',
    'contact.error': 'Could not send. Try again or use email.',
    'contact.mailtoFallback': 'Open mail',

    // Chat
    'chat.open': 'Open Joaquín AI',
    'chat.title': 'Joaquín AI',
    'chat.close': 'Close chat',
    'chat.placeholder': 'Ask about projects or stack…',
    'chat.send': 'Send',
    'chat.disclaimer': 'AI assistant based on verified site info.',
    'chat.soonTitle': 'Coming soon',
    'chat.soonBody':
      'Joaquín AI isn’t connected yet. In the meantime, email me.',
    'chat.emailCta': 'Email me',
    'chat.errorGeneric': 'Something went wrong. Try again or email me.',
    'chat.limitHint': 'Up to 5 messages/day · answers only about Joaquín.',
  },
} as const;

export type TranslationKey = keyof (typeof ui)['es'];
