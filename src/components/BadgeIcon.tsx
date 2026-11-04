import { DistrictIcon } from './DistrictIcon';

interface Props {
  icon: string;
  color: string;
  size?: number;
  earned?: boolean;
  title?: string;
}

export function BadgeIcon({ icon, color, size = 44, earned = true, title }: Props) {
  return (
    <span
      className={`badge-icon${earned ? ' badge-icon--earned' : ''}`}
      style={{
        width: size,
        height: size,
        color,
        borderColor: earned ? color : 'rgba(15, 23, 42, 0.15)',
      }}
      title={title}
      role="img"
      aria-label={title ?? 'Rozet'}
    >
      <DistrictIcon icon={icon} size={size * 0.5} />
    </span>
  );
}
