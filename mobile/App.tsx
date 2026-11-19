import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

import { colors } from './src/theme/tokens';
import {
  AutomationSettings,
  EditorConfig,
  ScreenId,
  VideoProject,
  ViralClip,
} from './src/types/clipia';
import {
  purgeResidualLocalRawFile,
  triggerBackendDriveUpload,
} from './src/services/driveAutoSync';
import { FloatingDock } from './src/components/StudioPrimitives';
import { HomeScreen } from './src/screens/HomeScreen';
import { ImportScreen } from './src/screens/ImportScreen';
import { AnalysisScreen } from './src/screens/AnalysisScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { PreviewGateScreen } from './src/screens/PreviewGateScreen';
import { ExportScreen } from './src/screens/ExportScreen';
import { PublishScreen } from './src/screens/PublishScreen';
import { CloudDriveScreen } from './src/screens/CloudDriveScreen';

const INITIAL_PROJECTS: VideoProject[] = [
  {
    id: 'p1',
    name: 'Podcast_Ep42_Clip1.mp4',
    durationSec: 38,
    rawSizeMb: 2450,
    finalSizeMb: 18.4,
    status: 'ready',
    driveSynced: true,
    rawPurged: true,
  },
  {
    id: 'p2',
    name: 'Stream_Reaccion_Final.mov',
    durationSec: 420,
    rawSizeMb: 1840,
    finalSizeMb: 21.2,
    status: 'approval',
    driveSynced: false,
    rawPurged: false,
  },
];

function createGeneratedClips(folder: string): ViralClip[] {
  return [
    {
      id: 'c1',
      title: 'Reacción épica al anuncio',
      score: 96,
      duration: '0:38',
      range: '01:14 – 01:52',
      driveState: 'queued',
      driveProgress: 0,
      driveFolder: folder,
      tags: ['Hook fuerte', 'Facecam', 'Grito'],
      quote: '“¡No me lo puedo creer, esto cambia **** por completo la forma de editar!”',
    },
    {
      id: 'c2',
      title: 'Secreto de retención 3s',
      score: 92,
      duration: '0:42',
      range: '04:02 – 04:44',
      driveState: 'queued',
      driveProgress: 0,
      driveFolder: folder,
      tags: ['Dato viral', 'Facecam'],
      quote: '“Si pierdes al espectador en 2 segundos, el algoritmo corta el alcance…”',
    },
    {
      id: 'c3',
      title: 'Comparativa Antes vs Después',
      score: 85,
      duration: '0:29',
      range: '06:18 – 06:47',
      driveState: 'queued',
      driveProgress: 0,
      driveFolder: folder,
      tags: ['Cambio escena', 'Ritmo'],
      quote: '“Mira la diferencia entre recortar a mano y el encuadre IA automático.”',
    },
  ];
}

