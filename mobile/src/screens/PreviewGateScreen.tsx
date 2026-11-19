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
  onBack: () => void;
  onApprove: () => void;
};

const FRAMES = [
  { time: '00:02', label: 'Inicio (Hook)', caption: '“¿SABÍAS ESTO?”', note: 'Face Lock centrado · 9:16 OK' },
  { time: '00:18', label: 'Clímax (Pico)', caption: '“CAMBIA **** TODO”', note: 'Auto-Zoom 1.15x · Censura OK' },
  { time: '00:34', label: 'Cierre (CTA)', caption: '“SÍGUEME AQUÍ”', note: 'Zona segura IG / YT / FB OK' },
];

export function PreviewGateScreen({ autoPurgeRaw, onBack, onApprove }: Props) {
  const [selected, setSelected] = useState(1);
  const active = FRAMES[selected];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StudioHeader
        title="Aprobación (3 Frames)"
        subtitle="SIN RENDER FINAL AÚN"
        subtitleColor={colors.warn}
        onBack={onBack}
      />

      <View style={styles.warnBanner}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.warn} />
        <Text style={styles.warnText}>
          Revisa estos 3 fotogramas generados por FFmpeg antes de aprobar el renderizado final.
        </Text>
      </View>

      {/* Main Frame Inspector */}
      <View style={styles.frameOuter}>
        <View style={styles.frameCard}>
          <View style={styles.frameTop}>
            <StatusPill label={`FRAME ${selected + 1}/3`} tone="neutral" />
            <StatusPill label={active.time} tone="accent" />
          </View>

          <View style={styles.frameCenter}>
            <View style={styles.frameAvatar}>
              <Ionicons name="film" size={28} color={colors.fg} />
            </View>
            <StatusPill label={active.label} tone="ok" />
          </View>

          <View style={styles.frameBottom}>
            <Text style={styles.frameCaption}>{active.caption}</Text>
            <Text style={styles.frameNote}>{active.note}</Text>
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
          <Text style={styles.sumKey}>Formato final</Text>
          <Text style={styles.sumVal}>1080×1920 · 30fps · H.264/AAC</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={styles.sumKey}>Al aprobar</Text>
          <Text style={[styles.sumVal, { color: colors.ok }]}>Render + Subida a Drive</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={styles.sumKey}>Video residual (2.4 GB)</Text>
          <Text style={[styles.sumVal, { color: autoPurgeRaw ? colors.ok : colors.warn }]}>
            {autoPurgeRaw ? 'Auto-borrado tras confirmar' : 'Conservar en iPhone'}
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
    height: 304,
    backgroundColor: '#131119',
    borderWidth: 2,
    borderColor: colors.acc,
    borderRadius: radius.sm,
    padding: 12,
    justifyContent: 'space-between',
  },
  frameTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frameCenter: {
    alignItems: 'center',
    gap: 10,
  },
  frameAvatar: {
    width: 66,
    height: 66,
    borderRadius: 99,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameBottom: {
    alignItems: 'center',
    gap: 4,
  },
  frameCaption: {
    color: colors.warn,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  frameNote: {
    color: colors.fg2,
    fontSize: 9,
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
