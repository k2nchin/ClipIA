import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { AspectRatio, CaptionStyle, EditorConfig } from '../types/clipia';
import {
  StatusPill,
  StudioHeader,
  SwitchRow,
  triggerHaptic,
} from '../components/StudioPrimitives';

type Props = {
  config: EditorConfig;
  onUpdateConfig: (patch: Partial<EditorConfig>) => void;
  onBack: () => void;
  onGoPreview: () => void;
};

export function EditorScreen({ config, onUpdateConfig, onBack, onGoPreview }: Props) {
  const [toolTab, setToolTab] = useState<'format' | 'captions' | 'effects'>('format');
  const [playhead, setPlayhead] = useState(44);

  const canvasDims =
    config.aspectRatio === '9:16'
      ? { width: 172, height: 296 }
      : config.aspectRatio === '1:1'
        ? { width: 232, height: 232 }
        : { width: 310, height: 180 };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StudioHeader
        title="Editor Pro"
        subtitle={`${config.aspectRatio} · 30FPS · H.264`}
        onBack={onBack}
        rightElement={
          <Pressable
            onPress={() => {
              triggerHaptic();
              onGoPreview();
            }}
            style={styles.approveChip}
          >
            <Text style={styles.approveChipText}>APROBAR ›</Text>
          </Pressable>
        }
      />

      {/* Dynamic Aspect Ratio Stage */}
      <View style={styles.stageOuter}>
        <View style={[styles.canvas, canvasDims]}>
          <View style={styles.canvasTop}>
            <StatusPill label={config.aspectRatio} tone="neutral" />
            {config.autoZoom ? <StatusPill label="ZOOM IA" tone="accent" /> : null}
          </View>

          {/* Safe zone right column mockup for Reels/Shorts */}
          {config.safeZone && config.aspectRatio === '9:16' ? (
            <View style={styles.safeZoneIcons}>
              <Ionicons name="heart" size={14} color="rgba(255,255,255,0.32)" />
              <Ionicons name="chatbubble" size={14} color="rgba(255,255,255,0.32)" />
              <Ionicons name="paper-plane" size={14} color="rgba(255,255,255,0.32)" />
            </View>
          ) : null}

          {/* Subject + Face Lock Reticle */}
          <View style={styles.subjectWrap}>
            <View style={styles.subjectAvatar}>
              <Ionicons name="mic" size={26} color={colors.fg} />
            </View>
            {config.smartCrop ? (
              <View style={styles.faceBox}>
                <Text style={styles.faceLabel}>FACE LOCK</Text>
              </View>
            ) : null}
          </View>

          {/* Dynamic Captions Preview */}
          <View style={styles.captionWrap}>
            <Text
              style={[
                styles.captionText,
                config.captionStyle === 'pop' && styles.captionPop,
                config.captionStyle === 'magenta' && styles.captionMagenta,
                config.captionStyle === 'minimal' && styles.captionMinimal,
              ]}
            >
              {config.censorWords ? 'ESTO CAMBIA **** TODO' : 'ESTO CAMBIA BRUTAL TODO'}
            </Text>
          </View>
        </View>
      </View>

      {/* Tactile Timeline */}
      <View style={styles.card}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            00:{String(Math.round(playhead * 0.38)).padStart(2, '0')}
          </Text>
          <Text style={styles.timelineTag}>TIMELINE · AUDIO PEAKS</Text>
          <Text style={styles.timeMuted}>00:38</Text>
        </View>

        <View style={styles.waveform}>
          {Array.from({ length: 30 }, (_, i) => {
            const h = 8 + ((i * 29 + 11) % 28);
            const peak = h > 27;
            return (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  { height: h, backgroundColor: peak ? colors.acc : colors.lineStrong },
                ]}
              />
            );
          })}
          <View style={[styles.playheadLine, { left: `${playhead}%` }]} />
        </View>

        <View style={styles.scrubBtns}>
          <Pressable
            onPress={() => {
              triggerHaptic();
              setPlayhead((p) => Math.max(0, p - 12));
            }}
            style={styles.scrubBtn}
          >
            <Text style={styles.scrubBtnText}>‹ -5s</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              triggerHaptic();
              setPlayhead((p) => Math.min(100, p + 12));
            }}
            style={styles.scrubBtn}
          >
            <Text style={styles.scrubBtnText}>+5s ›</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom Tool Segmented Panel */}
      <View style={styles.card}>
        <View style={styles.segBar}>
          {[
            { id: 'format' as const, label: 'FORMATO' },
            { id: 'captions' as const, label: 'SUBTÍTULOS' },
            { id: 'effects' as const, label: 'EFECTOS' },
          ].map((t) => {
            const active = toolTab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => {
                  triggerHaptic();
                  setToolTab(t.id);
                }}
                style={[styles.segBtn, active && styles.segBtnActive]}
              >
                <Text style={[styles.segText, active && styles.segTextActive]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {toolTab === 'format' ? (
          <View style={{ gap: 12 }}>
            <View style={styles.ratioRow}>
              {(['9:16', '16:9', '1:1'] as AspectRatio[]).map((r) => {
                const active = config.aspectRatio === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => {
                      triggerHaptic();
                      onUpdateConfig({ aspectRatio: r });
                    }}
                    style={[styles.ratioBtn, active && styles.ratioBtnActive]}
                  >
                    <Text style={[styles.ratioTitle, active && { color: colors.white }]}>
                      {r}
                    </Text>
                    <Text style={[styles.ratioSub, active && { color: colors.fg }]}>
                      {r === '9:16' ? 'Reels/Shorts' : r === '16:9' ? 'YouTube' : 'Feed'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <SwitchRow
              title="Smart Crop (Face Track IA)"
              description="Sigue al hablante automáticamente"
              value={config.smartCrop}
              onValueChange={(v) => onUpdateConfig({ smartCrop: v })}
            />
            <SwitchRow
              title="Zona segura IG / YT / FB"
              description="Guías para evitar tapar subtítulos"
              value={config.safeZone}
              onValueChange={(v) => onUpdateConfig({ safeZone: v })}
            />
          </View>
        ) : null}

        {toolTab === 'captions' ? (
          <View style={{ gap: 12 }}>
            <View style={styles.ratioRow}>
              {(
                [
                  { id: 'pop', title: 'POP PRO', sub: 'Amarillo' },
                  { id: 'magenta', title: 'MAGENTA', sub: 'Studio' },
                  { id: 'minimal', title: 'MINIMAL', sub: 'Caja' },
                ] as { id: CaptionStyle; title: string; sub: string }[]
              ).map((c) => {
                const active = config.captionStyle === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => {
                      triggerHaptic();
                      onUpdateConfig({ captionStyle: c.id });
                    }}
                    style={[styles.ratioBtn, active && styles.ratioBtnActive]}
                  >
                    <Text style={[styles.ratioTitle, active && { color: colors.white }]}>
                      {c.title}
                    </Text>
                    <Text style={[styles.ratioSub, active && { color: colors.fg }]}>
                      {c.sub}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <SwitchRow
              title="Censura automática (Bleep)"
              description="Oculta palabras restringidas con ****"
              value={config.censorWords}
              onValueChange={(v) => onUpdateConfig({ censorWords: v })}
            />
          </View>
        ) : null}

        {toolTab === 'effects' ? (
          <View style={{ gap: 12 }}>
            <SwitchRow
              title="Auto-Zoom en picos de voz"
              description="Escala suave 1.15x en reacciones"
              value={config.autoZoom}
              onValueChange={(v) => onUpdateConfig({ autoZoom: v })}
            />
            <View style={styles.audioRow}>
              <Text style={styles.audioLabel}>Normalización voz (-14 LUFS)</Text>
              <StatusPill label="ACTIVO" tone="ok" />
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 12,
  },
  approveChip: {
    backgroundColor: colors.acc,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.xs,
  },
  approveChipText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stageOuter: {
    minHeight: 312,
    backgroundColor: '#050506',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  canvas: {
    backgroundColor: '#131119',
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.sm,
    padding: 10,
    justifyContent: 'space-between',
    position: 'relative',
  },
  canvasTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeZoneIcons: {
    position: 'absolute',
    right: 8,
    bottom: 62,
    gap: 10,
  },
  subjectWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectAvatar: {
    width: 64,
    height: 64,
    borderRadius: 99,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceBox: {
    position: 'absolute',
    top: -12,
    bottom: -12,
    left: -12,
    right: -12,
    borderWidth: 2,
    borderColor: colors.ok,
    borderRadius: radius.xs,
    alignItems: 'center',
  },
  faceLabel: {
    position: 'absolute',
    top: -16,
    backgroundColor: colors.ok,
    color: '#070708',
    fontSize: 7,
    fontWeight: '900',
    paddingHorizontal: 5,
    paddingVertical: 1,
    letterSpacing: 0.8,
  },
  captionWrap: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  captionText: {
    textAlign: 'center',
    fontWeight: '900',
  },
  captionPop: {
    color: colors.warn,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  captionMagenta: {
    color: colors.acc,
    fontSize: 13,
    letterSpacing: 0.6,
  },
  captionMinimal: {
    color: colors.white,
    fontSize: 11,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  card: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 13,
    gap: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: colors.fg,
    fontSize: 11,
    fontWeight: '800',
  },
  timelineTag: {
    color: colors.acc,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  timeMuted: {
    color: colors.muted,
    fontSize: 11,
  },
  waveform: {
    height: 40,
    backgroundColor: colors.bg,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 3,
    position: 'relative',
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
  },
  playheadLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.white,
  },
  scrubBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  scrubBtn: {
    flex: 1,
    paddingVertical: 7,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
    alignItems: 'center',
  },
  scrubBtnText: {
    color: colors.fg2,
    fontSize: 11,
    fontWeight: '800',
  },
  segBar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    padding: 4,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.xs,
  },
  segBtnActive: {
    backgroundColor: colors.acc,
  },
  segText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  segTextActive: {
    color: colors.white,
  },
  ratioRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratioBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: radius.xs,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  ratioBtnActive: {
    backgroundColor: colors.acc,
    borderColor: colors.acc,
  },
  ratioTitle: {
    color: colors.fg,
    fontSize: 12,
    fontWeight: '900',
  },
  ratioSub: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 2,
  },
  audioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  audioLabel: {
    color: colors.fg,
    fontSize: 12,
    fontWeight: '700',
  },
});
