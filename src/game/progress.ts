import type {
  AppData,
  DistrictId,
  Mode,
  ModeProgress,
  Settings,
  TaskResult,
  Team,
} from '../types';
import { DISTRICTS } from '../data/districts';
import { TASK_BY_ID, tasksOf } from '../data/tasks';
import { shuffle } from '../utils/shuffle';

export const STORAGE_KEY = 'dijital-sehir:data:v1';
export const TASKS_PER_DISTRICT = 10;

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  reducedMotion: false,
};

export const DEFAULT_TEAMS: Team[] = [
  { id: 'team-1', name: 'Takım 1' },
  { id: 'team-2', name: 'Takım 2' },
  { id: 'team-3', name: 'Takım 3' },
];

export function makeTaskOrders(): Record<DistrictId, string[]> {
  return DISTRICTS.reduce(
    (acc, district) => {
      acc[district.id] = shuffle(tasksOf(district.id).map((task) => task.id));
      return acc;
    },
    {} as Record<DistrictId, string[]>,
  );
}

export function createProgress(): ModeProgress {
  return { results: {}, taskOrder: makeTaskOrders() };
}

export function createInitialData(): AppData {
  return {
    version: 1,
    mode: 'individual',
    settings: { ...DEFAULT_SETTINGS },
    progress: {
      individual: createProgress(),
      team: {
        teams: DEFAULT_TEAMS.map((team) => ({ ...team })),
        activeTeamIndex: 0,
        results: {},
        taskOrder: makeTaskOrders(),
      },
    },
  };
}

export function progressFor(data: AppData, mode: Mode): ModeProgress {
  return mode === 'team' ? data.progress.team : data.progress.individual;
}

export function teamScores(data: AppData): { team: Team; score: number }[] {
  return data.progress.team.teams.map((team) => ({
    team,
    score: Object.values(data.progress.team.results)
      .filter((result) => result.teamId === team.id)
      .reduce((sum, result) => sum + result.earned, 0),
  }));
}

export interface DistrictStats {
  districtId: DistrictId;
  total: number;
  answered: number;
  correct: number;
  score: number;
  stars: number;
  completed: boolean;
  badge: boolean;
}

export function districtStats(
  data: AppData,
  mode: Mode,
  districtId: DistrictId,
): DistrictStats {
  const progress = progressFor(data, mode);
  const tasks = tasksOf(districtId);
  const results = tasks
    .map((task) => progress.results[task.id])
    .filter((result): result is TaskResult => Boolean(result));
  const correct = results.filter((result) => result.correct).length;
  const answered = results.length;
  const total = TASKS_PER_DISTRICT;
  const stars = starsFor(correct, total);
  const completed = answered >= total;

  return {
    districtId,
    total,
    answered,
    correct,
    score: results.reduce((sum, result) => sum + result.earned, 0),
    stars,
    completed,
    badge: completed,
  };
}

export function starsFor(correct: number, total: number): number {
  if (total <= 0) return 0;
  const ratio = correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.4) return 1;
  return 0;
}

export interface OverallStats {
  total: number;
  answered: number;
  correct: number;
  score: number;
  stars: number;
  badges: number;
  completedDistricts: DistrictId[];
  allComplete: boolean;
}

export function overallStats(data: AppData, mode: Mode): OverallStats {
  const all = DISTRICTS.map((district) => districtStats(data, mode, district.id));
  const completedDistricts = all.filter((stat) => stat.completed).map((stat) => stat.districtId);
  return {
    total: all.reduce((sum, stat) => sum + stat.total, 0),
    answered: all.reduce((sum, stat) => sum + stat.answered, 0),
    correct: all.reduce((sum, stat) => sum + stat.correct, 0),
    score: all.reduce((sum, stat) => sum + stat.score, 0),
    stars: all.reduce((sum, stat) => sum + stat.stars, 0),
    badges: completedDistricts.length,
    completedDistricts,
    allComplete: completedDistricts.length === DISTRICTS.length,
  };
}

