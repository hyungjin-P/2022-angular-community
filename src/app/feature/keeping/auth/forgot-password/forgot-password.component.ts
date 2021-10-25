import { Component, OnInit } from '@angular/core'

import { GlobalService } from '@services/global.service'

import { AuthService } from '@services/auth.service'

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    TAG = '비밀번호 찾기'

    email: string
    emailValid: boolean
    emailErrorText: string

    selectedLanguage: string

    constructor(private globalService: GlobalService, private authService: AuthService) {}

    ngOnInit() {
        this.email = ''
        this.emailValid = false
        this.emailErrorText = ''

        this.selectedLanguage = localStorage.getItem('language')
    }

    sendResetPasswordLinkMail() {
        if (!this.formCheck()) {
            return
        }

        this.authService.sendResetPasswordLinkMail({ email: this.email }).subscribe(
            (v) => {
                this.email = ''
                this.emailValid = false

                let text = ''
                let confirmBtnText = ''
                if (this.selectedLanguage == 'ko') {
                    text = '비밀번호 재설정 링크를 발송하였습니다.'
                    confirmBtnText = '확인'
                } else {
                    text = 'We have sent you a password reset link.'
                    confirmBtnText = 'Confirm'
                }

                this.globalService.showModal({
                    text: text,
                    confirmBtnText: confirmBtnText,
                })
            },
            (e) => {
                this.globalService.showToast(e.message)
            }
        )
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.sendResetPasswordLinkMail()
            }
        } else {
            if (event.key != 'Tab' && type == 'email') {
                this.checkEmailPattern(this.email)
            }
        }
    }

    formCheck() {
        let isValid = false

        if (this.checkEmailPattern(this.email)) {
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
            if (this.selectedLanguage == 'ko') {
                this.emailErrorText = '규칙에 맞는 이메일 주소를 입력해 주세요.'
            } else {
                this.emailErrorText = 'Invalid email address.'
            }
        }

        return isValid
    }
}
