import { useEffect, useState } from 'react';
import type { Answer, AppData, DistrictId, Mode, TaskResult } from '../types';
import { DISTRICT_BY_ID } from '../data/districts';
import { taskById } from '../data/tasks';
import {
  correctAnswerText,
  evaluateAnswer,
  HINT_COST,
} from '../game/checking';
import {
  districtStats,
  districtTaskSequence,
  progressFor,
} from '../game/progress';
import { BadgeIcon } from '../components/BadgeIcon';
import { CharacterGuide } from '../components/CharacterGuide';
import { Modal } from '../components/Modal';
import { Stars } from '../components/Stars';
import { TaskRenderer, TASK_TYPE_LABELS } from '../games/TaskRenderer';
import { playFeedback } from '../utils/sound';
import { DistrictSummary } from './DistrictSummary';

interface Props {
  data: AppData;
  districtId: DistrictId;
  mode: Mode;
  soundOn: boolean;
  onExit: () => void;
  onRecord: (taskId: string, result: TaskResult) => void;
  onOpenFinal: () => void;
}

interface FeedbackData {
  correct: boolean;
  partial: boolean;
  earned: number;
  hintUsed: boolean;
  ratio: number;
  detailText: string;
  correctText: string;
  teamName?: string;
}

const DIFFICULTY_LABELS = {
  normal: 'Normal',
  zor: 'Zor',
  bonus: 'Bonus',
} as const;

