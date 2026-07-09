import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'watch.livekoora.app',
  appName: 'Live Koora',
  webDir: 'www',

  /**
   * Load the app from the deployed Next.js URL instead of bundling
   * web assets. This way every frontend deploy is instantly available
   * to mobile users without rebuilding the APK.
   *
   * Update this to your production URL after deploying the frontend.
   * Example: https://www.livekoora.watch
   */
  server: {
    url: 'https://www.livekoora.watch',
    hostname: 'www.livekoora.watch',
    cleartext: false,
  },
};

export default config;
