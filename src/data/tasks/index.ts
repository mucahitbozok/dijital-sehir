import type { DistrictId, Task } from '../../types';
import { teknolojiTasks } from './teknoloji';
import { toplumTasks } from './toplum';
import { guvenlikTasks } from './guvenlik';
import { yapayzekaTasks } from './yapayzeka';
import { atolyeTasks } from './atolye';
import { dosyaTasks } from './dosya';

export const ALL_TASKS: Task[] = [
  ...teknolojiTasks,
  ...toplumTasks,
  ...guvenlikTasks,
  ...yapayzekaTasks,
  ...atolyeTasks,
  ...dosyaTasks,
];

export const TASKS_BY_DISTRICT: Record<DistrictId, Task[]> = {
  teknoloji: teknolojiTasks,
  toplum: toplumTasks,
  guvenlik: guvenlikTasks,
  yapayzeka: yapayzekaTasks,
  atolye: atolyeTasks,
  dosya: dosyaTasks,
};

export const TASK_BY_ID: Record<string, Task> = ALL_TASKS.reduce(
  (acc, task) => {
    acc[task.id] = task;
    return acc;
  },
  {} as Record<string, Task>,
);

export function tasksOf(districtId: DistrictId): Task[] {
  return TASKS_BY_DISTRICT[districtId];
}

export function taskById(id: string): Task | undefined {
  return TASK_BY_ID[id];
}
