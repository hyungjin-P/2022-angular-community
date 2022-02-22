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
   * 수정 중
   * */
  getUser(userId: string): Observable<User> {
    // const url = environment['serverAddress'] + `/users/${userId}`
    const url = environment.userApiAddress + `/user/findById?userId=${userId}`;

    // header 설정. bearer token은
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.httpClient.get<any>(url, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  updateUser(userId: string, requestBody: UpdateUserRequestBody): Observable<User> {
    const url = environment['serverAddress'] + `/users/${userId}`

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    }

    return this.httpClient.put<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  deleteUser(userId: string, reasons: DeleteUserRequestBody): Observable<Response> {
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

  changePassword(userId: string, requestBody: ChangePasswordRequestBody): Observable<Response> {
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

  checkDuplicateNickname(userId: string, requestBody: CheckDuplicateNicknameRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + `/users/${userId}/check-duplicate-nickname`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.httpClient.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  createUserPicture(userId: string, requestBody: CreateUserPictureRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + `/users/${userId}/picture`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.httpClient.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  deleteUserPicture(userId: string, fileUrl: string): Observable<Response> {
    const url = environment['serverAddress'] + `/users/${userId}/picture/${encodeURIComponent(fileUrl)}`

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

  // /** 수정 중 */
  // createUserBackground(userId: string, requestBody: CreateUserBackgroundRequestBody): Observable<Response> {
  //
  //   const url = environment['serverAddress'] + `/users/${userId}/background`
  //
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   }
  //
  //   return this.httpClient.post<any>(url, requestBody, options).pipe(
  //     map((res) => {
  //       return res
  //     }),
  //     catchError(handleError)
  //   )
  // }

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

class UpdateUserRequestBody {
  name?: string
  nickname?: string
  age?: number
  sex?: string
  birth_date?: string
  color?: string
  about_me?: string
  fcm_token?: string
  agreement_age?: boolean
  agreement_privacy?: boolean
  agreement_service_terms?: boolean
  agreement_marketing?: boolean
}

class DeleteUserRequestBody {
  reasons: Array<any>
}

class ChangePasswordRequestBody {
  password: string
  new_password: string
}

class CheckDuplicateNicknameRequestBody {
  nickname: string
}

class CreateUserPictureRequestBody {
  files: Array<File>
}

class CreateUserBackgroundRequestBody {
  files: Array<File>
}
