import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import handleError from './handleError'

import {environment} from '@environments/environment'

import {Response} from '@schemas/response'
import {User} from '@schemas/user'
import {File} from '@schemas/file'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {
  }

  /**
   * 수정 완료
   * */
  getUser(userId: string): Observable<User> {
    const url = environment.userApiAddress + `/user/findById?userId=${userId}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.httpClient.get<any>(url, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    );
  }

  /**
   * 유저 수정
   * 작업중 => 삭제 예정
   * */
  updateUser(userId: string, requestBody: UpdateUserDto): Observable<User> {
    const url = environment['serverAddress'] + `/users/${userId}`
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.httpClient.patch<any>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0];
      }),
      catchError(handleError)
    );
  }

  /**
   * 개인정보, 서비스 이용약관
   * */
  updateServiceTerms(serviceTerms: ServiceTermsDto): Observable<User> {
    const url = environment.userApiAddress = '/user/serviceTerms';

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.httpClient.patch<User>(url, serviceTerms, options).pipe(
      map((user: User) => {
        return user;
      }),
      catchError(handleError)
    );

  }
  /**
   * 프로필 수정
   * 작업완료
   */
  updateUserProfile(userId: string, nickName: string, aboutMe: string): Observable<User> {
    const url = environment.userApiAddress + '/user/modifyProfile';

    const param: any = {
      userId,
      nickName,
      aboutMe
    };

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.httpClient.patch<User>(url, param, options).pipe(
      map((user: User) => {
        return user;
      }),
      catchError(handleError)
    );
  }

  deleteUser(userId: string, reasons: DeleteUserDto): Observable<Response> {
    const url = environment['serverAddress'] + `/users/${userId}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: reasons,
    }

    return this.httpClient.delete<Response>(url, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  changePassword(userId: string, requestBody: ChangePasswordDto): Observable<Response> {
    const url = environment['serverAddress'] + `/users/${userId}/change-password`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.httpClient.put<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  /**
   * 닉네임 중복확인
   * 수정 완료
   * */
  checkDuplicateNickname(userId: string, nickName: string): Observable<Response> {
    const url = environment.userApiAddress +
      `/user/duplicateUserNickname?userId=${userId}&nickName=${nickName}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.httpClient.get<any>(url, options).pipe(
      map((res) => {
        console.log('check duplicate nickname : ', res);
        return res
      }),
      catchError(handleError)
    )
  }

  /**
   * 수정완료
   * */
  deleteUserBackground(fileUrl: string): Observable<Response> {
    const url = environment.userApiAddress + `/file/deleteUserBackground?fileUrl=${fileUrl}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.httpClient.delete<Response>(url, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }
}

class UpdateUserDto {
  name?: string
  nickname?: string
  age?: number
  sex?: string
  birthDate?: string
  color?: string
  aboutMe?: string
  fcmToken?: string
  agreementAge?: boolean
  agreementPrivacy?: boolean
  agreementServiceTerms?: boolean
  agreementMarketing?: boolean
}

class ServiceTermsDto {
  userId: string;
  agreementAge: boolean;
  agreementPrivacy: boolean;
  agreementServiceTerms: boolean;
  agreementMarketing: boolean;
}

class DeleteUserDto {
  reasons: Array<any>
}

class ChangePasswordDto {
  password: string
  newPassword: string
}
