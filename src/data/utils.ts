export const TAGS = {
    NEXTJS: {
        name: "Next.js",
        class: "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
        icon: "simple-icons:nextdotjs",
    },
    TS: {
        name: "TypeScript",
        class: "bg-[#3178c6] text-white",
        icon: "simple-icons:typescript",
    },
    TW: {
        name: "Tailwind",
        class: "bg-[#06b6d4] text-white",
        icon: "simple-icons:tailwindcss",
    },
    NODE: {
        name: "Node.js",
        class: "bg-[#339933] text-white",
        icon: "simple-icons:nodedotjs",
    },
    PRISMA: {
        name: "Prisma",
        class: "bg-[#0c344b] text-white",
        icon: "simple-icons:prisma",
    },
    POSTGRES: {
        name: "PostgreSQL",
        class: "bg-[#4169e1] text-white",
        icon: "simple-icons:postgresql",
    },
    MYSQL: {
        name: "MySQL",
        class: "bg-[#4479a1] text-white",
        icon: "simple-icons:mysql",
    },
    REACT: {
        name: "React",
        class: "bg-[#61dafb] text-gray-900",
        icon: "simple-icons:react",
    },
    ASTRO: {
        name: "Astro",
        class: "bg-[#ff5d01] text-white",
        icon: "simple-icons:astro",
    },
};

export const CATEGORIES = {
    ALL: "todos",
    LANDING: "landing",
    APPS: "apps",
    CORPORATIVOS: "sitios corporativos",
    ECOMMERCE: "ecommerce",
} as const;