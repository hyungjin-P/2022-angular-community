import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { User } from '@schemas/user'
import { File } from '@schemas/file'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

    getUser(userId: string): Observable<User> {
        const url = environment['serverAddress'] + `/users/${userId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset[0]
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

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    deleteUser(userId: string, reasons: DeleteUserRequestBody): Observable<Response> {
        const url = environment['serverAddress'] + `/users/${userId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: reasons,
        }

        return this.http.delete<Response>(url, options).pipe(
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

        return this.http.put<Response>(url, requestBody, options).pipe(
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

        return this.http.post<Response>(url, requestBody, options).pipe(
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

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res.dataset[0]
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

        return this.http.delete<Response>(url, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    createUserBackground(userId: string, requestBody: CreateUserBackgroundRequestBody): Observable<Response> {
        const url = environment['serverAddress'] + `/users/${userId}/background`

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

    deleteUserBackground(userId: string, fileUrl: string): Observable<Response> {
        const url = environment['serverAddress'] + `/users/${userId}/background/${encodeURIComponent(fileUrl)}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.delete<Response>(url, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

class UpdateUserRequestBody {
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
