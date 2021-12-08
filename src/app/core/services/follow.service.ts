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
export class FollowService {
    constructor(private http: HttpClient) {}

    createFollow(requestBody: CreateFollowRequestBody): Observable<User> {
        const url = environment['serverAddress'] + '/follow'

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

    deleteFollow(userId: string): Observable<Response> {
        const url = environment['serverAddress'] + `/follow/${userId}`

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

    getFollower(page = '', pageSize = ''): Observable<Array<User>> {
        const url = environment['serverAddress'] + `/follow/follower?page=${page}&pageSize=${pageSize}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    getFollowing(page = '', pageSize = ''): Observable<Array<User>> {
        const url = environment['serverAddress'] + `/follow/following?page=${page}&pageSize=${pageSize}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
}

class CreateFollowRequestBody {
    user_id: string
}
