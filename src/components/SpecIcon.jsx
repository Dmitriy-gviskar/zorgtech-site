/** Thin line icons for real product spec fields only. */

const ICONS = {
  display: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="1.5" />
      <path d="M9 19h6" />
    </>
  ),
  weight: (
    <>
      <path d="M8 8.5h8l1.2 10.2a1.5 1.5 0 0 1-1.5 1.8H8.3a1.5 1.5 0 0 1-1.5-1.8L8 8.5Z" />
      <path d="M10 8.5V7a2 2 0 0 1 4 0v1.5" />
    </>
  ),
  install: (
    <>
      <path d="M6 20V9l6-4 6 4v11" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  touch: (
    <>
      <path d="M9 11.5V7.2a1.7 1.7 0 0 1 3.4 0V12" />
      <path d="M12.4 12V8.8a1.4 1.4 0 0 1 2.8 0V13" />
      <path d="M15.2 13v-2.4a1.2 1.2 0 0 1 2.4 0V15c0 2.8-1.8 5-4.6 5H12a5 5 0 0 1-5-5v-3.2a1.5 1.5 0 0 1 3 0V13" />
    </>
  ),
  brightness: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" />
    </>
  ),
  memory: (
    <>
      <rect x="4" y="7" width="16" height="10" rx="1.5" />
      <path d="M8 7v10M12 7v10M16 7v10M7 4.5v2.5M11 4.5v2.5M15 4.5v2.5M7 17v2.5M11 17v2.5M15 17v2.5" />
    </>
  ),
  cpu: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.2" />
      <path d="M10 7V4.5M14 7V4.5M10 19.5V17M14 19.5V17M7 10H4.5M7 14H4.5M19.5 10H17M19.5 14H17" />
      <rect x="10" y="10" width="4" height="4" rx="0.6" />
    </>
  ),
  size: (
    <>
      <path d="M5 19V5h14" />
      <path d="M5 19h14" />
      <path d="M8 16l8-8" />
    </>
  ),
  material: (
    <>
      <path d="M4.5 16.5 12 4.5l7.5 12H4.5Z" />
      <path d="M8.2 16.5 12 10.2l3.8 6.3" />
    </>
  ),
  power: (
    <>
      <path d="M13 3.5 7.5 13h4.2L11 20.5 16.5 11h-4.2L13 3.5Z" />
    </>
  ),
  audio: (
    <>
      <path d="M5 10v4h3l4 3.5V6.5L8 10H5Z" />
      <path d="M15.2 9.2a3.2 3.2 0 0 1 0 5.6" />
      <path d="M17.4 7a5.5 5.5 0 0 1 0 10" />
    </>
  ),
  wifi: (
    <>
      <path d="M4.8 9.2a10 10 0 0 1 14.4 0" />
      <path d="M7.6 12a6 6 0 0 1 8.8 0" />
      <path d="M10.4 14.8a2.4 2.4 0 0 1 3.2 0" />
      <circle cx="12" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  ports: (
    <>
      <rect x="3.5" y="8" width="17" height="8" rx="1.5" />
      <path d="M7 11.5h2.2M11 11.5h2.2M15 11.5h2.2" />
    </>
  ),
  storage: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="1.5" />
      <path d="M5 10h14M5 15h14M9 5v5M9 15v4" />
    </>
  ),
  ratio: (
    <>
      <rect x="4" y="7" width="16" height="10" rx="1.2" />
      <path d="M8 17.5 16 6.5" />
    </>
  ),
};

/** Map scraped/glance label → icon id. Returns null if no match. */
export function resolveSpecIcon(label) {
  const t = String(label || '')
    .toLowerCase()
    .replace(/ё/g, 'е');
  if (!t) return null;
  if (/диагонал|монитор|разрешен/.test(t)) return 'display';
  if (/вес/.test(t)) return 'weight';
  if (/установ/.test(t)) return 'install';
  if (/касани|сенсор|мультитач|метод ввода/.test(t)) return 'touch';
  if (/яркост/.test(t)) return 'brightness';
  if (/памят|озу/.test(t)) return 'memory';
  if (/процессор|ядер|материнск/.test(t)) return 'cpu';
  if (/габарит|высота|ширина|глубина|толщина/.test(t)) return 'size';
  if (/материал/.test(t)) return 'material';
  if (/энергопотреб/.test(t)) return 'power';
  if (/аудио|динамик/.test(t)) return 'audio';
  if (/wi-?fi|беспровод/.test(t)) return 'wifi';
  if (/порт|разъем/.test(t)) return 'ports';
  if (/жестк|ssd|диск|накоп/.test(t)) return 'storage';
  if (/соотношен|сторон/.test(t)) return 'ratio';
  return null;
}

export default function SpecIcon({ name, className = '' }) {
  const id = typeof name === 'string' && ICONS[name] ? name : resolveSpecIcon(name);
  const paths = id ? ICONS[id] : null;
  if (!paths) return null;
  return (
    <svg
      className={`spec-icon${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
