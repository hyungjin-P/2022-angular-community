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
   * 구글 로그인
   * @param accessToken
   */
  modifySignWithFirebase(accessToken: string): Observable<any> {
    const url = environment.userApiAddress + '/auth/firebaseSignIn';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<any>(url, { accessToken }, options).pipe(
      map((data) => {
        return data;
      }),
      catchError(handleError)
    )

  }

  /**
   * 카카오 로그인
   * @param accessToken
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
   * @param code
   */
  modifySignWithNaver(code: string): Observable<User> {
    const url = environment.userApiAddress + `/auth/signInNaver`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<any>(url, { code }, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    )

  }

  /**
   * email login
   * @param requestBody
   * */
  signInWithEmail(requestBody: signInEmailDto): Observable<User> {
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
  // refresh(requestBody: RefreshRequestBody): Observable<Response> {
  //   const url = environment['serverAddress'] + '/auth/refresh'
  //
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   }
  //
  //   return this.http.post<Response>(url, requestBody, options).pipe(
  //     map((res) => {
  //       return res
  //     }),
  //     catchError(handleError)
  //   )
  // }

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
        return result;
      }),
      catchError(handleError)
    )
  }

  /**
   * 수정 완료
   */
  sendResetPasswordLinkMail(
    requestBody: SendResetPasswordLinkMailRequestBody
  ): Observable<Response> {
    const url = environment.userApiAddress + '/user/resetPasswordLinkMail'

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
   * 비밀번호 변경 링크 검증
   * @param requestBody
   */
  passwordChangeEmailVerified(
    requestBody: CheckResetPasswordLinkMailRequestBody
  ): Observable<Response> {
    // const url = environment['serverAddress'] + '/auth/check-reset-password-link-mail'
    const url = environment.userApiAddress + `/user/passwordChangeEmailVerified`;

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
    const url = environment.userApiAddress + '/user/passwordChangeWithVerificationCheckOk';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<any>(url, requestBody, options).pipe(
      map((res) => {
        return res;
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

class signInEmailDto {
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
  password: string
}

class SendVerificationCodeMailChangeRequestBody {
  email: string
}

class CheckVerificationCodeSMSChangeRequestBody {
  verification_code: number
}
