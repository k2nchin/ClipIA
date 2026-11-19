import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { AutomationSettings } from '../types/clipia';
import { StatusPill, SwitchRow } from '../components/StudioPrimitives';

type Props = {
  automation: AutomationSettings;
  onUpdateAutomation: (patch: Partial<AutomationSettings>) => void;
};

export function CloudDriveScreen({ automation, onUpdateAutomation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>DRIVE & NUBE IA</Text>
          <Text style={styles.subtitle}>AUTO-SYNC · AUTO-PURGE · REDES</Text>
        </View>
        <StatusPill label="● ONLINE" tone="ok" />
      </View>

      {/* Google Drive Storage Card */}
      <View style={[styles.card, { borderColor: colors.accBorder }]}>
        <View style={styles.driveRow}>
          <View style={styles.driveIconBox}>
            <Ionicons name="cloud-done" size={20} color={colors.ok} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driveTitle}>Google Drive Conectado</Text>
            <Text style={styles.driveSub}>Carpeta: {automation.driveFolder}</Text>
          </View>
          <Text style={styles.quotaText}>14.2 / 100 GB</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '18%' }]} />
        </View>
      </View>

      {/* Auto-Purge & Drive Rules */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>POLÍTICA DE ALMACENAMIENTO IPHONE</Text>
        <SwitchRow
          icon="cloud-upload-outline"
          iconColor={colors.ok}
          title="Subir a Drive mientras clipea"
          description="Streaming paralelo en segundo plano"
          value={automation.driveSyncWhileClipping}
          onValueChange={(v) => onUpdateAutomation({ driveSyncWhileClipping: v })}
        />
        <View style={styles.divider} />
        <SwitchRow
          icon="trash-outline"
          iconColor={colors.acc}
          title="Auto-borrar video residual pesado"
          description="Elimina archivos raw tras confirmar el clip en Drive"
          value={automation.autoPurgeRaw}
          onValueChange={(v) => onUpdateAutomation({ autoPurgeRaw: v })}
        />
        <View style={styles.divider} />
        <SwitchRow
          icon="film-outline"
          iconColor={colors.warn}
          title="Dejar solo el clip final ligero"
          description="Conserva únicamente el MP4 1080×1920 (~18 MB)"
          value={automation.keepFinalClipOnly}
          onValueChange={(v) => onUpdateAutomation({ keepFinalClipOnly: v })}
        />
      </View>

      {/* Connected Social Accounts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>CUENTAS CONECTADAS (OAUTH)</Text>
        {[
          { name: 'Instagram Reels', icon: 'logo-instagram' as const, color: colors.ig },
          { name: 'YouTube Shorts', icon: 'logo-youtube' as const, color: colors.yt },
          { name: 'Facebook Reels', icon: 'logo-facebook' as const, color: colors.fb },
        ].map((acc, idx) => (
          <View key={acc.name}>
            {idx > 0 ? <View style={styles.divider} /> : null}
            <View style={styles.socialRow}>
              <View style={styles.socialLeft}>
                <Ionicons name={acc.icon} size={18} color={acc.color} />
                <Text style={styles.socialName}>{acc.name}</Text>
              </View>
              <StatusPill label="CONECTADO ✓" tone="ok" />
            </View>
          </View>
        ))}
      </View>

      {/* Live Celery/Redis Queue */}
      <View style={styles.card}>
        <View style={styles.queueHeader}>
          <Text style={styles.cardTitle}>COLA CELERY / REDIS</Text>
          <Text style={styles.queuePct}>68%</Text>
        </View>
        <Text style={styles.queueDesc}>
          Entrevista_4K.mov → Whisper + Subida paralela a Drive
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '68%', backgroundColor: colors.acc }]} />
        </View>
      </View>
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
  card: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 15,
    gap: 12,
  },
  cardTitle: {
    color: colors.fg2,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  driveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driveIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.xs,
    backgroundColor: colors.okBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driveTitle: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '800',
  },
  driveSub: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  quotaText: {
    color: colors.ok,
    fontSize: 11,
    fontWeight: '800',
  },
  track: {
    height: 6,
    backgroundColor: colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.ok,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  socialName: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '700',
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queuePct: {
    color: colors.acc,
    fontSize: 12,
    fontWeight: '900',
  },
  queueDesc: {
    color: colors.muted,
    fontSize: 11,
  },
});
