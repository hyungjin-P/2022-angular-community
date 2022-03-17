import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import handleError from './handleError';

import { environment } from '@environments/environment';

import { Response } from '@schemas/response';
import { User } from '@schemas/user';
import { Feed } from '@schemas/feed';
import { FeedTag } from '@schemas/feed-tag';
import { FeedComment } from '@schemas/feed-comment';
import { File } from '@schemas/file';
import { FeedLike } from '@schemas/feed-like';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param requestBody { rewrite }
   */
  createFeed(requestBody: CreateFeedDto): Observable<Feed> {
    const url = environment['serverAddress'] + '/feed';

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0];
      }),
      catchError(handleError)
    );
  }

  /**
   * 개인 피드 (좋아요, 북마크 표시)
   * @param page
   * @param limit
   * @param userId
   */
  getFeedList(page: number, limit: number, userId: string): Observable<any> {
    const url = environment.userApiAddress + `/feed/findPages?page=${page}&limit=${limit}&userId=${userId}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.get<any>(url, options).pipe(
      map((res) => {
        // console.log('res.dataset : ', res.dataset);
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 작업중
   * 개인 피드 상세 조회 (좋아요, 북마크 표시)
   * @param feedId
   * @param userId
   */
  getFeed(feedId: string, userId: string): Observable<Feed> {
    const url = environment.userApiAddress + `/feed/findById?feedId=${feedId}&userId=${userId}`;

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

  updateFeed(feedId: string, requestBody: UpdateFeedDto): Observable<Feed> {
    const url = `${environment['serverAddress']}/feed/${feedId}`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.http.put<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0];
      }),
      catchError(handleError)
    );
  }

  /**
   * 피드삭제 작업 중
   * @param feedId
   */
  deleteFeed(feedId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.delete<Response>(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  createFeedPicture(feedId: string, requestBody: CreateFeedPictureDto): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/picture`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  deleteUserPicture(feedId: string, fileUrl: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/picture/${encodeURIComponent(fileUrl)}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.delete<Response>(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  createFeedTag(feedId: string, requestBody: CreateFeedTagDto): Observable<FeedTag> {
    const url = environment['serverAddress'] + `/feed/${feedId}/tag`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0];
      }),
      catchError(handleError)
    );
  }

  deleteFeedTag(feedId: string, tagId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/tag/${tagId}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.delete<Response>(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 피드 좋아요 => 수정 완료
   * @param feedLike
   */
  createFeedLike(feedLike: addFeedLike): Observable<any> {
    const url = environment.userApiAddress + `/feed/addLike`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(url, feedLike, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 피드 좋아요 취소 => 수정 완료
   * @param feedLike { feedId, userId }
   */
  deleteFeedLike(feedLike: addFeedLike): Observable<any> {
    const url = environment.userApiAddress + `/feed/deleteLike?feedId=${feedLike.feedId}&userId=${feedLike.userId}`;

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

  getFeedLikeList(page: number, limit: number, feedId, userId: string): Observable<Array<FeedLike>> {
    const url =
      environment.userApiAddress + `/feed/like/findPages?page=${page}&limit=${limit}&feedId=${feedId}&userId=${userId}`;

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

  createFeedComment(feedId: string, requestBody: CreateFeedCommentDto): Observable<FeedComment> {
    const url = environment['serverAddress'] + `/feed/${feedId}/comment`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0];
      }),
      catchError(handleError)
    );
  }

  getFeedCommentList(feedId: string, page = '', pageSize = ''): Observable<Array<FeedComment>> {
    const url = `${environment['serverAddress']}/feed/${feedId}/comment?page=${page}&pageSize=${pageSize}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        return res.dataset;
      }),
      catchError(handleError)
    );
  }

  getFeedSubCommentList(feedId: string, commentId: string, page = '', pageSize = ''): Observable<Array<FeedComment>> {
    const url = environment['serverAddress'] + `/feed/${feedId}/comment/${commentId}?page=${page}&pageSize=${pageSize}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        return res.dataset;
      }),
      catchError(handleError)
    );
  }

  updateFeedComment(feedId: string, commentId: string, requestBody: UpdateFeedCommentDto): Observable<FeedComment> {
    const url = environment['serverAddress'] + `/feed/${feedId}/comment/${commentId}`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.http.put<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0];
      }),
      catchError(handleError)
    );
  }

  deleteFeedComment(feedId: string, commentId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/comment/${commentId}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.delete<Response>(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 북마크 추가
   * @param feedBookmarkDto { feedId, userId }
   */
  addFeedBookmark(feedBookmarkDto: FeedBookmarkDto): Observable<any> {
    const url = environment.userApiAddress + `/feed/addBookmark`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(url, feedBookmarkDto, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 북마크 삭제
   * @param feedBookmarkDto { feedId, userId }
   */
  deleteFeedBookmark(feedBookmarkDto: FeedBookmarkDto): Observable<any> {
    const url =
      environment.userApiAddress +
      `/feed/deleteBookmark?feedId=${feedBookmarkDto.feedId}&userId=${feedBookmarkDto.userId}`;

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

class FeedBookmarkDto {
  feedId: string;
  userId: string;
}

class CreateFeedDto {
  rewrite: boolean;
}

class UpdateFeedDto {
  content?: string;
  picture?: string;
  posting?: boolean;
}

class CreateFeedPictureDto {
  files: Array<File>;
}

class CreateFeedTagDto {
  name: string;
}

class CreateFeedCommentDto {
  parent_id?: string;
  text: string;
}

class UpdateFeedCommentDto {
  text: string;
}

/** 추가 */
class addFeedLike {
  feedId: string;
  userId: string;
}
