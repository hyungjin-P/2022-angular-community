import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import * as firebase from 'firebase/app'
import { Observable, Subscription } from 'rxjs'
declare let Kakao: any

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { AuthService } from '@services/auth.service'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    TAG = '로그인'

    signInMethod: string
    subscription: Subscription

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private storageService: StorageService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.angularFireAuth.setPersistence('session')
        this.subscription = this.angularFireAuth.authState.subscribe((user) => {
            if (user) {
                if (this.signInMethod == 'google' || this.signInMethod == 'facebook' || this.signInMethod == 'apple') {
                    user.getIdToken().then((accessToken) => {
                        this.authService.signInWithFirebase({ accessToken }).subscribe(
                            (user) => {
                                this.router.navigateByUrl('/keeping-home')
                            },
                            (e) => {}
                        )
                    })
                } else {
                    this.router.navigateByUrl('/keeping-home')
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
                this.authService.signInWithKakao({ accessToken }).subscribe((user) => {
                    this.angularFireAuth.signInWithCustomToken(user.custom_token)
                })
            },
            (e) => {}
        )
    }
}
