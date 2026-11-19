import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { AspectRatio, CaptionStyle, EditorConfig, LayoutPreset } from '../types/clipia';
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
      ? { width: 186, height: 330 }
      : config.aspectRatio === '1:1'
        ? { width: 236, height: 236 }
        : { width: 310, height: 180 };

  const isStreamerSplit =
    config.aspectRatio === '9:16' && config.layoutPreset === 'streamer_split';

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StudioHeader
        title="Editor Pro"
        subtitle={`${config.aspectRatio} · ${
          isStreamerSplit ? 'STREAMER SPLIT' : config.layoutPreset.toUpperCase()
        }`}
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
          {isStreamerSplit ? (
            /* EXACT STREAMER SPLIT LAYOUT: Blurred Ambient Top + Rounded Facecam Card + Full Bottom Content */
            <View style={styles.splitContainer}>
              {/* Top 38% Blurred Ambient Backdrop */}
              <View
                style={[
                  styles.topAmbientZone,
                  !config.blurBackdrop && { backgroundColor: '#121018' },
                ]}
              >
                {config.blurBackdrop ? (
                  <>
                    <View style={styles.glowLeft} />
                    <View style={styles.glowRight} />
                  </>
                ) : null}
              </View>

              {/* Bottom 62% Reaction / Main Content Video */}
              <View style={styles.bottomContentZone}>
                <View style={styles.scenePlaceholder}>
                  <Ionicons name="film-outline" size={26} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.sceneLabel}>VIDEO REACCIÓN / GAMEPLAY</Text>
                </View>

                {/* Clean Centered Subtitles in Lower Safe Zone */}
                <View style={styles.captionWrap}>
                  <Text
                    style={[
                      styles.captionText,
                      config.captionStyle === 'clean' && styles.captionClean,
                      config.captionStyle === 'pop' && styles.captionPop,
                      config.captionStyle === 'magenta' && styles.captionMagenta,
                    ]}
                  >
                    {config.censorWords
                      ? 'Esto cambia **** por completo,\n¿no lo pongas difícil?'
                      : 'Mattia os pidió que os encargaseis,\ny lo hicisteis, ¿no?'}
                  </Text>
                </View>
              </View>

              {/* Floating Rounded Facecam Card overlapping seam */}
              <View style={styles.facecamCard}>
                <View style={styles.facecamInner}>
                  <Ionicons name="headset" size={24} color={colors.fg} />
                  {config.smartCrop ? (
                    <View style={styles.faceLockPill}>
                      <Text style={styles.faceLockText}>FACE LOCK</Text>
                    </View>
                  ) : null}
                </View>
                {config.creatorWatermark.trim().length > 0 ? (
                  <View style={styles.watermarkPill}>
                    <Text style={styles.watermarkText} numberOfLines={1}>
                      {config.creatorWatermark}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Safe zone right column mockup for Reels/Shorts */}
              {config.safeZone ? (
                <View style={styles.safeZoneIcons}>
                  <Ionicons name="heart" size={13} color="rgba(255,255,255,0.35)" />
                  <Ionicons name="chatbubble" size={13} color="rgba(255,255,255,0.35)" />
                  <Ionicons name="paper-plane" size={13} color="rgba(255,255,255,0.35)" />
                </View>
              ) : null}
            </View>
          ) : (
            /* Standard Full / 50-50 Canvas */
            <View style={styles.standardCanvas}>
              <View style={styles.canvasTop}>
                <StatusPill label={config.aspectRatio} tone="neutral" />
                {config.autoZoom ? <StatusPill label="ZOOM IA" tone="accent" /> : null}
              </View>

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

              <View style={styles.captionWrap}>
                <Text
                  style={[
                    styles.captionText,
                    config.captionStyle === 'clean' && styles.captionClean,
                    config.captionStyle === 'pop' && styles.captionPop,
                    config.captionStyle === 'magenta' && styles.captionMagenta,
                  ]}
                >
                  {config.censorWords ? 'ESTO CAMBIA **** TODO' : 'ESTO CAMBIA BRUTAL TODO'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Tactile Timeline */}
      <View style={styles.card}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            00:{String(Math.round(playhead * 0.38)).padStart(2, '0')}
          </Text>
          <Text style={styles.timelineTag}>TIMELINE · FACECAM + VIDEO</Text>
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
            { id: 'format' as const, label: 'LAYOUT' },
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
            {/* Layout Presets */}
            <View style={styles.ratioRow}>
              {(
                [
                  { id: 'streamer_split', title: 'STREAMER', sub: 'Facecam + Blur' },
                  { id: 'full_vertical', title: 'FULL 9:16', sub: 'Pantalla llena' },
                  { id: 'split_50_50', title: '50 / 50', sub: 'Doble corte' },
                ] as { id: LayoutPreset; title: string; sub: string }[]
              ).map((lp) => {
                const active = config.layoutPreset === lp.id;
                return (
                  <Pressable
                    key={lp.id}
                    onPress={() => {
                      triggerHaptic();
                      onUpdateConfig({ layoutPreset: lp.id, aspectRatio: '9:16' });
                    }}
                    style={[styles.ratioBtn, active && styles.ratioBtnActive]}
                  >
                    <Text style={[styles.ratioTitle, active && { color: colors.white }]}>
                      {lp.title}
                    </Text>
                    <Text style={[styles.ratioSub, active && { color: colors.fg }]}>
                      {lp.sub}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Aspect Ratio Selector */}
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
                    style={[styles.miniRatioBtn, active && styles.miniRatioBtnActive]}
                  >
                    <Text style={[styles.miniRatioText, active && { color: colors.white }]}>
                      {r}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <SwitchRow
              title="Fondo difuminado (Blur Neon)"
              description="Rellena los laterales de la cámara con blur ambiental"
              value={config.blurBackdrop}
              onValueChange={(v) => onUpdateConfig({ blurBackdrop: v })}
            />

            <View style={{ gap: 6 }}>
              <Text style={styles.fieldLabel}>MARCA DE AGUA / CANAL (EN FACECAM)</Text>
              <TextInput
                value={config.creatorWatermark}
                onChangeText={(t) => onUpdateConfig({ creatorWatermark: t })}
                placeholder="Ej. KICK.COM/TU_CANAL"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
            </View>
          </View>
        ) : null}

        {toolTab === 'captions' ? (
          <View style={{ gap: 12 }}>
            <View style={styles.ratioRow}>
              {(
                [
                  { id: 'clean', title: 'CLEAN', sub: 'Blanco nítido' },
                  { id: 'pop', title: 'POP PRO', sub: 'Amarillo' },
                  { id: 'magenta', title: 'MAGENTA', sub: 'Studio' },
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
              title="Smart Crop (Face Track IA)"
              description="Centra tu rostro dentro de la tarjeta superior"
              value={config.smartCrop}
              onValueChange={(v) => onUpdateConfig({ smartCrop: v })}
            />
            <SwitchRow
              title="Auto-Zoom en picos de voz"
              description="Escala suave 1.15x en reacciones"
              value={config.autoZoom}
              onValueChange={(v) => onUpdateConfig({ autoZoom: v })}
            />
            <SwitchRow
              title="Zona segura IG / YT / FB"
              description="Guías para evitar tapar subtítulos"
              value={config.safeZone}
              onValueChange={(v) => onUpdateConfig({ safeZone: v })}
            />
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
    minHeight: 346,
    backgroundColor: '#050506',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  canvas: {
    backgroundColor: '#0D0C12',
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  splitContainer: {
    flex: 1,
    position: 'relative',
  },
  topAmbientZone: {
    height: '38%',
    backgroundColor: '#6D147E',
    overflow: 'hidden',
    position: 'relative',
  },
  glowLeft: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 110,
    height: 110,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 10, 138, 0.55)',
  },
  glowRight: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 110,
    height: 110,
    borderRadius: 99,
    backgroundColor: 'rgba(139, 92, 246, 0.55)',
  },
  bottomContentZone: {
    flex: 1,
    backgroundColor: '#12100E',
    justifyContent: 'space-between',
    paddingTop: 22,
    paddingBottom: 14,
    paddingHorizontal: 10,
  },
  scenePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  sceneLabel: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  facecamCard: {
    position: 'absolute',
    top: 26,
    alignSelf: 'center',
    width: 104,
    height: 106,
    borderRadius: 12,
    backgroundColor: '#241838',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  facecamInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  faceLockPill: {
    backgroundColor: colors.ok,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  faceLockText: {
    color: '#070708',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  watermarkPill: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: '92%',
  },
  watermarkText: {
    color: colors.white,
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  standardCanvas: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  canvasTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeZoneIcons: {
    position: 'absolute',
    right: 7,
    bottom: 48,
    gap: 9,
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
    paddingHorizontal: 6,
  },
  captionText: {
    textAlign: 'center',
  },
  captionClean: {
    color: '#F5F3EF',
    fontSize: 8.5,
    fontWeight: '700',
    lineHeight: 12,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  captionPop: {
    color: colors.warn,
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 13,
  },
  captionMagenta: {
    color: colors.acc,
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 13,
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
    fontSize: 11,
    fontWeight: '900',
  },
  ratioSub: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 2,
  },
  miniRatioBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: radius.xs,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  miniRatioBtnActive: {
    borderColor: colors.acc,
    backgroundColor: colors.accTint,
  },
  miniRatioText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
    color: colors.fg,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
});
