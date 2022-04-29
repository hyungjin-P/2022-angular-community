import {Component, OnInit} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'

import {GlobalService} from '@services/global.service'
import {StorageService} from '@services/storage.service'

import {AuthService} from '@services/auth.service'
import {TextService} from '@services/text.service'

import {User} from '@schemas/user'

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  TAG = '비밀번호 재설정';

  token: string;
  isTokenValid: boolean;

  password: string;
  passwordValid: boolean;
  passwordErrorText: string;
  passwordVisible: boolean;

  confirmPassword: string;
  confirmPasswordValid: boolean;
  confirmPasswordErrorText: string;
  confirmPasswordVisible: boolean;

  selectedLanguage: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private storageService: StorageService,
    private authService: AuthService,
    private textService: TextService
  ) {
  }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParams.token;

    if (!this.token) {
      this.isTokenValid = false;
    } else {
      this.checkResetPasswordLinkMail()
    }

    this.password = '';
    this.passwordValid = false;
    this.passwordErrorText = '';
    this.passwordVisible = false;

    this.confirmPassword = '';
    this.confirmPasswordValid = false;
    this.confirmPasswordErrorText = ''
    this.confirmPasswordVisible = false;

    this.selectedLanguage = localStorage.getItem('language')
  }

  checkResetPasswordLinkMail() {
    this.authService
      .passwordChangeEmailVerified({token: this.token})
      .subscribe((v) => {
          this.isTokenValid = true;
        }, (e) => {
          this.isTokenValid = false;
          if (e.code === 'user-not-found') {
            this.globalService.showToast(e.message);
          }

          if (e.code === 'time-later') {
            this.globalService.showToast(e.message);
          }

        }
      )
  }

  changePassword() {
    if (!this.formCheck()) {
      return
    }

    this.authService
      .changePassword({token: this.token, password: this.password})
      .subscribe((user: User) => {
          // 비밀번호가 변경되었습니다.

          let text = this.textService.getText('auth:reset-password:002')

          // 확인
          let confirmBtnText = this.textService.getText('auth:reset-password:003')

          this.globalService.showModal({
            text: text,
            confirmBtnText: confirmBtnText,
          })

          this.storageService.setUser(user)
          this.router.navigateByUrl('/').then();
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
      this.checkConfirmPasswordPattern(this.confirmPassword) &&
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
      !pattern4.test(password) &&
      8 <= password.length &&
      password.length <= 15
    ) {
      isValid = true
      this.passwordValid = true
      this.passwordErrorText = ''
    } else if (pattern4.test(password)) {
      this.passwordValid = false
      // 비밀번호에 공백을 제외하고 입력해주세요.
      this.passwordErrorText = this.textService.getText('auth:reset-password:004')
    } else if (password.length < 8) {
      this.passwordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('auth:reset-password:005')
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.passwordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('auth:reset-password:005')
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
      !pattern4.test(password) &&
      8 <= password.length &&
      password.length <= 15
    ) {
      if (this.password != this.confirmPassword) {
        this.confirmPasswordValid = false
        // 비밀번호가 일치하지 않습니다.
        this.confirmPasswordErrorText = this.textService.getText('auth:reset-password:006')
      } else {
        isValid = true
        this.confirmPasswordValid = true
        this.confirmPasswordErrorText = ''
      }
    } else if (pattern4.test(password)) {
      this.confirmPasswordValid = false
      // 비밀번호에 공백을 제외하고 입력해주세요.
      this.confirmPasswordErrorText = this.textService.getText('auth:reset-password:004')
    } else if (password.length < 8) {
      this.confirmPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.confirmPasswordErrorText = this.textService.getText('auth:reset-password:005')
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.confirmPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.confirmPasswordErrorText = this.textService.getText('auth:reset-password:005')
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
