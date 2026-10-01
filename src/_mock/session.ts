import { CryptoService } from '@services/crypto.service';

import { DEMO_USER } from './fixtures/users';

const SESSION_KEY = 'authAccess';

/**
 * ?as=user  → 데모 사용자로 로그인된 세션을 심는다(원본 StorageService 와 같은 AES 형식)
 * ?as=guest → 세션을 지운다
 * 소셜 로그인은 외부 계정이 필요해 목업 범위 밖이므로, 로그인 상태는 이 방법으로 만든다.
 */
export function applySessionFromQuery(): void {
  const as = new URLSearchParams(window.location.search).get('as');
  if (as === 'user') {
    const user = { ...DEMO_USER, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', customToken: 'mock-custom-token' };
    sessionStorage.setItem(SESSION_KEY, new CryptoService().encrypt(user));
  } else if (as === 'guest') {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
