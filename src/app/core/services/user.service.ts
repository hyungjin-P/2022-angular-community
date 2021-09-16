import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { User } from '@schemas/user'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient, private storageService: StorageService) {}

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

    deleteUser(userId: string): Observable<Response> {
        const url = environment['serverAddress'] + `/users/${userId}`

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

    checkPasswrod(userId: string, requestBody: { password: string }): Observable<Response> {
        const url = environment['serverAddress'] + `/users/${userId}/check-password`
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
}

class UpdateUserRequestBody {
    name?: string
    picture?: string
    age?: number
    sex?: string
    birth_date?: string
    color?: string
    fcm_token?: string
    agreement_age?: boolean
    agreement_privacy?: boolean
    agreement_service_terms?: boolean
    agreement_marketing?: boolean
}

class ChangePasswordRequestBody {
    password: string
    new_password: string
}
