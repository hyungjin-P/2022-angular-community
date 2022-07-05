import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

declare let Kakao: any;

import { environment } from '@environments/environment';
import { GlobalService } from '@services/global.service';
import { StorageService } from '@services/storage.service';

import { AuthService } from '@services/auth.service';
import { HelperService } from '@services/helper.service';

import { User } from '@schemas/user';
import { TranslateService } from '@ngx-translate/core';
import { TextService } from '@services/text.service';
import { UserService } from '@services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import OAuthProvider = firebase.auth.OAuthProvider;

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  TAG = '회원가입';

  signInMethod: string;
  subscription: Subscription;
  naverLoginPopupWindowRef: Window;

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
    console.log(this.angularFireAuth.authState);

    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        if (this.signInMethod == 'google' || this.signInMethod == 'facebook' || this.signInMethod == 'apple') {
          user.getIdToken().then((accessToken) => {
            this.authService.modifySignWithFirebase(accessToken).subscribe(
              (user: User) => {
                let viaPath = 'auth/login-success/google';

                if (user?.signUpType === 'google') {
                  viaPath = 'auth/service-terms/google';
                }

                this.storageService.setUser(user);
                this.router.navigateByUrl(viaPath).then();
              },
              (e) => {
                if (e.code === 'failure:deleted') {
                  this.deletedUserId = e.message;
                  this.openModalFailDeleted();
                }
              }
            );
          });
        } else {
          if (this.signInMethod == 'kakao' || this.signInMethod == 'naver') {
            this.router.navigateByUrl('/auth/service-terms');
          } else {
            this.router.navigateByUrl('/');
          }
        }
      } else {
        this.angularFireAuth.signOut().then();
      }
    });

    if (!Kakao.isInitialized()) {
      Kakao.init(`${environment.kakao['appKey']['javascript']}`);
    }

    this.selectedLanguage = localStorage.getItem('language');
  }

  ngOnDestroy() {}

  onImageLoad(element: HTMLImageElement) {
    this.helperService.ImproveImageQuality(element);
  }

  signInWithGoogle() {
    this.signInMethod = 'google';
    this.angularFireAuth.signInWithPopup(new GoogleAuthProvider());
  }

  signInWithFacebook() {
    this.signInMethod = 'facebook';
    this.angularFireAuth.signInWithPopup(new FacebookAuthProvider());
  }

  signInWithApple() {
    this.signInMethod = 'apple';
    this.angularFireAuth.signInWithPopup(new OAuthProvider('apple.com'));
  }

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
        if (e.code === 'failure:deleted') {
          this.deletedUserId = e.message;
          this.openModalFailDeleted();
        }
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

  signInWithNaver(): void {
    this.signInMethod = 'naver';

    let width = 504;
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

  _signInWithNaver(code: string) {
    this.naverLoginPopupWindowRef.close();

    this.authService.modifySignWithNaver(code).subscribe(
      (user: User) => {
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
    this.storageService.removeUser();
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
