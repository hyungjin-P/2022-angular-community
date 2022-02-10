import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import {
  animationFrameScheduler,
  defer,
  fromEvent,
  Observable,
  interval,
  concat,
  of,
  scheduled,
  queueScheduler,
  asapScheduler,
  asyncScheduler,
  Subscription,
} from 'rxjs'
import {
  map,
  switchMap,
  takeUntil,
  take,
  startWith,
  tap,
  withLatestFrom,
  share,
  scan,
  takeWhile,
  mergeAll,
} from 'rxjs/operators'
import * as moment from 'moment-timezone'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'

import { FeedService } from '@services/feed.service'
import { PublicService } from '@services/public.service'
import { TextService } from '@services/text.service'

import { Feed } from '@schemas/feed'
import { FeedComment } from '@schemas/feed-comment'
import { User } from '@schemas/user'
import { DateUtils } from '../../../../core/utils/date.utils'

declare const $

@Component({
  selector: 'feed-detail',
  templateUrl: './feed-detail.component.html',
  styleUrls: ['./feed-detail.component.scss'],
})
export class FeedDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  variables: any
  user: User

  carouselIndex: any

  selectedFeedId: string
  selectedFeed: Feed
  feedList: Array<Feed>

  subscription: Subscription

  @ViewChild('scroll') scroll: ElementRef

  refresh: boolean

  moreBoxVisible: boolean

  selectedLanguage: string
  commentViewVisible: boolean

  @ViewChild('feedCommentAddBtn') feedCommentAddBtnEl: ElementRef
  @ViewChild('feedCommentInput') feedCommentInputEl: ElementRef
  feedCommentInputObj: any
  feedCommentInputStatus: string
  feedCommentList: Array<FeedComment>

  feedSubComment: FeedComment

  feedSubCommentListViewObj: any
  feedSubCommentListObj: any

  likedViewVisible: boolean

  likeUserList: Array<User>

  onKeyEvent: boolean

  beginTime: any

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private storageService: StorageService,
    private feedService: FeedService,
    private publicService: PublicService,
    private textService: TextService,
    private dateUtils: DateUtils
  ) {}

  ngOnInit() {
    this.variables = this.globalService.variables
    this.user = this.storageService.getUser()

    this.carouselIndex = 1

    this.subscription = this.activatedRoute.params.subscribe(
      (v) => {
        this.selectedFeedId = v['feed_id']
        this.init()
      },
      (e) => {}
    )

    this.selectedLanguage = localStorage.getItem('language')
    this.commentViewVisible = false
    this.feedCommentInputObj = ''
    this.feedCommentInputStatus = ''
    this.feedCommentList = []
    this.feedSubComment = undefined
    this.feedSubCommentListViewObj = {}
    this.feedSubCommentListObj = {}
    this.likedViewVisible = false

    this.likeUserList = []

    this.onKeyEvent = false

    this.beginTime = ''
  }

  ngAfterViewInit(): void {
    document.addEventListener('keyup', (e) => {
      if (e.code !== 'Escape') return

      if (this.commentViewVisible) {
        this.hideCommentView()
      } else if (this.likedViewVisible) {
        this.hideLikedView()
      }
    })

    $('#carouselIndicators').carousel({
      interval: 0,
    })

    $('#carouselIndicators').on('slide.bs.carousel', (e) => {
      this.carouselIndex = e.to + 1
    })
  }

  toPos(obs$) {
    const SUPPORT_TOUCH = 'ontouchstart' in window
    return obs$.pipe(map((v: any) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)))
  }

  test() {
    console.log(this.carouselIndex)
  }
  // animation(from, to, duration) {
  //     return defer(() => {
  //         const scheduler = animationFrameScheduler;
  //         const start = scheduler.now();
  //         const interval$ = interval(0, scheduler).pipe(
  //             map(() => (scheduler.now() - start) / duration),
  //             takeWhile((rate) => rate < 1)
  //         );
  //
  //         return concat(interval$, of(1)).pipe(map((rate) => from + (to - from) * rate))
  //     })
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  init() {
    if (this.user) {
      this.getFeed()
      this.getFeedList()
    } else {
      this.getPublicFeed()
      this.getPublicFeedList()
    }
  }

  goBack() {
    this.router.navigateByUrl('/feed')
  }

  getFeed() {
    this.feedService.getFeed(this.selectedFeedId).subscribe(
      (feed: Feed) => {
        this.selectedFeed = feed

        if (!this.selectedFeed) {
          this.router.navigateByUrl('/feed')
        } else {
          this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(feed.created_at))
        }
      },
      (e) => {
        this.router.navigateByUrl('/feed')
      }
    )
  }

  getPublicFeed() {
    this.publicService.getFeed(this.selectedFeedId).subscribe(
      (feed: Feed) => {
        this.selectedFeed = feed

        this.beginTime = this.dateUtils.transTimeType(this.dateUtils.getTimeStamp(feed.created_at))
      },
      (e) => {}
    )
  }

  getFeedList() {
    this.feedService.getFeedList().subscribe(
      (feedList: Feed[]) => {
        this.feedList = feedList
      },
      (e) => {}
    )
  }

  getFeedCommentList() {
    this.feedService.getFeedCommentList(this.selectedFeed.id).subscribe(
      (feedCommentList: Array<FeedComment>) => {
        for (let i = 0; i < feedCommentList.length; i++) {
          feedCommentList[i].begin_timestamp = this.dateUtils.getTimeStamp(feedCommentList[i].created_at)
          feedCommentList[i].begin_time_text = this.dateUtils.transTimeType(feedCommentList[i].begin_timestamp)
        }
        this.feedCommentList = feedCommentList
      },
      (e) => {}
    )
  }

  getFeedSubCommentList(feedCommentId: string) {
    this.feedService.getFeedSubCommentList(this.selectedFeed.id, feedCommentId).subscribe(
      (feedCommentList: Array<FeedComment>) => {
        for (let i = 0; i < feedCommentList.length; i++) {
          feedCommentList[i].begin_timestamp = this.dateUtils.getTimeStamp(feedCommentList[i].created_at)
          feedCommentList[i].begin_time_text = this.dateUtils.transTimeType(feedCommentList[i].begin_timestamp)
        }
        this.feedSubCommentListObj[feedCommentId] = feedCommentList
      },
      (e) => {}
    )
  }

  getPublicFeedList() {
    this.publicService.getFeedList().subscribe(
      (feedList: Feed[]) => {
        this.feedList = feedList
      },
      (e) => {}
    )
  }

  getFeedLikeList() {
    this.feedService.getFeedLikeList(this.selectedFeed.id).subscribe(
      (likeUserList: Array<User>) => {
        this.likeUserList = likeUserList
      },
      (e) => {}
    )
  }

  selectedFeedLike(feed: Feed) {
    if (this.storageService.getUser()) {
      if (feed.like) {
        this.feedService.deleteFeedLike(feed.id).subscribe(
          (v) => {
            feed.like = false
            feed.like_count -= 1

            this.selectedFeed.like_users.forEach((user, index) => {
              if (user.id == this.user.id) {
                this.selectedFeed.like_users.splice(index, 1)
              }
            })
          },
          (e) => {}
        )
      } else {
        this.feedService.createFeedLike(feed.id).subscribe(
          (v) => {
            feed.like = true
            feed.like_count += 1

            this.selectedFeed.like_users.push(this.user)
          },
          (e) => {}
        )
      }
    } else {
      this.router.navigateByUrl('/auth/login')
    }
  }

  feedLike(feed: Feed) {
    if (this.storageService.getUser()) {
      if (feed.like) {
        this.feedService.deleteFeedLike(feed.id).subscribe(
          (v) => {
            feed.like = false
            feed.like_count -= 1
          },
          (e) => {}
        )
      } else {
        this.feedService.createFeedLike(feed.id).subscribe(
          (v) => {
            feed.like = true
            feed.like_count += 1
          },
          (e) => {}
        )
      }
    } else {
      this.router.navigateByUrl('/auth/login')
    }
  }

  goFeedDetail(feed: Feed) {
    this.refresh = true
    this.router.navigateByUrl(`/feed/${feed.id}`)
    try {
      this.scroll.nativeElement.scrollTop = 0
    } catch (err) {}
  }

  openMoreBox(event) {
    event.stopPropagation()

    if (this.moreBoxVisible) {
      this.closeMoreBox()
    } else {
      this.moreBoxVisible = true
    }
  }

  closeMoreBox() {
    this.moreBoxVisible = false
  }

  deleteFeed(feed: Feed) {
    this.feedService.deleteFeed(feed.id).subscribe(
      (v) => {
        this.router.navigateByUrl('/feed')
      },
      (e) => {}
    )
  }

  showCommentView() {
    if (this.storageService.getUser()) {
      this.getFeedCommentList()
      this.commentViewVisible = true
    } else {
      this.router.navigateByUrl('/auth/login')
    }
  }

  hideCommentView() {
    this.clearCommentInput()
    this.commentViewVisible = false
  }

  clearCommentInput() {
    this.feedCommentInputObj = ''
  }

  onCreateCommentKey(key) {
    // [편의성] Enter시, 저장
    // if (key.code === 'Enter') {
    // this.intervalCall(1000)(() => {
    //   this.createComment()
    // })
    // } else
    if (this.feedCommentInputObj === '' && this.feedCommentInputStatus === 'sub') {
      this.hideSubCommentInput()
    }
  }

  createComment() {
    if (!this.feedCommentInputObj) {
      return
    }

    if (this.feedCommentInputStatus === 'sub') {
      this.createSubComment(this.feedSubComment)
    } else {
      this.createParentComment()
    }
  }

  createParentComment() {
    this.feedService.createFeedComment(this.selectedFeed.id, { text: this.feedCommentInputObj }).subscribe(
      (feedComment: FeedComment) => {
        this.clearCommentInput()
        this.selectedFeed.comment_count++
        this.feedCommentList.unshift(feedComment)
      },
      (e) => {}
    )
  }

  showSubCommentInput(feedComment: FeedComment) {
    // this.feedSubCommentInputValueObj[feedCommentId] = '@' + this.feedSubCommentListObj[feedCommentId].writer
    this.feedCommentInputStatus = 'sub'
    this.feedSubComment = feedComment
    this.feedCommentInputObj = '@' + 'writer '
    this.feedCommentInputEl.nativeElement.focus()
  }

  hideSubCommentInput() {
    if (this.feedCommentInputStatus === 'sub') {
      this.feedCommentInputStatus = ''
      this.feedSubComment = undefined
      this.feedCommentInputObj = ''
    }
  }

  showSubCommentList(feedCommentId: string) {
    if (this.feedSubCommentListViewObj[feedCommentId]) {
      this.hideSubCommentList(feedCommentId)
    } else {
      this.feedSubCommentListViewObj[feedCommentId] = true
      this.getFeedSubCommentList(feedCommentId)
    }
  }

  hideSubCommentList(feedCommentId: string) {
    this.feedSubCommentListViewObj[feedCommentId] = false
    this.feedSubCommentListObj[feedCommentId] = []
  }

  createSubComment(parentFeedComment: FeedComment) {
    if (!this.feedCommentInputObj) {
      return
    }

    this.feedService
      .createFeedComment(this.selectedFeed.id, {
        parent_id: parentFeedComment.id,
        text: this.feedCommentInputObj,
      })
      .subscribe(
        (feedComment: FeedComment) => {
          this.hideSubCommentInput()
          this.selectedFeed.comment_count++
          parentFeedComment.sub_comment_count++
          this.feedSubCommentListViewObj[parentFeedComment.id] = false
          this.showSubCommentList(parentFeedComment.id)
          if (!this.feedSubCommentListObj[parentFeedComment.id]) {
            this.feedSubCommentListObj[parentFeedComment.id] = [feedComment]
          } else {
            this.feedSubCommentListObj[parentFeedComment.id].unshift(feedComment)
          }
        },
        (e) => {}
      )
  }

  deleteComment(feedComment: FeedComment, parentFeedComment: FeedComment) {
    this.feedService.deleteFeedComment(this.selectedFeed.id, feedComment.id).subscribe(
      (v) => {
        this.selectedFeed.comment_count--
        if (feedComment.parent_id) {
          parentFeedComment.sub_comment_count--
        }
        feedComment.deleted_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
      },
      (e) => {}
    )
  }

  showLikedView() {
    if (this.storageService.getUser()) {
      this.getFeedLikeList()
      this.likedViewVisible = true
    } else {
      this.router.navigateByUrl('/auth/login')
    }
  }

  hideLikedView() {
    this.likedViewVisible = false
  }

  intervalCall(interval) {
    return (fn) => {
      if (this.onKeyEvent) {
        return // 마지막 호출 후 제한된 경과시간이 지나지 않은 경우 리턴
      }
      this.onKeyEvent = true
      fn()
      setTimeout(() => {
        this.onKeyEvent = false
      }, interval)
    }
  }
}
