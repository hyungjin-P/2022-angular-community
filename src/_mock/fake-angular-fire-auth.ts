import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// 원본 로그인 화면이 버튼 클릭 시 firebase.default.auth.GoogleAuthProvider 를 만든다. 진짜 AngularFireAuth 가
// compat auth 를 지연 로드하던 것을 대신해 등록만 해 둔다(네트워크 요청 없음).
import 'firebase/compat/auth';

/**
 * @angular/fire compat AngularFireAuth 대체. 원본이 쓰는 멤버(authState·signInWithPopup·
 * signInWithCustomToken·signOut)만 구현한다. Firebase 서버와 통신하지 않는다.
 */
@Injectable()
export class FakeAngularFireAuth {
  readonly authState: Observable<null> = of(null);

  signInWithPopup(): Promise<null> {
    console.info('[mock-auth] 소셜 로그인은 목업 범위 밖입니다. ?as=user 로 데모 세션을 쓰세요.');
    return Promise.resolve(null);
  }

  signInWithCustomToken(): Promise<null> {
    return Promise.resolve(null);
  }

  signOut(): Promise<void> {
    return Promise.resolve();
  }
}
