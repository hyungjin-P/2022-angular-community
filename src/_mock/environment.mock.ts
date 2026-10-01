// --configuration=mock 에서 src/environments/environment.ts 를 대체한다.
// 원본과 같은 키, 값은 전부 더미다. 실제 키·엔드포인트는 넣지 않는다.
export const environment = {
  production: false,
  serverAddress: '/mock-api',
  // MockApiInterceptor 가 이 접두어로 시작하는 요청을 가로챈다. 놓친 요청도 localhost 로만 간다.
  userApiAddress: '/mock-api',
  wss: '',
  firebase: {
    apiKey: 'mock-api-key',
    // 비워 두어 popup/redirect 용 iframe(authDomain/__/auth/iframe) 로드를 막는다
    authDomain: '',
    projectId: 'keeping-mock',
    storageBucket: '',
    messagingSenderId: '0',
    appId: '1:0:web:0',
    measurementId: '',
  },
  kakao: {
    appKey: {
      javascript: 'mock-kakao-javascript-key',
    },
  },
  naver: {
    clientId: 'mock-naver-client-id',
    redirectUri: 'http://localhost:4200/auth/callback',
  },
  recaptchaSiteKey: 'mock-recaptcha-site-key',
  cryptoPlainText: 'mock-session-passphrase',
};
