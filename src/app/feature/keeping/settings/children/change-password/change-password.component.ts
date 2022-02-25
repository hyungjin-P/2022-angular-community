import {Component, OnInit} from '@angular/core'
import {Location} from '@angular/common'

import {GlobalService} from '@services/global.service'
import {StorageService} from '@services/storage.service'

import {UserService} from '@services/user.service'
import {TextService} from '@services/text.service'

import {User} from '@schemas/user'

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  user: User

  password: string
  passwordValid: boolean
  passwordErrorText: string
  passwordVisible: boolean

  newPassword: string
  newPasswordValid: boolean
  newPasswordErrorText: string
  newPasswordVisible: boolean

  confirmNewPassword: string
  confirmNewPasswordValid: boolean
  confirmNewPasswordErrorText: string
  confirmNewPasswordVisible: boolean

  constructor(
    private location: Location,
    private userService: UserService,
    private globalService: GlobalService,
    private storageService: StorageService,
    private textService: TextService
  ) {
  }

  ngOnInit() {
    this.user = this.storageService.getUser()

    this.password = ''
    this.passwordValid = false
    this.passwordErrorText = ''
    this.passwordVisible = false

    this.newPassword = ''
    this.newPasswordValid = false
    this.newPasswordErrorText = ''
    this.newPasswordVisible = false

    this.confirmNewPassword = ''
    this.confirmNewPasswordValid = false
    this.confirmNewPasswordErrorText = ''
    this.confirmNewPasswordVisible = false
  }

  goBack() {
    this.location.back()
  }

  changePassword() {
    if (!this.formCheck()) {
      return
    }

    this.userService
      .changePassword({
        userId: this.user.id,
        oldPassword: this.password,
        newPassword: this.newPassword
      })
      .subscribe(
        (v) => {
          this.password = '';
          this.newPassword = '';

          this.globalService.showToast(
            this.textService.getText('settings:change-password:004')
          );
        },
        (e) => {
          if (e.code === 'failure') {
            this.globalService.showToast(e.message);
          }
          console.log('password change failed ', e);
        }
      )
  }

  onKeyup(event, type) {
    if (event.key == 'Enter') {
      if (this.formCheck()) {
        this.changePassword()
      }
    } else {
      if (event.key != 'Tab' && (type == 'password' || type == 'newPassword' || type == 'confirmNewPassword')) {
        if (type == 'password') {
          this.checkPasswordPattern(this.password)
        } else if (type == 'newPassword') {
          this.checkNewPasswordPattern(this.newPassword)
        } else if (type == 'confirmNewPassword') {
          this.checkConfirmNewPasswordPattern(this.confirmNewPassword)
        }
      }
    }
  }

  formCheck() {
    let isValid = false

    if (
      this.checkPasswordPattern(this.password) &&
      this.checkNewPasswordPattern(this.newPassword) &&
      this.checkConfirmNewPasswordPattern(this.confirmNewPassword) &&
      this.newPassword == this.confirmNewPassword
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
      this.passwordErrorText = this.textService.getText('settings:change-password:001')
    } else if (password.length < 8) {
      this.passwordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('settings:change-password:002')
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.passwordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('settings:change-password:002')
    }

    return isValid
  }

  checkNewPasswordPattern(password: string) {
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
      this.newPasswordValid = true
      this.newPasswordErrorText = ''
    } else if (pattern4.test(password)) {
      this.newPasswordValid = false
      // 비밀번호에 공백을 제외하고 입력해주세요.
      this.newPasswordErrorText = this.textService.getText('settings:change-password:001')
    } else if (password.length < 8) {
      this.newPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.newPasswordErrorText = this.textService.getText('settings:change-password:002')
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.newPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.newPasswordErrorText = this.textService.getText('settings:change-password:002')
    }

    this.checkConfirmNewPasswordPattern(this.confirmNewPassword)

    return isValid
  }

  checkConfirmNewPasswordPattern(password: string) {
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
      if (this.newPassword != this.confirmNewPassword) {
        this.confirmNewPasswordValid = false
        // 비밀번호가 일치하지 않습니다.
        this.confirmNewPasswordErrorText = this.textService.getText('settings:change-password:003')
      } else {
        isValid = true
        this.confirmNewPasswordValid = true
        this.confirmNewPasswordErrorText = ''
      }
    } else if (pattern4.test(password)) {
      this.confirmNewPasswordValid = false
      // 비밀번호에 공백을 제외하고 입력해주세요.
      this.confirmNewPasswordErrorText = this.textService.getText('settings:change-password:001')
    } else if (password.length < 8) {
      this.confirmNewPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.confirmNewPasswordErrorText = this.textService.getText('settings:change-password:002')
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.confirmNewPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.confirmNewPasswordErrorText = this.textService.getText('settings:change-password:002')
    }

    return isValid
  }

  changePasswordVisible() {
    this.passwordVisible = !this.passwordVisible
  }

  changeNewPasswordVisible() {
    this.newPasswordVisible = !this.newPasswordVisible
  }

  changeConfirmNewPasswordVisible() {
    this.confirmNewPasswordVisible = !this.confirmNewPasswordVisible
  }
}
