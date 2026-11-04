import type { Answer, Task } from '../types';

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  if (setA.size !== new Set(b).size) return false;
  return b.every((value) => setA.has(value));
}

/** Saf cevap denetimi: arayüzden bağımsız, test edilebilir. */
export function checkAnswer(task: Task, answer: Answer): boolean {
  if (answer.type !== task.type) return false;

  switch (task.type) {
    case 'mc':
      return answer.type === 'mc' && answer.optionId === task.correctOptionId;

    case 'multi':
      return (
        answer.type === 'multi' &&
        sameSet(answer.optionIds, task.correctOptionIds)
      );

    case 'match': {
      if (answer.type !== 'match') return false;
      return task.left.every((left) => answer.pairs[left.id] === task.pairs[left.id]);
    }

    case 'classify': {
      if (answer.type !== 'classify') return false;
      return task.items.every(
        (item) => answer.assignments[item.id] === item.category,
      );
    }

    case 'order': {
      if (answer.type !== 'order') return false;
      return (
        answer.order.length === task.correctOrder.length &&
        answer.order.every((id, index) => id === task.correctOrder[index])
      );
    }

    default:
      return false;
  }
}

export const HINT_COST = 25;

export function pointsFor(task: Task, correct: boolean, hintUsed: boolean): number {
  if (!correct) return 0;
  return Math.max(0, task.points - (hintUsed ? HINT_COST : 0));
}

/** Sonuç ekranı ve geri bildirimde gösterilecek doğru cevap özeti. */
export function correctAnswerText(task: Task): string {
  switch (task.type) {
    case 'mc': {
      const option = task.options.find((o) => o.id === task.correctOptionId);
      return option?.text ?? '';
    }
    case 'multi': {
      return task.correctOptionIds
        .map((id) => task.options.find((o) => o.id === id)?.text ?? '')
        .filter(Boolean)
        .join(' • ');
    }
    case 'match': {
      return task.left
        .map((left) => {
          const right = task.right.find((r) => r.id === task.pairs[left.id]);
          return `${left.text} → ${right?.text ?? ''}`;
        })
        .join(' • ');
    }
    case 'classify': {
      return task.categories
        .map((category) => {
          const labels = task.items
            .filter((item) => item.category === category.id)
            .map((item) => item.label);
          return `${category.text}: ${labels.join(', ')}`;
        })
        .join(' • ');
    }
    case 'order': {
      return task.correctOrder
        .map((id) => task.items.find((item) => item.id === id)?.text ?? '')
        .filter(Boolean)
        .join(' → ');
    }
    default:
      return '';
  }
}

export function emptyAnswerFor(task: Task): Answer {
  switch (task.type) {
    case 'mc':
      return { type: 'mc', optionId: '' };
    case 'multi':
      return { type: 'multi', optionIds: [] };
    case 'match':
      return { type: 'match', pairs: {} };
    case 'classify':
      return { type: 'classify', assignments: {} };
    case 'order':
      return { type: 'order', order: [] };
  }
}
