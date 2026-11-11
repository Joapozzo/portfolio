import type { Lang } from '@/i18n';

interface BottomTabBarProps {
  lang: Lang;
  currentPath: string;
  labels: {
    home: string;
    projects: string;
    about: string;
    contact: string;
  };
}

export default function BottomTabBar({ lang, currentPath, labels }: BottomTabBarProps) {
  const tabs = [
    { href: `/${lang}`, label: labels.home, match: (p: string) => p === `/${lang}` || p === `/${lang}/` },
    {
      href: `/${lang}#projects`,
      label: labels.projects,
      match: (p: string) => p.includes('/proyectos'),
    },
    {
      href: `/${lang}/sobre-mi`,
      label: labels.about,
      match: (p: string) => p.includes('/sobre-mi'),
    },
    {
      href: `/${lang}/contacto`,
      label: labels.contact,
      match: (p: string) => p.includes('/contacto'),
    },
  ];

  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-[var(--separator)] md:hidden mb-safe"
      aria-label="Tab bar"
    >
      <ul className="page-shell grid grid-cols-4 pt-[var(--space-2)] pb-[var(--space-3)]">
        {tabs.map((tab) => {
          const active = tab.match(currentPath);
          return (
            <li key={tab.href}>
              <a
                href={tab.href}
                className={`focus-ring flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium ${
                  active ? 'text-[var(--accent)]' : 'text-[var(--fg-secondary)]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[var(--accent)]' : 'bg-transparent'}`}
                  aria-hidden="true"
                />
                {tab.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
