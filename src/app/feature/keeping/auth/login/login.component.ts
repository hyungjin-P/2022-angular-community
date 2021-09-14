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

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    TAG = '로그인'

    variables: any

    signInMethod: string
    subscription: Subscription
    naverLoginPopupWindowRef: Window

    email: string
    emailValid: boolean
    emailErrorText: string
    emailVisible: boolean

    password: string
    passwordValid: boolean
    passwordErrorText: string
    passwordVisible: boolean

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private globalService: GlobalService,
        private storageService: StorageService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.variables = this.globalService.variables

        this.email = ''
        this.emailValid = false
        this.emailErrorText = ''
        this.emailVisible = true

        this.password = ''
        this.passwordValid = false
        this.passwordErrorText = ''
        this.passwordVisible = false

        this.angularFireAuth.setPersistence('session')
        this.subscription = this.angularFireAuth.authState.subscribe((user) => {
            if (user) {
                if (this.signInMethod == 'google' || this.signInMethod == 'facebook' || this.signInMethod == 'apple') {
                    user.getIdToken().then((accessToken) => {
                        this.authService.signInWithFirebase({ accessToken }).subscribe(
                            (user) => {
                                this.globalService.variables.isLogin = true
                                this.router.navigateByUrl('/')
                            },
                            (e) => {}
                        )
                    })
                } else {
                    this.globalService.variables.isLogin = true
                    this.router.navigateByUrl('/')
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

    async signInWithEmail() {
        if (!this.formCheck()) {
            return
        }

        this.signInMethod = 'email'
        this.authService.signInWithEmail({ email: this.email, password: this.password }).subscribe(
            (user) => {
                this.angularFireAuth.signInWithCustomToken(user.custom_token)
            },
            (e) => {
                console.log(e)
            }
        )
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

        this.authService.signWithNaver({ code: code }).subscribe((user) => {
            this.angularFireAuth.signInWithCustomToken(user.custom_token)
        })
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.signInWithEmail()
            }
        } else {
            if (event.key != 'Tab' && type == 'email') {
                this.checkEmailPattern(this.email)
            } else if (event.key != 'Tab' && type == 'password') {
                this.checkPasswordPattern(this.password)
            }
        }
    }

    formCheck() {
        let isValid = false

        if (this.checkEmailPattern(this.email) && this.checkPasswordPattern(this.password)) {
            isValid = true
        }

        return isValid
    }

    checkEmailPattern(email: string) {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

        if (emailRegex.test(email)) {
            isValid = true
            this.emailValid = true
            this.emailErrorText = ''
        } else {
            this.emailValid = false
            this.emailErrorText = '규칙에 맞는 이메일 주소를 입력해 주세요.'
        }

        return isValid
    }

    checkPasswordPattern(password: string) {
        let isValid = false

        const pattern1 = /[0-9]/
        const pattern2 = /[a-zA-Z]/
        const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
        const pattern4 = /\s/

        if (
            pattern1.test(password) &&
            pattern2.test(password) &&
            pattern3.test(password) &&
            !pattern4.test(password) &&
            8 <= password.length &&
            password.length <= 15
        ) {
            isValid = true
            this.passwordValid = true
            this.passwordErrorText = ''
        } else if (pattern4.test(password)) {
            this.passwordValid = false
            this.passwordErrorText = '공백을 포함할 수 없습니다.'
        } else if (password.length < 8) {
            this.passwordValid = false
            this.passwordErrorText = '비밀번호는 8자 이상입니다.'
        } else if (!pattern1.test(password) || !pattern2.test(password) || !pattern3.test(password)) {
            this.passwordValid = false
            this.passwordErrorText = '영어, 숫자, 특수문자가 모두 포함되어야 합니다.'
        }

        return isValid
    }

    changePasswordVisible() {
        this.passwordVisible = !this.passwordVisible
    }
}
