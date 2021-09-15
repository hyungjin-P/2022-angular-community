import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ViewChildren,
    QueryList,
    ElementRef,
} from '@angular/core'
import { Observable, fromEvent, Subscription } from 'rxjs'
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { AuthService } from '@services/auth.service'

@Component({
    selector: 'registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('popupPrivacyServiceTermsRef') popupPrivacyServiceTermsRef

    @ViewChildren('emailRef') emailList: QueryList<ElementRef>
    EmailInputKeyupSubscription1: Subscription
    EmailInputKeyupSubscription2: Subscription

    email: string
    emailValid: boolean
    emailVerified: boolean
    emailErrorText: string

    verificationCodeVisible: boolean
    verificationCode: string
    verificationCodeErrorText: string
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

    passwordVerified: boolean

    agreementAll: boolean
    agreementAge: boolean
    agreementPrivacy: boolean
    agreementServiceTerms: boolean
    agreementMarketing: boolean

    verifiedAll: boolean

    isPrivacyOpen: boolean
    isServiceTermsOpen: boolean

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.email = ''
        this.emailValid = false
        this.emailVerified = false
        this.emailErrorText = ''

        this.verificationCodeVisible = false
        this.verificationCode = ''
        this.verificationCodeErrorText = ''
        this.timeLeft = 0

        this.password = ''
        this.passwordValid = false
        this.passwordErrorText = ''
        this.passwordVisible = false

        this.confirmPassword = ''
        this.confirmPasswordValid = false
        this.confirmPasswordErrorText = ''
        this.confirmPasswordVisible = false

        this.passwordVerified = false

        this.agreementAll = false
        this.agreementAge = false
        this.agreementPrivacy = false
        this.agreementServiceTerms = false
        this.agreementMarketing = false

        this.verifiedAll = false
    }

    ngAfterViewInit() {
        this.emailList.forEach((email, index) => {
            let inputElement = email.nativeElement.getElementsByTagName('input')[0]

            if (index == 0) {
                let keyup$ = fromEvent(inputElement, 'keyup').pipe(
                    debounceTime(300),
                    map((event) => {
                        return {
                            key: event['key'],
                            email: event['target']['value'].trim(),
                        }
                    }),
                    distinctUntilChanged()
                )

                this.EmailInputKeyupSubscription1 = keyup$.subscribe((v) => {
                    this.checkDuplicateMail(v.key, v.email)
                })
            } else {
                let keyup$ = fromEvent(inputElement, 'keyup').pipe(
                    debounceTime(300),
                    map((event) => {
                        return {
                            key: event['key'],
                            email: event['target']['value'].trim(),
                        }
                    }),
                    distinctUntilChanged()
                )

                this.EmailInputKeyupSubscription2 = keyup$.subscribe((v) => {
                    this.checkDuplicateMail(v.key, v.email)
                })
            }
        })
    }

    ngOnDestroy() {
        this.EmailInputKeyupSubscription1.unsubscribe()
        this.EmailInputKeyupSubscription2.unsubscribe()
    }

    checkDuplicateMail(key: string, email: string) {
        if (key == 'Backspace') {
            if (!this.checkEmailPattern(email)) {
                this.emailValid = false
                this.emailErrorText = '규칙에 맞는 이메일 주소를 입력해 주세요.'
            }

            this.verificationCodeVisible = false
            return
        }

        if (!this.checkEmailPattern(email)) {
            this.emailValid = false
            this.emailErrorText = '규칙에 맞는 이메일 주소를 입력해 주세요.'
            return
        }

        this.authService.checkDuplicateMail({ email: email }).subscribe(
            (v) => {
                this.emailValid = true
                this.emailErrorText = ''

                if (key == 'Enter') {
                    this.sendVerificationCodeMail()
                    return
                }
            },
            (e) => {
                this.emailValid = false
                this.emailErrorText = e.message
            }
        )
    }

    sendVerificationCodeMail() {
        if (!this.emailValid) {
            return
        }

        this.verificationCodeVisible = true
        this.verificationCode = ''
        this.verificationCodeErrorText = ''

        setTimeout(() => {
            try {
                document.activeElement
                    .closest('.registration-form')
                    .querySelector('.verification-code')
                    .getElementsByTagName('input')[0]
                    .focus()
            } catch (e) {}
        }, 0)

        this.authService.sendVerificationCodeMail({ email: this.email }).subscribe(
            (v) => {
                if (this.interval) {
                    this.stopTimer()
                }
                this.startTimer()
            },
            (e) => {
                this.verificationCodeErrorText = e.message
            }
        )
    }

    checkVerificationCodeMail() {
        if (this.verificationCode.length != 6 || this.timeLeft <= 0) {
            return
        }

        this.authService
            .checkVerificationCodeMail({ email: this.email, verification_code: Number(this.verificationCode) })
            .subscribe(
                (v) => {
                    if (this.interval) {
                        this.stopTimer()
                    }

                    this.emailVerified = true

                    this.verificationCodeVisible = false
                    this.verificationCodeErrorText = ''
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
                this.verificationCodeErrorText = '인증번호 입력시간이 초과되었습니다.'
                this.stopTimer()
            }
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.interval)
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (type == 'verificationCode') {
                this.checkVerificationCodeMail()
            }
        } else {
            if (event.key != 'Tab' && (type == 'email' || type == 'password' || type == 'confirmPassword')) {
                if (type == 'email') {
                    this.checkEmailPattern(this.email)
                } else if (type == 'password') {
                    this.checkPasswordPattern(this.password)
                } else if (type == 'confirmPassword') {
                    this.checkConfirmPasswordPattern(this.confirmPassword)
                }

                this.verifiedAll = this.formCheck()
            }
        }
    }

    formCheck() {
        let isValid = false

        if (
            this.emailVerified &&
            this.checkPasswordPattern(this.password) &&
            this.checkPasswordPattern(this.confirmPassword) &&
            this.password == this.confirmPassword &&
            this.agreementAge &&
            this.agreementPrivacy &&
            this.agreementServiceTerms
        ) {
            isValid = true
        }

        return isValid
    }

    checkDigit(event) {
        const code = event.which ? event.which : event.keyCode
        if (48 <= code && code <= 57) {
            return true
        } else {
            return false
        }
    }

    checkEmailPattern(email: string) {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

        if (emailRegex.test(email)) {
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

    checkTerms(item: string) {
        if (item == 'all') {
            if (this.agreementAll) {
                this.agreementAll = false
                this.agreementAge = false
                this.agreementPrivacy = false
                this.agreementServiceTerms = false
                this.agreementMarketing = false
            } else {
                this.agreementAll = true
                this.agreementAge = true
                this.agreementPrivacy = true
                this.agreementServiceTerms = true
                this.agreementMarketing = true
            }
        } else if (item == 'age') {
            this.agreementAge = !this.agreementAge
        } else if (item == 'privacy') {
            this.agreementPrivacy = !this.agreementPrivacy
        } else if (item == 'serviceTerms') {
            this.agreementServiceTerms = !this.agreementServiceTerms
        } else if (item == 'marketing') {
            this.agreementMarketing = !this.agreementMarketing
        }

        if (this.agreementAge && this.agreementPrivacy && this.agreementServiceTerms) {
            this.agreementAll = true
        } else {
            this.agreementAll = false
        }
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
