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

export interface Evaluation {
  /** 0.0 - 1.0 arası başarı oranı */
  ratio: number;
  /** Soru başarıyla geçildi mi? (en az %50 başarı veya tek seçimde tam doğru) */
  correct: boolean;
  /** Eksiksiz %100 tam doğru mu? */
  fullCorrect: boolean;
  /** İpucu düşülmeden önceki ham kazanılan puan */
  basePoints: number;
  /** İpucu düşüldükten sonra net kazanılan puan */
  earned: number;
  /** Arayüzde öğrenciye gösterilecek başarı detayı */
  detailText: string;
}

/**
 * Ayrıntılı cevap denetimi ve kısmi puan (ara puan) hesaplama motoru.
 * Eşleştirme, sınıflandırma, sıralama ve çoklu seçimde her doğru parça için puan verir.
 */
export function evaluateAnswer(
  task: Task,
  answer: Answer,
  hintUsed: boolean = false,
): Evaluation {
  if (answer.type !== task.type) {
    return {
      ratio: 0,
      correct: false,
      fullCorrect: false,
      basePoints: 0,
      earned: 0,
      detailText: 'Cevap biçimi uyuşmuyor',
    };
  }

  let ratio = 0;
  let detailText = '';

  switch (task.type) {
    case 'mc': {
      if (answer.type !== 'mc') break;
      const isCorrect = answer.optionId === task.correctOptionId;
      ratio = isCorrect ? 1 : 0;
      detailText = isCorrect ? 'Doğru seçenek' : 'Yanlış seçenek';
      break;
    }

    case 'multi': {
      if (answer.type !== 'multi') break;
      const correctSet = new Set(task.correctOptionIds);
      const totalCorrect = task.correctOptionIds.length;
      const correctSelected = answer.optionIds.filter((id) => correctSet.has(id)).length;
      const wrongSelected = answer.optionIds.filter((id) => !correctSet.has(id)).length;

      // Yanlış seçimler doğru seçimleri nötrler, 0'ın altına düşmez
      const net = Math.max(0, correctSelected - wrongSelected);
      ratio = totalCorrect > 0 ? net / totalCorrect : 0;

      if (ratio >= 0.999) {
        detailText = 'Tüm doğru seçenekler eksiksiz işaretlendi';
      } else if (ratio > 0) {
        detailText =
          wrongSelected > 0
            ? `${totalCorrect} doğru seçenekten ${correctSelected} tanesi seçildi (${wrongSelected} hatalı seçim)`
            : `${totalCorrect} doğru seçenekten ${correctSelected} tanesi seçildi`;
      } else {
        detailText = 'Doğru seçenek işaretlenmedi';
      }
      break;
    }

    case 'match': {
      if (answer.type !== 'match') break;
      const total = task.left.length;
      const correctMatches = task.left.filter(
        (left) => answer.pairs[left.id] === task.pairs[left.id],
      ).length;
      ratio = total > 0 ? correctMatches / total : 0;

      if (ratio >= 0.999) {
        detailText = 'Tüm eşleştirmeler doğru';
      } else if (ratio > 0) {
        detailText = `${total} eşleştirmeden ${correctMatches} tanesi doğru`;
      } else {
        detailText = 'Eşleştirmelerin hiçbiri doğru değil';
      }
      break;
    }

    case 'classify': {
      if (answer.type !== 'classify') break;
      const total = task.items.length;
      const correctItems = task.items.filter(
        (item) => answer.assignments[item.id] === item.category,
      ).length;
      ratio = total > 0 ? correctItems / total : 0;

      if (ratio >= 0.999) {
        detailText = 'Tüm kavramlar doğru grupta';
      } else if (ratio > 0) {
        detailText = `${total} kavramdan ${correctItems} tanesi doğru grupta`;
      } else {
        detailText = 'Kavramlar doğru gruplara yerleştirilmedi';
      }
      break;
    }

    case 'order': {
      if (answer.type !== 'order') break;
      const total = task.correctOrder.length;
      if (answer.order.length !== total) {
        ratio = 0;
        detailText = 'Sıralama adımları eksik';
        break;
      }

      // 1. Tam pozisyon eşleşmesi (kaç kart tam yerine konuldu)
      const posMatches = answer.order.filter(
        (id, index) => id === task.correctOrder[index],
      ).length;
      const posRatio = total > 0 ? posMatches / total : 0;

      // 2. İkili bağıl sıralama (çocuk adımları doğru sırada ama bir kaydırma ile yaptıysa)
      let correctPairs = 0;
      let totalPairs = 0;
      for (let i = 0; i < total; i++) {
        for (let j = i + 1; j < total; j++) {
          totalPairs++;
          const itemA = task.correctOrder[i];
          const itemB = task.correctOrder[j];
          const idxA = answer.order.indexOf(itemA);
          const idxB = answer.order.indexOf(itemB);
          if (idxA !== -1 && idxB !== -1 && idxA < idxB) {
            correctPairs++;
          }
        }
      }
      const pairRatio = totalPairs > 0 ? correctPairs / totalPairs : 0;

      // Öğrenci lehine olan en yüksek oranı baz al
      ratio = Math.max(posRatio, pairRatio);

      if (posMatches === total) {
        detailText = 'Adımların tümü doğru sırada';
      } else if (ratio > 0) {
        detailText = `${total} adımdan ${posMatches} tanesi tam yerinde`;
      } else {
        detailText = 'Sıralama adımları doğru değil';
      }
      break;
    }
  }

  const fullCorrect = ratio >= 0.999;
  // %50 ve üzeri başarı veya tek seçimde doğru olanlar başarılı kabul edilir
  const correct = ratio >= 0.5;

  let basePoints = 0;
  if (ratio > 0) {
    const raw = Math.round(task.points * ratio);
    // Temiz ve okunaklı puan için en yakın 5'in katına yuvarla (örn: 75, 85, 125 vb.)
    basePoints = Math.round(raw / 5) * 5;
  }

  const earned = hintUsed ? Math.max(0, basePoints - HINT_COST) : basePoints;

  return {
    ratio,
    correct,
    fullCorrect,
    basePoints,
    earned,
    detailText,
  };
}

export function pointsFor(
  task: Task,
  correctOrRatio: boolean | number,
  hintUsed: boolean = false,
): number {
  if (typeof correctOrRatio === 'boolean') {
    if (!correctOrRatio) return 0;
    return Math.max(0, task.points - (hintUsed ? HINT_COST : 0));
  }
  const ratio = Math.max(0, Math.min(1, correctOrRatio));
  if (ratio <= 0) return 0;
  const raw = Math.round(task.points * ratio);
  const base = Math.round(raw / 5) * 5;
  return Math.max(0, base - (hintUsed ? HINT_COST : 0));
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
