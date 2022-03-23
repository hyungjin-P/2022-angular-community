import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { User } from '@schemas/user'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * firebase 로그인
   * 수정중임
   * */
  signInWithFirebase(requestBody: SignInWithFirebaseRequestBody): Observable<User> {
    const url = environment['serverAddress'] + '/auth/firebase'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        console.log('firebase login : ', res);
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  /**
   * 카카오 로그인
   * 수정중임
   * */
  signInWithKakao(requestBody: SignInWithKakaoRequestBody): Observable<User> {
    const url = environment['serverAddress'] + '/auth/kakao'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http
      .post<Response>(url, requestBody, options)
      .pipe(map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  /**
   * 카카오 로그인 수정 후
   * */
  modifiedKakaoLogin(accessToken: string) {
    const url = environment.userApiAddress + '/auth/kakao';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http
      .post<any>(url, { accessToken }, options)
      .pipe(map((res) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  /**
   * 네이버 로그인
   * 수정중
   * */
  signWithNaver(requestBody: SignInWithNaverRequestBody): Observable<User> {

    console.log('signWithNaver : requestBody : ', requestBody);

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

  modifySignWithNaver(code: string): Observable<User> {
    console.log('sign with naver code', code);
    const url = environment.userApiAddress + `/auth/signInNaver`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<any>(url, { code }, options).pipe(
      map((res) => {
        console.log('modifySignWithNaver : ', res);
        return res;
      }),
      catchError(handleError)
    )

  }

  /**
   * email login
   * 수정완료
   * */
  signInWithEmail(requestBody: SignInWithEmailRequestBody): Observable<User> {
    const url = environment.userApiAddress + '/auth/signIn';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http
      .post<User>(url, requestBody, options)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(handleError));
  }

  // token refresh
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

  /**
   * 이메일 중복 체크
   * 수정완료
   * */
  checkDuplicateMail(requestBody: CheckDuplicateMailRequestBody): Observable<any> {
    const url = environment.userApiAddress + `/user/hasProvidedIdAndDeleteAtIsNull?providedId=${requestBody.email}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<any>(url, options).pipe(
      map((res) => {
        console.log('checkDuplicateMail res : ', res);
        return res;
      }),
      catchError(handleError)
    )
  }

  /**
   * 인증메일 발송
   * 수정완료
   * */
  sendVerificationCodeMail(requestBody: SendVerificationCodeMailRequestBody): Observable<Response> {
    const url = environment.userApiAddress +
      `/user/sendVerifiedCodeMail?emailAddress=${requestBody.email}&language=${requestBody.lang}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        console.log('url');
        return res;
      }),
      catchError(handleError)
    )
  }

  /**
   * 인증번호 확인 (수정 OK)
   * */
  checkVerificationCodeMail(requestBody: CheckVerificationCodeMailRequestBody): Observable<Response> {
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
        return res
      }),
      catchError(handleError)
    )
  }

  /**
   * 회원가입 (수정 OK)
   * */
  registration(requestBody: RegistrationRequestBody): Observable<User> {
    const url = environment.userApiAddress + `/user/registration`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<any>(url, requestBody, options).pipe(
      map((result) => {
         console.log('resistration > res : ', result)
        return result;
      }),
      catchError(handleError)
    )
  }

  /**
   * 수정 중
   */
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
  providedId: string
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
  email: string;
  verificationCode: number;
  password: string;
  agreementAge: boolean;
  agreementPrivacy: boolean;
  agreementServiceTerms: boolean;
  agreementMarketing: boolean;
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
