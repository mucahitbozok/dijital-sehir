import { describe, expect, it } from 'vitest';
import type { Task } from '../types';
import {
  HINT_COST,
  checkAnswer,
  correctAnswerText,
  evaluateAnswer,
  pointsFor,
} from './checking';

const base = {
  districtId: 'teknoloji' as const,
  outcome: 'BTY.5.1.1',
  title: 'Test',
  prompt: 'Test sorusu',
  hint: 'İpucu',
  explanation: 'Açıklama',
};

const mc: Task = {
  ...base,
  id: 'test-mc',
  type: 'mc',
  difficulty: 'normal',
  points: 100,
  options: [
    { id: 'a', text: 'Birinci' },
    { id: 'b', text: 'İkinci' },
  ],
  correctOptionId: 'b',
};

const multi: Task = {
  ...base,
  id: 'test-multi',
  type: 'multi',
  difficulty: 'zor',
  points: 150,
  options: [
    { id: 'a', text: 'A' },
    { id: 'b', text: 'B' },
    { id: 'c', text: 'C' },
  ],
  correctOptionIds: ['a', 'c'],
};

const match: Task = {
  ...base,
  id: 'test-match',
  type: 'match',
  difficulty: 'normal',
  points: 100,
  left: [
    { id: 'l1', text: 'Sol 1' },
    { id: 'l2', text: 'Sol 2' },
  ],
  right: [
    { id: 'r1', text: 'Sağ 1' },
    { id: 'r2', text: 'Sağ 2' },
  ],
  pairs: { l1: 'r1', l2: 'r2' },
};

const classify: Task = {
  ...base,
  id: 'test-classify',
  type: 'classify',
  difficulty: 'normal',
  points: 100,
  categories: [
    { id: 'x', text: 'X' },
    { id: 'y', text: 'Y' },
  ],
  items: [
    { id: 'i1', label: 'Bir', category: 'x' },
    { id: 'i2', label: 'İki', category: 'y' },
  ],
};

const order: Task = {
  ...base,
  id: 'test-order',
  type: 'order',
  difficulty: 'bonus',
  points: 200,
  items: [
    { id: 'o1', text: 'Bir' },
    { id: 'o2', text: 'İki' },
    { id: 'o3', text: 'Üç' },
  ],
  correctOrder: ['o1', 'o2', 'o3'],
};

describe('checkAnswer', () => {
  it('çoktan seçmeli doğru ve yanlış cevabı ayırt eder', () => {
    expect(checkAnswer(mc, { type: 'mc', optionId: 'b' })).toBe(true);
    expect(checkAnswer(mc, { type: 'mc', optionId: 'a' })).toBe(false);
  });

  it('çoklu seçimde sıradan bağımsız tam eşleşme ister', () => {
    expect(checkAnswer(multi, { type: 'multi', optionIds: ['c', 'a'] })).toBe(true);
    expect(checkAnswer(multi, { type: 'multi', optionIds: ['a'] })).toBe(false);
    expect(checkAnswer(multi, { type: 'multi', optionIds: ['a', 'b', 'c'] })).toBe(false);
    expect(checkAnswer(multi, { type: 'multi', optionIds: ['a', 'a', 'c'] })).toBe(false);
  });

  it('eşleştirmede tüm çiftlerin doğru olmasını ister', () => {
    expect(checkAnswer(match, { type: 'match', pairs: { l1: 'r1', l2: 'r2' } })).toBe(true);
    expect(checkAnswer(match, { type: 'match', pairs: { l1: 'r2', l2: 'r1' } })).toBe(false);
    expect(checkAnswer(match, { type: 'match', pairs: { l1: 'r1' } })).toBe(false);
  });

  it('sınıflandırmada tüm öğelerin doğru kategoride olmasını ister', () => {
    expect(checkAnswer(classify, { type: 'classify', assignments: { i1: 'x', i2: 'y' } })).toBe(true);
    expect(checkAnswer(classify, { type: 'classify', assignments: { i1: 'y', i2: 'y' } })).toBe(false);
  });

  it('sıralamada tam sırayı ister', () => {
    expect(checkAnswer(order, { type: 'order', order: ['o1', 'o2', 'o3'] })).toBe(true);
    expect(checkAnswer(order, { type: 'order', order: ['o2', 'o1', 'o3'] })).toBe(false);
    expect(checkAnswer(order, { type: 'order', order: ['o1', 'o2'] })).toBe(false);
  });

  it('görev türüyle uyuşmayan cevabı yanlış sayar', () => {
    expect(checkAnswer(mc, { type: 'multi', optionIds: ['b'] })).toBe(false);
  });
});

