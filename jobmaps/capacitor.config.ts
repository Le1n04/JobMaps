import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jobmaps.app',
  appName: 'JobMaps',
  webDir: 'dist/jobmaps/browser',
  server: {
    cleartext: true,
    androidScheme: 'https', // 👈 necesario
    allowNavigation: ['*.stadiamaps.com', '*.openstreetmap.org'], // 👈 ESTO
  },
};

export default config;
