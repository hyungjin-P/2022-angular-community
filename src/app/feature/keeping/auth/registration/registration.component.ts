import { Component, OnInit, ViewChild } from '@angular/core'

import { AuthService } from '@services/auth.service'

@Component({
    selector: 'registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
    @ViewChild('popupPrivacyServiceTermsRef') popupPrivacyServiceTermsRef

    email: string
    emailValid: boolean
    emailErrorText: string
    emailVisible: boolean

    verificationCode: string
    verificationCodeErrorText: string
    verificationCodeVisible: boolean
    timeLeft: number
    interval: any

    password: string
    passwordValid: boolean
    passwordErrorText: string
    passwordVisible: boolean

    confirmPassword: string
    confirmPasswordValid: boolean
    confirmPasswordErrorText: string
    confirmPasswordVisible: boolean

    checkbox: boolean
    checkbox1: boolean

    isPrivacyOpen: boolean
    isServiceTermsOpen: boolean

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.email = ''
        this.emailValid = false
        this.emailErrorText = ''
        this.emailVisible = true

        this.verificationCode = ''
        this.verificationCodeErrorText = ''
        this.verificationCodeVisible = false
        this.timeLeft = 0

        this.password = ''
        this.passwordValid = false
        this.passwordErrorText = ''
        this.passwordVisible = false

        this.confirmPassword = ''
        this.confirmPasswordValid = false
        this.confirmPasswordErrorText = ''
        this.confirmPasswordVisible = false
    }

    checkDuplicateMail() {
        this.authService.checkDuplicateMail({ email: this.email }).subscribe(
            (v) => {},
            (e) => {}
        )
    }

    sendVerificationCodeMail() {
        this.verificationCodeVisible = true
        this.verificationCodeErrorText = ''

        setTimeout(() => {
            document.activeElement
                .closest('.registration-form')
                .querySelector('.verification-code')
                .getElementsByTagName('input')[0]
                .focus()
        }, 0)

        // this.authService.sendVerificationCodeMail({ email: this.email }).subscribe(
        //     (v) => {
        //         if (this.interval) {
        //             this.stopTimer()
        //         }
        //         this.startTimer()
        //     },
        //     (e) => {}
        // )
    }

    checkVerificationCodeMail() {
        this.authService
            .checkVerificationCodeMail({ email: this.email, verification_code: Number(this.verificationCode) })
            .subscribe(
                (v) => {
                    if (this.interval) {
                        this.stopTimer()
                    }

                    this.verificationCodeVisible = false
                    this.verificationCodeErrorText = ''
                    this.verificationCodeVisible = false
                    this.emailValid = true
                },
                (e) => {
                    this.verificationCodeErrorText = e.message
                }
            )
    }

    startTimer() {
        this.timeLeft = 3 * 60
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--
            } else {
                this.stopTimer()
            }
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.interval)
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (type == 'email') {
                if (this.checkEmailPattern(this.email)) {
                    this.sendVerificationCodeMail()
                }
            } else if (type == 'verificationCode') {
                this.checkVerificationCodeMail()
            } else {
                if (this.formCheck()) {
                }
            }
        } else {
            if (event.key != 'Tab' && type == 'email') {
                this.checkEmailPattern(this.email)
            } else if (event.key != 'Tab' && type == 'password') {
                this.checkPasswordPattern(this.password)
            } else if (event.key != 'Tab' && type == 'confirmPassword') {
                this.checkConfirmPasswordPattern(this.confirmPassword)
            }
        }
    }

    formCheck() {
        let isValid = false

        if (
            this.checkEmailPattern(this.email) &&
            this.checkPasswordPattern(this.password) &&
            this.checkPasswordPattern(this.confirmPassword)
        ) {
            isValid = true
        }

        return isValid
    }

    checkEmailPattern(email: string) {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

        if (emailRegex.test(email)) {
            isValid = true
            // this.emailValid = true
            this.emailErrorText = ''
        } else {
            // this.emailValid = false
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

    clickCheckbox() {
        this.checkbox = !this.checkbox
    }

    clickCheckbox1() {
        this.checkbox1 = !this.checkbox1
    }

    showPopup(popupName: string) {
        if (popupName == 'popup-privacy-service-terms') {
            this.popupPrivacyServiceTermsRef.nativeElement.style.visibility = 'visible'
        }
    }

    hidePopup(popupName: string) {
        if (popupName == 'popup-privacy-service-terms') {
            this.popupPrivacyServiceTermsRef.nativeElement.style.visibility = 'hidden'
            this.isPrivacyOpen = false
            this.isServiceTermsOpen = false
        }
    }

    openContent(name: string) {
        if (name == 'privacy') {
            this.isPrivacyOpen = !this.isPrivacyOpen
            this.isServiceTermsOpen = false
        } else if (name == 'service-terms') {
            this.isPrivacyOpen = false
            this.isServiceTermsOpen = !this.isServiceTermsOpen
        }
    }
}
