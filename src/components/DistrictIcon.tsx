interface Props {
  icon: string;
  size?: number;
  className?: string;
}

export function DistrictIcon({ icon, size = 24, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };

  switch (icon) {
    case 'chip':
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <rect x="10" y="10" width="4" height="4" rx="0.8" />
          <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" />
          <circle cx="3" cy="3" r="1.1" />
          <circle cx="21" cy="21" r="1.1" />
        </svg>
      );
    case 'people':
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <path d="M6.5 20v-1.5A5.5 5.5 0 0 1 12 13a5.5 5.5 0 0 1 5.5 5.5V20" />
          <circle cx="5" cy="8.5" r="2.1" />
          <path d="M2 18.5v-1a4 4 0 0 1 4-4" />
          <circle cx="19" cy="8.5" r="2.1" />
          <path d="M22 18.5v-1a4 4 0 0 0-4-4" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6v5.2c0 4.3 2.9 7.6 7 9.8 4.1-2.2 7-5.5 7-9.8V6l-7-3Z" />
          <path d="m9 11.8 2.1 2.2L15.4 9.6" />
        </svg>
      );
    case 'brain':
      return (
        <svg {...common}>
          <path d="M9.5 4.5A3 3 0 0 0 6.7 8a3.2 3.2 0 0 0-1.5 5.6A3 3 0 0 0 8 19h1.5V4.5Z" />
          <path d="M14.5 4.5A3 3 0 0 1 17.3 8a3.2 3.2 0 0 1 1.5 5.6A3 3 0 0 1 16 19h-1.5V4.5Z" />
          <path d="M9.5 9h-2M14.5 9h2M9.5 14h-2M14.5 14h2M12 5v14" />
          <circle cx="19.5" cy="5" r="1" />
          <circle cx="4.5" cy="16" r="1" />
        </svg>
      );
    case 'computer':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
          <path d="M7 8h5M7 11h3" />
          <circle cx="16.5" cy="9" r="1.4" />
        </svg>
      );
    case 'folder':
      return (
        <svg {...common}>
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7v8.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-11Z" />
          <path d="M3 10h18M8 14h5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
