import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import handleError from './handleError'

import {environment} from '@environments/environment'

import {Response} from '@schemas/response'
import {Feed} from '@schemas/feed'

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(
    private http: HttpClient
  ) {
  }

  getFeedList(page: number, limit: number): Observable<Array<Feed>> {
    const url = environment.userApiAddress + `/public/feed?page=${page}&limit=${limit}`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<any>(url, options).pipe(
      map((res) => {
        console.log('feed list : ', res);
        return res;
      }),
      catchError(handleError)
    )
  }

  getFeed(feedId: string): Observable<Feed> {
    const url = environment['serverAddress'] + `/public/feed/${feedId}`

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
