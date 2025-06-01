import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jobmaps.app',
  appName: 'JobMaps',
  webDir: 'dist/jobmaps/browser',
  server: {
    cleartext: true,
    androidScheme: 'https', // 👈 importante para evitar bloqueos de WebView
  },
};

export default config;
