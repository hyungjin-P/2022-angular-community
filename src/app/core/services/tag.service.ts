import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.prod';
import { catchError, map } from 'rxjs/operators';
import handleError from '@services/handleError';

@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private http: HttpClient) {}

  getTagList(text: string): Observable<any> {
    const url = environment.userApiAddress + `/tag/findTagList?name=${text}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.get<any>(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }
}
