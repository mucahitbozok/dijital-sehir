import type { Team } from '../types';

interface Props {
  scores: { team: Team; score: number }[];
  activeTeamId?: string;
  onOpenTeams: () => void;
}

export function TeamBar({ scores, activeTeamId, onOpenTeams }: Props) {
  if (scores.length === 0) {
    return (
      <div className="team-bar">
        <span className="team-bar__empty">Takım modu için takımları oluştur.</span>
        <button type="button" className="btn btn--soft btn--small" onClick={onOpenTeams}>
          Takımları oluştur
        </button>
      </div>
    );
  }

  return (
    <div className="team-bar" aria-label="Takım puanları">
      <span className="team-bar__title">Sıra</span>
      <div className="team-bar__list">
        {scores.map(({ team, score }, index) => {
          const active = team.id === activeTeamId;
          return (
            <div
              key={team.id}
              className={`team-chip${active ? ' team-chip--active' : ''}`}
              aria-current={active ? 'true' : undefined}
            >
              <span className="team-chip__name">
                {active && (
                  <span className="team-chip__play" aria-label="Sıradaki takım">
                    ▶
                  </span>
                )}
                {team.name || `Takım ${index + 1}`}
              </span>
              <span className="team-chip__score">{score}</span>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn--soft btn--small" onClick={onOpenTeams}>
        Düzenle
      </button>
    </div>
  );
}