export function recordResult(
  data: AppData,
  mode: Mode,
  taskId: string,
  result: TaskResult,
): AppData {
  if (mode === 'team') {
    const team = data.progress.team;
    const lastTeam = team.teams.findIndex((item) => item.id === result.teamId);
    if (lastTeam !== -1) {
      result = { ...result, teamId: team.teams[lastTeam].id };
    }
    const nextIndex = team.teams.length > 0
      ? (Math.max(team.activeTeamIndex, 0) + 1) % team.teams.length
      : 0;
    return {
      ...data,
      progress: {
        ...data.progress,
        team: {
          ...team,
          results: { ...team.results, [taskId]: result },
          activeTeamIndex: nextIndex,
        },
      },
    };
  }

  return {
    ...data,
    progress: {
      ...data.progress,
      individual: {
        ...data.progress.individual,
        results: {
          ...data.progress.individual.results,
          [taskId]: result,
        },
      },
    },
  };
}

export function districtTaskSequence(
  data: AppData,
  mode: Mode,
  districtId: DistrictId,
): string[] {
  const progress = progressFor(data, mode);
  const validIds = tasksOf(districtId).map((task) => task.id);
  const stored = progress.taskOrder[districtId];
  if (stored && stored.length === validIds.length && stored.every((id) => validIds.includes(id))) {
    return stored;
  }
  return validIds;
}

export function sanitizeData(raw: unknown): AppData {
  const fallback = createInitialData();
  if (!raw || typeof raw !== 'object') return fallback;

  const candidate = raw as Partial<AppData>;
  const settings: Settings = {
    sound:
      typeof candidate.settings?.sound === 'boolean'
        ? candidate.settings.sound
        : DEFAULT_SETTINGS.sound,
    reducedMotion:
      typeof candidate.settings?.reducedMotion === 'boolean'
        ? candidate.settings.reducedMotion
        : DEFAULT_SETTINGS.reducedMotion,
  };

  const individual = candidate.progress?.individual;
  const team = candidate.progress?.team;

  const teams = Array.isArray(team?.teams) && team.teams.length >= 2
    ? team.teams
        .filter((item): item is Team => Boolean(item) && typeof item.name === 'string')
        .slice(0, 4)
        .map((item, index) => ({ id: `team-${index + 1}`, name: item.name }))
    : fallback.progress.team.teams;

  const merged: AppData = {
    version: 1,
    mode: candidate.mode === 'team' ? 'team' : 'individual',
    settings,
    progress: {
      individual: {
        results: sanitizeResults(individual?.results),
        taskOrder: sanitizeOrders(individual?.taskOrder, fallback.progress.individual.taskOrder),
      },
      team: {
        teams,
        activeTeamIndex: Math.min(
          Math.max(0, Number(team?.activeTeamIndex) || 0),
          Math.max(0, teams.length - 1),
        ),
        results: sanitizeResults(team?.results),
        taskOrder: sanitizeOrders(team?.taskOrder, fallback.progress.team.taskOrder),
      },
    },
  };

  if (merged.mode === 'team' && merged.progress.team.teams.length === 0) {
    merged.mode = 'individual';
  }
  return merged;
}

function sanitizeResults(raw: unknown): Record<string, TaskResult> {
  if (!raw || typeof raw !== 'object') return {};
  const result: Record<string, TaskResult> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!TASK_BY_ID[key] || !value || typeof value !== 'object') continue;
    const candidate = value as Partial<TaskResult>;
    if (typeof candidate.correct !== 'boolean') continue;
    result[key] = {
      correct: candidate.correct,
      earned: Math.max(0, Number(candidate.earned) || 0),
      hintUsed: Boolean(candidate.hintUsed),
      ...(typeof candidate.teamId === 'string' ? { teamId: candidate.teamId } : {}),
    };
  }
  return result;
}

function sanitizeOrders(
  raw: unknown,
  fallback: Partial<Record<DistrictId, string[]>>,
): Partial<Record<DistrictId, string[]>> {
  const orders: Partial<Record<DistrictId, string[]>> = {};
  for (const district of DISTRICTS) {
    const value =
      raw && typeof raw === 'object'
        ? (raw as Partial<Record<DistrictId, unknown>>)[district.id]
        : undefined;
    const validIds = tasksOf(district.id).map((task) => task.id);
    if (
      Array.isArray(value) &&
      value.length === validIds.length &&
      value.every((id) => typeof id === 'string' && validIds.includes(id))
    ) {
      orders[district.id] = value as string[];
    } else {
      orders[district.id] = fallback[district.id] ?? validIds;
    }
  }
  return orders;
}

export function loadData(): AppData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialData();
    return sanitizeData(JSON.parse(raw));
  } catch {
    return createInitialData();
  }
}

export function saveData(data: AppData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Depolama kapalıysa oyun çalışmaya devam eder.
  }
}
