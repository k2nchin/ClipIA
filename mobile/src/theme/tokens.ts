export const colors = {
  // Content Scheduler inspired dark neo-editorial palette
  bg: '#070708',
  bg2: '#101012',
  bg3: '#16151A',
  line: '#222126',
  lineStrong: '#302E36',

  // Hot Magenta primary brand accent
  acc: '#FF0A8A',
  accTint: 'rgba(255, 10, 138, 0.14)',
  accBorder: 'rgba(255, 10, 138, 0.45)',
  accGlow: 'rgba(255, 10, 138, 0.35)',

  // Text hierarchy
  fg: '#F5F3EF',
  fg2: '#C9C6CD',
  muted: '#8B8890',
  placeholder: '#5A5760',
  white: '#FFFFFF',

  // Semantic status
  ok: '#5EE6A8',
  okBg: 'rgba(94, 230, 168, 0.12)',
  okText: '#C8F7E1',

  warn: '#FFB35C',
  warnBg: 'rgba(255, 179, 92, 0.14)',
  warnText: '#FFE1BD',

  red: '#FF6B6B',
  redBg: 'rgba(255, 107, 107, 0.14)',
  redText: '#FFC9C9',

  // Platform accents
  ig: '#FF0A8A',
  yt: '#FF3B30',
  fb: '#2F80ED',
  drive: '#5EE6A8',
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
} as const;
