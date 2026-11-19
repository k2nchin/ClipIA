import React from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { colors, radius } from '../theme/tokens';
import { ScreenId } from '../types/clipia';

export function triggerHaptic() {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

export function StudioHeader({
  title,
  subtitle,
  subtitleColor = colors.acc,
  onBack,
  rightElement,
}: {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          onPress={() => {
            triggerHaptic();
            onBack();
          }}
          style={styles.iconBtn}
        >
          <Ionicons name="chevron-back" size={20} color={colors.fg} />
        </Pressable>
      ) : (
        <View style={styles.iconSpacer} />
      )}

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.headerSubtitle, { color: subtitleColor }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.headerRight}>
        {rightElement ?? <View style={styles.iconSpacer} />}
      </View>
    </View>
  );
}

export function StatusPill({
  label,
  tone = 'accent',
}: {
  label: string;
  tone?: 'accent' | 'ok' | 'warn' | 'red' | 'neutral';
}) {
  const palette = {
    accent: { bg: colors.accTint, border: colors.accBorder, text: colors.acc },
    ok: { bg: colors.okBg, border: 'rgba(94,230,168,0.35)', text: colors.ok },
    warn: { bg: colors.warnBg, border: 'rgba(255,179,92,0.35)', text: colors.warn },
    red: { bg: colors.redBg, border: 'rgba(255,107,107,0.35)', text: colors.red },
    neutral: { bg: colors.bg3, border: colors.line, text: colors.fg2 },
  }[tone];

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: palette.bg, borderColor: palette.border },
      ]}
    >
      <Text style={[styles.pillText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  icon,
  onPress,
  tone = 'accent',
  disabled = false,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  tone?: 'accent' | 'ok' | 'outline';
  disabled?: boolean;
}) {
  const bg =
    tone === 'accent'
      ? colors.acc
      : tone === 'ok'
        ? colors.ok
        : colors.bg2;
  const textColor =
    tone === 'ok' ? '#070708' : tone === 'outline' ? colors.fg : colors.white;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        triggerHaptic();
        onPress();
      }}
      style={({ pressed }) => [
        styles.primaryBtn,
        {
          backgroundColor: bg,
          borderColor: tone === 'outline' ? colors.lineStrong : 'transparent',
          borderWidth: tone === 'outline' ? 1 : 0,
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
        },
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={textColor} /> : null}
      <Text style={[styles.primaryBtnText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function SwitchRow({
  title,
  description,
  value,
  onValueChange,
  icon,
  iconColor = colors.acc,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}) {
  return (
    <View style={styles.switchRow}>
      {icon ? (
        <View style={styles.switchIconBox}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.switchTitle}>{title}</Text>
        <Text style={styles.switchDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          triggerHaptic();
          onValueChange(v);
        }}
        trackColor={{ false: colors.lineStrong, true: colors.acc }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.lineStrong}
      />
    </View>
  );
}

export function FloatingDock({
  active,
  onSelect,
}: {
  active: ScreenId;
  onSelect: (id: ScreenId) => void;
}) {
  const tabs: { id: ScreenId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'home', label: 'INICIO', icon: 'grid' },
    { id: 'editor', label: 'EDITOR', icon: 'cut' },
    { id: 'publish', label: 'PUBLICAR', icon: 'paper-plane' },
    { id: 'cloud', label: 'DRIVE', icon: 'cloud-done' },
  ];

  return (
    <View style={styles.dockOuter}>
      <BlurView intensity={45} tint="dark" style={styles.dockBlur}>
        <View style={styles.dockInner}>
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => {
                  triggerHaptic();
                  onSelect(tab.id);
                }}
                style={[styles.dockItem, isActive && styles.dockItemActive]}
              >
                <Ionicons
                  name={tab.icon}
                  size={19}
                  color={isActive ? colors.acc : colors.muted}
                />
                <Text
                  style={[
                    styles.dockLabel,
                    { color: isActive ? colors.fg : colors.muted },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: 38,
    height: 38,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: colors.fg,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  headerRight: {
    minWidth: 38,
    alignItems: 'flex-end',
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  primaryBtn: {
    height: 50,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchIconBox: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: {
    color: colors.fg,
    fontSize: 13,
    fontWeight: '700',
  },
  switchDesc: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  dockOuter: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  dockBlur: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  dockInner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 16, 18, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    gap: 3,
  },
  dockItemActive: {
    backgroundColor: colors.accTint,
  },
  dockLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
