import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import handleError from './handleError';

import { environment } from '@environments/environment';

import { Response } from '@schemas/response';
import { User } from '@schemas/user';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  constructor(private http: HttpClient) {}

  addFollow(fromUser: string, toUser: string): Observable<any> {
    const url = environment.userApiAddress + `/follow/addFollow?fromUser=${fromUser}&toUser=${toUser}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  removeFollow(fromUser: string, toUser: string): Observable<any> {
    const url = environment.userApiAddress + `/follow/removeFollow?fromUser=${fromUser}&toUser=${toUser}`;

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

  countFollow(userId: string): Observable<any> {
    const url = environment.userApiAddress + `/follow/countFollow?userId=${userId}`

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

  findFollowingList(followPageDto: FollowPageDto): Observable<any> {
    const url = environment.userApiAddress +
      `/follow/findFollowing?userId=${followPageDto.userId}&page=${followPageDto.page}&limit=${followPageDto.limit}`

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

  findFollowerList(followPageDto: FollowPageDto): Observable<any> {
    const url = environment.userApiAddress +
      `/follow/findFollower?userId=${followPageDto.userId}&page=${followPageDto.page}&limit=${followPageDto.limit}`;

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

class FollowPageDto {
  userId: string;
  page: number;
  limit: number;
}
