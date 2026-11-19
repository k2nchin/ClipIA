export type ScreenId =
  | 'home'
  | 'import'
  | 'analysis'
  | 'editor'
  | 'preview'
  | 'export'
  | 'publish'
  | 'cloud';

export type AspectRatio = '9:16' | '16:9' | '1:1';
export type LayoutPreset = 'streamer_split' | 'full_vertical' | 'split_50_50';
export type CaptionStyle = 'clean' | 'pop' | 'magenta';
export type PlatformKey = 'ig' | 'yt' | 'fb';

export type VideoProject = {
  id: string;
  name: string;
  uri?: string;
  durationSec: number;
  rawSizeMb: number;
  finalSizeMb: number;
  status: 'local' | 'analyzing' | 'approval' | 'ready';
  driveSynced: boolean;
  rawPurged: boolean;
};

export type DriveUploadState = 'queued' | 'uploading' | 'synced';

export type ViralClip = {
  id: string;
  title: string;
  score: number;
  duration: string;
  range: string;
  driveState: DriveUploadState;
  driveProgress: number;
  driveFolder: string;
  tags: string[];
  quote: string;
};

export type AutomationSettings = {
  driveSyncWhileClipping: boolean;
  autoPurgeRaw: boolean;
  keepFinalClipOnly: boolean;
  driveFolder: string;
};

export type EditorConfig = {
  aspectRatio: AspectRatio;
  layoutPreset: LayoutPreset;
  blurBackdrop: boolean;
  creatorWatermark: string;
  smartCrop: boolean;
  safeZone: boolean;
  captionStyle: CaptionStyle;
  censorWords: boolean;
  autoZoom: boolean;
};
