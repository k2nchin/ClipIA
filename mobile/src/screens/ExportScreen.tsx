import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import {
  PrimaryButton,
  StatusPill,
  StudioHeader,
  triggerHaptic,
} from '../components/StudioPrimitives';

type Props = {
  autoPurgeRaw: boolean;
  onClose: () => void;
  onGoPublish: () => void;
};

export function ExportScreen({ autoPurgeRaw, onClose, onGoPublish }: Props) {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    if (progress >= 100) return;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return Math.min(100, p + 20);
      });
    }, 450);
    return () => clearInterval(timer);
  }, [progress]);

  const done = progress >= 100;

  const stages = [
    { label: 'FFmpeg Render 1080×1920 · H.264/AAC', min: 35, tag: '18.4 MB' },
    { label: 'Subida paralela a Google Drive (/ClipIA)', min: 70, tag: 'DRIVE ✓' },
    {
      label: autoPurgeRaw
        ? 'Auto-borrado de video residual (2.4 GB)'
        : 'Video raw conservado en dispositivo',
      min: 100,
      tag: autoPurgeRaw ? 'BORRADO ✓' : 'GUARDADO',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StudioHeader
        title="Render & Auto-Drive"
        subtitle={done ? 'COMPLETADO Y LIMPIO' : 'PROCESANDO EN SERVIDOR'}
        subtitleColor={done ? colors.ok : colors.acc}
        onBack={onClose}
        rightElement={
          <Pressable
            onPress={() => {
              triggerHaptic();
              setProgress(15);
            }}
            style={styles.replayBtn}
          >
            <Text style={styles.replayText}>↻ SIMULAR</Text>
          </Pressable>
        }
      />

      {/* Main Progress Card */}
      <View style={[styles.heroCard, done && { borderColor: colors.ok }]}>
        <View
          style={[
            styles.circle,
            {
              borderColor: done ? colors.ok : colors.acc,
              backgroundColor: done ? colors.okBg : colors.accTint,
            },
          ]}
        >
          <Text style={[styles.circleText, { color: done ? colors.ok : colors.acc }]}>
            {done ? '✓' : `${progress}%`}
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          {done ? 'CLIP LISTO · RAW ELIMINADO' : 'RENDERIZANDO Y SUBIENDO A DRIVE…'}
        </Text>
        <Text style={styles.heroDesc}>
          {done
            ? 'Tu clip final de 18.4 MB quedó respaldado en Google Drive y el video pesado fue eliminado.'
            : 'Subiendo en paralelo a Google Drive sin consumir batería ni almacenamiento en tu iPhone.'}
        </Text>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${progress}%`,
                backgroundColor: done ? colors.ok : colors.acc,
              },
            ]}
          />
        </View>
      </View>

      {/* Pipeline Checklist */}
      <View style={styles.card}>
        {stages.map((st) => {
          const ok = progress >= st.min;
          return (
            <View key={st.label} style={styles.stageRow}>
              <Text style={[styles.stageText, !ok && { color: colors.muted }]}>
                {st.label}
              </Text>
              <StatusPill label={ok ? st.tag : '…'} tone={ok ? 'ok' : 'neutral'} />
            </View>
          );
        })}
      </View>

      {/* Storage Freed Banner */}
      <View style={styles.freedBanner}>
        <Ionicons name="trash-bin-outline" size={20} color={colors.ok} />
        <View style={{ flex: 1 }}>
          <Text style={styles.freedTitle}>2.38 GB LIBERADOS AUTOMÁTICAMENTE</Text>
          <Text style={styles.freedDesc}>
            Raw de 2.4 GB borrado · Solo queda tu clip final de 18.4 MB
          </Text>
        </View>
      </View>

      <PrimaryButton
        label="Publicar en IG · YouTube · Facebook"
        icon="paper-plane"
        disabled={!done}
        onPress={onGoPublish}
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
  replayBtn: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
  },
  replayText: {
    color: colors.acc,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.accBorder,
    borderRadius: radius.sm,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  circle: {
    width: 78,
    height: 78,
    borderRadius: 99,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: 22,
    fontWeight: '900',
  },
  heroTitle: {
    color: colors.fg,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  heroDesc: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  track: {
    width: '100%',
    height: 7,
    backgroundColor: colors.bg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  card: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 14,
    gap: 12,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  stageText: {
    flex: 1,
    color: colors.fg,
    fontSize: 12,
    fontWeight: '700',
  },
  freedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.okBg,
    borderWidth: 1,
    borderColor: 'rgba(94,230,168,0.35)',
    borderRadius: radius.sm,
  },
  freedTitle: {
    color: colors.ok,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  freedDesc: {
    color: colors.okText,
    fontSize: 11,
    marginTop: 2,
  },
});
