import { describe, expect, it } from 'vitest';
import {
  createInitialData,
  districtStats,
  overallStats,
  recordResult,
  sanitizeData,
  starsFor,
  teamScores,
} from './progress';

describe('starsFor', () => {
  it('doğru oranına göre 0–3 yıldız verir', () => {
    expect(starsFor(0, 10)).toBe(0);
    expect(starsFor(3, 10)).toBe(0);
    expect(starsFor(4, 10)).toBe(1);
    expect(starsFor(6, 10)).toBe(1);
    expect(starsFor(7, 10)).toBe(2);
    expect(starsFor(8, 10)).toBe(2);
    expect(starsFor(9, 10)).toBe(3);
    expect(starsFor(10, 10)).toBe(3);
    expect(starsFor(0, 0)).toBe(0);
  });
});

describe('ilerleme ve puanlama', () => {
  it('ilk durumda puan, rozet ve tamamlanma yoktur', () => {
    const data = createInitialData();
    const overall = overallStats(data, 'individual');
    expect(overall.total).toBe(60);
    expect(overall.answered).toBe(0);
    expect(overall.score).toBe(0);
    expect(overall.badges).toBe(0);
    expect(overall.allComplete).toBe(false);
  });

  it('bireysel sonuçları kaydeder ve bölge istatistiğini günceller', () => {
    let data = createInitialData();
    data = recordResult(data, 'individual', 'teknoloji-01', {
      correct: true,
      earned: 100,
      hintUsed: false,
    });
    const stat = districtStats(data, 'individual', 'teknoloji');
    expect(stat.answered).toBe(1);
    expect(stat.correct).toBe(1);
    expect(stat.score).toBe(100);
    expect(stat.completed).toBe(false);
    expect(data.progress.individual.results['teknoloji-01'].earned).toBe(100);
  });

  it('takım modunda sırayı döndürür ve takım puanlarını ayrı tutar', () => {
    let data = createInitialData();
    data = recordResult(data, 'team', 'teknoloji-01', {
      correct: true,
      earned: 100,
      hintUsed: false,
      teamId: 'team-1',
    });
    expect(data.progress.team.activeTeamIndex).toBe(1);
    data = recordResult(data, 'team', 'teknoloji-02', {
      correct: false,
      earned: 0,
      hintUsed: false,
      teamId: 'team-2',
    });
    expect(data.progress.team.activeTeamIndex).toBe(2);
    const scores = teamScores(data);
    expect(scores[0].score).toBe(100);
    expect(scores[1].score).toBe(0);
    expect(scores[2].score).toBe(0);
  });

  it('son takımdan sonra sıra ilk takıma döner', () => {
    let data = createInitialData();
    data.progress.team.teams = [
      { id: 'team-1', name: 'A' },
      { id: 'team-2', name: 'B' },
    ];
    data.progress.team.activeTeamIndex = 1;
    data = recordResult(data, 'team', 'toplum-01', {
      correct: true,
      earned: 100,
      hintUsed: false,
      teamId: 'team-2',
    });
    expect(data.progress.team.activeTeamIndex).toBe(0);
  });
});

describe('sanitizeData', () => {
  it('bozuk veride güvenli başlangıç durumuna döner', () => {
    const data = sanitizeData({ mode: 'bilinmeyen', settings: 'x', progress: null });
    expect(data.mode).toBe('individual');
    expect(data.progress.individual.results).toEqual({});
    expect(data.progress.team.teams.length).toBeGreaterThanOrEqual(2);
  });

  it('geçerli ayarları ve sonuçları korur', () => {
    const initial = createInitialData();
    const data = sanitizeData({
      ...initial,
      mode: 'team',
      settings: { sound: false, reducedMotion: true },
      progress: {
        ...initial.progress,
        team: {
          ...initial.progress.team,
          results: {
            'teknoloji-01': { correct: true, earned: 100, hintUsed: false, teamId: 'team-2' },
          },
        },
      },
    });
    expect(data.mode).toBe('team');
    expect(data.settings).toEqual({ sound: false, reducedMotion: true });
    expect(data.progress.team.results['teknoloji-01'].teamId).toBe('team-2');
  });

  it('negatif puanları ve geçersiz takım indeksini düzeltir', () => {
    const initial = createInitialData();
    const data = sanitizeData({
      ...initial,
      progress: {
        ...initial.progress,
        team: {
          ...initial.progress.team,
          activeTeamIndex: 99,
          results: {
            'teknoloji-01': { correct: true, earned: -500, hintUsed: 'evet' },
          },
        },
      },
    });
    expect(data.progress.team.activeTeamIndex).toBe(data.progress.team.teams.length - 1);
    expect(data.progress.team.results['teknoloji-01'].earned).toBe(0);
    expect(data.progress.team.results['teknoloji-01'].hintUsed).toBe(true);
  });
});
