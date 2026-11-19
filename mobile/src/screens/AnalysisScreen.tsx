import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { ViralClip } from '../types/clipia';
import { StatusPill, StudioHeader, triggerHaptic } from '../components/StudioPrimitives';

type Props = {
  clips: ViralClip[];
  autoDriveEnabled: boolean;
  autoPurgeEnabled: boolean;
  rawPurged: boolean;
  rawSizeMb: number;
  onBack: () => void;
  onSelectClip: (clip: ViralClip) => void;
  onOpenCloud: () => void;
  onRetryDriveSync: () => void;
};

export function AnalysisScreen({
  clips,
  autoDriveEnabled,
  autoPurgeEnabled,
  rawPurged,
  rawSizeMb,
  onBack,
  onSelectClip,
  onOpenCloud,
  onRetryDriveSync,
}: Props) {
  const [filter, setFilter] = useState<'all' | 'top' | 'drive'>('all');

  const syncedCount = clips.filter((c) => c.driveState === 'synced').length;
  const totalPct =
    clips.length > 0
      ? Math.round(
          clips.reduce((acc, c) => acc + c.driveProgress, 0) / clips.length
        )
      : 0;
  const allSynced = clips.length > 0 && syncedCount === clips.length;

  const filtered = clips.filter((c) => {
    if (filter === 'top') return c.score >= 90;
    if (filter === 'drive') return c.driveState === 'synced';
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StudioHeader
        title="Momentos Virales IA"
        subtitle={
          allSynced
            ? 'CLIPS EN DRIVE · AUTO-SYNC OK'
            : 'SUBIENDO CLIPS A DRIVE AUTOMÁTICAMENTE'
        }
        subtitleColor={allSynced ? colors.ok : colors.acc}
        onBack={onBack}
        rightElement={
          <Pressable onPress={onOpenCloud} style={styles.cloudBtn}>
            <Ionicons
              name={allSynced ? 'cloud-done' : 'cloud-upload-outline'}
              size={18}
              color={allSynced ? colors.ok : colors.acc}
            />
          </Pressable>
        }
      />

      {/* Automatic Parallel Drive Sync + Raw Purge Banner */}
      <View
        style={[
          styles.syncCard,
          allSynced && { borderColor: 'rgba(94, 230, 168, 0.45)' },
        ]}
      >
        <View style={styles.syncRow}>
          <Text style={styles.syncTitle}>
            {!autoDriveEnabled
              ? 'AUTO-SUBIDA A DRIVE PAUSADA'
              : allSynced
                ? '✓ TODOS LOS CLIPS SUBIDOS A GOOGLE DRIVE'
                : 'SUBIENDO CLIPS A DRIVE AUTOMÁTICAMENTE…'}
          </Text>
          <Text style={[styles.syncCount, allSynced && { color: colors.ok }]}>
            {syncedCount} / {clips.length}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${totalPct}%`,
                backgroundColor: allSynced ? colors.ok : colors.acc,
              },
            ]}
          />
        </View>

        <View style={styles.syncRow}>
          <Text style={styles.syncMeta}>
            {rawPurged
              ? `Raw residual (${(rawSizeMb / 1024).toFixed(2)} GB) borrado · Solo clips ligeros`
              : autoPurgeEnabled
                ? `Raw (${(rawSizeMb / 1024).toFixed(2)} GB) se borrará al terminar subida`
                : 'Auto-borrado de raw desactivado'}
          </Text>
          {allSynced ? (
            <Pressable onPress={onRetryDriveSync}>
              <Text style={[styles.syncMeta, { color: colors.ok, fontWeight: '900' }]}>
                {rawPurged ? 'RAW BORRADO ✓' : 'DRIVE OK ✓'}
              </Text>
            </Pressable>
          ) : (
            <Text style={[styles.syncMeta, { color: colors.acc, fontWeight: '800' }]}>
              {totalPct}%
            </Text>
          )}
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterRow}>
        {[
          { id: 'all' as const, label: `TODOS (${clips.length})` },
          { id: 'top' as const, label: 'SCORE 90+' },
          { id: 'drive' as const, label: `EN DRIVE (${syncedCount})` },
        ].map((item) => {
          const active = filter === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                triggerHaptic();
                setFilter(item.id);
              }}
              style={[styles.filterTab, active && styles.filterTabActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Viral Clips List */}
      <View style={{ gap: 12 }}>
        {filtered.map((clip) => {
          const driveLabel =
            clip.driveState === 'synced'
              ? 'EN DRIVE ✓'
              : clip.driveState === 'uploading'
                ? `SUBIENDO ${clip.driveProgress}%`
                : 'EN COLA DRIVE';

          return (
            <View key={clip.id} style={styles.clipCard}>
              <View style={styles.clipHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clipTitle}>{clip.title}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.clipRange}>
                      {clip.range} · {clip.duration}
                    </Text>
                    <StatusPill
                      label={driveLabel}
                      tone={
                        clip.driveState === 'synced'
                          ? 'ok'
                          : clip.driveState === 'uploading'
                            ? 'accent'
                            : 'neutral'
                      }
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.scoreBox,
                    {
                      borderColor: clip.score >= 90 ? colors.ok : colors.acc,
                      backgroundColor: clip.score >= 90 ? colors.okBg : colors.accTint,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreVal,
                      { color: clip.score >= 90 ? colors.ok : colors.acc },
                    ]}
                  >
                    {clip.score}
                  </Text>
                  <Text style={styles.scoreLabel}>VIRAL</Text>
                </View>
              </View>

              {/* Individual clip Drive upload progress */}
              {clip.driveState === 'uploading' ? (
                <View style={styles.miniTrack}>
                  <View
                    style={[styles.miniFill, { width: `${clip.driveProgress}%` }]}
                  />
                </View>
              ) : null}

              <View style={styles.quoteBox}>
                <Text style={styles.quoteText}>{clip.quote}</Text>
              </View>

              <View style={styles.clipFooter}>
                <View style={styles.tagsWrap}>
                  {clip.tags.map((t) => (
                    <StatusPill key={t} label={t} tone="neutral" />
                  ))}
                </View>
                <Pressable
                  onPress={() => {
                    triggerHaptic();
                    onSelectClip(clip);
                  }}
                  style={styles.editBtn}
                >
                  <Text style={styles.editBtnText}>EDITAR ›</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
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
  cloudBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.accBorder,
    borderRadius: radius.sm,
    padding: 14,
    gap: 9,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  syncTitle: {
    color: colors.fg,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.9,
    flex: 1,
  },
  syncCount: {
    color: colors.acc,
    fontSize: 12,
    fontWeight: '900',
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  syncMeta: {
    color: colors.muted,
    fontSize: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.bg2,
    padding: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.xs,
  },
  filterTabActive: {
    backgroundColor: colors.acc,
  },
  filterText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  filterTextActive: {
    color: colors.white,
  },
  clipCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 14,
    gap: 11,
  },
  clipHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  clipTitle: {
    color: colors.fg,
    fontSize: 14,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  clipRange: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  scoreBox: {
    width: 48,
    height: 48,
    borderRadius: radius.xs,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },
  miniTrack: {
    height: 4,
    backgroundColor: colors.bg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    backgroundColor: colors.acc,
  },
  quoteBox: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xs,
    padding: 10,
  },
  quoteText: {
    color: colors.fg2,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  clipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    flex: 1,
  },
  editBtn: {
    backgroundColor: colors.acc,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.xs,
  },
  editBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
