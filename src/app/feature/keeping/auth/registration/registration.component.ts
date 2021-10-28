import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import * as firebase from 'firebase/app'
import { Observable, Subscription } from 'rxjs'
declare let Kakao: any

import { environment } from '@environments/environment'
import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { AuthService } from '@services/auth.service'
import { HelperService } from '@services/helper.service'

import { User } from '@schemas/user'

@Component({
    selector: 'registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
    TAG = '회원가입'

    signInMethod: string
    subscription: Subscription
    naverLoginPopupWindowRef: Window

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private globalService: GlobalService,
        private storageService: StorageService,
        private authService: AuthService,
        private helperService: HelperService
    ) {}

    ngOnInit() {
        this.angularFireAuth.setPersistence('session')
        this.subscription = this.angularFireAuth.authState.subscribe((user) => {
            if (user) {
                if (this.signInMethod == 'google' || this.signInMethod == 'facebook' || this.signInMethod == 'apple') {
                    user.getIdToken().then((accessToken) => {
                        this.authService.signInWithFirebase({ accessToken }).subscribe(
                            (user: User) => {
                                this.globalService.variables.isLogin = true
                                this.storageService.setUser(user)
                                this.router.navigateByUrl('/auth/service-terms')
                            },
                            (e) => {
                                this.globalService.showToast(e.message)
                            }
                        )
                    })
                } else {
                    if (this.signInMethod == 'kakao' || this.signInMethod == 'naver') {
                        this.globalService.variables.isLogin = true
                        this.router.navigateByUrl('/auth/service-terms')
                    } else {
                        this.globalService.variables.isLogin = true
                        this.router.navigateByUrl('/')
                    }
                }
            }
        })

        if (!Kakao.isInitialized()) {
            Kakao.init(`${environment.kakao['appKey']['javascript']}`)
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    onImageLoad(element: HTMLImageElement) {
        this.helperService.ImproveImageQuality(element)
    }

    signInWithGoogle() {
        this.signInMethod = 'google'
        this.angularFireAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
    }

    signInWithFacebook() {
        this.signInMethod = 'facebook'
        this.angularFireAuth.signInWithPopup(new firebase.default.auth.FacebookAuthProvider())
    }

    signInWithApple() {
        this.signInMethod = 'apple'
        this.angularFireAuth.signInWithPopup(new firebase.default.auth.OAuthProvider('apple.com'))
    }

    signInWithKakao() {
        this.signInMethod = 'kakao'
        const kakao$ = new Observable(function subscribe(observer) {
            Kakao.Auth.loginForm({
                success: function (response) {
                    observer.next(response)
                    observer.complete()
                },
                fail: function (error) {
                    observer.error(error)
                },
                persistAccessToken: false,
                persistRefreshToken: false,
            })
        })

        kakao$.subscribe(
            (user) => {
                const accessToken = user['access_token']
                this.authService.signInWithKakao({ accessToken }).subscribe((user: User) => {
                    this.storageService.setUser(user)
                    this.angularFireAuth.signInWithCustomToken(user.custom_token)
                })
            },
            (e) => {
                this.globalService.showToast(e.message)
            }
        )
    }

    signInWithNaver(): void {
        this.signInMethod = 'naver'

        let width = 504
        let height = 642
        let top = (window.outerHeight - height) / 2 + screenY
        let left = (window.outerWidth - width) / 2 + screenX

        let clientId = environment.naver['clientId']
        let redirectUri = environment.naver['redirectUri']

        this.naverLoginPopupWindowRef = window.open(
            `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`,
            '_blank',
            `width=${width},height=${height},top=${top},left=${left},scrollbars=no`
        )
    }

    _signInWithNaver(code: string) {
        this.naverLoginPopupWindowRef.close()

        this.authService.signWithNaver({ code: code }).subscribe(
            (user: User) => {
                this.storageService.setUser(user)
                this.angularFireAuth.signInWithCustomToken(user.custom_token)
            },
            (e) => {
                this.globalService.showToast(e.message)
            }
        )
    }
}
