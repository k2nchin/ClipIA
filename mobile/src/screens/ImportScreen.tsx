import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import { colors, radius } from '../theme/tokens';
import { AutomationSettings, VideoProject } from '../types/clipia';
import {
  PrimaryButton,
  StatusPill,
  StudioHeader,
  SwitchRow,
  triggerHaptic,
} from '../components/StudioPrimitives';

type Props = {
  project: VideoProject;
  automation: AutomationSettings;
  onUpdateAutomation: (patch: Partial<AutomationSettings>) => void;
  onBack: () => void;
  onStartClipping: () => void;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ImportScreen({
  project,
  automation,
  onUpdateAutomation,
  onBack,
  onStartClipping,
}: Props) {
  const totalDur = Math.max(30, project.durationSec || 360);
  const [startSec, setStartSec] = useState(Math.round(totalDur * 0.12));
  const [endSec, setEndSec] = useState(Math.round(totalDur * 0.78));

  const player = useVideoPlayer(project.uri ?? null, (p) => {
    p.loop = true;
  });

  const segmentDur = Math.max(5, endSec - startSec);
  const savedGb = ((project.rawSizeMb - project.finalSizeMb) / 1024).toFixed(2);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StudioHeader
        title="Preparar Video"
        subtitle="RECORTE LOCAL EN IPHONE"
        subtitleColor={colors.ok}
        onBack={onBack}
      />

      {/* Video Player or Cinematic Preview */}
      <View style={styles.playerBox}>
        {project.uri ? (
          <VideoView
            player={player}
            style={styles.videoView}
            nativeControls
            contentFit="contain"
          />
        ) : (
          <View style={styles.mockPlayer}>
            <View style={styles.playerTopRow}>
              <StatusPill label={project.name} tone="neutral" />
              <StatusPill label={`${(project.rawSizeMb / 1024).toFixed(1)} GB RAW`} tone="red" />
            </View>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={24} color={colors.white} />
            </View>
            <View style={styles.playerBottomRow}>
              <Text style={styles.timeMono}>{formatTime(startSec)}</Text>
              <Text style={[styles.timeMono, { color: colors.acc }]}>
                TRAMO: {formatTime(segmentDur)}
              </Text>
              <Text style={styles.timeMono}>{formatTime(endSec)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Interval Trim Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>INTERVALO A CLIPEAR</Text>
          <Text style={styles.monoAccent}>
            {formatTime(startSec)} – {formatTime(endSec)}
          </Text>
        </View>

        {/* Waveform visualization */}
        <View style={styles.waveform}>
          {Array.from({ length: 28 }, (_, i) => {
            const pct = i / 27;
            const inRange = pct >= startSec / totalDur && pct <= endSec / totalDur;
            const height = 10 + ((i * 23 + 7) % 28);
            return (
              <View
                key={i}
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: inRange ? colors.acc : colors.lineStrong,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Tactile Trim Steppers */}
        <View style={styles.stepperGrid}>
          <View style={styles.stepperBox}>
            <Text style={styles.stepperLabel}>INICIO · {formatTime(startSec)}</Text>
            <View style={styles.stepperBtns}>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setStartSec((v) => Math.max(0, v - 10));
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>-10s</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setStartSec((v) => Math.min(endSec - 10, v + 10));
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+10s</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.stepperBox}>
            <Text style={styles.stepperLabel}>FINAL · {formatTime(endSec)}</Text>
            <View style={styles.stepperBtns}>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setEndSec((v) => Math.max(startSec + 10, v - 10));
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>-10s</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setEndSec((v) => Math.min(totalDur, v + 10));
                }}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+10s</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Google Drive Parallel Sync + Auto-Purge Residual Raw */}
      <View style={[styles.card, styles.highlightCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>AUTOMATIZACIÓN DRIVE & ESPACIO</Text>
          <StatusPill label={`AHORRA ${savedGb} GB`} tone="ok" />
        </View>

        <SwitchRow
          icon="cloud-upload-outline"
          iconColor={colors.ok}
          title="Subir a Drive mientras clipea"
          description={`Carpeta: ${automation.driveFolder}`}
          value={automation.driveSyncWhileClipping}
          onValueChange={(v) => onUpdateAutomation({ driveSyncWhileClipping: v })}
        />

        <View style={styles.divider} />

        <SwitchRow
          icon="trash-outline"
          iconColor={colors.acc}
          title="Borrar video residual pesado"
          description="Elimina el raw al terminar · Deja solo el clip final"
          value={automation.autoPurgeRaw}
          onValueChange={(v) => onUpdateAutomation({ autoPurgeRaw: v })}
        />
      </View>

      <PrimaryButton
        label="Iniciar Clipping IA + Drive Sync"
        icon="sparkles"
        onPress={onStartClipping}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 30,
    gap: 14,
  },
  playerBox: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.bg2,
    height: 205,
  },
  videoView: {
    width: '100%',
    height: '100%',
  },
  mockPlayer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: '#0D0C12',
  },
  playerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 99,
    backgroundColor: colors.accTint,
    borderWidth: 1,
    borderColor: colors.acc,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeMono: {
    color: colors.fg2,
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 15,
    gap: 12,
  },
  highlightCard: {
    borderColor: colors.accBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: colors.fg,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  monoAccent: {
    color: colors.acc,
    fontSize: 11,
    fontWeight: '800',
  },
  waveform: {
    height: 44,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    gap: 3,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
  stepperGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  stepperBox: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
    padding: 10,
    gap: 8,
  },
  stepperLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepperBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  stepBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: colors.bg3,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
  },
  stepBtnText: {
    color: colors.fg,
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
});
