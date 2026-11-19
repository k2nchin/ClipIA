import React, { useState } from 'react';
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
  watermark: string;
  onBack: () => void;
  onApprove: () => void;
};

const FRAMES = [
  { time: '00:02', label: 'Inicio (Hook)', caption: 'Mattia os pidió que os encargaseis,\ny lo hicisteis, ¿no?', note: 'Facecam + Blur ambiental OK' },
  { time: '00:18', label: 'Clímax (Reacción)', caption: 'No lo pongas difícil.\nEsto cambia **** todo.', note: 'Auto-Zoom 1.15x · Censura OK' },
  { time: '00:34', label: 'Cierre (CTA)', caption: 'Sígueme para más clips\nen directo hoy.', note: 'Zona segura IG / YT / FB OK' },
];

export function PreviewGateScreen({ autoPurgeRaw, watermark, onBack, onApprove }: Props) {
  const [selected, setSelected] = useState(0);
  const active = FRAMES[selected];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StudioHeader
        title="Aprobación (3 Frames)"
        subtitle="STREAMER SPLIT 1080×1920"
        subtitleColor={colors.warn}
        onBack={onBack}
      />

      <View style={styles.warnBanner}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.warn} />
        <Text style={styles.warnText}>
          Revisa los 3 fotogramas en formato Streamer Split (facecam con blur + video inferior + subtítulos) antes del render final.
        </Text>
      </View>

      {/* Main Frame Inspector in Streamer Split 9:16 */}
      <View style={styles.frameOuter}>
        <View style={styles.frameCard}>
          <View style={styles.topBlur}>
            <View style={styles.glowLeft} />
            <View style={styles.glowRight} />
            <View style={styles.frameTopBadges}>
              <StatusPill label={`FRAME ${selected + 1}/3`} tone="neutral" />
              <StatusPill label={active.time} tone="accent" />
            </View>
          </View>

          <View style={styles.bottomVideo}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="film-outline" size={24} color="rgba(255,255,255,0.22)" />
            </View>
            <View style={styles.frameBottom}>
              <Text style={styles.frameCaption}>{active.caption}</Text>
              <Text style={styles.frameNote}>{active.note}</Text>
            </View>
          </View>

          {/* Rounded Facecam Card */}
          <View style={styles.facecamCard}>
            <Ionicons name="headset" size={22} color={colors.fg} />
            {watermark.trim().length > 0 ? (
              <View style={styles.wmPill}>
                <Text style={styles.wmText} numberOfLines={1}>
                  {watermark}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* 3-Frame Selector Strip */}
      <View style={styles.strip}>
        {FRAMES.map((fr, idx) => {
          const isSelected = idx === selected;
          return (
            <Pressable
              key={fr.time}
              onPress={() => {
                triggerHaptic();
                setSelected(idx);
              }}
              style={[styles.thumbBtn, isSelected && styles.thumbBtnActive]}
            >
              <Text style={[styles.thumbTime, isSelected && { color: colors.white }]}>
                {fr.time}
              </Text>
              <Text style={styles.thumbLabel} numberOfLines={1}>
                {fr.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Pipeline Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.sumRow}>
          <Text style={styles.sumKey}>Layout</Text>
          <Text style={styles.sumVal}>Streamer Split (Blur + Facecam)</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={styles.sumKey}>Formato final</Text>
          <Text style={styles.sumVal}>1080×1920 · 30fps · H.264/AAC</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={styles.sumKey}>Video residual (2.4 GB)</Text>
          <Text style={[styles.sumVal, { color: autoPurgeRaw ? colors.ok : colors.warn }]}>
            {autoPurgeRaw ? 'Auto-borrado tras subir a Drive' : 'Conservar en iPhone'}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <View style={{ flex: 1 }}>
          <PrimaryButton label="Ajustar" tone="outline" onPress={onBack} />
        </View>
        <View style={{ flex: 1.4 }}>
          <PrimaryButton
            label="Aprobar y Renderizar"
            icon="checkmark-circle"
            tone="ok"
            onPress={onApprove}
          />
        </View>
      </View>
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
  warnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.warnBg,
    borderWidth: 1,
    borderColor: 'rgba(255,179,92,0.35)',
    borderRadius: radius.sm,
  },
  warnText: {
    flex: 1,
    color: colors.warnText,
    fontSize: 11,
    lineHeight: 16,
  },
  frameOuter: {
    alignItems: 'center',
  },
  frameCard: {
    width: 196,
    height: 336,
    backgroundColor: '#12100E',
    borderWidth: 2,
    borderColor: colors.acc,
    borderRadius: radius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  topBlur: {
    height: '38%',
    backgroundColor: '#6D147E',
    padding: 8,
    overflow: 'hidden',
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
  frameTopBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  bottomVideo: {
    flex: 1,
    backgroundColor: '#12100E',
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 22,
  },
  facecamCard: {
    position: 'absolute',
    top: 32,
    alignSelf: 'center',
    width: 102,
    height: 104,
    borderRadius: 12,
    backgroundColor: '#241838',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  wmPill: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: '90%',
  },
  wmText: {
    color: colors.white,
    fontSize: 6.5,
    fontWeight: '900',
  },
  frameBottom: {
    alignItems: 'center',
    gap: 4,
  },
  frameCaption: {
    color: '#F5F3EF',
    fontSize: 9.5,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 13,
  },
  frameNote: {
    color: colors.ok,
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
  },
  strip: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
    alignItems: 'center',
    gap: 3,
  },
  thumbBtnActive: {
    borderColor: colors.acc,
    backgroundColor: colors.accTint,
  },
  thumbTime: {
    color: colors.fg,
    fontSize: 11,
    fontWeight: '900',
  },
  thumbLabel: {
    color: colors.muted,
    fontSize: 9,
  },
  summaryCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 14,
    gap: 9,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumKey: {
    color: colors.muted,
    fontSize: 11,
  },
  sumVal: {
    color: colors.fg,
    fontSize: 11,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
