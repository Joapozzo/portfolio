import type { Lang } from '@/i18n';

interface DockProps {
  lang: Lang;
  labels: {
    home: string;
    projects: string;
    about: string;
    cv: string;
    contact: string;
  };
}

const icons = {
  home: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12 3.2 3.5 10.2V21h6.2v-6.2h4.6V21h6.2V10.2L12 3.2Z" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5A1.5 1.5 0 0 1 12 5.5v5A1.5 1.5 0 0 1 10.5 12h-5A1.5 1.5 0 0 1 4 10.5v-5Zm8.5 0A1.5 1.5 0 0 1 14 4h5A1.5 1.5 0 0 1 20.5 5.5v5A1.5 1.5 0 0 1 19 12h-5a1.5 1.5 0 0 1-1.5-1.5v-5ZM4 14a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 12 14v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 19v-5Zm8.5 0a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 12.5 19v-5Z" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Zm0 2.2c-3.7 0-7 1.9-7 4.2V20h14v-1.6c0-2.3-3.3-4.2-7-4.2Z" />
    </svg>
  ),
  cv: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M7 3.5A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.2L13.8 3.5H7Zm6 1.3 3.7 3.7H13V4.8ZM8.5 12h7v1.5h-7V12Zm0 3h7v1.5h-7V15Z" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Zm2.1.8 5.5 3.9a.8.8 0 0 0 .9 0l5.5-3.9H6.1Zm11.4 1.9-4.9 3.5a2.3 2.3 0 0 1-2.6 0L5.1 9.2V16.7h12.4V9.2Z" />
    </svg>
  ),
};

export default function Dock({ lang, labels }: DockProps) {
  const items = [
    { href: `/${lang}`, label: labels.home, icon: icons.home },
    { href: `/${lang}#projects`, label: labels.projects, icon: icons.projects },
    { href: `/${lang}/sobre-mi`, label: labels.about, icon: icons.about },
    { href: `/${lang}/cv`, label: labels.cv, icon: icons.cv },
    { href: `/${lang}/contacto`, label: labels.contact, icon: icons.contact },
  ];

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-6 z-40 hidden md:block"
      aria-label="Dock"
      data-testid="dock"
    >
      <div className="page-shell pointer-events-none flex justify-center">
      <ul className="pointer-events-auto glass flex items-end gap-2 rounded-[28px] px-3 py-2 shadow-[var(--shadow-dock)]">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="group focus-ring flex h-14 w-14 items-center justify-center rounded-[18px] text-[var(--fg)] transition-transform duration-200 hover:-translate-y-2 hover:scale-110"
              aria-label={item.label}
              title={item.label}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--fill)] text-[var(--accent)] shadow-sm">
                {item.icon}
              </span>
            </a>
          </li>
        ))}
      </ul>
      </div>
    </nav>
  );
}
