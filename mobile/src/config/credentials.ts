/**
 * Public OAuth client identifiers & backend endpoints shared with Content Scheduler.
 * Note: These are public client IDs (NOT client secrets) required by iOS URL schemes.
 */
export const CONTENT_SCHEDULER_CONFIG = {
  baseUrl: 'https://contentscheduler.vercel.app',
  bundleId: 'com.contentscheduler.app',
  googleIosClientId:
    '84783551840-mki8tk5nse0mh4idh09f88gi8csf59f1.apps.googleusercontent.com',
  googleReversedClientId:
    'com.googleusercontent.apps.84783551840-mki8tk5nse0mh4idh09f88gi8csf59f1',
  metaAppId: '1611404507348655',
  googleScopes: [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/youtube.upload',
  ],
  metaScopes: [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'instagram_basic',
    'instagram_content_publish',
  ],
} as const;
