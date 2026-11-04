import { describe, expect, it } from 'vitest';
import { DISTRICTS } from '../districts';
import { ALL_TASKS, TASKS_BY_DISTRICT } from './index';
import { checkAnswer, correctAnswerText, pointsFor } from '../../game/checking';
import type { Answer, Task } from '../../types';

const EXPECTED_POINTS = { normal: 100, zor: 150, bonus: 200 } as const;

describe('görev içerik havuzu', () => {
  it('altı bölgede toplam 60 görev vardır', () => {
    expect(ALL_TASKS).toHaveLength(60);
    for (const district of DISTRICTS) {
      expect(TASKS_BY_DISTRICT[district.id]).toHaveLength(10);
    }
  });

  it('görev kimlikleri benzersizdir', () => {
    const ids = ALL_TASKS.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('her görev zorunlu alanlara sahiptir', () => {
    for (const task of ALL_TASKS) {
      expect(task.id).toMatch(/^[a-z]+-\d{2}$/);
      expect(task.title.trim().length).toBeGreaterThan(2);
      expect(task.prompt.trim().length).toBeGreaterThan(5);
      expect(task.hint.trim().length).toBeGreaterThan(2);
      expect(task.explanation.trim().length).toBeGreaterThan(5);
      expect(task.outcome).toBe(
        DISTRICTS.find((district) => district.id === task.districtId)?.outcome,
      );
      expect(task.points).toBe(EXPECTED_POINTS[task.difficulty]);
    }
  });

  it('doğru cevaplar mevcut seçenek ve öğelere işaret eder', () => {
    for (const task of ALL_TASKS) {
      switch (task.type) {
        case 'mc':
          expect(task.options.length).toBeGreaterThanOrEqual(2);
          expect(task.options.some((option) => option.id === task.correctOptionId)).toBe(true);
          break;
        case 'multi':
          expect(task.correctOptionIds.length).toBeGreaterThanOrEqual(2);
          for (const id of task.correctOptionIds) {
            expect(task.options.some((option) => option.id === id)).toBe(true);
          }
          break;
        case 'match':
          for (const left of task.left) {
            expect(task.right.some((right) => right.id === task.pairs[left.id])).toBe(true);
          }
          break;
        case 'classify':
          for (const item of task.items) {
            expect(task.categories.some((category) => category.id === item.category)).toBe(true);
          }
          break;
        case 'order':
          expect(task.correctOrder).toHaveLength(task.items.length);
          expect(new Set(task.correctOrder).size).toBe(task.items.length);
          for (const id of task.correctOrder) {
            expect(task.items.some((item) => item.id === id)).toBe(true);
          }
          break;
      }
    }
  });

  it('her görevin doğru cevabı denetimden geçer ve tam puan kazandırır', () => {
    for (const task of ALL_TASKS) {
      const answer = correctAnswerFor(task);
      expect(checkAnswer(task, answer), task.id).toBe(true);
      expect(pointsFor(task, true, false), task.id).toBe(task.points);
      expect(correctAnswerText(task).length, task.id).toBeGreaterThan(0);
    }
  });

  it('yanlış/boş cevaplar sıfır puan alır', () => {
    for (const task of ALL_TASKS) {
      expect(pointsFor(task, false, false), task.id).toBe(0);
    }
  });
});

function correctAnswerFor(task: Task): Answer {
  switch (task.type) {
    case 'mc':
      return { type: 'mc', optionId: task.correctOptionId };
    case 'multi':
      return { type: 'multi', optionIds: [...task.correctOptionIds] };
    case 'match':
      return { type: 'match', pairs: { ...task.pairs } };
    case 'classify':
      return {
        type: 'classify',
        assignments: Object.fromEntries(
          task.items.map((item) => [item.id, item.category]),
        ),
      };
    case 'order':
      return { type: 'order', order: [...task.correctOrder] };
  }
}