function ClipIAApp() {
  const [screen, setScreen] = useState<ScreenId>('home');
  const [projects, setProjects] = useState<VideoProject[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<VideoProject>(INITIAL_PROJECTS[0]);

  const [automation, setAutomation] = useState<AutomationSettings>({
    driveSyncWhileClipping: true,
    autoPurgeRaw: true,
    keepFinalClipOnly: true,
    driveFolder: '/ClipIA/Clips_Listos',
  });

  const [clips, setClips] = useState<ViralClip[]>(() =>
    createGeneratedClips('/ClipIA/Clips_Listos')
  );
  const [syncCycle, setSyncCycle] = useState(0);

  const [editorConfig, setEditorConfig] = useState<EditorConfig>({
    aspectRatio: '9:16',
    smartCrop: true,
    safeZone: true,
    captionStyle: 'pop',
    censorWords: true,
    autoZoom: true,
  });

  // Automatically upload every generated clip to Google Drive when entering Analysis
  useEffect(() => {
    if (screen !== 'analysis' || !automation.driveSyncWhileClipping) return;

    const alreadySynced = clips.every((c) => c.driveState === 'synced');
    if (alreadySynced) return;

    const interval = setInterval(() => {
      setClips((prev) => {
        const next = prev.map((c) => ({ ...c }));
        const targetIdx = next.findIndex((c) => c.driveState !== 'synced');
        if (targetIdx === -1) return prev;

        const target = next[targetIdx];
        const nextProg = Math.min(100, target.driveProgress + 34);
        target.driveProgress = nextProg;
        target.driveState = nextProg >= 100 ? 'synced' : 'uploading';

        if (nextProg >= 100) {
          triggerBackendDriveUpload(
            activeProject.id,
            target.id,
            automation.driveFolder
          ).catch(() => {});
        }
        return next;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [screen, automation.driveSyncWhileClipping, syncCycle, activeProject.id, automation.driveFolder, clips]);

  // Once all clips are verified in Google Drive, automatically purge residual heavy raw video
  useEffect(() => {
    const allSynced = clips.length > 0 && clips.every((c) => c.driveState === 'synced');
    if (!allSynced || !automation.autoPurgeRaw || activeProject.rawPurged) return;

    purgeResidualLocalRawFile(activeProject.uri).then(() => {
      setActiveProject((prev) => ({
        ...prev,
        driveSynced: true,
        rawPurged: true,
      }));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? { ...p, driveSynced: true, rawPurged: true }
            : p
        )
      );
    });
  }, [clips, automation.autoPurgeRaw, activeProject.id, activeProject.rawPurged, activeProject.uri]);

  function startClippingWithAutoDrive() {
    setClips(createGeneratedClips(automation.driveFolder));
    setSyncCycle((c) => c + 1);
    setScreen('analysis');
  }

  async function handlePickVideo() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        'Necesitamos acceso a tu galería de Fotos para importar videos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const newProj: VideoProject = {
        id: `p-${Date.now()}`,
        name: asset.fileName || 'Video_iPhone.mov',
        uri: asset.uri,
        durationSec: asset.duration ? Math.round(asset.duration / 1000) : 180,
        rawSizeMb: asset.fileSize ? Math.round(asset.fileSize / (1024 * 1024)) : 1420,
        finalSizeMb: 18.4,
        status: 'local',
        driveSynced: false,
        rawPurged: false,
      };
      setProjects((prev) => [newProj, ...prev]);
      setActiveProject(newProj);
      setScreen('import');
    } else {
      setScreen('import');
    }
  }

  function handleOpenProject(proj: VideoProject) {
    setActiveProject(proj);
    if (proj.status === 'ready') setScreen('publish');
    else if (proj.status === 'approval') setScreen('preview');
    else setScreen('import');
  }

  const showDock =
    screen === 'home' ||
    screen === 'editor' ||
    screen === 'publish' ||
    screen === 'cloud';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <View style={styles.body}>
        {screen === 'home' ? (
          <HomeScreen
            projects={projects}
            onPickVideo={handlePickVideo}
            onNavigate={setScreen}
            onOpenProject={handleOpenProject}
            autoPurgeEnabled={automation.autoPurgeRaw}
          />
        ) : null}

        {screen === 'import' ? (
          <ImportScreen
            project={activeProject}
            automation={automation}
            onUpdateAutomation={(patch) =>
              setAutomation((prev) => ({ ...prev, ...patch }))
            }
            onBack={() => setScreen('home')}
            onStartClipping={startClippingWithAutoDrive}
          />
        ) : null}

        {screen === 'analysis' ? (
          <AnalysisScreen
            clips={clips}
            autoDriveEnabled={automation.driveSyncWhileClipping}
            autoPurgeEnabled={automation.autoPurgeRaw}
            rawPurged={activeProject.rawPurged}
            rawSizeMb={activeProject.rawSizeMb}
            onBack={() => setScreen('import')}
            onSelectClip={() => setScreen('editor')}
            onOpenCloud={() => setScreen('cloud')}
            onRetryDriveSync={startClippingWithAutoDrive}
          />
        ) : null}

        {screen === 'editor' ? (
          <EditorScreen
            config={editorConfig}
            onUpdateConfig={(patch) =>
              setEditorConfig((prev) => ({ ...prev, ...patch }))
            }
            onBack={() => setScreen('analysis')}
            onGoPreview={() => setScreen('preview')}
          />
        ) : null}

        {screen === 'preview' ? (
          <PreviewGateScreen
            autoPurgeRaw={automation.autoPurgeRaw}
            onBack={() => setScreen('editor')}
            onApprove={() => setScreen('export')}
          />
        ) : null}

        {screen === 'export' ? (
          <ExportScreen
            autoPurgeRaw={automation.autoPurgeRaw}
            onClose={() => setScreen('home')}
            onGoPublish={() => setScreen('publish')}
          />
        ) : null}

        {screen === 'publish' ? <PublishScreen /> : null}

        {screen === 'cloud' ? (
          <CloudDriveScreen
            automation={automation}
            onUpdateAutomation={(patch) =>
              setAutomation((prev) => ({ ...prev, ...patch }))
            }
          />
        ) : null}
      </View>

      {showDock ? (
        <SafeAreaView edges={['bottom']}>
          <FloatingDock active={screen} onSelect={setScreen} />
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ClipIAApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
  },
});
