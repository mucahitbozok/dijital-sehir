interface Props {
  value: number;
  max?: number;
  size?: number;
  label?: string;
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={filled ? 'star star--filled' : 'star'}
    >
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95L12 2.6Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stars({ value, max = 3, size = 20, label }: Props) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${value} / ${max} yıldız`}>
      {Array.from({ length: max }, (_, index) => (
        <Star key={index} filled={index < value} size={size} />
      ))}
    </span>
  );
}
