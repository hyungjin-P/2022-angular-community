import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import handleError from './handleError'

import {environment} from '@environments/environment'

import {Response} from '@schemas/response'
import {User} from '@schemas/user'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  signInWithFirebase(requestBody: SignInWithFirebaseRequestBody): Observable<User> {
    const url = environment['serverAddress'] + '/auth/firebase'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  signInWithKakao(requestBody: SignInWithKakaoRequestBody): Observable<User> {
    const url = environment['serverAddress'] + '/auth/kakao'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  signWithNaver(requestBody: SignInWithNaverRequestBody): Observable<User> {
    const url = environment['serverAddress'] + '/auth/naver'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  signInWithEmail(requestBody: SignInWithEmailRequestBody): Observable<User> {
    const url = environment['serverAddress'] + '/auth/login'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  refresh(requestBody: RefreshRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/refresh'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  checkDuplicateMail(requestBody: CheckDuplicateMailRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/check-duplicate-mail'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  /**
   * 인증메일 발송
   * */
  sendVerificationCodeMail(requestBody: SendVerificationCodeMailRequestBody): Observable<Response> {
    console.log('sendVerificationCodeMail > requestBody : ', requestBody);

    /* old source */
    // const url = environment['serverAddress'] + '/auth/send-verification-code-mail'
    const url = environment.userApiAddress + `/user/sendVerifiedCodeMail?emailAddress=${requestBody.email}&language=${requestBody.lang}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        console.log('url');
        return res
      }),
      catchError(handleError)
    )
  }

  /**
   * 인증번호 확인
   * */
  checkVerificationCodeMail(requestBody: CheckVerificationCodeMailRequestBody): Observable<Response> {
    // const url = environment['serverAddress'] + '/auth/check-verification-code-mail'

    let url = environment.userApiAddress + '/user/checkVerificationCode'
    url += `?providedId=${requestBody.email}&verifiedCode=${requestBody.verification_code}`;

    console.log('url : ', url);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        console.log('checkVerificationCodeMail res : ', res);

        return res
      }),
      catchError(handleError)
    )
  }

  /**
   * 회원가입
   * */
  registration(requestBody: RegistrationRequestBody): Observable<User> {
    // const url = environment['serverAddress'] + '/auth/registration'
    const url = environment.userApiAddress + `/user/registration`;

    console.log('registration data : ', requestBody);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0];
      }),
      catchError(handleError)
    )
  }

  sendResetPasswordLinkMail(
    requestBody: SendResetPasswordLinkMailRequestBody
  ): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/send-reset-password-link-mail'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  checkResetPasswordLinkMail(
    requestBody: CheckResetPasswordLinkMailRequestBody
  ): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/check-reset-password-link-mail'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  changePassword(requestBody: ChangePasswordRequestBody): Observable<User> {
    const url = environment['serverAddress'] + '/auth/change-password'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  sendVerificationCodeMailChange(requestBody: SendVerificationCodeMailChangeRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/send-verification-code-mail-change'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  checkVerificationCodeMailChange(requestBody: CheckVerificationCodeMailChangeRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/check-verification-code-mail-change'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  sendVerificationCodeSMSChange(requestBody: SendVerificationCodeSMSChangeRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/send-verification-code-sms-change'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  checkVerificationCodeSMSChange(requestBody: CheckVerificationCodeSMSChangeRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + '/auth/check-verification-code-sms-change'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }
}

class SignInWithFirebaseRequestBody {
  accessToken: string
}

class SignInWithKakaoRequestBody {
  accessToken: string
}

class SignInWithNaverRequestBody {
  code: string
}

class SignInWithEmailRequestBody {
  email: string
  password: string
}

class RefreshRequestBody {
  refreshToken: string
}

class CheckDuplicateMailRequestBody {
  email: string
}

class SendVerificationCodeMailRequestBody {
  email: string
  lang: string
}

class CheckVerificationCodeMailRequestBody {
  email: string
  verification_code: number
}

class RegistrationRequestBody {
  email: string
  verification_code: number
  password: string
  agreement_age: boolean
  agreement_privacy: boolean
  agreement_service_terms: boolean
  agreement_marketing: boolean
}

class SendResetPasswordLinkMailRequestBody {
  email: string
  lang: string
}

class CheckResetPasswordLinkMailRequestBody {
  token: string
}

class ChangePasswordRequestBody {
  token: string
  new_password: string
}

class SendVerificationCodeMailChangeRequestBody {
  email: string
}

class CheckVerificationCodeMailChangeRequestBody {
  verification_code: number
}

class SendVerificationCodeSMSChangeRequestBody {
  phone_number: string
  is_test?: number
}

class CheckVerificationCodeSMSChangeRequestBody {
  verification_code: number
}
