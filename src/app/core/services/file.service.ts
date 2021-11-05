import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { File } from '@schemas/file'

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor(private http: HttpClient) {}

    createFile(requestBody: CreateFileRequestBody, files: FileList): Observable<Array<File>> {
        const url = environment['serverAddress'] + '/files'

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        const formData: FormData = new FormData()

        formData.append('domain_name', requestBody['domain_name'])
        formData.append('path', requestBody['path'])

        if (requestBody['tags']) {
            requestBody['tags'].forEach((tag) => {
                formData.append('tags', tag)
            })
        }

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        return this.http.post<Response>(url, formData, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    deleteFile(fileUrl: string): Observable<Response> {
        const url = environment['serverAddress'] + `/files/${encodeURIComponent(fileUrl)}`

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

class CreateFileRequestBody {
    domain_name: string
    path: string
    tags?: Array<string>
}