describe('pointsFor', () => {
  it('doğru cevapta görev puanını verir', () => {
    expect(pointsFor(mc, true, false)).toBe(100);
    expect(pointsFor(multi, true, false)).toBe(150);
    expect(pointsFor(order, true, false)).toBe(200);
  });

  it('yanlış cevapta sıfır puan verir', () => {
    expect(pointsFor(mc, false, false)).toBe(0);
    expect(pointsFor(order, false, true)).toBe(0);
  });

  it('ipucu kullanıldığında puanı açıkça düşürür', () => {
    expect(pointsFor(mc, true, true)).toBe(100 - HINT_COST);
    expect(pointsFor(order, true, true)).toBe(200 - HINT_COST);
  });
});

describe('evaluateAnswer', () => {
  it('eşleştirmede bir hata olduğunda sıfır vermek yerine kısmi puan (ara puan) verir', () => {
    // 2 eşleştirmeden 1'i doğru olduğunda %50 puan (100 puanın yarısı = 50 puan)
    const result = evaluateAnswer(match, {
      type: 'match',
      pairs: { l1: 'r1', l2: 'r1' }, // l1 doğru, l2 yanlış
    });
    expect(result.fullCorrect).toBe(false);
    expect(result.correct).toBe(true);
    expect(result.ratio).toBe(0.5);
    expect(result.earned).toBe(50);
    expect(result.detailText).toBe('2 eşleştirmeden 1 tanesi doğru');
  });

  it('eşleştirmede hepsi doğruysa tam puan verir', () => {
    const result = evaluateAnswer(match, {
      type: 'match',
      pairs: { l1: 'r1', l2: 'r2' },
    });
    expect(result.fullCorrect).toBe(true);
    expect(result.correct).toBe(true);
    expect(result.ratio).toBe(1);
    expect(result.earned).toBe(100);
  });

  it('eşleştirmede hiçbiri doğru değilse sıfır puan verir', () => {
    const result = evaluateAnswer(match, {
      type: 'match',
      pairs: { l1: 'r2', l2: 'r1' },
    });
    expect(result.fullCorrect).toBe(false);
    expect(result.ratio).toBe(0);
    expect(result.earned).toBe(0);
  });

  it('sınıflandırmada doğru yerleştirilen öğe oranına göre ara puan verir', () => {
    // classify görevi 100 puan, 2 öğe var. 1'i doğru: 50 puan
    const result = evaluateAnswer(classify, {
      type: 'classify',
      assignments: { i1: 'x', i2: 'x' }, // i1 doğru, i2 yanlış
    });
    expect(result.fullCorrect).toBe(false);
    expect(result.ratio).toBe(0.5);
    expect(result.earned).toBe(50);
    expect(result.detailText).toBe('2 kavramdan 1 tanesi doğru grupta');
  });

  it('sıralamada adımların bir kısmı doğruysa ara puan verir', () => {
    // order 200 puan, 3 adımdan 1'i yerinde: 1/3 veya bağıl ikili eşleşme oranıyla ara puan
    const result = evaluateAnswer(order, {
      type: 'order',
      order: ['o1', 'o3', 'o2'],
    });
    expect(result.fullCorrect).toBe(false);
    expect(result.earned).toBeGreaterThan(0);
  });

  it('çoklu seçimde kısmi doğruya ara puan verir', () => {
    // multi doğru cevapları: ['a', 'c']. Görev puanı: 150. Öğrenci sadece 'a' seçti: 1/2 = 75 puan
    const result = evaluateAnswer(multi, {
      type: 'multi',
      optionIds: ['a'],
    });
    expect(result.fullCorrect).toBe(false);
    expect(result.ratio).toBe(0.5);
    expect(result.earned).toBe(75);
  });

  it('ipucu kullanıldığında ara puandan ipucu bedelini düşer', () => {
    const result = evaluateAnswer(
      match,
      {
        type: 'match',
        pairs: { l1: 'r1', l2: 'r1' }, // 50 puan
      },
      true, // hintUsed
    );
    expect(result.earned).toBe(50 - HINT_COST);
  });
});

describe('correctAnswerText', () => {
  it('her görev türü için okunabilir özet üretir', () => {
    expect(correctAnswerText(mc)).toBe('İkinci');
    expect(correctAnswerText(multi)).toBe('A • C');
    expect(correctAnswerText(match)).toBe('Sol 1 → Sağ 1 • Sol 2 → Sağ 2');
    expect(correctAnswerText(classify)).toContain('X: Bir');
    expect(correctAnswerText(order)).toBe('Bir → İki → Üç');
  });
});
