export type DistrictId =
  | 'teknoloji'
  | 'toplum'
  | 'guvenlik'
  | 'yapayzeka'
  | 'atolye'
  | 'dosya';

export type Difficulty = 'normal' | 'zor' | 'bonus';

export type TaskType = 'mc' | 'multi' | 'match' | 'classify' | 'order';

export interface Option {
  id: string;
  text: string;
}

export interface TaskBase {
  id: string;
  districtId: DistrictId;
  outcome: string;
  type: TaskType;
  difficulty: Difficulty;
  points: 100 | 150 | 200;
  title: string;
  prompt: string;
  scenario?: string;
  hint: string;
  explanation: string;
}

export interface MultipleChoiceTask extends TaskBase {
  type: 'mc';
  options: Option[];
  correctOptionId: string;
}

export interface MultiSelectTask extends TaskBase {
  type: 'multi';
  options: Option[];
  correctOptionIds: string[];
}

export interface MatchingTask extends TaskBase {
  type: 'match';
  left: Option[];
  right: Option[];
  /** left id -> right id */
  pairs: Record<string, string>;
}

export interface ClassificationTask extends TaskBase {
  type: 'classify';
  categories: Option[];
  items: { id: string; label: string; category: string }[];
}

export interface OrderingTask extends TaskBase {
  type: 'order';
  items: Option[];
  /** item ids in the correct order */
  correctOrder: string[];
}

export type Task =
  | MultipleChoiceTask
  | MultiSelectTask
  | MatchingTask
  | ClassificationTask
  | OrderingTask;

/** Every task type submits a JSON-serialisable answer. */
export type Answer =
  | { type: 'mc'; optionId: string }
  | { type: 'multi'; optionIds: string[] }
  | { type: 'match'; pairs: Record<string, string> }
  | { type: 'classify'; assignments: Record<string, string> }
  | { type: 'order'; order: string[] };

export interface TaskResult {
  correct: boolean;
  earned: number;
  hintUsed: boolean;
  teamId?: string;
  ratio?: number;
}

export interface District {
  id: DistrictId;
  name: string;
  shortName: string;
  outcome: string;
  description: string;
  color: string;
  dark: string;
  light: string;
  icon: string;
}

export interface Team {
  id: string;
  name: string;
}

export type Mode = 'individual' | 'team';

export interface Settings {
  sound: boolean;
  reducedMotion: boolean;
}

export interface ModeProgress {
  results: Record<string, TaskResult>;
  taskOrder: Partial<Record<DistrictId, string[]>>;
}

export interface GameProgress {
  individual: ModeProgress;
  team: {
    teams: Team[];
    activeTeamIndex: number;
    results: Record<string, TaskResult>;
    taskOrder: Partial<Record<DistrictId, string[]>>;
  };
}

export interface AppData {
  version: 1;
  mode: Mode;
  settings: Settings;
  progress: GameProgress;
}
