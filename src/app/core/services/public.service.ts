import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import handleError from './handleError';

import { environment } from '@environments/environment';

import { Response } from '@schemas/response';
import { Feed } from '@schemas/feed';
import { User } from '@schemas/user';
import { FeedLike } from '@schemas/feed-like';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(private http: HttpClient) {}

  getFeedList(page: number, limit: number): Observable<Array<Feed>> {
    const url = environment.userApiAddress + `/public/feed/findPages?page=${page}&limit=${limit}`;

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

  /**
   * 비로그인 피드 상세 조회
   * @param feedId
   */
  getFeed(feedId: string): Observable<Feed> {
    const url = environment.userApiAddress + `/public/feed/findById?feedId=${feedId}`;

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

  getFeedLikeList(page: number, limit: number, feedId): Observable<Array<FeedLike>> {
    const url = environment.userApiAddress + `/public/feed/like/findPages?page=${page}&limit=${limit}&feedId=${feedId}`;

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

  getMagazineList(page: number, limit: number, category: string = 'all'): Observable<any> {
    const url =
      environment.userApiAddress + `/public/magazine/findPages?page=${page}&limit=${limit}&category=${category}`;

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
