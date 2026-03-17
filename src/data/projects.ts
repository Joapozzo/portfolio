import { TAGS } from "./utils";
import { CATEGORIES } from "./utils";

export const PROJECTS = [
    {
        title: "UCFA",
        description:
            "Sitio institucional y gestión para Unión Cordobesa de Fútbol Amateur.",
        progres: 100,
        link: "https://ucfa.com.ar",
        image: "/projects/ucfa.png",
        tags: [TAGS.NEXTJS, TAGS.TS, TAGS.NODE, TAGS.POSTGRES, TAGS.PRISMA],
        category: CATEGORIES.APPS,
        role: "fullstack",
    },
    {
        title: "Copa Relámpago - Gestión de torneos",
        description:
            "Sistema de gestión web para torneo de fútbol 7. Roles múltiples, fixture, resultados y más.",
        progres: 100,
        link: "https://coparelampago.com/",
        image: "/projects/coparelampago.png",
        tags: [TAGS.NEXTJS, TAGS.TS, TAGS.NODE, TAGS.POSTGRES, TAGS.PRISMA],
        category: CATEGORIES.APPS,
        role: "fullstack",
    },
    {
        title: "Loopin - App de fidelización",
        description:
            "Frontend desarrollado para una app de puntos y beneficios en restaurantes.",
        progres: 100,
        link: "https://loopin.com.ar/",
        image: "/projects/loopin.png",
        tags: [TAGS.NEXTJS, TAGS.TS, TAGS.TW],
        category: CATEGORIES.APPS,
        role: "frontend",
    },
    {
        title: "Altiplano Experience",
        description:
            "Expediciones y trekking en Argentina. Calendario de salidas, destinos y reservas.",
        progres: 100,
        link: "https://altiplanoexperience.com/",
        image: "/projects/altiplano.png",
        tags: [TAGS.NEXTJS, TAGS.TS, TAGS.NODE, TAGS.POSTGRES, TAGS.PRISMA],
        category: CATEGORIES.APPS,
        role: "fullstack",
    },
    // Ecommerce
    {
        title: "Maxshop",
        description:
            "Tienda online con catálogo y gestión de productos.",
        progres: 100,
        link: "https://maxshop.com.ar",
        image: "/projects/maxshop.png",
        tags: [TAGS.NEXTJS, TAGS.TS, TAGS.NODE, TAGS.POSTGRES, TAGS.PRISMA],
        category: CATEGORIES.ECOMMERCE,
        role: "fullstack",
    },
    {
        title: "GND - Grupo Natural Design",
        description:
            "Ecommerce para empresa de diseño de indumentaria corporativa.",
        progres: 80,
        link: "https://gruponaturaldesign-sigma.vercel.app/",
        image: "/projects/gnd.png",
        tags: [TAGS.NEXTJS, TAGS.TS, TAGS.NODE, TAGS.MYSQL, TAGS.PRISMA],
        category: CATEGORIES.ECOMMERCE,
        role: "fullstack",
    },
    // Sitios corporativos — solo NEXT, TS
    {
        title: "Duccó - Amoblamientos",
        description:
            "Sitio corporativo para mueblería: productos y servicios personalizados.",
        progres: 100,
        link: "https://www.amoblamientosducco.com.ar/",
        image: "/projects/ducco.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.CORPORATIVOS,
    },
    {
        title: "Rayces - Tienda de muebles",
        description:
            "Sitio corporativo para tienda de muebles a medida.",
        progres: 100,
        link: "https://www.mueblesrayces.com.ar/",
        image: "/projects/rayces.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.CORPORATIVOS,
    },
    // Landing
    {
        title: "Grupo BZN - Desarrolladora inmobiliaria",
        description:
            "Landing institucional con foco en branding e impacto visual. Córdoba.",
        progres: 100,
        link: "https://www.bznurbanmaking.com.ar/",
        image: "/projects/bzn.png",
        tags: [TAGS.ASTRO],
        category: CATEGORIES.LANDING,
    },
    {
        title: "Gentío - Agencia de comunicación",
        description:
            "Landing desarrollada a medida según identidad visual y análisis de competencia.",
        progres: 100,
        link: "https://gentiomkt.com/es",
        image: "/projects/gentio.png",
        tags: [TAGS.REACT],
        category: CATEGORIES.LANDING,
    },
    {
        title: "Grupo Rennella - Publicidad OOH",
        description:
            "Landing para empresa con más de 60 años en medios publicitarios.",
        progres: 100,
        link: "https://www.gruporennella.com.ar/",
        image: "/projects/rennella.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.LANDING,
    },
    {
        title: "Florencia Diz - Consultorio odontológico",
        description:
            "Landing para consultorio odontológico en Córdoba. Agenda y servicios.",
        progres: 100,
        link: "https://www.ortodoncia-florenciadiz.com/",
        image: "/projects/flordiz.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.LANDING,
    },
    {
        title: "Me gusta lo que hago",
        description:
            "Proyecto audiovisual. Landing con temporadas y episodios.",
        progres: 100,
        link: "https://mglqh.vercel.app/",
        image: "/projects/mglqh.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.LANDING,
    },
    {
        title: "Quantiva Group",
        description:
            "Landing para importador mayorista de termos y productos térmicos. Argentina.",
        progres: 100,
        link: "https://quantivagroup.com.ar/",
        image: "/projects/quantiva.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.LANDING,
    },
    {
        title: "ZC Seguridad",
        description:
            "Sistemas de alarma AJAX en Córdoba. Diagnóstico, instalación y app.",
        progres: 100,
        link: "https://zcseguridad.vercel.app/",
        image: "/projects/zc.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.LANDING,
    },
    {
        title: "Sommier World",
        description:
            "Colchones y sommiers premium en Córdoba. Marcas y sucursales.",
        progres: 100,
        link: "https://www.sommierworld.com/",
        image: "/projects/sommierworld.png",
        tags: [TAGS.NEXTJS, TAGS.TS],
        category: CATEGORIES.LANDING,
    },
];