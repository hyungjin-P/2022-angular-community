import {Component, OnInit} from '@angular/core'

import {GlobalService} from '@services/global.service'

import {AuthService} from '@services/auth.service'
import {TextService} from '@services/text.service'

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

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    private textService: TextService
  ) {
  }

  ngOnInit() {
    this.email = '';
    this.emailValid = false;
    this.emailErrorText = '';
    this.selectedLanguage = localStorage.getItem('language');
  }

  sendResetPasswordLinkMail() {
    if (!this.formCheck()) {
      return
    }

    this.authService
      .sendResetPasswordLinkMail({email: this.email, lang: this.selectedLanguage || 'ko'})
      .subscribe(
        (v) => {
          this.email = '';
          this.emailValid = false;

          // 비밀번호 재설정 링크를 발송하였습니다.
          let text = this.textService.getText('auth:forgot-password:001');

          // 확인
          let confirmBtnText = this.textService.getText('auth:forgot-password:002');

          this.globalService.showModal({
            text,
            confirmBtnText,
          });
        },
        () => {
          this.globalService
            .showToast(this.textService
              .getText(
                'auth:forgot-password:004',
                this.selectedLanguage || 'ko'));
        }
      )
  }

  onKeyup(event, type) {
    if (event.key === 'Enter') {
      if (this.formCheck()) {
        this.sendResetPasswordLinkMail()
      }
    } else {
      if (event.key !== 'Tab' && type === 'email') {
        this.checkEmailPattern(this.email)
      }
    }
  }

  formCheck() {
    let isValid = false;

    if (this.checkEmailPattern(this.email)) {
      isValid = true;
    }

    return isValid;
  }

  checkEmailPattern(email: string) {
    let isValid = false;

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (emailRegex.test(email)) {
      isValid = true;
      this.emailValid = true;
      this.emailErrorText = '';
    } else {
      this.emailValid = false;
      // 규칙에 맞는 이메일 주 소를 입력해 주세요.
      this.emailErrorText = this.textService.getText('auth:forgot-password:003');
    }

    return isValid;
  }
}
