import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { observable, Observable, Subscription } from 'rxjs';

declare let Kakao: any;

import { environment } from '@environments/environment';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { AuthService } from '@services/auth.service';
import { HelperService } from '@services/helper.service';
import { TextService } from '@services/text.service';

import { User } from '@schemas/user';
import { UserService } from '@services/user.service';

import * as firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth/';
import { onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  TAG = '로그인';

  signInMethod: string;
  naverLoginPopupWindowRef: Window;

  email: string;
  emailValid: boolean;
  emailErrorText: string;

  password: string;
  passwordValid: boolean;
  passwordErrorText: string;
  passwordVisible: boolean;

  langBoxVisible: boolean;
  selectedLanguage: string;

  deletedUserId: string;
  /* confirm modal */
  isConfirmModalVisible = false;
  confirmModalData: any = {};
  confirmModalStatus: string;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private translate: TranslateService,
    private globalService: GlobalService,
    private storageService: StorageService,
    private authService: AuthService,
    private userService: UserService,
    private helperService: HelperService,
    private textService: TextService
  ) {}

  ngOnInit() {
    /* form 초기화 */
    this.email = '';
    this.emailValid = false;
    this.emailErrorText = '';
    this.password = '';
    this.passwordValid = false;
    this.passwordErrorText = '';
    this.passwordVisible = false;

    /* SNS 로그인 Subscriber */
    // subscriber 상태에서 기존 unSubscribe => signOut 으로 변경
    this.angularFireAuth.authState.subscribe((user) => {
      /**
       * signInMethod 구분
       * google, meta, apple => firebase 통해서 로그인
       **/
      if (user) {
        if (this.signInMethod === 'google' || this.signInMethod === 'facebook' || this.signInMethod === 'apple') {
          user.getIdToken().then((accessToken) => {
            this.authService.modifySignWithFirebase(accessToken).subscribe(
              (user: User) => {
                let viaPath = 'auth/login-success/google';

                if (user?.signUpType === 'google') {
                  viaPath = 'auth/service-terms/google';
                }

                this.storageService.setUser(user);
                // this.router.navigateByUrl(viaPath).then(() => {});
                this.router.navigateByUrl(viaPath).then();
              },
              (e) => {
                if (e.code === 'failure:deleted') {
                  this.deletedUserId = e.message;
                  this.openModalFailDeleted();
                  return;
                }
              }
            );
          });
        } else {
          if (this.signInMethod === 'kakao' || this.signInMethod === 'naver') {
            this.router.navigateByUrl('/auth/service-terms').then();
          } else {
            this.router.navigateByUrl('/').then();
          }
        }
      } else {
        this.angularFireAuth.signOut().then(() => {});
      }
    });

    if (!Kakao.isInitialized()) {
      Kakao.init(`${environment.kakao.appKey.javascript}`);
    }

    this.selectedLanguage = localStorage.getItem('language');
  }

  ngOnDestroy() {
    // this.angularFireAuth.signOut().then(() => {});
    //
    // this.subscription.unsubscribe();
  }

  /** ImageLoad */
  onImageLoad(element: HTMLImageElement) {
    this.helperService.ImproveImageQuality(element);
  }

  /** 구글 로그인 */
  signInWithGoogle() {
    this.signInMethod = 'google';
    this.angularFireAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider()).then((r) => {});
  }

  /** 페이스북 로그인 */
  signInWithFacebook() {
    this.signInMethod = 'facebook';
    this.angularFireAuth.signInWithPopup(new firebase.default.auth.FacebookAuthProvider()).then((r) => {});
  }

  /** 카카오 로그인 */
  signInWithKakao() {
    this.signInMethod = 'kakao';
    const kakao$ = new Observable(function subscribe(observer) {
      Kakao.Auth.loginForm({
        success: function (response) {
          observer.next(response);
          observer.complete();
        },
        fail: function (error) {
          observer.error(error);
        },
        persistAccessToken: false,
        persistRefreshToken: false,
      });
    });

    kakao$.subscribe(
      (user: any) => {
        const accessToken = user.access_token;
        this.kakaoLoginTrigger(accessToken);
      },
      (e) => {
        this.globalService.showToast(e.message);
      }
    );
  }

  /**
   * kakao로그인 창 닫힌 후 Trigger
   * @param accessToken
   */
  kakaoLoginTrigger(accessToken: string): void {
    this.authService.modifiedKakaoLogin(accessToken).subscribe(
      (user: User) => {
        let viaPath = 'auth/login-success/kakao';

        if (user?.signUpType === 'kakao') {
          viaPath = 'auth/service-terms/kakao';
        }

        this.router.navigateByUrl(viaPath).then(() => {
          this.storageService.setUser(user);
          this.angularFireAuth.signInWithCustomToken(user.customToken);
        });
      },
      (e) => {
        if (e.code === 'failure:deleted') {
          this.deletedUserId = e.message;
          this.openModalFailDeleted();
        }
      }
    );
  }

  /** 네이버 로그인 */
  signInWithNaver(): void {
    this.signInMethod = 'naver';

    let width = 800;
    let height = 642;
    let top = (window.outerHeight - height) / 2 + screenY;
    let left = (window.outerWidth - width) / 2 + screenX;

    let clientId = environment.naver.clientId;
    let redirectUri = environment.naver.redirectUri;

    this.naverLoginPopupWindowRef = window.open(
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=no`
    );
  }

  async _signInWithNaver(code: string): Promise<void> {
    this.naverLoginPopupWindowRef.close();
    this.authService.modifySignWithNaver(code).subscribe(
      (user: any) => {
        let viaPath = 'auth/login-success/naver';

        if (user?.signUpType === 'naver') {
          viaPath = 'auth/service-terms/naver';
        }

        this.router.navigateByUrl(viaPath).then(() => {
          this.storageService.setUser(user);
          this.angularFireAuth.signInWithCustomToken(user.customToken);
        });
      },
      (e) => {
        if (e.code === 'failure:deleted') {
          this.deletedUserId = e.message;
          this.openModalFailDeleted();
        }
      }
    );
  }

  async signInWithEmail() {
    if (!this.formCheck()) {
      return;
    }

    this.signInMethod = 'email';

    /** 이메일 로그인 */
    this.authService
      .signInWithEmail({
        providedId: this.email,
        password: this.password,
      })
      .subscribe(
        (user: User) => {
          const viaPath = 'auth/login-success/email';

          this.router.navigateByUrl(viaPath).then(() => {
            this.storageService.setUser(user);
            this.angularFireAuth.signInWithCustomToken(user.customToken);
          });
        },
        (e) => {
          if (e.code === 'failure:deleted') {
            this.deletedUserId = e.message;
            this.openModalFailDeleted();
          } else {
            let message = this.textService.getText('auth:email:009');
            this.globalService.showToast(message);
          }
        }
      );
  }

  /** enter, email, tab, password */
  onKeyup(event, type) {
    if (event.key === 'Enter') {
      if (this.formCheck()) {
        this.signInWithEmail().then((r) => {});
      }
    } else {
      if (event.key !== 'Tab' && type === 'email') {
        this.checkEmailPattern(this.email);
      } else if (event.key !== 'Tab' && type === 'password') {
        this.checkPasswordPattern(this.password);
      }
    }
  }

  formCheck() {
    let isValid = false;

    if (this.checkEmailPattern(this.email) && this.checkPasswordPattern(this.password)) {
      isValid = true;
    }

    return isValid;
  }

  /**
   * email 패턴 체크
   * */
  checkEmailPattern(email: string) {
    let isValid = false;

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    // 이메일 규칙 체크
    if (emailRegex.test(email)) {
      isValid = true;
      this.emailValid = true;
      this.emailErrorText = '';
    } else {
      this.emailValid = false;
      // 규칙에 맞는 이메일 주소를 입력해 주세요.
      this.emailErrorText = this.textService.getText('auth:login:001');
    }

    return isValid;
  }

  /**
   * password 패턴 체크
   * */
  checkPasswordPattern(password: string) {
    let isValid = false;

    const pattern1 = /[0-9]/;
    const pattern2 = /[a-zA-Z]/;
    const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;
    const pattern4 = /\s/;

    if (
      pattern1.test(password) &&
      pattern2.test(password) &&
      !pattern4.test(password) &&
      8 <= password.length &&
      password.length <= 15
    ) {
      isValid = true;
      this.passwordValid = true;
      this.passwordErrorText = '';
    } else if (pattern4.test(password)) {
      this.passwordValid = false;
      // 비밀번호에 공백을 제외하고 입력해주세요.
      this.passwordErrorText = this.textService.getText('auth:login:002');
    } else if (password.length < 8) {
      this.passwordValid = false;
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('auth:login:003');
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.passwordValid = false;
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('auth:login:003');
    }

    return isValid;
  }

  changePasswordVisible() {
    this.passwordVisible = !this.passwordVisible;
  }

  openLangBox(event) {
    event.stopPropagation();

    if (this.langBoxVisible) {
      this.closeLangBox();
    } else {
      this.langBoxVisible = true;
    }
  }

  closeLangBox() {
    this.langBoxVisible = false;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.textService.changeLanguage(language);
    this.selectedLanguage = language;
    this.closeLangBox();
  }

  openModalFailDeleted() {
    this.confirmModalStatus = 'deletedUser';
    if (this.selectedLanguage === 'ko') {
      this.confirmModalData = {
        isIcon: false,
        text: '삭제 요청중인 계정',
        subText: '삭제 요청을 취소하시겠습니까?',
        cancelBtnText: '아니요', // 선택
        confirmBtnText: '요청취소', // 선택
      };
    } else {
      this.confirmModalData = {
        isIcon: false,
        text: 'Account Requested for Withdrawal',
        subText: `Do you want to cancel it?`,
        cancelBtnText: 'No', // 선택
        confirmBtnText: 'Yes', // 선택
      };
    }
    this.isConfirmModalVisible = true;

    this.storageService.removeUser();
  }

  confirmModalCancel() {
    this.isConfirmModalVisible = false;
  }

  confirmModalConfirm() {
    this.isConfirmModalVisible = false;
    if (this.confirmModalStatus === 'deletedUser') {
      this.userService.withdrawalCancel(this.deletedUserId).subscribe((result) => {
        let message = this.textService.getText('auth:withdrawal:003');
        this.globalService.showToast(message);
      });
    }
  }
}
