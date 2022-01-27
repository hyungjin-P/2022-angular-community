import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import handleError from './handleError'

import {environment} from '@environments/environment'

import {Response} from '@schemas/response'
import {User} from '@schemas/user'
import {Feed} from '@schemas/feed'
import {FeedTag} from '@schemas/feed-tag'
import {FeedComment} from '@schemas/feed-comment'
import {File} from '@schemas/file'

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private http: HttpClient) {
  }

  createFeed(requestBody: CreateFeedRequestBody): Observable<Feed> {
    const url = environment['serverAddress'] + '/feed'

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        // console.log('create ----------------> : ', res.dataset[0]);

        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  getFeedList(page = '', pageSize = ''): Observable<Array<Feed>> {
    const url = environment['serverAddress'] + `/feed?page=${page}&pageSize=${pageSize}`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<Response>(url, options).pipe(
      map((res) => {

        // console.log('res.dataset : ', res.dataset);
        return res.dataset
      }),
      catchError(handleError)
    )
  }

  getFeed(feedId: string): Observable<Feed> {
    const url = environment['serverAddress'] + `/feed/${feedId}`

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

  updateFeed(feedId: string, requestBody: UpdateFeedRequestBody): Observable<Feed> {
    const url = `${environment['serverAddress']}/feed/${feedId}`

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    }

    return this.http.put<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  deleteFeed(feedId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}`

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

  createFeedPicture(feedId: string, requestBody: CreateFeedPictureRequestBody): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/picture`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  deleteUserPicture(feedId: string, fileUrl: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/picture/${encodeURIComponent(fileUrl)}`

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

  createFeedTag(feedId: string, requestBody: CreateFeedTagRequestBody): Observable<FeedTag> {
    const url = environment['serverAddress'] + `/feed/${feedId}/tag`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  deleteFeedTag(feedId: string, tagId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/tag/${tagId}`

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

  createFeedLike(feedId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/like`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, {}, options).pipe(
      map((res) => {
        return res
      }),
      catchError(handleError)
    )
  }

  getFeedLikeList(feedId: string, page = '', pageSize = ''): Observable<Array<User>> {
    const url = environment['serverAddress'] + `/feed/${feedId}/like?page=${page}&pageSize=${pageSize}`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        return res.dataset
      }),
      catchError(handleError)
    )
  }

  deleteFeedLike(feedId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/like`

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

  createFeedComment(feedId: string, requestBody: CreateFeedCommentRequestBody): Observable<FeedComment> {
    const url = environment['serverAddress'] + `/feed/${feedId}/comment`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.post<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  getFeedCommentList(feedId: string, page = '', pageSize = ''): Observable<Array<FeedComment>> {
    const url = `${environment['serverAddress']}/feed/${feedId}/comment?page=${page}&pageSize=${pageSize}`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        return res.dataset
      }),
      catchError(handleError)
    )
  }

  getFeedSubCommentList(feedId: string, commentId: string, page = '', pageSize = ''): Observable<Array<FeedComment>> {
    const url =
      environment['serverAddress'] + `/feed/${feedId}/comment/${commentId}?page=${page}&pageSize=${pageSize}`

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    return this.http.get<Response>(url, options).pipe(
      map((res) => {
        return res.dataset
      }),
      catchError(handleError)
    )
  }

  updateFeedComment(
    feedId: string,
    commentId: string,
    requestBody: UpdateFeedCommentRequestBody
  ): Observable<FeedComment> {
    const url = environment['serverAddress'] + `/feed/${feedId}/comment/${commentId}`

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    }

    return this.http.put<Response>(url, requestBody, options).pipe(
      map((res) => {
        return res.dataset[0]
      }),
      catchError(handleError)
    )
  }

  deleteFeedComment(feedId: string, commentId: string): Observable<Response> {
    const url = environment['serverAddress'] + `/feed/${feedId}/comment/${commentId}`

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

class CreateFeedRequestBody {
  rewrite: boolean
}

class UpdateFeedRequestBody {
  content?: string
  picture?: string
  posting?: boolean
}

class CreateFeedPictureRequestBody {
  files: Array<File>
}

class CreateFeedTagRequestBody {
  name: string
}

class CreateFeedCommentRequestBody {
  parent_id?: string
  text: string
}

class UpdateFeedCommentRequestBody {
  text: string
}
