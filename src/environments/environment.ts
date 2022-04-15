export const environment = {
  production: false,
  // serverAddress: 'https://REDACTED_SERVER_ADDRESS',
  serverAddress: 'http://localhost:3000/latest',
  userApiAddress: 'http://localhost:3001',
  wss: 'wss://REDACTED_WSS_ENDPOINT',
  firebase: {
    apiKey: 'REDACTED_FIREBASE_API_KEY',
    authDomain: 'REDACTED_FIREBASE_AUTH_DOMAIN',
    projectId: 'REDACTED_FIREBASE_PROJECT_ID',
    storageBucket: 'REDACTED_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'REDACTED_FIREBASE_SENDER_ID',
    appId: 'REDACTED_FIREBASE_APP_ID',
    measurementId: 'REDACTED_FIREBASE_MEASUREMENT_ID',
  },
  kakao: {
    appKey: {
      javascript: 'REDACTED_KAKAO_JS_KEY',
    },
  },
  naver: {
    clientId: 'REDACTED_NAVER_CLIENT_ID',
    redirectUri: 'http://localhost:4200/auth/callback',
  },
  recaptchaSiteKey: '',
  cryptoPlainText: 'REDACTED_CRYPTO_KEY',
};
