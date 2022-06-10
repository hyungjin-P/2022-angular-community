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
   * 피드 작성
   * @param rewrite
   * @param userId
   */
  createFeed(rewrite: boolean, userId: string): Observable<Feed> {
    const url = environment.userApiAddress + `/feed/createFeed?rewrite=${rewrite}&userId=${userId}`;

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

  /**
   * 개인 피드 (좋아요, 북마크 표시)
   * @param page
   * @param limit
   * @param userId
   * @param pageDate
   */
  getFeedList(page: number, limit: number, userId: string, pageDate: string): Observable<any> {
    const url =
      environment.userApiAddress + `/feed/findPages?page=${page}&limit=${limit}&userId=${userId}&pageDate=${pageDate}`;

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
   * 피드 팔로우 리스트 조회
   * @param page
   * @param limit
   * @param userId
   * @param pageDate
   */
  getFeedFollowList(page: number, limit: number, userId: string, pageDate: string): Observable<any> {
    const url =
      environment.userApiAddress +
      `/feed/findPagesOverFollow?page=${page}&limit=${limit}&userId=${userId}&pageDate=${pageDate}`;

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
   * 피드 스크랩 리스트 조회
   * @param page
   * @param limit
   * @param userId
   */
  getScrapFeedList(page: number, limit: number, userId: string): Observable<any> {
    const url = environment.userApiAddress + `/feed/findPagesOverBookmark?page=${page}&limit=${limit}&userId=${userId}`;

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

  updateFeed(requestBody: UpdateFeedDto): Observable<Feed> {
    const url = environment.userApiAddress + `/feed/updateFeed`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    //기존 put방식에 대해 검토
    return this.http.post<any>(url, requestBody, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  modifyFeed(requestBody: Feed): Observable<Feed> {
    const url = environment.userApiAddress + `/feed/modifyFeed`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.http.post<any>(url, requestBody, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  modifyFeedPicture(requestBody: Feed) {
    const url = environment.userApiAddress + `/feed/modifyFeedPicture`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.http.post<any>(url, requestBody, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 피드삭제 작업 중
   * @param feedId
   */
  deleteFeed(feedId: string): Observable<Response> {
    const url = environment.userApiAddress + `/feed/deleteFeed?feedId=${feedId}`;

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

  createFeedTag(feedId: string, name: string): Observable<FeedTag> {
    const url = environment.userApiAddress + `/feed/addFeedTagNameOnly?feedId=${feedId}&name=${name}`;

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

  deleteFeedTag(feedId: string, tagId: string): Observable<Response> {
    const url = environment.userApiAddress + `/feed/deleteFeedTagNameOnly?feedId=${feedId}&tagId=${tagId}`;

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
        console.log('create feed like : ', res);
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

  getFeedLikeList(page: number, limit: number, feedId, userId: string, pageDate: string): Observable<Array<FeedLike>> {
    const url =
      environment.userApiAddress +
      `/feed/like/findPages?page=${page}&limit=${limit}&feedId=${feedId}&userId=${userId}&pageDate=${pageDate}`;

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

  createFeedComment(requestBody: CreateFeedCommentDto): Observable<FeedComment> {
    const url = environment.userApiAddress + `/feed/comment/create`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(url, requestBody, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  getFeedCommentList(
    page: number,
    limit: number,
    feedId: string,
    userId: string,
    pageDate: string
  ): Observable<Array<FeedComment>> {
    const url =
      environment.userApiAddress +
      `/feed/comment/findPages?page=${page}&limit=${limit}&feedId=${feedId}&userId=${userId}&pageDate=${pageDate}`;

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

  getFeedSubCommentList(
    page: number,
    limit: number,
    feedCommentId: string,
    userId: string,
    pageDate: string
  ): Observable<Array<FeedComment>> {
    let url = environment.userApiAddress + `/feed/comment/sub/findPages`;
    url += `?page=${page}&limit=${limit}&feedCommentId=${feedCommentId}`;
    url += `&userId=${userId}&pageDate=${pageDate}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.get<any>(url, options).pipe(
      map((res) => {
        return res.items;
      }),
      catchError(handleError)
    );
  }

  modifyFeedComment(commentId: string, text: string): Observable<FeedComment> {
    const url = environment.userApiAddress + `/feed/comment/modify?feedCommentId=${commentId}&text=${text}`;

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

  deleteFeedComment(commentId: string): Observable<Response> {
    const url = environment.userApiAddress + `/feed/comment/delete?feedCommentId=${commentId}`;

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

  removeFeedComment(commentId: string): Observable<Response> {
    const url = environment.userApiAddress + `/feed/comment/remove?feedCommentId=${commentId}`;

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

  addFeedCommentMention(addMention: addFeedCommentMention) {
    const url = environment.userApiAddress + `/feed/comment/addMention`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(url, addMention, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 피드 댓글 좋아요
   * @param feedCommentId
   * @param userId
   */
  createFeedCommentLike(feedCommentId: string, userId: string): Observable<any> {
    const url = environment.userApiAddress + `/feed/comment/addLike?feedCommentId=${feedCommentId}&userId=${userId}`;
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

  /**
   * 피드 댓글 좋아요
   * @param feedCommentId
   * @param userId
   */
  createFeedCommentLikeAndGetComment(feedCommentId: string, userId: string): Observable<any> {
    const url = environment.userApiAddress + `/feed/comment/addLikeAndGetComment`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const param = { feedCommentId, userId };
    return this.http.post<any>(url, param, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  /**
   * 피드 댓글 좋아요 취소
   * @param feedCommentId
   * @param userId
   */
  deleteFeedCommentLike(feedCommentId: string, userId: string): Observable<any> {
    const url = environment.userApiAddress + `/feed/comment/deleteLike?feedCommentId=${feedCommentId}&userId=${userId}`;

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

  /**
   * 마이페이지 피드 메인 조회
   * @param page
   * @param limit
   * @param userId
   * @param pageDate
   */
  findMyPageFeedMain(page: number, limit: number, userId: string, pageDate: string): Observable<any> {
    const url =
      environment.userApiAddress +
      `/feed/findMypageFeed?page=${page}&limit=${limit}&userId=${userId}&pageDate=${pageDate}`;

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
   * 마이페이지 피드 상세 페이지 조회
   * @param userId
   * @param page
   * @param limit
   * @param pageDate
   * @param otherUserId
   */
  findMyPageFeedDetail(
    userId: string,
    page: number,
    limit: number,
    pageDate: string,
    otherUserId?: string
  ): Observable<any> {
    let url =
      environment.userApiAddress +
      `/feed/findMypageFeedDetail?userId=${userId}&page=${page}&limit=${limit}&pageDate=${pageDate}`;

    if (otherUserId) {
      url += `&otherUserId=${otherUserId}`;
    }

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

  deleteBookmarkAll(userId: string) {
    const url = environment.userApiAddress + `/feed/deleteAllBookmarkByUserId?userId=${userId}`;

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

  /**
   * 피드 삭제
   * @param feedId
   */
  deleteRealFeed(feedId: string): Observable<any> {
    const url = environment.userApiAddress + `/feed/realDelete?feedId=${feedId}`;

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

  /**
   * 피드 댓글 및 연관 정보 조회
   * @param feedId
   * */
  findFeedCommentsWithRelations(feedId: string): Observable<any> {
    const url = environment.userApiAddress + `/feed/comment/getFeedCommentsWithRelations?feedId=${feedId}`;

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

  getFirstFeedList(): Observable<any> {
    const url = environment.userApiAddress + `/feed/`;

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

  getPublicFeedList(): Observable<any> {
    const url = environment.userApiAddress + `/feed`;

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

class FeedBookmarkDto {
  feedId: string;
  userId: string;
}

class UpdateFeedDto {
  feedId: string;
  content?: string;
  picture?: string;
  posting?: boolean;
}

class CreateFeedCommentDto {
  feedId: string;
  userId: string;
  parentId?: string;
  text: string;
}

/** 추가 */
class addFeedLike {
  feedId: string;
  userId: string;
}

class addFeedCommentMention {
  feedCommentId: string;
  mentionUserId: string;
}
