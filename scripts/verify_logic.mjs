/* Geliştirme sırasında bağımlılık olmadan içerik ve oyun mantığını doğrular.
   Asıl testler Vitest ile çalışır; bu betik hızlı bir çapraz kontroldür. */
import assert from 'node:assert/strict';

const { ALL_TASKS, TASKS_BY_DISTRICT } = await import('../src/data/tasks/index.ts');
const { DISTRICTS } = await import('../src/data/districts.ts');
const { checkAnswer, correctAnswerText, pointsFor } = await import(
  '../src/game/checking.ts'
);
const { createInitialData, districtStats, overallStats, recordResult, sanitizeData, starsFor } =
  await import('../src/game/progress.ts');

const EXPECTED_POINTS = { normal: 100, zor: 150, bonus: 200 };

assert.equal(ALL_TASKS.length, 60, 'Toplam görev sayısı 60 olmalı');
assert.equal(new Set(ALL_TASKS.map((task) => task.id)).size, 60, 'Görev kimlikleri benzersiz olmalı');

for (const district of DISTRICTS) {
  assert.equal(TASKS_BY_DISTRICT[district.id].length, 10, `${district.id} 10 görev içermeli`);
  for (const task of TASKS_BY_DISTRICT[district.id]) {
    assert.equal(task.districtId, district.id);
    assert.equal(task.outcome, district.outcome);
    assert.equal(task.points, EXPECTED_POINTS[task.difficulty]);
    assert.ok(task.title.length > 2 && task.prompt.length > 5 && task.explanation.length > 5);
    const answer = correctAnswerFor(task);
    assert.equal(checkAnswer(task, answer), true, `${task.id} doğru cevabı geçmeli`);
    assert.equal(pointsFor(task, true, false), task.points);
    assert.equal(pointsFor(task, false, false), 0);
    assert.ok(correctAnswerText(task).length > 0);
  }
}

function correctAnswerFor(task) {
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
        assignments: Object.fromEntries(task.items.map((item) => [item.id, item.category])),
      };
    case 'order':
      return { type: 'order', order: [...task.correctOrder] };
  }
}

assert.equal(starsFor(10, 10), 3);
assert.equal(starsFor(7, 10), 2);
assert.equal(starsFor(4, 10), 1);
assert.equal(starsFor(3, 10), 0);

let data = createInitialData();
data = recordResult(data, 'individual', 'teknoloji-01', {
  correct: true,
  earned: 100,
  hintUsed: false,
});
assert.equal(districtStats(data, 'individual', 'teknoloji').score, 100);
assert.equal(overallStats(data, 'individual').answered, 1);

let teamData = createInitialData();
teamData = recordResult(teamData, 'team', 'toplum-01', {
  correct: true,
  earned: 150,
  hintUsed: false,
  teamId: 'team-1',
});
assert.equal(teamData.progress.team.activeTeamIndex, 1);
assert.equal(teamData.progress.team.results['toplum-01'].teamId, 'team-1');

const sanitized = sanitizeData({
  mode: 'team',
  settings: {},
  progress: {
    individual: {
      results: {
        'toplum-99': { correct: true, earned: 200, hintUsed: false },
        'toplum-01': { correct: true, earned: 150, hintUsed: false },
      },
      taskOrder: {},
    },
  },
});
assert.equal(sanitized.progress.individual.results['toplum-99'], undefined);
assert.equal(sanitized.progress.individual.results['toplum-01'].earned, 150);

console.log(`OK: ${ALL_TASKS.length} görev, ${DISTRICTS.length} bölge doğrulandı.`);
