import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { environment } from '@environments/environment';

import { MockAppModule } from './mock-app.module';
import { applySessionFromQuery } from './session';

if (environment.production) {
  enableProdMode();
}

// AngularFireAuth 는 providedIn: 'any' 라서 lazy 모듈(AuthModule 등) 인젝터가 루트 provider 를 무시하고
// 진짜 인스턴스를 새로 만든다. 'root' 로 바꿔 MockAppModule 의 FakeAngularFireAuth 가 모든 곳에 쓰이게 한다.
AngularFireAuth.ɵprov.providedIn = 'root';

// 부트스트랩 전에 세션을 정해야 AppComponent·가드가 로그인 상태를 바로 본다
applySessionFromQuery();

platformBrowserDynamic()
  .bootstrapModule(MockAppModule)
  .catch((err) => console.error(err));