export function PlayScreen({
  data,
  districtId,
  mode,
  soundOn,
  onExit,
  onRecord,
  onOpenFinal,
}: Props) {
  const district = DISTRICT_BY_ID[districtId];
  const [queue] = useState<string[]>(() => {
    const progress = progressFor(data, mode);
    return districtTaskSequence(data, mode, districtId).filter(
      (id) => !progress.results[id],
    );
  });
  const [index, setIndex] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const stats = districtStats(data, mode, districtId);
  const currentTaskId = queue[index];
  const task = currentTaskId ? taskById(currentTaskId) : undefined;
  const activeTeam =
    mode === 'team'
      ? data.progress.team.teams[data.progress.team.activeTeamIndex]
      : undefined;

  useEffect(() => {
    setHintOpen(false);
    setHintUsed(false);
  }, [currentTaskId]);

  if (!task) {
    return (
      <DistrictSummary
        data={data}
        districtId={districtId}
        mode={mode}
        onExit={onExit}
        onOpenFinal={onOpenFinal}
      />
    );
  }

  const submit = (answer: Answer) => {
    if (feedback) return;
    const evaluation = evaluateAnswer(task, answer, hintUsed);
    const result: TaskResult = {
      correct: evaluation.correct,
      earned: evaluation.earned,
      hintUsed,
      ratio: evaluation.ratio,
    };
    if (mode === 'team' && activeTeam) result.teamId = activeTeam.id;
    onRecord(task.id, result);
    if (soundOn) playFeedback(evaluation.earned > 0 ? 'correct' : 'wrong');
    setFeedback({
      correct: evaluation.fullCorrect,
      partial: evaluation.ratio > 0 && evaluation.ratio < 1,
      earned: evaluation.earned,
      hintUsed,
      ratio: evaluation.ratio,
      detailText: evaluation.detailText,
      correctText: correctAnswerText(task),
      teamName: mode === 'team' ? activeTeam?.name : undefined,
    });
  };

  const advance = () => {
    setFeedback(null);
    if (index + 1 >= queue.length) {
      setIndex(queue.length);
    } else {
      setIndex((current) => current + 1);
      setHintOpen(false);
      setHintUsed(false);
    }
  };

  const progress = progressFor(data, mode);
  const answeredCount = stats.answered;
  const guideMessages = [
    'Görevleri dikkatlice oku. İpucu istersen sağdaki ipucu kartını kullanabilirsin.',
    'Yanlış cevap da bir öğrenme fırsatıdır. Açıklamayı mutlaka oku!',
    'Harika gidiyorsun! Bölgeyi tamamlayınca rozetini kazanacaksın.',
  ];
  const guideMessage =
    mode === 'team'
      ? `Sıra ${activeTeam?.name ?? 'takımda'}! Doğru cevap takımına puan kazandırır.`
      : guideMessages[Math.min(index, guideMessages.length - 1)];

  return (
    <main className="play-screen">
      <div className="play-bar">
        <button type="button" className="btn btn--soft" onClick={onExit}>
          <span aria-hidden="true">←</span> Şehre dön
        </button>
        <div className="play-bar__title">
          <span className="play-bar__outcome">{district.outcome}</span>
          <h1>{district.name}</h1>
        </div>
        <div className="play-bar__progress" aria-label={`Bölge ilerlemesi ${answeredCount} / ${stats.total}`}>
          <div className="play-bar__progress-label">
            <span>Görev {Math.min(index + 1, queue.length)} / {queue.length}</span>
            <strong>{answeredCount}/{stats.total}</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${(answeredCount / stats.total) * 100}%`, background: district.color }} />
          </div>
        </div>
      </div>

      <div className="play-content">
        <section className="task-card" aria-labelledby="task-title">
          <div className="task-meta">
            <span className="pill" style={{ background: district.light, color: district.dark }}>
              {district.outcome}
            </span>
            <span className="pill pill--neutral">{TASK_TYPE_LABELS[task.type]}</span>
            <span className={`pill pill--${task.difficulty}`}>
              {DIFFICULTY_LABELS[task.difficulty]} · {task.points} puan
            </span>
          </div>

          <h2 id="task-title">{task.title}</h2>

          {task.scenario && (
            <div className="scenario-box">
              <span className="scenario-box__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
                  <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20M8 7h8M8 11h5" />
                </svg>
              </span>
              <p>{task.scenario}</p>
            </div>
          )}

          <p className="task-prompt">{task.prompt}</p>

          <TaskRenderer key={task.id} task={task} disabled={Boolean(feedback)} onSubmit={submit} />
        </section>

        <aside className="play-aside" aria-label="Görev bilgileri">
          <div className="aside-card">
            <h3>
              <span style={{ color: district.color }}>●</span> Bölge durumu
            </h3>
            <div className="progress-dots" aria-hidden="true">
              {queue.map((id, dotIndex) => {
                const result = progress.results[id];
                const current = dotIndex === index;
                const isFull = result && result.correct && (!result.ratio || result.ratio >= 0.999);
                const isPart = result && result.earned > 0 && result.ratio && result.ratio < 0.999;
                const isWrong = result && result.earned === 0;

                return (
                  <span
                    key={id}
                    className={`progress-dot${current ? ' is-current' : ''}${
                      isFull ? ' is-correct' : isPart ? ' is-partial' : isWrong ? ' is-wrong' : ''
                    }`}
                    title={
                      result
                        ? `${result.earned} puan kazanıldı`
                        : `Görev ${dotIndex + 1}`
                    }
                  >
                    {isFull ? '✓' : isPart ? '★' : isWrong ? '✕' : dotIndex + 1}
                  </span>
                );
              })}
            </div>
            <div className="aside-stats">
              <div>
                <span>Doğru</span>
                <strong>{stats.correct}</strong>
              </div>
              <div>
                <span>Yıldız</span>
                <Stars value={stats.stars} size={18} />
              </div>
              <div>
                <span>Puan</span>
                <strong>{stats.score}</strong>
              </div>
            </div>
            <div className="aside-badge">
              <BadgeIcon
                icon={district.icon}
                color={district.color}
                earned={stats.completed}
                size={40}
                title={`${district.name} rozeti`}
              />
              <span>{stats.completed ? 'Rozet kazanıldı!' : 'Rozet için bölgeyi tamamla'}</span>
            </div>
          </div>

          {mode === 'team' && activeTeam ? (
            <div className="aside-card aside-card--team">
              <h3>Sıradaki takım</h3>
              <p className="aside-team-name">{activeTeam.name}</p>
              <ul className="aside-team-list">
                {data.progress.team.teams.map((team) => {
                  const score = Object.values(data.progress.team.results)
                    .filter((result) => result.teamId === team.id)
                    .reduce((sum, result) => sum + result.earned, 0);
                  return (
                    <li key={team.id} className={team.id === activeTeam.id ? 'is-active' : ''}>
                      <span>{team.name}</span>
                      <strong>{score}</strong>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="aside-card aside-card--guide">
              <CharacterGuide message={guideMessage} compact />
            </div>
          )}

          <div className="aside-card aside-card--hint">
            <h3>İpucu</h3>
            {hintOpen ? (
              <p className="hint-text">{task.hint}</p>
            ) : (
              <p className="hint-text hint-text--muted">
                Takıldıysan ipucundan yararlan. İpucu kullanınca doğru cevaptan {HINT_COST} puan düşülür.
              </p>
            )}
            <button
              type="button"
              className="btn btn--soft btn--small"
              onClick={() => {
                setHintOpen(true);
                setHintUsed(true);
              }}
              disabled={hintOpen}
            >
              {hintOpen ? 'İpucu açık' : hintUsed ? 'İpucunu göster' : 'İpucu al (−25 puan)'}
            </button>
          </div>
        </aside>
      </div>

      {feedback && (
        <Modal
          title={
            feedback.correct
              ? 'Harika, tam doğru!'
              : feedback.partial
                ? 'Tebrikler, kısmi puan kazandın!'
                : 'Bu kez olmadı'
          }
          subtitle={
            feedback.correct
              ? 'Görevi eksiksiz tamamladın.'
              : feedback.partial
                ? `${feedback.detailText} ve ara puan aldın.`
                : 'Doğru cevabı ve açıklamayı birlikte inceleyelim.'
          }
          variant="feedback"
          icon={
            <span
              className={`feedback-icon${
                feedback.correct
                  ? ' is-correct'
                  : feedback.partial
                    ? ' is-partial'
                    : ' is-wrong'
              }`}
              aria-hidden="true"
            >
              {feedback.correct ? '✓' : feedback.partial ? '★' : '✕'}
            </span>
          }
          footer={
            <button type="button" className="btn btn--primary btn--large" onClick={advance} autoFocus>
              {index + 1 >= queue.length ? 'Bölge sonucunu gör' : 'Devam et'}
            </button>
          }
        >
          <div className="feedback">
            <div className="feedback__score">
              <span className={`feedback__points${feedback.earned > 0 ? ' is-positive' : ''}`}>
                +{feedback.earned} puan
              </span>
              {feedback.partial && feedback.detailText && (
                <span className="feedback__detail-badge">{feedback.detailText}</span>
              )}
              {feedback.hintUsed && feedback.earned > 0 && (
                <span className="feedback__hint-note">
                  İpucu kullanıldı: −{HINT_COST} puan
                </span>
              )}
              {feedback.teamName && (
                <span className="feedback__team">Bu puan {feedback.teamName} takımına yazıldı.</span>
              )}
            </div>

            {!feedback.correct && (
              <div className="feedback__correct">
                <h3>{feedback.partial ? 'Tam Doğru Çözüm' : 'Doğru Cevap'}</h3>
                <p>{feedback.correctText}</p>
              </div>
            )}

            <div className="feedback__explanation">
              <h3>Neden?</h3>
              <p>{task.explanation}</p>
            </div>

            <p className="feedback__outcome">
              Kazanım: <strong>{task.outcome}</strong>
            </p>
          </div>
        </Modal>
      )}
    </main>
  );
}
