import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { PlatformKey } from '../types/clipia';
import {
  PrimaryButton,
  StatusPill,
  SwitchRow,
  triggerHaptic,
} from '../components/StudioPrimitives';

const PRESET_CAPTIONS = [
  {
    title: '¡Esto cambia por completo cómo editas clips con IA! 🔥',
    body: 'Encuadre automático + subtítulos dinámicos en 30 segundos. ¿Lo probarías? 👇 #ClipIA #Shorts #Reels #IA',
  },
  {
    title: 'De 1 hora de podcast a 3 clips virales sin llenar tu iPhone ⚡',
    body: 'Subida automática a Google Drive + publicación directa en Instagram, YouTube y Facebook. #VideoEditing #Creadores',
  },
];

export function PublishScreen() {
  const [selected, setSelected] = useState<Record<PlatformKey, boolean>>({
    ig: true,
    yt: true,
    fb: true,
  });
  const [captionIdx, setCaptionIdx] = useState(0);
  const [title, setTitle] = useState(PRESET_CAPTIONS[0].title);
  const [body, setBody] = useState(PRESET_CAPTIONS[0].body);
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [status, setStatus] = useState<'idle' | 'publishing' | 'done'>('idle');

  const activeCount = Object.values(selected).filter(Boolean).length;

  function regenerateAI() {
    triggerHaptic();
    const next = (captionIdx + 1) % PRESET_CAPTIONS.length;
    setCaptionIdx(next);
    setTitle(PRESET_CAPTIONS[next].title);
    setBody(PRESET_CAPTIONS[next].body);
  }

  function handlePublish() {
    if (activeCount === 0) return;
    setStatus('publishing');
    setTimeout(() => {
      setStatus('done');
    }, 900);
  }

  const platforms: {
    key: PlatformKey;
    name: string;
    handle: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }[] = [
    { key: 'ig', name: 'Instagram Reels', handle: '@clipia.studio · Conectado', icon: 'logo-instagram', color: colors.ig },
    { key: 'yt', name: 'YouTube Shorts', handle: 'ClipIA Oficial · Conectado', icon: 'logo-youtube', color: colors.yt },
    { key: 'fb', name: 'Facebook Reels', handle: 'ClipIA Page · Conectado', icon: 'logo-facebook', color: colors.fb },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>PUBLICAR CLIP</Text>
          <Text style={styles.subtitle}>INSTAGRAM · YOUTUBE · FACEBOOK</Text>
        </View>
        <StatusPill label="DESDE DRIVE" tone="ok" />
      </View>

      {/* Clip Mini Summary */}
      <View style={styles.clipStrip}>
        <View style={styles.clipThumb}>
          <Ionicons name="play" size={18} color={colors.acc} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.clipName} numberOfLines={1}>
            Podcast_Ep42_Clip1.mp4
          </Text>
          <Text style={styles.clipMeta}>1080×1920 · 0:38 · 18.4 MB</Text>
          <Text style={styles.clipDrive}>✓ Verificado en Drive · Raw eliminado</Text>
        </View>
      </View>

      {/* Platform Multi-Select */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>DESTINOS DE PUBLICACIÓN ({activeCount}/3)</Text>
        {platforms.map((p, idx) => (
          <View key={p.key}>
            {idx > 0 ? <View style={styles.divider} /> : null}
            <View style={{ paddingVertical: 6 }}>
              {status === 'done' && selected[p.key] ? (
                <View style={styles.publishedRow}>
                  <View style={styles.pubLeft}>
                    <Ionicons name={p.icon} size={18} color={p.color} />
                    <View>
                      <Text style={styles.pubName}>{p.name}</Text>
                      <Text style={styles.pubHandle}>{p.handle}</Text>
                    </View>
                  </View>
                  <StatusPill
                    label={mode === 'now' ? 'PUBLICADO ✓' : 'PROGRAMADO ✓'}
                    tone="ok"
                  />
                </View>
              ) : (
                <SwitchRow
                  icon={p.icon}
                  iconColor={p.color}
                  title={p.name}
                  description={p.handle}
                  value={selected[p.key]}
                  onValueChange={(v) => {
                    setStatus('idle');
                    setSelected((prev) => ({ ...prev, [p.key]: v }));
                  }}
                />
              )}
            </View>
          </View>
        ))}
      </View>

      {/* AI Title & Hashtags Editor */}
      <View style={styles.card}>
        <View style={styles.aiHeader}>
          <Text style={styles.cardTitle}>✦ TÍTULO Y HASHTAGS IA</Text>
          <Pressable onPress={regenerateAI} style={styles.regenBtn}>
            <Text style={styles.regenText}>↻ REGENERAR</Text>
          </Pressable>
        </View>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Título del clip…"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />
        <TextInput
          value={body}
          onChangeText={setBody}
          multiline
          placeholder="Descripción y hashtags…"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, styles.textArea]}
        />
      </View>

      {/* Instant vs Schedule */}
      <View style={styles.modeBar}>
        <Pressable
          onPress={() => {
            triggerHaptic();
            setMode('now');
            setStatus('idle');
          }}
          style={[styles.modeBtn, mode === 'now' && styles.modeBtnActive]}
        >
          <Text style={[styles.modeText, mode === 'now' && { color: colors.white }]}>
            PUBLICAR AHORA
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            triggerHaptic();
            setMode('schedule');
            setStatus('idle');
          }}
          style={[styles.modeBtn, mode === 'schedule' && styles.modeBtnActive]}
        >
          <Text style={[styles.modeText, mode === 'schedule' && { color: colors.white }]}>
            PROGRAMAR · 19:00
          </Text>
        </Pressable>
      </View>

      <PrimaryButton
        disabled={activeCount === 0 || status === 'publishing'}
        tone={status === 'done' ? 'ok' : 'accent'}
        icon={status === 'done' ? 'checkmark-done' : 'paper-plane'}
        label={
          status === 'publishing'
            ? 'Publicando en redes…'
            : status === 'done'
              ? `${mode === 'now' ? 'Publicado' : 'Programado'} en ${activeCount} redes ✓`
              : `${mode === 'now' ? 'Publicar ahora' : 'Programar'} (${activeCount} redes)`
        }
        onPress={handlePublish}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.fg,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.acc,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginTop: 2,
  },
  clipStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
  },
  clipThumb: {
    width: 44,
    height: 54,
    borderRadius: radius.xs,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clipName: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '800',
  },
  clipMeta: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  clipDrive: {
    color: colors.ok,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  card: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 14,
    gap: 10,
  },
  cardTitle: {
    color: colors.fg2,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  publishedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pubLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pubName: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '800',
  },
  pubHandle: {
    color: colors.muted,
    fontSize: 11,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regenBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.xs,
  },
  regenText: {
    color: colors.acc,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
    color: colors.fg,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 68,
    textAlignVertical: 'top',
  },
  modeBar: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 4,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.xs,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: colors.acc,
  },
  modeText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
