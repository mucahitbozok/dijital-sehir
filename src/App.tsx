import { useCallback, useEffect, useState } from 'react';
import type { AppData, DistrictId, Mode, TaskResult } from './types';
import {
  createInitialData,
  loadData,
  makeTaskOrders,
  overallStats,
  recordResult,
  saveData,
  teamScores,
} from './game/progress';
import { AppHeader } from './components/AppHeader';
import { TeamBar } from './components/TeamBar';
import { TeamSetupModal } from './components/TeamSetupModal';
import { SettingsModal } from './components/SettingsModal';
import { HowToModal } from './components/HowToModal';
import { HomeScreen } from './screens/HomeScreen';
import { PlayScreen } from './screens/PlayScreen';
import { FinalScreen } from './screens/FinalScreen';
import { playFeedback } from './utils/sound';

type View =
  | { name: 'home' }
  | { name: 'play'; districtId: DistrictId }
  | { name: 'final' };

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [view, setView] = useState<View>({ name: 'home' });
  const [teamSetupOpen, setTeamSetupOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.dataset.motion = data.settings.reducedMotion
      ? 'reduced'
      : 'full';
  }, [data.settings.reducedMotion]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const mode = data.mode;
  const overall = overallStats(data, mode);
  const teamScored = teamScores(data);
  const activeTeamId =
    mode === 'team'
      ? data.progress.team.teams[data.progress.team.activeTeamIndex]?.id
      : undefined;

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Tarayıcı tam ekrana izin vermezse oyun normal boyutta devam eder.
    }
  }, []);

  const changeMode = (next: Mode) => {
    if (next === mode) return;
    setView({ name: 'home' });
    setData((current) => ({ ...current, mode: next }));
    if (next === 'team' && Object.keys(data.progress.team.results).length === 0) {
      setSettingsOpen(false);
      setHowToOpen(false);
      setTeamSetupOpen(true);
    }
  };

  const selectDistrict = (districtId: DistrictId) => {
    if (mode === 'team' && data.progress.team.teams.length === 0) {
      setTeamSetupOpen(true);
      return;
    }
    setView({ name: 'play', districtId });
  };

  const handleRecord = (taskId: string, result: TaskResult) => {
    setData((current) => recordResult(current, current.mode, taskId, result));
  };

  const saveTeams = (names: string[]) => {
    setData((current) => {
      const hasResults = Object.keys(current.progress.team.results).length > 0;
      const teams = names.map((name, index) => ({
        id: `team-${index + 1}`,
        name: name.trim() || `Takım ${index + 1}`,
      }));
      return {
        ...current,
        mode: 'team',
        progress: {
          ...current.progress,
          team: {
            teams,
            activeTeamIndex: 0,
            results: hasResults ? {} : current.progress.team.results,
            taskOrder: hasResults ? makeTaskOrders() : current.progress.team.taskOrder,
          },
        },
      };
    });
    setTeamSetupOpen(false);
    setView({ name: 'home' });
  };

  const resetAll = () => {
    setData((current) => {
      const fresh = createInitialData();
      return {
        ...fresh,
        settings: current.settings,
        mode: current.mode,
      };
    });
    setView({ name: 'home' });
    setSettingsOpen(false);
    setTeamSetupOpen(false);
  };

  const toggleSound = () => {
    setData((current) => {
      const sound = !current.settings.sound;
      if (sound) playFeedback('click');
      return {
        ...current,
        settings: { ...current.settings, sound },
      };
    });
  };

  const toggleMotion = () => {
    setData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        reducedMotion: !current.settings.reducedMotion,
      },
    }));
  };

  const teamHasResults = Object.keys(data.progress.team.results).length > 0;

  return (
    <div className="app-shell">
      <AppHeader
        mode={mode}
        onChangeMode={changeMode}
        score={overall.score}
        stars={overall.stars}
        maxStars={18}
        badges={overall.badges}
        maxBadges={6}
        onHome={() => setView({ name: 'home' })}
        onOpenTeams={() => {
          setSettingsOpen(false);
          setTeamSetupOpen(true);
        }}
        onOpenHowTo={() => {
          setSettingsOpen(false);
          setTeamSetupOpen(false);
          setHowToOpen(true);
        }}
        onOpenSettings={() => {
          setTeamSetupOpen(false);
          setHowToOpen(false);
          setSettingsOpen(true);
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {mode === 'team' && (
        <TeamBar
          scores={teamScored}
          activeTeamId={activeTeamId}
          onOpenTeams={() => setTeamSetupOpen(true)}
        />
      )}

      <div className="view-container">
        {view.name === 'home' && (
          <HomeScreen
            data={data}
            mode={mode}
            onSelectDistrict={selectDistrict}
            onOpenFinal={() => setView({ name: 'final' })}
          />
        )}
        {view.name === 'play' && (
          <PlayScreen
            key={`${view.districtId}-${mode}`}
            data={data}
            districtId={view.districtId}
            mode={mode}
            soundOn={data.settings.sound}
            onExit={() => setView({ name: 'home' })}
            onRecord={handleRecord}
            onOpenFinal={() => setView({ name: 'final' })}
          />
        )}
        {view.name === 'final' && (
          <FinalScreen
            data={data}
            mode={mode}
            onHome={() => setView({ name: 'home' })}
            onReset={resetAll}
          />
        )}
      </div>

      {teamSetupOpen && (
        <TeamSetupModal
          teams={data.progress.team.teams}
          hasResults={teamHasResults}
          onClose={() => setTeamSetupOpen(false)}
          onSave={saveTeams}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          settings={data.settings}
          onToggleSound={toggleSound}
          onToggleMotion={toggleMotion}
          onReset={resetAll}
          onClose={() => setSettingsOpen(false)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onOpenTeams={() => {
            setSettingsOpen(false);
            setTeamSetupOpen(true);
          }}
          teamMode={mode === 'team'}
        />
      )}

      {howToOpen && <HowToModal onClose={() => setHowToOpen(false)} />}
    </div>
  );
}
