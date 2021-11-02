import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { CodeCategory } from '@schemas/code-category'

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor(private http: HttpClient) {}

    getCategory(categoryId: string): Observable<CodeCategory> {
        const url = environment['serverAddress'] + `/code/${categoryId}`

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
}
