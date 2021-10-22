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
import { Router } from '@angular/router'
import { fromEvent, Subscription } from 'rxjs'
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'

@Component({
    selector: 'email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit, AfterViewInit, OnDestroy {
    TAG = '이메일 회원가입'

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

    agreementAll: boolean
    agreementAge: boolean
    agreementPrivacy: boolean
    agreementServiceTerms: boolean
    agreementMarketing: boolean

    isPrivacyOpen: boolean
    isServiceTermsOpen: boolean

    selectedLanguage: string

    constructor(
        private router: Router,
        private globalService: GlobalService,
        private storageService: StorageService,
        private authService: AuthService
    ) {}

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

        this.agreementAll = false
        this.agreementAge = false
        this.agreementPrivacy = false
        this.agreementServiceTerms = false
        this.agreementMarketing = false

        this.selectedLanguage = localStorage.getItem('language')
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
                if (this.selectedLanguage == 'ko') {
                    this.emailErrorText = '규칙에 맞는 이메일 주소를 입력해 주세요.'
                } else {
                    this.emailErrorText = 'Invalid email address.'
                }
            }

            this.verificationCodeVisible = false
            return
        }

        if (!this.checkEmailPattern(email)) {
            this.emailValid = false
            if (this.selectedLanguage == 'ko') {
                this.emailErrorText = '규칙에 맞는 이메일 주소를 입력해 주세요.'
            } else {
                this.emailErrorText = 'Invalid email address.'
            }
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

                if (e.code == 'FUNCTION:AUTH:004') {
                    if (this.selectedLanguage == 'ko') {
                        this.emailErrorText = '이미 가입된 이메일 주소 입니다.'
                    } else {
                        this.emailErrorText = 'This is an already registered email address.'
                    }
                } else if (e.code == 'VALIDATOR:VALIDATE') {
                    if (this.selectedLanguage == 'ko') {
                        this.emailErrorText = '규칙에 맞는 이메일 주소를 입력해 주세요.'
                    } else {
                        this.emailErrorText = 'Invalid email address.'
                    }
                } else {
                    this.emailErrorText = e.message
                }
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
                    if (e.code == 'FUNCTION:AUTH:005') {
                        if (this.selectedLanguage == 'ko') {
                            this.verificationCodeErrorText = '인증번호가 일치하지 않습니다. 다시 입력해주세요.'
                        } else {
                            this.verificationCodeErrorText = 'The verification code does not match.'
                        }
                    } else {
                        this.verificationCodeErrorText = e.message
                    }
                }
            )
    }

    registration() {
        if (!this.formCheck()) {
            return
        }

        this.authService
            .registration({
                email: this.email,
                verification_code: Number(this.verificationCode),
                password: this.password,
                agreement_age: this.agreementAge,
                agreement_privacy: this.agreementPrivacy,
                agreement_service_terms: this.agreementServiceTerms,
                agreement_marketing: this.agreementMarketing,
            })
            .subscribe(
                (user: User) => {
                    this.globalService.variables.isLogin = true
                    this.storageService.setUser(user)
                    this.router.navigateByUrl('/')
                },
                (e) => {
                    this.globalService.showToast(e.message)
                }
            )
    }

    startTimer() {
        this.timeLeft = 3 * 60
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--
            } else {
                if (this.selectedLanguage == 'ko') {
                    this.verificationCodeErrorText = '인증번호 입력시간이 초과되었습니다.'
                } else {
                    this.verificationCodeErrorText = 'The time to enter the verification code has expired.'
                }
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
            if (this.selectedLanguage == 'ko') {
                this.passwordErrorText = '비밀번호에 공백을 제외하고 입력해주세요.'
            } else {
                this.passwordErrorText = 'Spaces are not allowed.'
            }
        } else if (password.length < 8) {
            this.passwordValid = false
            if (this.selectedLanguage == 'ko') {
                this.passwordErrorText = '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.'
            } else {
                this.passwordErrorText = 'Password must be at least 8 characters and contain English + numbers.'
            }
        } else if (!pattern1.test(password) || !pattern2.test(password)) {
            this.passwordValid = false
            if (this.selectedLanguage == 'ko') {
                this.passwordErrorText = '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.'
            } else {
                this.passwordErrorText = 'Password must be at least 8 characters and contain English + numbers.'
            }
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
                if (this.selectedLanguage == 'ko') {
                    this.confirmPasswordErrorText = '비밀번호가 일치하지 않습니다.'
                } else {
                    this.confirmPasswordErrorText = 'Passwords do not match.'
                }
            } else {
                isValid = true
                this.confirmPasswordValid = true
                this.confirmPasswordErrorText = ''
            }
        } else if (pattern4.test(password)) {
            this.confirmPasswordValid = false
            if (this.selectedLanguage == 'ko') {
                this.confirmPasswordErrorText = '비밀번호에 공백을 제외하고 입력해주세요.'
            } else {
                this.confirmPasswordErrorText = 'Spaces are not allowed.'
            }
        } else if (password.length < 8) {
            this.confirmPasswordValid = false
            if (this.selectedLanguage == 'ko') {
                this.confirmPasswordErrorText = '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.'
            } else {
                this.confirmPasswordErrorText = 'Password must be at least 8 characters and contain English + numbers.'
            }
        } else if (!pattern1.test(password) || !pattern2.test(password)) {
            this.confirmPasswordValid = false
            if (this.selectedLanguage == 'ko') {
                this.confirmPasswordErrorText = '비밀번호는 8자 이상, 영문+숫자를 포함해주세요.'
            } else {
                this.confirmPasswordErrorText = 'Password must be at least 8 characters and contain English + numbers.'
            }
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

        if (this.agreementAge && this.agreementPrivacy && this.agreementServiceTerms && this.agreementMarketing) {
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
