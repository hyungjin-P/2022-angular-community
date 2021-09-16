import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { GlobalService } from '@services/global.service'

import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    TAG = '비밀번호 재설정'

    token: string
    isTokenValid: boolean

    password: string
    passwordValid: boolean
    passwordErrorText: string
    passwordVisible: boolean

    confirmPassword: string
    confirmPasswordValid: boolean
    confirmPasswordErrorText: string
    confirmPasswordVisible: boolean

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private globalService: GlobalService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.token = this.activatedRoute.snapshot.queryParams.token

        if (!this.token) {
            this.isTokenValid = false
        } else {
            this.checkResetPasswordLinkMail()
        }

        this.password = ''
        this.passwordValid = false
        this.passwordErrorText = ''
        this.passwordVisible = false

        this.confirmPassword = ''
        this.confirmPasswordValid = false
        this.confirmPasswordErrorText = ''
        this.confirmPasswordVisible = false
    }

    checkResetPasswordLinkMail() {
        this.authService.checkResetPasswordLinkMail({ token: this.token }).subscribe(
            (v) => {
                this.isTokenValid = true
            },
            (e) => {
                this.isTokenValid = false
                this.globalService.showToast(e.message)
            }
        )
    }

    changePassword() {
        if (!this.formCheck()) {
            return
        }

        this.authService.changePassword({ token: this.token, new_password: this.password }).subscribe(
            (user: User) => {
                this.router.navigateByUrl('/')
            },
            (e) => {
                this.globalService.showToast(e.message)
            }
        )
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.changePassword()
            }
        } else {
            if (event.key != 'Tab' && (type == 'password' || type == 'confirmPassword')) {
                if (type == 'password') {
                    this.checkPasswordPattern(this.password)
                } else if (type == 'confirmPassword') {
                    this.checkConfirmPasswordPattern(this.confirmPassword)
                }
            }
        }
    }

    formCheck() {
        let isValid = false

        if (
            this.isTokenValid &&
            this.checkPasswordPattern(this.password) &&
            this.checkPasswordPattern(this.confirmPassword) &&
            this.password == this.confirmPassword
        ) {
            isValid = true
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

        this.checkConfirmPasswordPattern(this.confirmPassword)

        return isValid
    }

    checkConfirmPasswordPattern(password: string) {
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
            if (this.password != this.confirmPassword) {
                this.confirmPasswordValid = false
                this.confirmPasswordErrorText = '비밀번호가 일치하지 않습니다.'
            } else {
                isValid = true
                this.confirmPasswordValid = true
                this.confirmPasswordErrorText = ''
            }
        } else if (pattern4.test(password)) {
            this.confirmPasswordValid = false
            this.confirmPasswordErrorText = '공백을 포함할 수 없습니다.'
        } else if (password.length < 8) {
            this.confirmPasswordValid = false
            this.confirmPasswordErrorText = '비밀번호는 8자 이상입니다.'
        } else if (!pattern1.test(password) || !pattern2.test(password) || !pattern3.test(password)) {
            this.confirmPasswordValid = false
            this.confirmPasswordErrorText = '영어, 숫자, 특수문자가 모두 포함되어야 합니다.'
        }

        return isValid
    }

    changePasswordVisible() {
        this.passwordVisible = !this.passwordVisible
    }

    changeConfirmPasswordVisible() {
        this.confirmPasswordVisible = !this.confirmPasswordVisible
    }
}
