import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AppModule } from '../app/app.module';
import { AppComponent } from '../app/app.component';

import { FakeAngularFireAuth } from './fake-angular-fire-auth';
import { MockApiInterceptor } from './mock-api.interceptor';

/** 원본 AppModule 을 그대로 감싸고, 외부 의존 지점만 목업으로 바꾼다 */
@NgModule({
  imports: [AppModule],
  providers: [
    // CoreModule 의 인증 인터셉터(Bearer 부착) 다음에 실행된다
    { provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true },
    { provide: AngularFireAuth, useClass: FakeAngularFireAuth },
  ],
  bootstrap: [AppComponent],
})
export class MockAppModule {}
