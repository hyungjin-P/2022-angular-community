// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverAddress: 'https://REDACTED_SERVER_ADDRESS',
  // serverAddress: 'http://localhost:3000/latest',
  userApiAddress: 'http://localhost:3001',
  // userApiAddress: 'http://REDACTED_PRIVATE_TEST_HOST:3001',
  // userApiAddress: 'https://REDACTED_USER_API_HOST',
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
    redirectUri: 'https://dev.keeping.link/auth/callback',
  },
  recaptchaSiteKey: '',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
