import character from '../assets/brand/ogretmen-bozok-karakter.png';

interface Props {
  message: string;
  compact?: boolean;
}

export function CharacterGuide({ message, compact = false }: Props) {
  return (
    <aside className={`guide${compact ? ' guide--compact' : ''}`} aria-label="Öğretmen Bozok rehber">
      <div className="guide__bubble">
        <span className="guide__name">Öğretmen Bozok</span>
        <p>{message}</p>
      </div>
      <img
        src={character}
        alt="Öğretmen Bozok karakteri"
        className="guide__image"
        draggable={false}
        loading="eager"
        fetchPriority="high"
      />
    </aside>
  );
}
