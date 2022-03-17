import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Magazine } from '@schemas/magazine';
import { environment } from '@environments/environment';
import { catchError, map } from 'rxjs/operators';
import handleError from '@services/handleError';
import { Response } from '@schemas/response';

@Injectable({
  providedIn: 'root',
})
export class MagazineService {
  constructor(private http: HttpClient) {}

  /**
   * 매거진 (북마크 표시)
   * @param page
   * @param limit
   * @param category
   * @param userId
   */
  getMagazineList(page: number, limit: number, category: string = 'all', userId: string): Observable<any> {
    const url =
      environment.userApiAddress +
      `/magazine/findPages?page=${page}&limit=${limit}&category=${category}&userId=${userId}`;

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

class CreateMagazineDto {
  rewrite: boolean;
}
