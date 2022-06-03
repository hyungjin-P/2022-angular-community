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
import {Router} from '@angular/router'
import {fromEvent, Subscription} from 'rxjs'
import {map, debounceTime, distinctUntilChanged} from 'rxjs/operators'

import {GlobalService} from '@services/global.service'
import {StorageService} from '@services/storage.service'

import {AuthService} from '@services/auth.service'
import {HelperService} from '@services/helper.service'
import {TextService} from '@services/text.service'

import {User} from '@schemas/user'

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit, AfterViewInit, OnDestroy {
  TAG = '이메일 회원가입'

  @ViewChild('popupPrivacyServiceTermsRef') popupPrivacyServiceTermsRef

  @ViewChildren('emailRef') emailList: QueryList<ElementRef>
  EmailInputKeyupSubscription1: Subscription;
  EmailInputKeyupSubscription2: Subscription;

  email: string;
  emailValid: boolean;
  emailVerified: boolean;
  emailErrorText: string;

  verificationCodeVisible: boolean;
  verificationCode: string;
  verificationCodeErrorText: string;
  timeLeft: number;
  interval: any;

  password: string;
  passwordValid: boolean;
  passwordErrorText: string;
  passwordVisible: boolean;

  confirmPassword: string
  confirmPasswordValid: boolean
  confirmPasswordErrorText: string
  confirmPasswordVisible: boolean

  allAgreement: boolean
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
    private authService: AuthService,
    private helperService: HelperService,
    private textService: TextService
  ) {
  }

  ngOnInit() {
    this.email = ''
    this.emailValid = false
    this.emailVerified = false
    this.emailErrorText = ''

    this.verificationCodeVisible = false
    this.verificationCode = ''
    this.verificationCodeErrorText = ''
    this.timeLeft = 0

    this.password = '';
    this.passwordValid = false;
    this.passwordErrorText = '';
    this.passwordVisible = false;

    this.confirmPassword = '';
    this.confirmPasswordValid = false;
    this.confirmPasswordErrorText = '';
    this.confirmPasswordVisible = false;

    this.allAgreement = false;
    this.agreementAge = false;
    this.agreementPrivacy = false;
    this.agreementServiceTerms = false;
    this.agreementMarketing = false;

    this.selectedLanguage = localStorage.getItem('language');
  }

  ngAfterViewInit() {
    this.emailList.forEach((email, index) => {
      let inputElement = email.nativeElement.getElementsByTagName('input')[0];

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
        );

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

  onImageLoad(element: HTMLImageElement) {
    this.helperService.ImproveImageQuality(element)
  }

  checkDuplicateMail(key: string, email: string) {
    if (key === 'Backspace') {
      if (!this.checkEmailPattern(email)) {
        this.emailValid = false
        // 규칙에 맞는 이메일 주소를 입력해 주세요.
        this.emailErrorText = this.textService.getText('auth:email:001')
      }
      this.verificationCodeVisible = false
      return
    }

    if (!this.checkEmailPattern(email)) {
      this.emailValid = false
      // 규칙에 맞는 이메일 주소를 입력해 주세요.
      this.emailErrorText = this.textService.getText('auth:email:001')
      return
    }

    this.authService
      .checkDuplicateMail({email: email})
      .subscribe((v) => {
        if (!v) {
          this.emailValid = true
          this.emailErrorText = ''
          if (key === 'Enter') {
            this.sendVerificationCodeMail()
            return
          }
        } else {
          this.emailValid = false;
          this.emailErrorText = this.textService.getText('auth:email:002');
        }
      });
  }

  /**
   * 이메일 인증
   * */
  sendVerificationCodeMail() {
    if (!this.emailValid) {
      return
    }

    console.log('email : ', this.email);

    // 인증 뷰 표시
    this.verificationCodeVisible = true;
    this.verificationCode = '';
    this.verificationCodeErrorText = '';

    setTimeout(() => {
      try {
        document.activeElement
          .closest('.registration-form')
          .querySelector('.verification-code')
          .getElementsByTagName('input')[0]
          .focus()
      } catch (e) {
      }
    }, 0)

    console.log('---------------------------');
    console.log('this.email : ', this.email);
    console.log('this.selectedLanguage : ', this.selectedLanguage);
    console.log('this.interval : ', this.interval);
    console.log('---------------------------');

    // 인증메일 발송
    this.authService
      .sendVerificationCodeMail({email: this.email, lang: this.selectedLanguage || 'ko'})
      .subscribe((v) => {
        if (this.interval) {
          this.stopTimer()
        }

        this.startTimer()
      },
        (e) => {
        this.verificationCodeErrorText = e.message
      });
  }

  checkVerificationCodeMail() {

    console.log('---------------------------');
    console.log('this.verificationCode : ', this.verificationCode);
    console.log('this.timeLeft : ', this.timeLeft);
    console.log('---------------------------');

    if (this.verificationCode.length != 6 || this.timeLeft <= 0) {
      return
    }

    this.authService
      .checkVerificationCodeMail({email: this.email, verification_code: Number(this.verificationCode)})
      .subscribe(
        (v) => {
          if (this.interval) {
            this.stopTimer()
          }
          this.emailVerified = true;
          this.verificationCodeVisible = false;
          this.verificationCodeErrorText = '';
        },
        (e) => {
          console.log('email verified failed : ', e);
          this.verificationCodeErrorText = this.textService.getText('auth:email:003');

          /* old codes */
          // if (e.code == 'FUNCTION:AUTH:005') {
          //   // 인증번호가 일치하지 않습니다. 다시 입력해주세요.
          //   this.verificationCodeErrorText = this.textService.getText('auth:email:003')
          // } else {
          //   this.verificationCodeErrorText = e.message
          // }
        }
      )
  }

  /**
   * 회원가입
   */
  registration() {

    // 폼 체크
    if (!this.formCheck()) {
      return
    }

    this.authService
      .registration({
        email: this.email,
        verificationCode: Number(this.verificationCode),
        password: this.password,
        agreementAge: this.agreementAge,
        agreementPrivacy: this.agreementPrivacy,
        agreementServiceTerms: this.agreementServiceTerms,
        agreementMarketing: this.agreementMarketing,
      })
      .subscribe(
        (user: User) => {
          console.log('user : ', user);
          this.storageService.setUser(user)
          this.router.navigateByUrl('/').then().catch();
        },
        (e) => {
          this.globalService.showToast(this.textService.getText('auth:email:003'));
        }
      )
  }

  startTimer() {
    this.timeLeft = 3 * 60
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--
      } else {
        // 인증번호 입력시간이 초과되었습니다.
        this.verificationCodeErrorText = this.textService.getText('auth:email:004')
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
      if (event.key !== 'Tab' && (type === 'email' || type === 'password' || type === 'confirmPassword')) {
        if (type === 'email') {
          this.checkEmailPattern(this.email)
        } else if (type === 'password') {
          this.checkPasswordPattern(this.password)
        } else if (type === 'confirmPassword') {
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
      this.checkConfirmPasswordPattern(this.confirmPassword) &&
      this.password === this.confirmPassword &&
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

  /**
   * password 패턴 체크
   * */
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
      this.passwordErrorText = this.textService.getText('auth:email:005')
    } else if (password.length < 8) {
      this.passwordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('auth:email:006')
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.passwordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.passwordErrorText = this.textService.getText('auth:email:006')
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
        this.confirmPasswordErrorText = this.textService.getText('auth:email:007')
      } else {
        isValid = true
        this.confirmPasswordValid = true
        this.confirmPasswordErrorText = ''
      }
    } else if (pattern4.test(password)) {
      this.confirmPasswordValid = false
      // 비밀번호에 공백을 제외하고 입력해주세요.
      this.confirmPasswordErrorText = this.textService.getText('auth:email:005')
    } else if (password.length < 8) {
      this.confirmPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.confirmPasswordErrorText = this.textService.getText('auth:email:006')
    } else if (!pattern1.test(password) || !pattern2.test(password)) {
      this.confirmPasswordValid = false
      // 비밀번호는 8자 이상, 영문+숫자를 포함해주세요.
      this.confirmPasswordErrorText = this.textService.getText('auth:email:006')
    }

    return isValid
  }

  changePasswordVisible() {
    this.passwordVisible = !this.passwordVisible
  }

  changeConfirmPasswordVisible() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible
  }

  /**
   * 개인정보 수집 이용동의, 마케팅 정보 수신 동의
   * */
  checkTerms(item: string) {
    if (item === 'all') {
      if (this.allAgreement) {
        this.allAgreement = false
        this.agreementAge = false
        this.agreementPrivacy = false
        this.agreementServiceTerms = false
        this.agreementMarketing = false
      } else {
        this.allAgreement = true
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

    this.allAgreement =
      this.agreementAge &&
      this.agreementPrivacy &&
      this.agreementServiceTerms &&
      this.agreementMarketing;
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
