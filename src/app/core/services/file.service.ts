import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import handleError from './handleError';

import { environment } from '@environments/environment';

import { Response } from '@schemas/response';
import { File } from '@schemas/file';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  /**
   * 수정 완료
   * */
  createFile(requestBody: CreateFileDto, files: FileList): Observable<Array<File>> {
    const url = environment.userApiAddress + `/file`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    const formData: FormData = new FormData();

    formData.append('domainName', requestBody.domainName);
    formData.append('path', requestBody.path);
    formData.append('userId', requestBody.userId);
    formData.append('tag', requestBody.tag);
    if (requestBody.tagInId) {
      formData.append('tagInId', requestBody.tagInId);
    }

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    return this.http.post<any>(url, formData, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   *
   * @param tag
   * @param tagInId
   * @param fileUrl
   */
  deleteFile(tag: string, tagInId: string, fileUrl: string): Observable<any> {
    const url = environment.userApiAddress + `/file?tag=${tag}&tagInId=${tagInId}&url=${fileUrl}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.delete<any>(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }
}

class CreateFileDto {
  userId: string;
  domainName: string;
  path: string;
  tag: string;
  tagInId?: string;
}
