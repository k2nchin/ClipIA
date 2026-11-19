import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { ScreenId, VideoProject } from '../types/clipia';
import { PrimaryButton, StatusPill, triggerHaptic } from '../components/StudioPrimitives';

type Props = {
  projects: VideoProject[];
  onPickVideo: () => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenProject: (project: VideoProject) => void;
  autoPurgeEnabled: boolean;
};

export function HomeScreen({
  projects,
  onPickVideo,
  onNavigate,
  onOpenProject,
  autoPurgeEnabled,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Brand Bar (Content Scheduler Studio Vibe) */}
      <View style={styles.brandBar}>
        <View style={styles.brandLeft}>
          <View style={styles.logoMark}>
            <Ionicons name="play" size={16} color={colors.white} />
          </View>
          <View>
            <Text style={styles.logoText}>
              CLIP<Text style={{ color: colors.acc }}>IA.</Text>
            </Text>
            <Text style={styles.logoSub}>IOS AI VIDEO STUDIO</Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            triggerHaptic();
            onNavigate('cloud');
          }}
          style={styles.driveChip}
        >
          <View style={styles.liveDot} />
          <Text style={styles.driveChipText}>2.4 GB LIBRES</Text>
        </Pressable>
      </View>

      {/* Editorial Hero Panel */}
      <View style={styles.heroCard}>
        <View style={styles.heroTagRow}>
          <View style={styles.heroDot} />
          <Text style={styles.heroTag}>DRIVE AUTO-SYNC · IG · YT · FB</Text>
        </View>

        <Text style={styles.heroTitle}>
          CLIPEA EN SEGUNDOS.{'\n'}
          <Text style={{ color: colors.acc }}>CERO PESO</Text> EN TU IPHONE.
        </Text>

        <Text style={styles.heroDesc}>
          Sube a Google Drive mientras clipea, borra el video raw pesado y
          publica directo a Facebook, Instagram y YouTube.
        </Text>

        <View style={{ marginTop: 18 }}>
          <PrimaryButton
            label="Importar video desde Fotos"
            icon="add-circle-outline"
            onPress={onPickVideo}
          />
        </View>
      </View>

      {/* Magenta Ticker Strip (Content Scheduler Signature) */}
      <View style={styles.tickerStrip}>
        <Text style={styles.tickerText} numberOfLines={1}>
          ✦  INSTAGRAM  ✦  YOUTUBE  ✦  FACEBOOK  ✦  GOOGLE DRIVE  ✦
        </Text>
      </View>

      {/* Auto-Purge & Drive Live Banner */}
      <Pressable
        onPress={() => {
          triggerHaptic();
          onNavigate('cloud');
        }}
        style={styles.autoPurgeBanner}
      >
        <View style={styles.purgeIcon}>
          <Ionicons name="trash-outline" size={18} color={colors.ok} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.purgeTitle}>
            Auto-borrado de Raw {autoPurgeEnabled ? 'activo' : 'pausado'}
          </Text>
          <Text style={styles.purgeDesc}>
            Sube a Drive en paralelo · Conserva solo el clip final
          </Text>
        </View>
        <StatusPill label={autoPurgeEnabled ? 'ON' : 'OFF'} tone={autoPurgeEnabled ? 'ok' : 'neutral'} />
      </Pressable>

      {/* 2x2 Pro AI Modules */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HERRAMIENTAS IA</Text>
        <Text style={styles.sectionMeta}>GPU CLOUD</Text>
      </View>

      <View style={styles.grid}>
        <Pressable
          onPress={() => {
            triggerHaptic();
            onNavigate('analysis');
          }}
          style={styles.toolCard}
        >
          <Ionicons name="sparkles" size={20} color={colors.acc} />
          <Text style={styles.toolTitle}>AI Clipping</Text>
          <Text style={styles.toolDesc}>Detecta hooks, gritos y picos virales.</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic();
            onNavigate('editor');
          }}
          style={styles.toolCard}
        >
          <Ionicons name="chatbox-ellipses" size={20} color={colors.warn} />
          <Text style={styles.toolTitle}>Subtítulos + Bleep</Text>
          <Text style={styles.toolDesc}>Whisper dinámico + censura automática.</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic();
            onNavigate('publish');
          }}
          style={styles.toolCard}
        >
          <Ionicons name="paper-plane" size={20} color={colors.fg} />
          <Text style={styles.toolTitle}>Multi-Publicar</Text>
          <Text style={styles.toolDesc}>Facebook, Instagram y YouTube a la vez.</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic();
            onNavigate('cloud');
          }}
          style={styles.toolCard}
        >
          <Ionicons name="cloud-upload" size={20} color={colors.ok} />
          <Text style={styles.toolTitle}>Drive Auto-Sync</Text>
          <Text style={styles.toolDesc}>Respaldo paralelo y limpieza de raw.</Text>
        </Pressable>
      </View>

      {/* Recent Projects */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CLIPS RECIENTES</Text>
        <Pressable onPress={() => onNavigate('analysis')}>
          <Text style={styles.sectionLink}>VER TODOS ›</Text>
        </Pressable>
      </View>

      <View style={{ gap: 10 }}>
        {projects.map((proj) => (
          <Pressable
            key={proj.id}
            onPress={() => {
              triggerHaptic();
              onOpenProject(proj);
            }}
            style={styles.projectCard}
          >
            <View style={styles.projectThumb}>
              <Ionicons
                name={proj.status === 'ready' ? 'play' : 'film-outline'}
                size={18}
                color={proj.status === 'approval' ? colors.warn : colors.acc}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.projectName} numberOfLines={1}>
                {proj.name}
              </Text>
              <View style={styles.badgeRow}>
                {proj.driveSynced ? <StatusPill label="EN DRIVE ✓" tone="ok" /> : null}
                {proj.rawPurged ? <StatusPill label="RAW BORRADO" tone="neutral" /> : null}
                {proj.status === 'approval' ? (
                  <StatusPill label="APROBAR 3 FRAMES" tone="warn" />
                ) : null}
                {proj.status === 'local' ? (
                  <StatusPill label="LISTO PARA TRIM" tone="accent" />
                ) : null}
              </View>
              <Text style={styles.projectMeta}>
                {proj.rawPurged
                  ? `${proj.finalSizeMb} MB final · ${proj.rawSizeMb} MB raw eliminado`
                  : `${proj.rawSizeMb} MB raw local · Toca para abrir`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.footer}>CLIPIA IOS PRO · VERSION 0.2.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 24,
  },
  brandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 34,
    height: 34,
    backgroundColor: colors.acc,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.fg,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  logoSub: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  driveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: colors.ok,
  },
  driveChipText: {
    color: colors.fg,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 18,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.bg,
    marginBottom: 14,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: colors.acc,
  },
  heroTag: {
    color: colors.fg2,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: colors.fg,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 33,
    letterSpacing: -0.3,
  },
  heroDesc: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  tickerStrip: {
    backgroundColor: colors.acc,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 14,
    marginBottom: 16,
    borderRadius: radius.xs,
    alignItems: 'center',
  },
  tickerText: {
    color: '#070708',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  autoPurgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    marginBottom: 22,
  },
  purgeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    backgroundColor: colors.okBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purgeTitle: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '800',
  },
  purgeDesc: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.fg,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  sectionMeta: {
    color: colors.acc,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  sectionLink: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  toolCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 14,
    minHeight: 112,
    justifyContent: 'space-between',
  },
  toolTitle: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },
  toolDesc: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  projectThumb: {
    width: 44,
    height: 52,
    borderRadius: radius.xs,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectName: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
  },
  projectMeta: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 5,
  },
  footer: {
    color: colors.placeholder,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 26,
  },
});
