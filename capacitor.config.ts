import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.vitereactapp',
  appName: 'Vite React App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
